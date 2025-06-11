import React from 'react';
import { Building2, Calendar, UserCheck, LogOut, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const { rooms, bookings } = useApp();

  const totalRooms = rooms.length;
  const bookedRooms = rooms.filter(room => room.status === 'Booked' || room.status === 'Occupied').length;
  const availableRooms = rooms.filter(room => room.status === 'Available').length;
  
  const today = new Date().toISOString().split('T')[0];
  const todayCheckIns = bookings.filter(booking => 
    booking.checkInDate === today && booking.status === 'Confirmed'
  ).length;
  const todayCheckOuts = bookings.filter(booking => 
    booking.checkOutDate === today && booking.status === 'Checked In'
  ).length;

  const stats = [
    { label: 'Total Rooms', value: totalRooms, icon: Building2, color: 'bg-blue-500' },
    { label: 'Booked Rooms', value: bookedRooms, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Available Rooms', value: availableRooms, icon: Building2, color: 'bg-green-500' },
    { label: "Today's Check-ins", value: todayCheckIns, icon: UserCheck, color: 'bg-purple-500' },
    { label: "Today's Check-outs", value: todayCheckOuts, icon: LogOut, color: 'bg-red-500' },
  ];

  const quickActions = [
    { label: 'New Booking', icon: Plus, action: () => onPageChange('bookings'), color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Check-In', icon: UserCheck, action: () => onPageChange('checkin'), color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Check-Out', icon: LogOut, action: () => onPageChange('checkout'), color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Kamara Lake View Hotel Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-lg transition-colors flex items-center justify-center space-x-3`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-lg font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.guest.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.room.number} ({booking.room.type})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'Checked In' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}