import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Room } from '../types';

export function Rooms() {
  const { 
    rooms, 
    loading, 
    error, 
    addRoom, 
    updateRoom, 
    deleteRoom 
  } = useApp();
  
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    type: 'Standard' as Room['type'],
    status: 'Available' as Room['status'],
    price: 120
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
      } else {
        await addRoom(formData);
      }
      
      resetForm();
      alert(editingRoom ? 'Room updated successfully!' : 'Room added successfully!');
    } catch (err) {
      console.error('Error saving room:', err);
      alert('Error saving room. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      type: 'Standard',
      status: 'Available',
      price: 120
    });
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      status: room.status,
      price: room.price
    });
    setShowForm(true);
  };

  const handleDelete = async (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId);
        alert('Room deleted successfully!');
      } catch (err) {
        console.error('Error deleting room:', err);
        alert('Error deleting room. Please try again.');
      }
    }
  };

  const updateRoomStatus = async (roomId: string, status: Room['status']) => {
    try {
      await updateRoom(roomId, { status });
    } catch (err) {
      console.error('Error updating room status:', err);
      alert('Error updating room status. Please try again.');
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Booked': return 'bg-yellow-100 text-yellow-800';
      case 'Occupied': return 'bg-red-100 text-red-800';
      case 'Cleaning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading rooms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading rooms: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rooms Management</h1>
          <p className="text-gray-600">Manage hotel rooms and their availability</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Room Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Room['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Lake View">Lake View</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Room['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      {editingRoom ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingRoom ? 'Update Room' : 'Add Room'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-lg">Room {room.number}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(room)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">Type: <span className="font-medium">{room.type}</span></p>
              <p className="text-sm text-gray-600">Price: <span className="font-medium">${room.price}/night</span></p>
            </div>
            
            <div className="mb-4">
              <select
                value={room.status}
                onChange={(e) => updateRoomStatus(room.id, e.target.value as Room['status'])}
                className={`w-full px-3 py-2 rounded-md text-sm font-medium ${getStatusColor(room.status)} border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Occupied">Occupied</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No rooms found. Add your first room to get started!</p>
        </div>
      )}
    </div>
  );
}