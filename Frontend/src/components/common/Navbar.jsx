import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-premium-black border-b border-premium-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-premium-gold rounded-full flex items-center justify-center">
              <span className="text-premium-black font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-premium-white">Rent</span>
              <span className="text-premium-gold">Wheels</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-premium-silver hover:text-premium-gold transition-colors">
              Home
            </Link>
            <Link to="/vehicles" className="text-premium-silver hover:text-premium-gold transition-colors">
              Vehicles
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/profile'} 
                  className="text-premium-silver hover:text-premium-gold transition-colors"
                >
                  {user?.role === 'admin' ? 'Dashboard' : 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-premium-gold text-premium-black font-semibold rounded-lg hover:bg-premium-gold/90 transition-all transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-premium-silver hover:text-premium-gold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-premium-gold text-premium-black font-semibold rounded-lg hover:bg-premium-gold/90 transition-all transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-premium-silver hover:text-premium-gold"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-premium-gray">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-premium-silver hover:text-premium-gold">Home</Link>
              <Link to="/vehicles" className="text-premium-silver hover:text-premium-gold">Vehicles</Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/profile'} 
                    className="text-premium-silver hover:text-premium-gold"
                  >
                    {user?.role === 'admin' ? 'Dashboard' : 'Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-premium-gold text-premium-black font-semibold rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-premium-silver hover:text-premium-gold">Login</Link>
                  <Link to="/register" className="px-6 py-2 bg-premium-gold text-premium-black font-semibold rounded-lg text-center">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;