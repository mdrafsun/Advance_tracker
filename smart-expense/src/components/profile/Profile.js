import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { actionTypes } from '../../context/AppContext';

const Profile = () => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      phone: state.user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information
          </p>
        </div>
      </div>

      <div className="card max-w-2xl">
        <div className="flex items-center space-x-6 mb-6">
          <img
            className="h-24 w-24 rounded-full object-cover"
            src={state.user?.avatar}
            alt={state.user?.name}
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{state.user?.name}</h2>
            <p className="text-gray-600">{state.user?.email}</p>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize mt-2 ${
              state.user?.role === 'admin' 
                ? 'bg-purple-100 text-purple-800'
                : state.user?.role === 'business'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {state.user?.role} Account
            </span>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900">{state.user?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900">{state.user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="text-gray-900">{state.user?.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <p className="text-gray-900 capitalize">{state.user?.role}</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="card max-w-2xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive email alerts for important updates</p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              defaultChecked
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Budget Alerts</h4>
              <p className="text-sm text-gray-500">Get notified when you exceed budget limits</p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              defaultChecked
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Monthly Reports</h4>
              <p className="text-sm text-gray-500">Receive monthly financial summary reports</p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              defaultChecked
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card max-w-2xl border-red-200 bg-red-50">
        <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-red-900">Export Data</h4>
            <p className="text-sm text-red-700 mb-2">Download all your financial data</p>
            <button className="text-sm text-red-600 hover:text-red-800 underline">
              Export my data
            </button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
            <p className="text-sm text-red-700 mb-2">Permanently delete your account and all data</p>
            <button className="text-sm text-red-600 hover:text-red-800 underline">
              Delete my account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;