// smart-expense/src/components/notifications/Notifications.js
import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, deleteNotification, DEFAULT_USER_ID } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { actionTypes } from '../../context/AppContext';
import { TrashIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Notifications() {
  const { state, dispatch } = useApp();
  const userId = state?.user?.id ?? state?.user?.userId ?? DEFAULT_USER_ID;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true); setErr('');
    try {
      const list = await getNotifications(userId);
      // newest first by timestamp
      list.sort((a,b)=> new Date(b.at || b.date || b.createdAt || 0) - new Date(a.at || a.date || a.createdAt || 0));
      setItems(list);
    } catch (e) {
      setErr(e.message || 'Failed to load notifications');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function onMarkRead(id) {
    // optimistic
    setItems(prev => prev.map(n => n.notificationId === id ? { ...n, read: true } : n));
    try { await markNotificationRead(id); } catch (e) { /* best-effort; no rollback */ }
  }

  async function onDelete(id) {
    const prev = items;
    setItems(prev => prev.filter(n => n.notificationId !== id));
    try { 
      await deleteNotification(id); 
      // Update global state to refresh notification count
      dispatch({ type: actionTypes.DELETE_NOTIFICATION, payload: id });
    } catch (e) { 
      setItems(prev); 
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">Mark items as read or delete them</p>
        </div>
        <button onClick={load} className="btn-secondary inline-flex items-center">
          <ArrowPathIcon className="h-5 w-5 mr-2" /> Refresh
        </button>
      </div>

      {err && <div className="text-red-600">{err}</div>}

      <div className="card">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No notifications</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map(n => (
              <li key={n.notificationId} className="flex items-start justify-between p-4 hover:bg-gray-50">
                <div>
                  <div className="text-sm text-gray-500">
                    {new Date(n.at || n.date || n.createdAt || Date.now()).toLocaleString()}
                  </div>
                  <div className="font-medium text-gray-900">{n.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{n.event}</div>
                  {n.read && <div className="text-xs text-green-700 mt-1">Read</div>}
                </div>
                <div className="flex gap-2 ml-4">
                  {!n.read && (
                    <button
                      className="btn-secondary inline-flex items-center"
                      onClick={() => onMarkRead(n.notificationId)}
                      title="Mark as read"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" /> Read
                    </button>
                  )}
                  <button
                    className="btn-danger inline-flex items-center"
                    onClick={() => onDelete(n.notificationId)}
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
