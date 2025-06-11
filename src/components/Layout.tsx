import React, { ReactNode } from 'react';
import { 
  Home, 
  Building2, 
  Calendar, 
  UserCheck, 
  LogOut, 
  Users, 
  Settings,
  Mic
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'rooms', name: 'Rooms', icon: Building2 },
  { id: 'bookings', name: 'Bookings', icon: Calendar },
  { id: 'checkin', name: 'Check-In', icon: UserCheck },
  { id: 'checkout', name: 'Check-Out', icon: LogOut },
  { id: 'guests', name: 'Guest Log', icon: Users },
  { id: 'voice', name: 'Emirald AI', icon: Mic },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src="/3ce624b0-571e-4395-90fc-18f23020fccd.JPG" 
              alt="Kamara Lake View Hotel" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Kamara Lake View</h1>
              <p className="text-sm text-gray-600">Hotel Management</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}