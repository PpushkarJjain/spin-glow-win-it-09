import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

export interface UserSession {
  id: string;
  name: string;
  mobile: string;
  created_at: string;
}

/**
 * Check if a user with the given name and mobile already exists
 */
export async function checkDuplicateUser(name: string, mobile: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('name', name)
    .eq('mobile', mobile)
    .maybeSingle();

  if (error) {
    console.error('Error checking duplicate user:', error);
    throw new Error('Failed to check user existence');
  }

  return data !== null;
}

/**
 * Create a new user record
 */
export async function createUser(name: string, mobile: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({ name, mobile })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }

  return data;
}

/**
 * Get user by name and mobile
 */
export async function getUserByNameAndMobile(name: string, mobile: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('name', name)
    .eq('mobile', mobile)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }

  return data;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }

  return data;
}

/**
 * Save user session to localStorage (temporary storage for session management)
 */
export function saveUserSession(user: User): void {
  const session: UserSession = {
    id: user.id,
    name: user.name,
    mobile: user.mobile,
    created_at: user.created_at || new Date().toISOString()
  };
  localStorage.setItem('currentUser', JSON.stringify(session));
}

/**
 * Get current user session from localStorage
 */
export function getCurrentUserSession(): UserSession | null {
  const stored = localStorage.getItem('currentUser');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Clear user session
 */
export function clearUserSession(): void {
  localStorage.removeItem('currentUser');
}