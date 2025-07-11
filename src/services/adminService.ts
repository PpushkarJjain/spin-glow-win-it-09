import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { updateSystemState } from "./systemService";

type OfferSegment = Database['public']['Tables']['offer_segments']['Row'];

export interface OfferStats {
  name: string;
  current: number;
  max: number;
}

/**
 * Get offer segments for a specific round
 */
export async function getOfferSegments(roundNumber: number): Promise<OfferSegment[]> {
  const { data, error } = await supabase
    .from('offer_segments')
    .select('*')
    .eq('round_number', roundNumber)
    .order('segment_number');

  if (error) {
    console.error('Error fetching offer segments:', error);
    throw new Error('Failed to fetch offer segments');
  }

  return data || [];
}

/**
 * Get current offer distribution stats
 */
export async function getOfferStats(roundNumber: number): Promise<OfferStats[]> {
  const segments = await getOfferSegments(roundNumber);
  
  return segments.map(segment => ({
    name: segment.label,
    current: segment.current_count,
    max: segment.max_per_round
  }));
}

/**
 * Update offer segment count
 */
export async function updateOfferSegmentCount(
  roundNumber: number,
  segmentNumber: number
): Promise<void> {
  // Get current count
  const { data: currentSegment, error: fetchError } = await supabase
    .from('offer_segments')
    .select('current_count')
    .eq('round_number', roundNumber)
    .eq('segment_number', segmentNumber)
    .single();

  if (fetchError) {
    console.error('Error fetching current segment count:', fetchError);
    throw new Error('Failed to fetch segment count');
  }

  // Increment count
  const { error: updateError } = await supabase
    .from('offer_segments')
    .update({ 
      current_count: currentSegment.current_count + 1,
      updated_at: new Date().toISOString()
    })
    .eq('round_number', roundNumber)
    .eq('segment_number', segmentNumber);

  if (updateError) {
    console.error('Error updating segment count:', updateError);
    throw new Error('Failed to update segment count');
  }
}

/**
 * Reset all counters (admin function)
 */
export async function resetAllCounters(): Promise<void> {
  try {
    // Reset system state to initial values
    await updateSystemState({
      total_spins: '0',
      current_round: '0',
      spins_in_current_round: '0'
    });

    // Reset offer segments for round 0
    const { error: deleteError } = await supabase
      .from('offer_segments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error deleting offer segments:', deleteError);
      throw new Error('Failed to delete existing segments');
    }

    // Insert fresh offer segments for round 0
    const initialOffers = [
      { segment_number: 1, label: '10% OFF', max_per_round: 25 },
      { segment_number: 2, label: '2% OFF', max_per_round: 20 },
      { segment_number: 3, label: '0.50g silver coin', max_per_round: 15 },
      { segment_number: 4, label: '1 Gold Coin', max_per_round: 5 },
      { segment_number: 5, label: '15% OFF', max_per_round: 15 },
      { segment_number: 6, label: '5% OFF', max_per_round: 15 },
      { segment_number: 7, label: '10% OFF Premium', max_per_round: 3 },
      { segment_number: 8, label: '50% OFF', max_per_round: 2 }
    ];

    const { error: insertError } = await supabase
      .from('offer_segments')
      .insert(
        initialOffers.map(offer => ({
          ...offer,
          current_count: 0,
          round_number: 0
        }))
      );

    if (insertError) {
      console.error('Error inserting fresh segments:', insertError);
      throw new Error('Failed to reset offer segments');
    }

    console.log('All counters reset successfully');
  } catch (error) {
    console.error('Error in resetAllCounters:', error);
    throw error;
  }
}

/**
 * Get total number of users
 */
export async function getTotalUsers(): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error getting total users:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get total number of spins
 */
export async function getTotalSpins(): Promise<number> {
  const { count, error } = await supabase
    .from('spins')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error getting total spins:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get spins for current round
 */
export async function getCurrentRoundSpins(roundNumber: number): Promise<number> {
  const { count, error } = await supabase
    .from('spins')
    .select('*', { count: 'exact', head: true })
    .eq('round_number', roundNumber);

  if (error) {
    console.error('Error getting current round spins:', error);
    return 0;
  }

  return count || 0;
}