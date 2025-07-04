import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Droplet, User, MessageCircle, LogOut, Recycle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMessages } from '../hooks/useMessages';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { messages } = useMessages();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const unreadMessages = messages.filter(m => !m.read && m.receiver_id === user?.id).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowProfileMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMessagesClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
    window.sessionStorage.setItem('profileActiveTab', 'messages');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Droplet className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-emerald-700">PaintCycle London</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/browse" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
              Browse Paint
            </Link>
            <Link to="/list-paint" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
              List Paint
            </Link>
            <Link to="/donated" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
              <Recycle className="h-4 w-4 inline mr-1" />
              Donated Paints
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
              About
            </Link>
            
            {user ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  Account
                  {unreadMessages > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500 text-white">
                      {unreadMessages}
                    </span>
                  )}
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setShowProfileMenu(false);
                          window.sessionStorage.removeItem('profileActiveTab');
                        }}
                      >
                        <User className="h-4 w-4 inline mr-2" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleMessagesClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <MessageCircle className="h-4 w-4 inline mr-2" />
                        Messages
                        {unreadMessages > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-600">
                            {unreadMessages}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700">
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/browse" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Browse Paint
            </Link>
            <Link 
              to="/list-paint" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              List Paint
            </Link>
            <Link 
              to="/donated" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Recycle className="h-4 w-4 inline mr-1" />
              Donated Paints
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                  onClick={() => {
                    setIsOpen(false);
                    window.sessionStorage.removeItem('profileActiveTab');
                  }}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  My Profile
                </Link>
                <button 
                  onClick={() => {
                    handleMessagesClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <MessageCircle className="h-4 w-4 inline mr-2" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-600">
                      {unreadMessages}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;