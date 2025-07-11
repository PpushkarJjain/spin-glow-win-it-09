import { supabase } from "@/integrations/supabase/client";

export interface SystemState {
  total_spins: string;
  current_round: string;
  spins_in_current_round: string;
}

/**
 * Get current system state
 */
export async function getSystemState(): Promise<SystemState> {
  const { data, error } = await supabase
    .from('system_state')
    .select('key, value')
    .in('key', ['total_spins', 'current_round', 'spins_in_current_round']);

  if (error) {
    console.error('Error fetching system state:', error);
    throw new Error('Failed to fetch system state');
  }

  // Convert array to object
  const stateObject: SystemState = {
    total_spins: '0',
    current_round: '0',
    spins_in_current_round: '0'
  };

  data?.forEach(item => {
    if (typeof item.value === 'string') {
      stateObject[item.key as keyof SystemState] = item.value;
    }
  });

  return stateObject;
}

/**
 * Update system state
 */
export async function updateSystemState(updates: Partial<SystemState>): Promise<void> {
  const updatePromises = Object.entries(updates).map(([key, value]) => {
    return supabase
      .from('system_state')
      .update({ 
        value: value,
        updated_at: new Date().toISOString()
      })
      .eq('key', key);
  });

  const results = await Promise.all(updatePromises);
  
  for (const result of results) {
    if (result.error) {
      console.error('Error updating system state:', result.error);
      throw new Error('Failed to update system state');
    }
  }
}

/**
 * Get a single system state value
 */
export async function getSystemStateValue(key: keyof SystemState): Promise<string> {
  const { data, error } = await supabase
    .from('system_state')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching system state ${key}:`, error);
    throw new Error(`Failed to fetch ${key}`);
  }

  return typeof data.value === 'string' ? data.value : '0';
}

/**
 * Set a single system state value
 */
export async function setSystemStateValue(key: keyof SystemState, value: string): Promise<void> {
  const { error } = await supabase
    .from('system_state')
    .update({ 
      value,
      updated_at: new Date().toISOString()
    })
    .eq('key', key);

  if (error) {
    console.error(`Error setting system state ${key}:`, error);
    throw new Error(`Failed to set ${key}`);
  }
}

/**
 * Initialize system state if it doesn't exist
 */
export async function initializeSystemState(): Promise<void> {
  const defaultState = [
    { key: 'total_spins', value: '0' },
    { key: 'current_round', value: '0' },
    { key: 'spins_in_current_round', value: '0' }
  ];

  for (const state of defaultState) {
    const { data } = await supabase
      .from('system_state')
      .select('key')
      .eq('key', state.key)
      .maybeSingle();

    if (!data) {
      const { error } = await supabase
        .from('system_state')
        .insert(state);

      if (error) {
        console.error(`Error initializing ${state.key}:`, error);
      }
    }
  }
}