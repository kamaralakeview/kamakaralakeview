import { Room, Guest, Booking, StayLog } from '../types';

export const mockRooms: Room[] = [
  { id: '1', number: '101', type: 'Standard', status: 'Available', price: 120 },
  { id: '2', number: '102', type: 'Standard', status: 'Occupied', price: 120 },
  { id: '3', number: '103', type: 'Deluxe', status: 'Booked', price: 180 },
  { id: '4', number: '104', type: 'Lake View', status: 'Available', price: 250 },
  { id: '5', number: '201', type: 'Standard', status: 'Cleaning', price: 120 },
  { id: '6', number: '202', type: 'Deluxe', status: 'Available', price: 180 },
  { id: '7', number: '203', type: 'Lake View', status: 'Occupied', price: 250 },
  { id: '8', number: '204', type: 'Lake View', status: 'Available', price: 250 },
  { id: '9', number: '301', type: 'Deluxe', status: 'Booked', price: 180 },
  { id: '10', number: '302', type: 'Lake View', status: 'Available', price: 250 },
];

export const mockGuests: Guest[] = [
  {
    id: '1',
    fullName: 'John Smith',
    phone: '+1-555-0123',
    email: 'john.smith@email.com',
    nationality: 'American',
    idType: 'Passport',
    idNumber: 'US123456789'
  },
  {
    id: '2',
    fullName: 'Marie Dubois',
    phone: '+33-1-23-45-67-89',
    email: 'marie.dubois@email.fr',
    nationality: 'French',
    idType: 'ID Card',
    idNumber: 'FR987654321'
  },
  {
    id: '3',
    fullName: 'David Johnson',
    phone: '+1-555-0456',
    email: 'david.j@email.com',
    nationality: 'Canadian',
    idType: 'Passport',
    idNumber: 'CA456789123'
  },
  {
    id: '4',
    fullName: 'Sarah Wilson',
    phone: '+44-20-7946-0958',
    email: 'sarah.wilson@email.co.uk',
    nationality: 'British',
    idType: 'Passport',
    idNumber: 'GB789123456'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    guestId: '1',
    guest: mockGuests[0],
    roomId: '3',
    room: mockRooms[2],
    checkInDate: '2025-01-15',
    checkOutDate: '2025-01-18',
    numberOfGuests: 2,
    status: 'Confirmed',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: '2',
    guestId: '2',
    guest: mockGuests[1],
    roomId: '2',
    room: mockRooms[1],
    checkInDate: '2025-01-14',
    checkOutDate: '2025-01-16',
    numberOfGuests: 1,
    status: 'Checked In',
    createdAt: '2025-01-12T14:30:00Z'
  },
  {
    id: '3',
    guestId: '3',
    guest: mockGuests[2],
    roomId: '9',
    room: mockRooms[8],
    checkInDate: '2025-01-16',
    checkOutDate: '2025-01-20',
    numberOfGuests: 3,
    status: 'Confirmed',
    createdAt: '2025-01-13T09:15:00Z'
  }
];

export const mockStayLogs: StayLog[] = [
  {
    id: '1',
    guestId: '4',
    guest: mockGuests[3],
    roomId: '7',
    room: mockRooms[6],
    checkInDate: '2025-01-10',
    checkOutDate: '2025-01-13',
    actualCheckIn: '2025-01-10T15:30:00Z',
    actualCheckOut: '2025-01-13T11:00:00Z'
  }
];