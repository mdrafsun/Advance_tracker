// smart-expense/src/services/api.js
export const DEFAULT_USER_ID = 'u1';
export const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

async function json(res) {
  const text = await res.text();
  if (!text) return {};
  try { return JSON.parse(text); } catch { return {}; }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let body = {};
    try { body = await res.json(); } catch { /* ignore */ }
    const message = body?.error || body?.message || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  // 204 has no body
  if (res.status === 204) return {};
  return json(res);
}

/* ========== SUMMARY / REPORTS ========== */
export function getSummary(userId = DEFAULT_USER_ID) {
  return request(`/summary?userId=${encodeURIComponent(userId)}`);
}
export function getReport(userId, type = 'overall') {
  return request(`/report?userId=${encodeURIComponent(userId)}&type=${encodeURIComponent(type)}`);
}

/* ========== INCOME ========== */
export function listIncome(userId = DEFAULT_USER_ID) {
  return request(`/income?userId=${encodeURIComponent(userId)}`);
}
export function addIncome(data) {
  const body = JSON.stringify({ userId: data.userId || DEFAULT_USER_ID, ...data });
  return request('/income', { method: 'POST', body });
}
export function updateIncome(id, data) {
  return request(`/income/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteIncome(id) {
  return request(`/income/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/* ========== EXPENSE ========== */
export function listExpenses(userId = DEFAULT_USER_ID) {
  return request(`/expense?userId=${encodeURIComponent(userId)}`);
}
export function addExpense(data) {
  const body = JSON.stringify({ userId: data.userId || DEFAULT_USER_ID, kind: 'purchase', ...data });
  return request('/expense', { method: 'POST', body });
}
export function updateExpense(id, data) {
  return request(`/expense/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteExpense(id) {
  return request(`/expense/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/* ========== SAVINGS ========== */
export function listSavings(userId = DEFAULT_USER_ID) {
  return request(`/savings?userId=${encodeURIComponent(userId)}`);
}
export function addSavings(data) {
  const body = JSON.stringify({ userId: data.userId || DEFAULT_USER_ID, ...data });
  return request('/savings', { method: 'POST', body });
}
export function updateSavings(id, data) {
  return request(`/savings/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteSavings(id) {
  return request(`/savings/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/* ========== LOANS ========== */
export function listLoans(userId = DEFAULT_USER_ID) {
  return request(`/loan?userId=${encodeURIComponent(userId)}`);
}
export function addLoan(data) {
  const body = JSON.stringify({ userId: data.userId || DEFAULT_USER_ID, ...data });
  return request('/loan', { method: 'POST', body });
}
export function updateLoan(id, data) {
  return request(`/loan/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteLoan(id) {
  return request(`/loan/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/* ========== NOTIFICATIONS ========== */
export async function getNotifications(userId = DEFAULT_USER_ID) {
  const out = await request(`/notifications?userId=${encodeURIComponent(userId)}`);
  // backend returns { value: [...], Count: n } sometimes — normalize to array
  if (Array.isArray(out)) return out;
  if (Array.isArray(out?.value)) return out.value;
  return [];
}
export function markNotificationRead(id) {
  return request(`/notifications/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ read: true }) });
}
export function deleteNotification(id) {
  return request(`/notifications/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
