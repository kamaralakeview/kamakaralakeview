import React, { useState } from 'react';
import { UserCheck, Calendar, Users, Phone, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';

export function CheckIn() {
  const { bookings, setBookings, rooms, setRooms, guests, setGuests } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [checkInData, setCheckInData] = useState({
    idType: '',
    idNumber: '',
    nationality: ''
  });

  const confirmedBookings = bookings.filter(booking => booking.status === 'Confirmed');

  const handleCheckIn = () => {
    if (!selectedBooking) return;

    // Update guest information
    setGuests(prev => prev.map(guest => 
      guest.id === selectedBooking.guestId 
        ? { 
            ...guest, 
            idType: checkInData.idType,
            idNumber: checkInData.idNumber,
            nationality: checkInData.nationality
          }
        : guest
    ));

    // Update booking status
    setBookings(prev => prev.map(booking => 
      booking.id === selectedBooking.id 
        ? { ...booking, status: 'Checked In' as Booking['status'] }
        : booking
    ));

    // Update room status
    setRooms(prev => prev.map(room => 
      room.id === selectedBooking.roomId 
        ? { ...room, status: 'Occupied' as const }
        : room
    ));

    // Reset form
    setSelectedBooking(null);
    setCheckInData({
      idType: '',
      idNumber: '',
      nationality: ''
    });

    alert('Guest checked in successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check-In Management</h1>
        <p className="text-gray-600">Process guest check-ins for confirmed bookings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Confirmed Bookings
          </h2>
          
          {confirmedBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No confirmed bookings for check-in</p>
          ) : (
            <div className="space-y-3">
              {confirmedBookings.map((booking) => (
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
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-1" />
                        {booking.guest.phone}
                      </p>
                      {booking.guest.email && (
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Mail className="w-4 h-4 mr-1" />
                          {booking.guest.email}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Room {booking.room.number}</p>
                      <p className="text-sm text-gray-600">{booking.room.type}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        {booking.numberOfGuests} guests
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Check-in: {new Date(booking.checkInDate).toLocaleDateString()} - 
                      Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check-In Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Check-In Details
          </h2>
          
          {selectedBooking ? (
            <div>
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Guest:</p>
                    <p className="font-medium">{selectedBooking.guest.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Room:</p>
                    <p className="font-medium">{selectedBooking.room.number} ({selectedBooking.room.type})</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-in Date:</p>
                    <p className="font-medium">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-out Date:</p>
                    <p className="font-medium">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Number of Guests:</p>
                    <p className="font-medium">{selectedBooking.numberOfGuests}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone:</p>
                    <p className="font-medium">{selectedBooking.guest.phone}</p>
                  </div>
                </div>
              </div>

              {/* Guest Information Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Type *
                  </label>
                  <select
                    value={checkInData.idType}
                    onChange={(e) => setCheckInData(prev => ({ ...prev, idType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select ID Type</option>
                    <option value="Passport">Passport</option>
                    <option value="ID Card">National ID Card</option>
                    <option value="Driver License">Driver's License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    value={checkInData.idNumber}
                    onChange={(e) => setCheckInData(prev => ({ ...prev, idNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter ID number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    value={checkInData.nationality}
                    onChange={(e) => setCheckInData(prev => ({ ...prev, nationality: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter nationality"
                    required
                  />
                </div>

                <button
                  onClick={handleCheckIn}
                  disabled={!checkInData.idType || !checkInData.idNumber || !checkInData.nationality}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Confirm Check-In</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a booking to proceed with check-in</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}