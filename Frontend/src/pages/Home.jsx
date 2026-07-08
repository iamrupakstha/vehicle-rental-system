import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const LandingPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data.slice(0, 6)); // Show only 6 vehicles on landing
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-premium-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-premium-white">Premium Vehicle</span>
                <br />
                <span className="text-premium-gold">Rental Services</span>
              </h1>
              <p className="text-lg text-premium-silver max-w-lg">
                Experience luxury and comfort with our premium fleet of vehicles. 
                Book your dream car today and drive in style.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/vehicles"
                  className="px-8 py-3 bg-premium-gold text-premium-black font-semibold rounded-lg hover:bg-premium-gold/90 transition-all transform hover:scale-105"
                >
                  Browse Vehicles
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-3 border border-premium-gold text-premium-gold font-semibold rounded-lg hover:bg-premium-gold/10 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-premium-gold/20 to-premium-gray rounded-2xl flex items-center justify-center border border-premium-gray">
                  <div className="text-center">
                    <svg className="w-32 h-32 text-premium-gold mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <p className="text-premium-silver mt-4">Luxury Fleet Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-premium-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-premium-white">
              Featured <span className="text-premium-gold">Vehicles</span>
            </h2>
            <p className="mt-4 text-premium-silver">
              Discover our premium collection of vehicles
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-premium-gray rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-premium-lightgray rounded-lg mb-4"></div>
                  <div className="h-6 bg-premium-lightgray rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-premium-lightgray rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-premium-gray rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-premium-lightgray hover:border-premium-gold">
                  <div className="h-48 bg-gradient-to-br from-premium-lightgray to-premium-gray flex items-center justify-center">
                    {vehicle.image ? (
                      <img 
                        src={`http://localhost:5000/uploads/${vehicle.image}`} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-16 h-16 text-premium-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-premium-white">{vehicle.name}</h3>
                    <p className="text-premium-silver text-sm mt-1">{vehicle.brand} • {vehicle.model}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-premium-gold">${vehicle.pricePerDay}/day</span>
                      <button className="px-4 py-2 bg-premium-gold text-premium-black font-semibold rounded-lg hover:bg-premium-gold/90 transition-all">
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-premium-silver">
              No vehicles available at the moment.
            </div>
          )}

          {vehicles.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/vehicles"
                className="px-8 py-3 border border-premium-gold text-premium-gold font-semibold rounded-lg hover:bg-premium-gold/10 transition-all"
              >
                View All Vehicles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-premium-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-premium-dark rounded-xl border border-premium-gray hover:border-premium-gold transition-all">
              <div className="w-16 h-16 bg-premium-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-premium-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-premium-white mb-2">Premium Quality</h3>
              <p className="text-premium-silver">Top-tier vehicles maintained to the highest standards.</p>
            </div>

            <div className="text-center p-6 bg-premium-dark rounded-xl border border-premium-gray hover:border-premium-gold transition-all">
              <div className="w-16 h-16 bg-premium-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-premium-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-premium-white mb-2">24/7 Support</h3>
              <p className="text-premium-silver">Round-the-clock assistance for all your rental needs.</p>
            </div>

            <div className="text-center p-6 bg-premium-dark rounded-xl border border-premium-gray hover:border-premium-gold transition-all">
              <div className="w-16 h-16 bg-premium-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-premium-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 1v1m0 1v1m0 1v1m0 1v1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-premium-white mb-2">Best Prices</h3>
              <p className="text-premium-silver">Competitive rates with no hidden charges.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;