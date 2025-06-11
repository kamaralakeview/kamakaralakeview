import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on the actual schema
export interface DatabaseRoom {
  id: number;
  room_number: string;
  room_type: string;
  status: string;
  price: number;
  created_at: string;
}

export interface DatabaseGuest {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export interface DatabaseBooking {
  id: number;
  guest_id: number | null;
  room_id: number | null;
  staff_id: number | null;
  check_in_date: string;
  check_out_date: string;
  status: string | null;
  created_at: string;
}

export interface DatabaseStaff {
  id: number;
  full_name: string;
  role: string;
  email: string | null;
  phone: string | null;
  status: string | null;
  created_at: string;
}

export interface DatabaseCheckin {
  id: number;
  booking_id: number | null;
  checkin_time: string | null;
  staff_id: number | null;
  created_at: string;
}

export interface DatabaseCheckout {
  id: number;
  booking_id: number | null;
  checkout_time: string | null;
  staff_id: number | null;
  created_at: string;
}