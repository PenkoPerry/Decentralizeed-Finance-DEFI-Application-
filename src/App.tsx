import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { MarketsPage } from './pages/MarketsPage';
import { DashboardPage } from './pages/DashboardPage';
import { FaucetPage } from './pages/FaucetPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden font-poppins">
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/faucet" element={<FaucetPage />} />
      </Routes>
    </div>
  );
}

export default App;