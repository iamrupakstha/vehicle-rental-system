import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-premium-black border-t border-premium-gray mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-premium-gold rounded-full flex items-center justify-center">
                <span className="text-premium-black font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-premium-white">Rent</span>
                <span className="text-premium-gold">Wheels</span>
              </span>
            </div>
            <p className="text-premium-silver text-sm">
              Premium vehicle rental services for your every need.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-premium-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-premium-silver hover:text-premium-gold text-sm">Home</Link></li>
              <li><Link to="/vehicles" className="text-premium-silver hover:text-premium-gold text-sm">Vehicles</Link></li>
              <li><Link to="/about" className="text-premium-silver hover:text-premium-gold text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-premium-silver hover:text-premium-gold text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-premium-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-premium-silver text-sm">Car Rental</li>
              <li className="text-premium-silver text-sm">Bike Rental</li>
              <li className="text-premium-silver text-sm">SUV Rental</li>
              <li className="text-premium-silver text-sm">Luxury Cars</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-premium-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-premium-silver text-sm">📞 +1 (555) 123-4567</li>
              <li className="text-premium-silver text-sm">✉️ info@rentwheels.com</li>
              <li className="text-premium-silver text-sm">📍 123 Luxury Ave, NY</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-premium-silver hover:text-premium-gold transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-premium-silver hover:text-premium-gold transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-premium-silver hover:text-premium-gold transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.821-12.85c.503-.36.94-.792 1.312-1.292z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-premium-gray mt-8 pt-8 text-center">
          <p className="text-premium-silver text-sm">
            &copy; {new Date().getFullYear()} RentWheels. All rights reserved. | Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;