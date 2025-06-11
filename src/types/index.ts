export interface Room {
  id: string;
  number: string;
  type: 'Standard' | 'Deluxe' | 'Lake View';
  status: 'Available' | 'Booked' | 'Occupied' | 'Cleaning';
  price: number;
}

export interface Guest {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
}

export interface Booking {
  id: string;
  guestId: string;
  guest: Guest;
  roomId: string;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
  createdAt: string;
}

export interface StayLog {
  id: string;
  guestId: string;
  guest: Guest;
  roomId: string;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
}

export interface Settings {
  checkInTime: string;
  checkOutTime: string;
  language: 'English' | 'French';
}

export interface User {
  id: string;
  email: string;
  role: 'Receptionist' | 'Admin';
  name: string;
}