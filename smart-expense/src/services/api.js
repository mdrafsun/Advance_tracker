// smart-expense/src/services/api.js
// Small helper the React components can import to call your backend API.

const API = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API)
  ? process.env.REACT_APP_API
  : 'http://localhost:3000';

async function http(method, path, body, headers = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  // Try to parse JSON; fall back to empty object
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// Transactions
export const addIncome  = (b) => http('POST', '/api/income',  b);
export const addExpense = (b) => http('POST', '/api/expense', b);
export const addSavings = (b) => http('POST', '/api/savings', b);
export const addLoan    = (b) => http('POST', '/api/loan',    b);

// Summary & Reports
export const getSummary = (userId) =>
  http('GET', `/api/summary?userId=${encodeURIComponent(userId)}`);

export const getReport = (type, userId, start, end) =>
  http('GET', `/api/report?type=${encodeURIComponent(type)}&userId=${encodeURIComponent(userId)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);

// Notifications (Observer)
export const getNotifications = (userId) =>
  http('GET', `/api/notifications?userId=${encodeURIComponent(userId)}`);

// Admin (Proxy)
export const listUsersAdmin   = () =>
  http('GET', '/api/admin/users', null, { 'X-Role': 'admin' });

export const deleteUserAdmin  = (userId) =>
  http('DELETE', `/api/admin/users/${encodeURIComponent(userId)}`, null, { 'X-Role': 'admin' });

// Health (optional quick check)
export const health = () => http('GET', '/api/health');
