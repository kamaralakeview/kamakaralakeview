import React, { useState } from 'react';
import { UserCheck, Calendar, Users, Phone, Mail, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';

export function CheckIn() {
  const { 
    bookings, 
    rooms, 
    guests, 
    loading, 
    error, 
    updateBooking, 
    updateRoom, 
    updateGuest 
  } = useApp();
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkInData, setCheckInData] = useState({
    idType: '',
    idNumber: '',
    nationality: ''
  });

  const confirmedBookings = bookings.filter(booking => booking.status === 'Confirmed');

  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    setSubmitting(true);
    try {
      // Update guest information
      await updateGuest(selectedBooking.guestId, {
        idType: checkInData.idType,
        idNumber: checkInData.idNumber,
        nationality: checkInData.nationality
      });

      // Update booking status
      await updateBooking(selectedBooking.id, { status: 'Checked In' });

      // Update room status
      await updateRoom(selectedBooking.roomId, { status: 'Occupied' });

      // Reset form
      setSelectedBooking(null);
      setCheckInData({
        idType: '',
        idNumber: '',
        nationality: ''
      });

      alert('Guest checked in successfully!');
    } catch (err) {
      console.error('Error during check-in:', err);
      alert('Error during check-in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading check-in data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading check-in data: {error}</p>
      </div>
    );
  }

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
                  disabled={!checkInData.idType || !checkInData.idNumber || !checkInData.nationality || submitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5" />
                      <span>Confirm Check-In</span>
                    </>
                  )}
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