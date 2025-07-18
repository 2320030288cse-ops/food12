import { createClient } from '@supabase/supabase-js';

// Check if environment variables are properly set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create Supabase client if we have valid environment variables
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database Types
export interface DailyCollection {
  id: string;
  date: string;
  total_amount: number;
  total_orders: number;
  payment_methods: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  order_data: any;
  table_number?: number;
  customer_name?: string;
  total_amount: number;
  payment_status: string;
  payment_methods: any[];
  created_at: string;
  completed_at?: string;
}