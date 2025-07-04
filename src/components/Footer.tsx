import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Droplet className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-emerald-700">PaintCycle London</span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              Share Leftover Paint, Save Resources, Colour Our City Sustainably.
              Join our community of eco-conscious Londoners reducing waste one paint can at a time.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-emerald-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-600">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-base text-gray-600 hover:text-emerald-600">Home</Link>
              </li>
              <li>
                <Link to="/browse" className="text-base text-gray-600 hover:text-emerald-600">Browse Paint</Link>
              </li>
              <li>
                <Link to="/list-paint" className="text-base text-gray-600 hover:text-emerald-600">List Paint</Link>
              </li>
              <li>
                <Link to="/about" className="text-base text-gray-600 hover:text-emerald-600">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-emerald-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-emerald-600">Terms and Conditions</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-base text-gray-600 hover:text-emerald-600">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-600 hover:text-emerald-600">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 text-center">
            &copy; {new Date().getFullYear()} PaintCycle London. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 text-center mt-2">
            #ZeroWasteLondon #SustainableDecor
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;