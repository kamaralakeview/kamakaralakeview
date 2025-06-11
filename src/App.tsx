import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Rooms } from './components/Rooms';
import { Bookings } from './components/Bookings';
import { CheckIn } from './components/CheckIn';
import { CheckOut } from './components/CheckOut';
import { GuestLog } from './components/GuestLog';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Settings } from './components/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'rooms':
        return <Rooms />;
      case 'bookings':
        return <Bookings />;
      case 'checkin':
        return <CheckIn />;
      case 'checkout':
        return <CheckOut />;
      case 'guests':
        return <GuestLog />;
      case 'voice':
        return <VoiceAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <AppProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  );
}

export default App;