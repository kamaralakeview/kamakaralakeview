import { useState, useEffect } from 'react';
import { supabase, DatabaseRoom, DatabaseGuest, DatabaseBooking } from '../lib/supabase';
import { Room, Guest, Booking } from '../types';

// Transform database types to app types
const transformRoom = (dbRoom: DatabaseRoom): Room => ({
  id: dbRoom.id.toString(),
  number: dbRoom.room_number,
  type: dbRoom.room_type === 'standard' ? 'Standard' : 
        dbRoom.room_type === 'deluxe' ? 'Deluxe' : 'Lake View',
  status: dbRoom.status === 'available' ? 'Available' :
          dbRoom.status === 'booked' ? 'Booked' :
          dbRoom.status === 'occupied' ? 'Occupied' : 'Cleaning',
  price: Number(dbRoom.price)
});

const transformGuest = (dbGuest: DatabaseGuest): Guest => ({
  id: dbGuest.id.toString(),
  fullName: `${dbGuest.first_name || ''} ${dbGuest.last_name || ''}`.trim(),
  phone: dbGuest.phone_number || '',
  email: dbGuest.email || undefined,
  nationality: dbGuest.nationality || undefined,
  idType: dbGuest.id_type || undefined,
  idNumber: dbGuest.id_number || undefined
});

const transformBooking = (dbBooking: DatabaseBooking, room: Room, guest: Guest): Booking => ({
  id: dbBooking.id.toString(),
  guestId: guest.id,
  guest,
  roomId: room.id,
  room,
  checkInDate: dbBooking.check_in_date || '',
  checkOutDate: dbBooking.check_out_date || '',
  numberOfGuests: dbBooking.number_of_guests || 1,
  status: dbBooking.status === 'booked' ? 'Confirmed' :
          dbBooking.status === 'checked_in' ? 'Checked In' :
          dbBooking.status === 'checked_out' ? 'Checked Out' : 'Cancelled',
  createdAt: dbBooking.created_at
});

export function useSupabaseData() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');

      if (roomsError) throw roomsError;

      // Fetch guests
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (guestsError) throw guestsError;

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Transform data
      const transformedRooms = roomsData?.map(transformRoom) || [];
      const transformedGuests = guestsData?.map(transformGuest) || [];
      
      // Transform bookings with room and guest data
      const transformedBookings = bookingsData?.map(booking => {
        const room = transformedRooms.find(r => r.id === booking.room_id?.toString());
        const guest = transformedGuests.find(g => g.fullName === booking.guest_name);
        
        if (!room || !guest) {
          // Create placeholder data if not found
          const placeholderRoom: Room = {
            id: booking.room_id?.toString() || '0',
            number: 'Unknown',
            type: 'Standard',
            status: 'Available',
            price: 120
          };
          
          const placeholderGuest: Guest = {
            id: '0',
            fullName: booking.guest_name || 'Unknown Guest',
            phone: booking.guest_phone || '',
            email: booking.guest_email || undefined
          };
          
          return transformBooking(booking, room || placeholderRoom, guest || placeholderGuest);
        }
        
        return transformBooking(booking, room, guest);
      }) || [];

      setRooms(transformedRooms);
      setGuests(transformedGuests);
      setBookings(transformedBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Room operations
  const addRoom = async (roomData: Omit<Room, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          room_number: roomData.number,
          room_type: roomData.type.toLowerCase().replace(' ', '_'),
          status: roomData.status.toLowerCase(),
          price: roomData.price
        })
        .select()
        .single();

      if (error) throw error;
      
      const newRoom = transformRoom(data);
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      console.error('Error adding room:', err);
      throw err;
    }
  };

  const updateRoom = async (roomId: string, updates: Partial<Room>) => {
    try {
      const dbUpdates: any = {};
      if (updates.number) dbUpdates.room_number = updates.number;
      if (updates.type) dbUpdates.room_type = updates.type.toLowerCase().replace(' ', '_');
      if (updates.status) dbUpdates.status = updates.status.toLowerCase();
      if (updates.price !== undefined) dbUpdates.price = updates.price;

      const { data, error } = await supabase
        .from('rooms')
        .update(dbUpdates)
        .eq('id', parseInt(roomId))
        .select()
        .single();

      if (error) throw error;
      
      const updatedRoom = transformRoom(data);
      setRooms(prev => prev.map(room => room.id === roomId ? updatedRoom : room));
      return updatedRoom;
    } catch (err) {
      console.error('Error updating room:', err);
      throw err;
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', parseInt(roomId));

      if (error) throw error;
      
      setRooms(prev => prev.filter(room => room.id !== roomId));
    } catch (err) {
      console.error('Error deleting room:', err);
      throw err;
    }
  };

  // Guest operations
  const addGuest = async (guestData: Omit<Guest, 'id'>) => {
    try {
      const [firstName, ...lastNameParts] = guestData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const { data, error } = await supabase
        .from('guests')
        .insert({
          first_name: firstName,
          last_name: lastName || null,
          email: guestData.email || null,
          phone_number: guestData.phone,
          nationality: guestData.nationality || null,
          id_type: guestData.idType || null,
          id_number: guestData.idNumber || null
        })
        .select()
        .single();

      if (error) throw error;
      
      const newGuest = transformGuest(data);
      setGuests(prev => [...prev, newGuest]);
      return newGuest;
    } catch (err) {
      console.error('Error adding guest:', err);
      throw err;
    }
  };

  // Booking operations
  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          guest_name: bookingData.guest.fullName,
          guest_email: bookingData.guest.email || null,
          guest_phone: bookingData.guest.phone,
          room_id: parseInt(bookingData.roomId),
          check_in_date: bookingData.checkInDate,
          check_out_date: bookingData.checkOutDate,
          number_of_guests: bookingData.numberOfGuests,
          status: bookingData.status.toLowerCase().replace(' ', '_')
        })
        .select()
        .single();

      if (error) throw error;
      
      const newBooking = transformBooking(data, bookingData.room, bookingData.guest);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      console.error('Error adding booking:', err);
      throw err;
    }
  };

  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status.toLowerCase().replace(' ', '_');

      const { data, error } = await supabase
        .from('bookings')
        .update(dbUpdates)
        .eq('id', parseInt(bookingId))
        .select()
        .single();

      if (error) throw error;
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, ...updates }
          : booking
      ));
    } catch (err) {
      console.error('Error updating booking:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    rooms,
    guests,
    bookings,
    loading,
    error,
    refetch: fetchData,
    addRoom,
    updateRoom,
    deleteRoom,
    addGuest,
    addBooking,
    updateBooking
  };
}