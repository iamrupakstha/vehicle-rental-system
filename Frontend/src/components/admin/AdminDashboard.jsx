import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import UsersList from './UsersList.jsx';
import AddVehicle from './AddVehicle';
import VehicleList from './VehicleList';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('vehicles');

  const tabs = [
    { id: 'vehicles', label: 'Vehicle List', path: '/admin/dashboard' },
    { id: 'add', label: 'Add Vehicle', path: '/admin/dashboard/add' },
    { id: 'users', label: 'Users List', path: '/admin/dashboard/users' },
  ];

  return (
    <div className="min-h-screen bg-premium-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-premium-white mb-8">
          Admin <span className="text-premium-gold">Dashboard</span>
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-premium-gray pb-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                (activeTab === tab.id) || 
                (tab.id === 'vehicles' && location.pathname === '/admin/dashboard') ||
                (tab.id === 'users' && location.pathname === '/admin/dashboard/users') ||
                (tab.id === 'add' && location.pathname === '/admin/dashboard/add')
                  ? 'bg-premium-gold text-premium-black'
                  : 'bg-premium-gray text-premium-silver hover:bg-premium-lightgray'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Routes */}
        <Routes>
          <Route index element={<VehicleList />} />
          <Route path="add" element={<AddVehicle />} />
          <Route path="users" element={<UsersList />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;