/*
  # Hotel Management System Database Schema

  1. New Tables
    - `rooms`
      - `id` (bigint, primary key)
      - `room_number` (text, unique)
      - `room_type` (text)
      - `status` (text)
      - `price` (numeric)
      - `created_at` (timestamp)
    
    - `guests`
      - `id` (bigint, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone_number` (text)
      - `id_type` (text)
      - `id_number` (text)
      - `nationality` (text)
      - `created_at` (timestamp)
    
    - `bookings`
      - `id` (bigint, primary key)
      - `guest_name` (text)
      - `guest_email` (text)
      - `guest_phone` (text)
      - `room_id` (bigint, foreign key)
      - `check_in_date` (date)
      - `check_out_date` (date)
      - `number_of_guests` (integer)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `checkins`
      - `id` (bigint, primary key)
      - `booking_id` (bigint, foreign key)
      - `check_in_time` (timestamp)
      - `staff_id` (bigint)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `checkouts`
      - `id` (bigint, primary key)
      - `booking_id` (bigint, foreign key)
      - `check_out_time` (timestamp)
      - `staff_id` (bigint)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `staff`
      - `id` (bigint, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `role` (text)
      - `status` (text)
      - `last_login` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  room_number text UNIQUE NOT NULL,
  room_type text DEFAULT 'executive',
  status text DEFAULT 'available',
  price numeric DEFAULT 120,
  created_at timestamptz DEFAULT now()
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name text,
  last_name text,
  email text,
  phone_number text,
  id_type text,
  id_number text,
  nationality text,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  guest_name text,
  guest_email text,
  guest_phone text,
  room_id bigint REFERENCES rooms(id),
  check_in_date date,
  check_out_date date,
  number_of_guests integer DEFAULT 1,
  status text DEFAULT 'booked',
  created_at timestamptz DEFAULT now()
);

-- Create checkins table
CREATE TABLE IF NOT EXISTS checkins (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  booking_id bigint,
  check_in_time timestamp DEFAULT now(),
  staff_id bigint,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create checkouts table
CREATE TABLE IF NOT EXISTS checkouts (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  booking_id bigint NOT NULL,
  check_out_time timestamp DEFAULT now(),
  staff_id bigint,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text,
  email text,
  phone text,
  role text,
  status text DEFAULT 'active',
  last_login timestamp,
  staff_id bigint REFERENCES staff(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms
CREATE POLICY "Allow all operations on rooms"
  ON rooms
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for guests
CREATE POLICY "Allow all operations on guests"
  ON guests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for bookings
CREATE POLICY "Allow all operations on bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for checkins
CREATE POLICY "Allow all operations on checkins"
  ON checkins
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for checkouts
CREATE POLICY "Allow all operations on checkouts"
  ON checkouts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for staff
CREATE POLICY "Allow all operations on staff"
  ON staff
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample rooms data
INSERT INTO rooms (room_number, room_type, status, price) VALUES
  ('101', 'standard', 'available', 120),
  ('102', 'standard', 'occupied', 120),
  ('103', 'deluxe', 'booked', 180),
  ('104', 'lake_view', 'available', 250),
  ('201', 'standard', 'cleaning', 120),
  ('202', 'deluxe', 'available', 180),
  ('203', 'lake_view', 'occupied', 250),
  ('204', 'lake_view', 'available', 250),
  ('301', 'deluxe', 'booked', 180),
  ('302', 'lake_view', 'available', 250)
ON CONFLICT (room_number) DO NOTHING;

-- Insert sample guests data
INSERT INTO guests (first_name, last_name, email, phone_number, nationality, id_type, id_number) VALUES
  ('John', 'Smith', 'john.smith@email.com', '+1-555-0123', 'American', 'Passport', 'US123456789'),
  ('Marie', 'Dubois', 'marie.dubois@email.fr', '+33-1-23-45-67-89', 'French', 'ID Card', 'FR987654321'),
  ('David', 'Johnson', 'david.j@email.com', '+1-555-0456', 'Canadian', 'Passport', 'CA456789123'),
  ('Sarah', 'Wilson', 'sarah.wilson@email.co.uk', '+44-20-7946-0958', 'British', 'Passport', 'GB789123456')
ON CONFLICT DO NOTHING;

-- Insert sample staff data
INSERT INTO staff (name, email, phone, role, status) VALUES
  ('Admin User', 'admin@kamaralakeview.com', '+1-555-0001', 'Admin', 'active'),
  ('Front Desk', 'reception@kamaralakeview.com', '+1-555-0002', 'Receptionist', 'active')
ON CONFLICT DO NOTHING;