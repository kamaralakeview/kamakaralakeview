import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Room, Guest, Booking, StayLog, Settings } from '../types';

interface AppContextType {
  rooms: Room[];
  setRooms: (rooms: Room[] | ((prev: Room[]) => Room[])) => void;
  guests: Guest[];
  setGuests: (guests: Guest[] | ((prev: Guest[]) => Guest[])) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[] | ((prev: Booking[]) => Booking[])) => void;
  stayLogs: StayLog[];
  setStayLogs: (logs: StayLog[] | ((prev: StayLog[]) => StayLog[])) => void;
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  addRoom: (roomData: Omit<Room, 'id'>) => Promise<Room>;
  updateRoom: (roomId: string, updates: Partial<Room>) => Promise<Room>;
  deleteRoom: (roomId: string) => Promise<void>;
  addGuest: (guestData: Omit<Guest, 'id'>) => Promise<Guest>;
  addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: Settings = {
  checkInTime: '15:00',
  checkOutTime: '11:00',
  language: 'English'
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Use Supabase for main data
  const {
    rooms,
    guests,
    bookings,
    loading,
    error,
    refetch,
    addRoom,
    updateRoom,
    deleteRoom,
    addGuest,
    addBooking,
    updateBooking
  } = useSupabaseData();

  // Use local storage for stay logs and settings (these are app-specific)
  const [stayLogs, setStayLogs] = useLocalStorage<StayLog[]>('hotel-stay-logs', []);
  const [settings, setSettings] = useLocalStorage('hotel-settings', defaultSettings);

  // Wrapper functions to maintain compatibility with existing components
  const setRooms = (rooms: Room[] | ((prev: Room[]) => Room[])) => {
    // This is handled by Supabase operations now
    console.log('setRooms called - use addRoom, updateRoom, deleteRoom instead');
  };

  const setGuests = (guests: Guest[] | ((prev: Guest[]) => Guest[])) => {
    // This is handled by Supabase operations now
    console.log('setGuests called - use addGuest instead');
  };

  const setBookings = (bookings: Booking[] | ((prev: Booking[]) => Booking[])) => {
    // This is handled by Supabase operations now
    console.log('setBookings called - use addBooking, updateBooking instead');
  };

  return (
    <AppContext.Provider value={{
      rooms,
      setRooms,
      guests,
      setGuests,
      bookings,
      setBookings,
      stayLogs,
      setStayLogs,
      settings,
      setSettings,
      loading,
      error,
      refetch,
      addRoom,
      updateRoom,
      deleteRoom,
      addGuest,
      addBooking,
      updateBooking
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}