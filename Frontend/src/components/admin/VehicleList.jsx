import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles(); // Refresh the list
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-premium-silver">Loading vehicles...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-premium-white mb-6">Vehicle List</h2>
      <div className="bg-premium-dark rounded-xl border border-premium-gray overflow-hidden">
        <table className="w-full">
          <thead className="bg-premium-gray">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Brand/Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Price/Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-premium-silver uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-premium-gray">
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id} className="hover:bg-premium-gray/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-16 h-16 bg-premium-gray rounded-lg overflow-hidden">
                    {vehicle.image ? (
                      <img 
                        src={`http://localhost:5000/uploads/${vehicle.image}`} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-premium-silver">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-premium-white">{vehicle.name}</td>
                <td className="px-6 py-4 text-premium-silver">{vehicle.brand} • {vehicle.model}</td>
                <td className="px-6 py-4 text-premium-gold font-semibold">${vehicle.pricePerDay}/day</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    vehicle.availability 
                      ? 'bg-green-900/20 text-green-400' 
                      : 'bg-red-900/20 text-red-400'
                  }`}>
                    {vehicle.availability ? 'Available' : 'Not Available'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* Implement edit functionality */}}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;