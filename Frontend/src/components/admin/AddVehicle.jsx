import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    pricePerDay: '',
    availability: true,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataWithImage = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataWithImage.append(key, formData[key]);
      });
      if (image) {
        formDataWithImage.append('image', image);
      }

      await api.post('/vehicles', formDataWithImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-premium-white mb-6">Add New Vehicle</h2>
      <div className="bg-premium-dark rounded-xl border border-premium-gray p-6">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-premium-silver mb-2">
                Vehicle Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                placeholder="e.g., Luxury Sedan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-premium-silver mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                placeholder="e.g., Mercedes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-premium-silver mb-2">
                Model
              </label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                placeholder="e.g., S-Class"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-premium-silver mb-2">
                Price Per Day ($)
              </label>
              <input
                type="number"
                name="pricePerDay"
                required
                min="0"
                step="0.01"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent"
                placeholder="e.g., 150"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-premium-silver mb-2">
                Vehicle Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-silver file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-premium-gold file:text-premium-black hover:file:bg-premium-gold/90"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                  className="w-5 h-5 accent-premium-gold"
                />
                <span className="text-premium-silver">Available for Rent</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-premium-gold text-premium-black font-semibold rounded-lg hover:bg-premium-gold/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-8 py-3 bg-premium-gray text-premium-silver font-semibold rounded-lg hover:bg-premium-lightgray transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;