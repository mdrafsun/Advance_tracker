// smart-expense/src/components/common/DashboardLayout.js
import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getNotifications, DEFAULT_USER_ID } from '../../services/api';

function NavLink({ to, label, active, badge }) {
  return (
    <Link
      to={to}
      className={[
        'flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium',
        active ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      ].join(' ')}
    >
      <span>{label}</span>
      {typeof badge === 'number' && badge > 0 && (
        <span className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] px-1 h-5 text-xs rounded-full bg-red-600 text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const { state } = useApp();
  const userId = state?.user?.id ?? state?.user?.userId ?? DEFAULT_USER_ID;
  const loc = useLocation();

  const [unread, setUnread] = useState(0);

  async function refreshUnread() {
    try {
      const list = await getNotifications(userId);
      setUnread(list.filter(n => !n.read).length);
    } catch {
      // ignore badge errors in UI
    }
  }

  useEffect(() => {
    refreshUnread();
    const id = setInterval(refreshUnread, 15000);
    return () => clearInterval(id);
  }, [userId]);

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/income',    label: 'Income' },
    { to: '/expenses',  label: 'Expenses' },
    { to: '/savings',   label: 'Savings' },
    { to: '/loans',     label: 'Loans' },
    { to: '/reports',   label: 'Reports' },
    { to: '/notifications', label: 'Notifications', badge: unread },
    { to: '/profile',   label: 'Profile' },
    { to: '/admin',     label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Smart Expense</h1>
          <div className="text-sm text-gray-600">
            {state?.user?.name ? `Hi, ${state.user.name}` : 'Welcome'}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <nav className="space-y-1 bg-white p-3 rounded-lg border">
            {links.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                label={item.label}
                active={loc.pathname === item.to}
                badge={item.badge}
              />
            ))}
          </nav>
        </aside>

        <main className="md:col-span-3">
          {/* IMPORTANT: render nested routes here */}
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
