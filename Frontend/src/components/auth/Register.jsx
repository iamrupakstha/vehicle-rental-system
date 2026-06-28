import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',  // Changed from 'username' to 'name'
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Remove confirmPassword from data sent to backend
    const { confirmPassword, ...registerData } = formData;
    
    const result = await register(registerData);
    
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/profile');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-premium-dark p-8 rounded-2xl border border-premium-gray">
        <div>
          <h2 className="text-center text-3xl font-bold text-premium-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-premium-silver">
            Join RentWheels today
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-premium-silver">
              Full Name
            </label>
            <input
              id="name"
              name="name"  // Changed from 'username' to 'name'
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-premium-silver">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-premium-silver">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-premium-silver">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-premium-silver">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-premium-gray border border-premium-lightgray rounded-lg text-premium-white placeholder-premium-silver focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-premium-gold text-premium-black font-semibold rounded-lg hover:bg-premium-gold/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-premium-silver">
            Already have an account?{' '}
            <Link to="/login" className="text-premium-gold hover:text-premium-gold/80 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;