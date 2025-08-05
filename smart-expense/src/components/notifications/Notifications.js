import React from 'react';
import { useApp } from '../../context/AppContext';
import { actionTypes } from '../../context/AppContext';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const { state, dispatch } = useApp();

  const markAsRead = (id) => {
    dispatch({
      type: actionTypes.MARK_NOTIFICATION_READ,
      payload: id
    });
  };

  const deleteNotification = (id) => {
    dispatch({
      type: actionTypes.DELETE_NOTIFICATION,
      payload: id
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-600">
            Stay updated with your financial alerts
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {state.notifications.map((notification) => (
          <div
            key={notification.id}
            className={`card ${getNotificationColor(notification.type)} ${
              !notification.read ? 'border-l-4 border-l-primary-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="text-gray-700 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Mark as read"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Delete notification"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {state.notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No notifications</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;