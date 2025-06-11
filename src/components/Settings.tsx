import React, { useState } from 'react';
import { Settings as SettingsIcon, Clock, Users, Globe, Download, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { settings, setSettings, stayLogs, bookings } = useApp();
  const [formData, setFormData] = useState(settings);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Receptionist' as 'Receptionist' | 'Admin'
  });

  const handleSave = () => {
    setSettings(formData);
    alert('Settings saved successfully!');
  };

  const downloadGuestLog = (format: 'csv' | 'json') => {
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

    if (format === 'csv') {
      const headers = ['Guest Name', 'Phone', 'Email', 'Room Number', 'Room Type', 'Check-in Date', 'Check-out Date', 'Nationality', 'ID Type', 'ID Number'];
      const csvContent = [
        headers.join(','),
        ...allGuestRecords.map(record => [
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
    } else {
      const jsonContent = JSON.stringify(allGuestRecords, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guest-log-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const addUser = () => {
    // In a real app, this would save to a database
    console.log('Adding user:', newUser);
    setNewUser({ name: '', email: '', role: 'Receptionist' });
    setShowUserForm(false);
    alert('User added successfully! (Note: This is a demo - in production, this would be saved to the database)');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure hotel management system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            General Settings
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Check-in Time
              </label>
              <input
                type="time"
                value={formData.checkInTime}
                onChange={(e) => setFormData(prev => ({ ...prev, checkInTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Check-out Time
              </label>
              <input
                type="time"
                value={formData.checkOutTime}
                onChange={(e) => setFormData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as 'English' | 'French' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="English">English</option>
                <option value="French">Français</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            User Management
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Current Users</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-500">admin@kamaralakeview.com</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Front Desk</p>
                    <p className="text-xs text-gray-500">reception@kamaralakeview.com</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Receptionist</span>
                </div>
              </div>
            </div>

            {!showUserForm ? (
              <button
                onClick={() => setShowUserForm(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Add New User
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'Receptionist' | 'Admin' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Receptionist">Receptionist</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={addUser}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Data Export
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Guest Log Export</h3>
            <p className="text-sm text-gray-600 mb-4">Download complete guest history with all stay records</p>
            <div className="space-y-2">
              <button
                onClick={() => downloadGuestLog('csv')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
              <button
                onClick={() => downloadGuestLog('json')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">System Backup</h3>
            <p className="text-sm text-gray-600 mb-4">Create a complete backup of all hotel data</p>
            <button
              onClick={() => {
                const allData = {
                  rooms: JSON.parse(localStorage.getItem('hotel-rooms') || '[]'),
                  guests: JSON.parse(localStorage.getItem('hotel-guests') || '[]'),
                  bookings: JSON.parse(localStorage.getItem('hotel-bookings') || '[]'),
                  stayLogs: JSON.parse(localStorage.getItem('hotel-stay-logs') || '[]'),
                  settings: JSON.parse(localStorage.getItem('hotel-settings') || '{}'),
                  exportDate: new Date().toISOString()
                };
                
                const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `hotel-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Create Backup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hotel Information */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Kamara Lake View Hotel</h3>
            <p className="text-sm text-gray-600">Premium lakeside accommodation with stunning views and exceptional service.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">System Version</h3>
            <p className="text-sm text-gray-600">Hotel Management System v1.0</p>
            <p className="text-xs text-gray-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}