import React, { useState } from 'react';
import { Search, Download, Users, Calendar, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function GuestLog() {
  const { stayLogs, bookings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Combine stay logs with checked out bookings
  const allGuestRecords = [
    ...stayLogs,
    ...bookings.filter(booking => booking.status === 'Checked Out').map(booking => ({
      id: booking.id,
      guestId: booking.guestId,
      guest: booking.guest,
      roomId: booking.roomId,
      room: booking.room,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      actualCheckIn: booking.createdAt,
      actualCheckOut: new Date().toISOString()
    }))
  ];

  const filteredRecords = allGuestRecords.filter(record => {
    const matchesSearch = record.guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.guest.phone.includes(searchTerm) ||
                         record.room.number.includes(searchTerm);
    
    const matchesDate = !dateFilter || 
                       record.checkInDate.includes(dateFilter) || 
                       record.checkOutDate.includes(dateFilter);
    
    return matchesSearch && matchesDate;
  });

  const downloadCSV = () => {
    const headers = ['Guest Name', 'Phone', 'Email', 'Room Number', 'Room Type', 'Check-in Date', 'Check-out Date', 'Nationality', 'ID Type', 'ID Number'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.guest.fullName,
        record.guest.phone,
        record.guest.email || '',
        record.room.number,
        record.room.type,
        record.checkInDate,
        record.checkOutDate,
        record.guest.nationality || '',
        record.guest.idType || '',
        record.guest.idNumber || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Log</h1>
          <p className="text-gray-600">Complete history of all guest stays</p>
        </div>
        <button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Download CSV</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by guest name, phone, or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{allGuestRecords.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {allGuestRecords.filter(record => 
                  new Date(record.checkInDate).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nationalities</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(allGuestRecords.map(record => record.guest.nationality).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Repeat Guests</p>
              <p className="text-2xl font-bold text-gray-900">
                {allGuestRecords.reduce((acc, record) => {
                  const guestStays = allGuestRecords.filter(r => r.guestId === record.guestId);
                  return guestStays.length > 1 ? acc + 1 : acc;
                }, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stay Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.guest.fullName}</div>
                      {record.guest.nationality && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {record.guest.nationality}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Room {record.room.number}</div>
                    <div className="text-sm text-gray-500">{record.room.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>In: {new Date(record.checkInDate).toLocaleDateString()}</div>
                      <div>Out: {new Date(record.checkOutDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.guest.idType && record.guest.idNumber ? (
                      <div className="text-sm text-gray-900">
                        <div>{record.guest.idType}</div>
                        <div className="text-gray-500">{record.guest.idNumber}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {record.guest.phone}
                      </div>
                      {record.guest.email && (
                        <div className="text-gray-500 mt-1">{record.guest.email}</div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No guest records found</p>
          </div>
        )}
      </div>
    </div>
  );
}