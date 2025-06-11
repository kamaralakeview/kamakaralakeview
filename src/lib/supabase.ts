import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
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
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  id_type: string | null;
  id_number: string | null;
  nationality: string | null;
  created_at: string;
}

export interface DatabaseBooking {
  id: number;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  room_id: number | null;
  check_in_date: string | null;
  check_out_date: string | null;
  number_of_guests: number | null;
  status: string | null;
  created_at: string;
}

export interface DatabaseCheckin {
  id: number;
  booking_id: number | null;
  check_in_time: string | null;
  staff_id: number | null;
  notes: string | null;
  created_at: string;
}

export interface DatabaseCheckout {
  id: number;
  booking_id: number;
  check_out_time: string | null;
  staff_id: number | null;
  notes: string | null;
  created_at: string;
}

export interface DatabaseStaff {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  status: string | null;
  last_login: string | null;
  staff_id: number | null;
  created_at: string;
}