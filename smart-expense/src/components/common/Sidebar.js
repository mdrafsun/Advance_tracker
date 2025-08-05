import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { actionTypes } from '../../context/AppContext';
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartPieIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  BellIcon,
  UserIcon,
  Bars3Icon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { state, dispatch } = useApp();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Income', href: '/income', icon: BanknotesIcon },
    { name: 'Expenses', href: '/expenses', icon: CreditCardIcon },
    { name: 'Budget', href: '/budget', icon: ChartPieIcon },
    { name: 'Savings & Loans', href: '/savings', icon: BuildingLibraryIcon },
    { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
    { name: 'Notifications', href: '/notifications', icon: BellIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon }
  ];

  // Add admin link for admin users
  if (state.user?.role === 'admin') {
    navigationItems.splice(-1, 0, { name: 'Admin Panel', href: '/admin', icon: Cog6ToothIcon });
  }

  const toggleSidebar = () => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {state.sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ${
        state.sidebarOpen 
          ? 'w-64 translate-x-0' 
          : 'w-20 -translate-x-full lg:translate-x-0'
      } lg:relative lg:translate-x-0`}>
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-600 text-lg font-bold">SE</span>
              </div>
              {state.sidebarOpen && (
                <span className="ml-3 text-white text-xl font-semibold">
                  SmartExpense
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item group flex items-center ${
                    state.sidebarOpen ? 'px-3 py-2' : 'px-2 py-2 justify-center'
                  } text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                  title={!state.sidebarOpen ? item.name : ''}
                >
                  <item.icon
                    className={`flex-shrink-0 ${
                      state.sidebarOpen ? 'mr-3 h-5 w-5' : 'h-6 w-6'
                    } ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'}`}
                  />
                  {state.sidebarOpen && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {!state.sidebarOpen && item.name === 'Notifications' && state.unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {state.unreadNotifications}
                    </span>
                  )}
                  {state.sidebarOpen && item.name === 'Notifications' && state.unreadNotifications > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {state.unreadNotifications}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar toggle button */}
          <div className="flex-shrink-0 p-3">
            <button
              onClick={toggleSidebar}
              className={`group flex items-center ${
                state.sidebarOpen ? 'w-full px-3 py-2' : 'w-full justify-center py-2'
              } text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-primary-600 transition-colors`}
            >
              <Bars3Icon className={`flex-shrink-0 ${
                state.sidebarOpen ? 'mr-3 h-5 w-5' : 'h-6 w-6'
              } text-gray-400 group-hover:text-primary-600`} />
              {state.sidebarOpen && <span>Collapse</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;