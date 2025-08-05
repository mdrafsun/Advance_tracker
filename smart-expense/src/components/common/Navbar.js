import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { actionTypes } from '../../context/AppContext';
import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const toggleSidebar = () => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
  };

  const handleLogout = () => {
    dispatch({ type: actionTypes.LOGOUT });
    navigate('/login');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userMenuItems = [
    {
      name: 'Profile',
      icon: UserIcon,
      action: () => {
        navigate('/profile');
        setUserMenuOpen(false);
      }
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      action: () => {
        // Add settings functionality later
        setUserMenuOpen(false);
      }
    },
    {
      name: 'Sign out',
      icon: ArrowRightOnRectangleIcon,
      action: handleLogout
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center">
          {/* Mobile sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Page title - you can make this dynamic based on current route */}
          <h1 className="ml-4 lg:ml-0 text-2xl font-semibold text-gray-900 capitalize">
            {location.pathname.replace('/', '') || 'Dashboard'}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* User role badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            state.user?.role === 'admin' 
              ? 'bg-purple-100 text-purple-800'
              : state.user?.role === 'business'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {state.user?.role}
          </div>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <BellIcon className="h-6 w-6" />
            {state.unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {state.unreadNotifications}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={state.user?.avatar}
                  alt={state.user?.name}
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {state.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {state.user?.email}
                  </p>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </button>

            {/* User menu dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                {userMenuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <item.icon className="mr-3 h-4 w-4 text-gray-400" />
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;