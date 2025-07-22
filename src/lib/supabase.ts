import { createClient } from '@supabase/supabase-js';

// Check if environment variables are properly set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create Supabase client if we have valid environment variables
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Enhanced Database Types
export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  restaurant_id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'cashier' | 'kitchen';
  phone?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  cost_price?: number;
  image_url?: string;
  is_available: boolean;
  is_special: boolean;
  preparation_time: number;
  calories?: number;
  allergens?: string[];
  dietary_info?: string[];
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  restaurant_id: string;
  name: string;
  category?: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock?: number;
  cost_per_unit?: number;
  supplier?: string;
  last_restocked?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  position_x?: number;
  position_y?: number;
  shape: 'round' | 'square' | 'rectangle';
  qr_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  restaurant_id: string;
  phone?: string;
  email?: string;
  name?: string;
  date_of_birth?: string;
  preferences: Record<string, any>;
  loyalty_points: number;
  total_visits: number;
  total_spent: number;
  last_visit?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  customer_id?: string;
  table_id?: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  special_instructions?: string;
  estimated_time?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'upi' | 'wallet' | 'bank_transfer';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  gateway_response?: Record<string, any>;
  processed_by?: string;
  processed_at: string;
  created_at: string;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  customer_id?: string;
  table_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  restaurant_id: string;
  order_id?: string;
  customer_id?: string;
  food_rating: number;
  service_rating: number;
  ambiance_rating: number;
  overall_rating: number;
  comments?: string;
  is_public: boolean;
  created_at: string;
}

export interface Recipe {
  id: string;
  menu_item_id: string;
  inventory_item_id: string;
  quantity_required: number;
  unit: string;
  created_at: string;
}

export interface Combo {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'happy_hour';
  value: number;
  conditions: Record<string, any>;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit?: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyProgram {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  points_per_rupee: number;
  redemption_rate: number;
  minimum_points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SMSTemplate {
  id: string;
  restaurant_id: string;
  name: string;
  template_type: 'order_confirmation' | 'payment_receipt' | 'reservation_reminder' | 'feedback_request' | 'promotion';
  message_template: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  restaurant_id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface AnalyticsData {
  id: string;
  restaurant_id: string;
  metric_name: string;
  metric_value?: number;
  metric_data?: Record<string, any>;
  date_recorded: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  restaurant_id: string;
  user_id?: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Legacy types for backward compatibility
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