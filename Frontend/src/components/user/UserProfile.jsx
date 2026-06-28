import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-premium-silver">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-premium-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-premium-dark rounded-2xl border border-premium-gray p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-premium-gold rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-premium-black">
                {user.name?.charAt(0).toUpperCase() || 'U'} {/* Changed from username to name */}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-premium-white">{user.name}</h1> {/* Changed from username to name */}
              <p className="text-premium-silver">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-premium-gray rounded-full text-xs font-semibold text-premium-silver">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-premium-gray rounded-lg p-4">
              <h3 className="text-sm font-medium text-premium-silver mb-1">Full Name</h3> {/* Changed from Username */}
              <p className="text-premium-white">{user.name}</p>
            </div>
            <div className="bg-premium-gray rounded-lg p-4">
              <h3 className="text-sm font-medium text-premium-silver mb-1">Email</h3>
              <p className="text-premium-white">{user.email}</p>
            </div>
            <div className="bg-premium-gray rounded-lg p-4">
              <h3 className="text-sm font-medium text-premium-silver mb-1">Phone</h3>
              <p className="text-premium-white">{user.phone || 'Not provided'}</p>
            </div>
            <div className="bg-premium-gray rounded-lg p-4">
              <h3 className="text-sm font-medium text-premium-silver mb-1">Role</h3>
              <p className="text-premium-white capitalize">{user.role}</p>
            </div>
            <div className="bg-premium-gray rounded-lg p-4 md:col-span-2">
              <h3 className="text-sm font-medium text-premium-silver mb-1">Member Since</h3>
              <p className="text-premium-white">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;