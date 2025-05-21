
import { supabase } from "@/integrations/supabase/client";

// Default currency symbol
export const DEFAULT_CURRENCY = "EUR";
export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
  CAD: "C$",
  AUD: "A$",
};

// Helper function to format amount with currency symbol
export const formatCurrency = (amount: number, currency: string = DEFAULT_CURRENCY): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS[DEFAULT_CURRENCY];
  
  // Different formatting based on currency
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export interface UserSettings {
  id: string;
  user_id: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Create default settings for a new user
export const createDefaultSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        currency: DEFAULT_CURRENCY
      })
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating default user settings:", error);
    return null;
  }
};

// Get user settings
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    // First try to get existing settings
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        // Create default settings if none exist
        return createDefaultSettings(userId);
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
};

// Update user settings
export const updateUserSettings = async (userId: string, settings: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating user settings:", error);
    return null;
  }
};
