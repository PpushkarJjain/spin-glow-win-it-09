import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getSystemState, updateSystemState } from "./systemService";
import { getOfferSegments, updateOfferSegmentCount } from "./adminService";
import { offerConfig, type Offer } from "@/config/offerConfig.tsx";

type Spin = Database['public']['Tables']['spins']['Row'];
type SpinInsert = Database['public']['Tables']['spins']['Insert'];

export interface SpinnerSegment extends Offer {
  textColor: string;
  probability: number;
}

/**
 * Check if user can spin (once per day limit)
 */
export async function canUserSpin(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('spins')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
    .maybeSingle();

  if (error) {
    console.error('Error checking user spin eligibility:', error);
    throw new Error('Failed to check spin eligibility');
  }

  return data === null;
}

/**
 * Get available offers based on current round distribution
 */
export async function getAvailableOffers(): Promise<SpinnerSegment[]> {
  const systemState = await getSystemState();
  const currentRound = parseInt(systemState.current_round);
  
  const offerSegments = await getOfferSegments(currentRound);
  
  return offerSegments
    .filter(segment => segment.current_count < segment.max_per_round)
    .map(segment => {
      const offer = offerConfig.find(o => o.id === segment.segment_number);
      if (!offer) throw new Error(`Offer config not found for segment ${segment.segment_number}`);
      
      return {
        ...offer,
        textColor: "#FFD700",
        probability: offer.maxPerRound
      };
    });
}

/**
 * Select a random offer based on weighted probability
 */
export async function selectRandomOffer(): Promise<SpinnerSegment> {
  const systemState = await getSystemState();
  const currentRound = parseInt(systemState.current_round);
  
  const offerSegments = await getOfferSegments(currentRound);
  
  // Filter available segments
  const availableSegments = offerSegments.filter(
    segment => segment.current_count < segment.max_per_round
  );

  if (availableSegments.length === 0) {
    throw new Error('No available offers in current round');
  }

  // Create weighted array
  const weightedSegments: number[] = [];
  availableSegments.forEach(segment => {
    const remainingSlots = segment.max_per_round - segment.current_count;
    for (let i = 0; i < remainingSlots; i++) {
      weightedSegments.push(segment.segment_number);
    }
  });

  // Select random segment
  const randomIndex = Math.floor(Math.random() * weightedSegments.length);
  const selectedSegmentNumber = weightedSegments[randomIndex];
  
  const selectedSegment = availableSegments.find(
    segment => segment.segment_number === selectedSegmentNumber
  );

  if (!selectedSegment) {
    throw new Error('Failed to select offer segment');
  }

  const offer = offerConfig.find(o => o.id === selectedSegment.segment_number);
  if (!offer) {
    throw new Error(`Offer config not found for segment ${selectedSegment.segment_number}`);
  }

  return {
    ...offer,
    textColor: "#FFD700",
    probability: offer.maxPerRound
  };
}

/**
 * Record a spin result
 */
export async function recordSpin(
  userId: string,
  result: SpinnerSegment
): Promise<void> {
  const systemState = await getSystemState();
  const currentRound = parseInt(systemState.current_round);
  const totalSpins = parseInt(systemState.total_spins);
  const spinsInCurrentRound = parseInt(systemState.spins_in_current_round);

  // Insert spin record
  const { error: spinError } = await supabase
    .from('spins')
    .insert({
      user_id: userId,
      segment_id: result.id,
      offer_label: result.label,
      spin_result: result.label,
      round_number: currentRound,
      spin_number_in_round: spinsInCurrentRound + 1,
      total_spin_number: totalSpins + 1
    });

  if (spinError) {
    console.error('Error recording spin:', spinError);
    throw new Error('Failed to record spin');
  }

  // Update system state
  const newTotalSpins = totalSpins + 1;
  const newSpinsInRound = spinsInCurrentRound + 1;
  
  // Check if round is complete (100 spins)
  if (newSpinsInRound >= 100) {
    await updateSystemState({
      total_spins: newTotalSpins.toString(),
      current_round: (currentRound + 1).toString(),
      spins_in_current_round: '0'
    });
    
    // Initialize next round offer segments
    await initializeNextRound(currentRound + 1);
  } else {
    await updateSystemState({
      total_spins: newTotalSpins.toString(),
      spins_in_current_round: newSpinsInRound.toString()
    });
  }

  // Update offer segment count
  await updateOfferSegmentCount(currentRound, result.id);
}

/**
 * Initialize offer segments for a new round
 */
async function initializeNextRound(roundNumber: number): Promise<void> {
  const initialOffers = offerConfig.map(offer => ({
    segment_number: offer.id,
    label: offer.label,
    max_per_round: offer.maxPerRound,
  }));

  const { error } = await supabase
    .from('offer_segments')
    .insert(
      initialOffers.map(offer => ({
        ...offer,
        current_count: 0,
        round_number: roundNumber
      }))
    );

  if (error) {
    console.error('Error initializing next round:', error);
    throw new Error('Failed to initialize next round');
  }
}

/**
 * Get segment color based on segment number
 */
function getSegmentColor(segmentNumber: number): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];
  return colors[(segmentNumber - 1) % colors.length];
}

/**
 * Get spin history for a user
 */
export async function getUserSpinHistory(userId: string): Promise<Spin[]> {
  const { data, error } = await supabase
    .from('spins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user spin history:', error);
    throw new Error('Failed to fetch spin history');
  }

  return data || [];
}
