import React, { useState } from 'react';
import { LogOut, Building2, Calendar, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking, StayLog } from '../types';

export function CheckOut() {
  const { bookings, setBookings, rooms, setRooms, stayLogs, setStayLogs } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const checkedInBookings = bookings.filter(booking => booking.status === 'Checked In');

  const handleCheckOut = () => {
    if (!selectedBooking) return;

    // Create stay log entry
    const stayLog: StayLog = {
      id: Date.now().toString(),
      guestId: selectedBooking.guestId,
      guest: selectedBooking.guest,
      roomId: selectedBooking.roomId,
      room: selectedBooking.room,
      checkInDate: selectedBooking.checkInDate,
      checkOutDate: selectedBooking.checkOutDate,
      actualCheckIn: selectedBooking.createdAt,
      actualCheckOut: new Date().toISOString()
    };

    setStayLogs(prev => [...prev, stayLog]);

    // Update booking status
    setBookings(prev => prev.map(booking => 
      booking.id === selectedBooking.id 
        ? { ...booking, status: 'Checked Out' as Booking['status'] }
        : booking
    ));

    // Update room status to Available
    setRooms(prev => prev.map(room => 
      room.id === selectedBooking.roomId 
        ? { ...room, status: 'Available' as const }
        : room
    ));

    setSelectedBooking(null);
    alert('Guest checked out successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check-Out Management</h1>
        <p className="text-gray-600">Process guest check-outs for occupied rooms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Occupied Rooms */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Occupied Rooms
          </h2>
          
          {checkedInBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No guests currently checked in</p>
          ) : (
            <div className="space-y-3">
              {checkedInBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedBooking?.id === booking.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{booking.guest.fullName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{booking.guest.phone}</p>
                      {booking.guest.email && (
                        <p className="text-sm text-gray-600">{booking.guest.email}</p>
                      )}
                      {booking.guest.nationality && (
                        <p className="text-sm text-gray-600">Nationality: {booking.guest.nationality}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">Room {booking.room.number}</p>
                      <p className="text-sm text-gray-600">{booking.room.type}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        {booking.numberOfGuests} guests
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Checked in: {new Date(booking.checkInDate).toLocaleDateString()} - 
                      Expected checkout: {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check-Out Confirmation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <LogOut className="w-5 h-5 mr-2" />
            Check-Out Confirmation
          </h2>
          
          {selectedBooking ? (
            <div>
              {/* Stay Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Stay Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guest:</span>
                    <span className="font-medium">{selectedBooking.guest.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">{selectedBooking.room.number} ({selectedBooking.room.type})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in Date:</span>
                    <span className="font-medium">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Check-out:</span>
                    <span className="font-medium">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Guests:</span>
                    <span className="font-medium">{selectedBooking.numberOfGuests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedBooking.guest.phone}</span>
                  </div>
                  {selectedBooking.guest.nationality && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nationality:</span>
                      <span className="font-medium">{selectedBooking.guest.nationality}</span>
                    </div>
                  )}
                  {selectedBooking.guest.idType && selectedBooking.guest.idNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{selectedBooking.guest.idType} - {selectedBooking.guest.idNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Billing Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Rate per Night:</span>
                    <span className="font-medium">${selectedBooking.room.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Nights:</span>
                    <span className="font-medium">
                      {Math.ceil((new Date(selectedBooking.checkOutDate).getTime() - new Date(selectedBooking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>
                        ${selectedBooking.room.price * Math.ceil((new Date(selectedBooking.checkOutDate).getTime() - new Date(selectedBooking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckOut}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Confirm Check-Out</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <LogOut className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a room to proceed with check-out</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}