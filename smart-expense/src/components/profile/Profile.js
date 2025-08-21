// smart-expense/src/components/profile/Profile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { actionTypes } from '../../context/AppContext';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const { state, dispatch, totalIncome, totalExpenses, unreadNotifications } = useApp();
  const navigate = useNavigate();
  

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    role: state.user?.role || 'user'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    dispatch({
      type: actionTypes.UPDATE_PROFILE,
      payload: formData
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || '',
      email: state.user?.email || '',
      phone: state.user?.phone || '',
      role: state.user?.role || 'user'
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch({ type: actionTypes.LOGOUT });
    localStorage.removeItem('smartexpense_user');
    navigate('/login');
  };

  const roleLabels = {
    user: 'Individual User',
    business: 'Business User',
    admin: 'Administrator'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your account information and preferences</p>
        </div>
        {!isEditing && (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary inline-flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="btn-danger inline-flex items-center"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {state.user?.name || 'User Name'}
            </h2>
            <p className="text-gray-600 capitalize">
              {roleLabels[state.user?.role] || 'User'}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="user">Individual User</option>
                  <option value="business">Business User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSave}
                className="btn-primary inline-flex items-center"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary inline-flex items-center"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{state.user?.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">{state.user?.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <p className="text-gray-900 capitalize">
                  {roleLabels[state.user?.role] || 'User'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="text-gray-900 font-mono text-sm">{state.user?.userId || state.user?.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>

             {/* Account Statistics */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
           <div className="text-center">
             <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
             <p className="text-2xl font-bold text-blue-600">
               ${(totalIncome || 0).toLocaleString()}
             </p>
           </div>
         </div>
         <div className="card bg-gradient-to-r from-red-50 to-red-100 border-red-200">
           <div className="text-center">
             <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
             <p className="text-2xl font-bold text-red-600">
               ${(totalExpenses || 0).toLocaleString()}
             </p>
           </div>
         </div>
         <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
           <div className="text-center">
             <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
             <p className="text-2xl font-bold text-purple-600">
               {unreadNotifications || 0}
             </p>
             <p className="text-sm text-gray-600">Unread</p>
           </div>
         </div>
       </div>
    </div>
  );
}