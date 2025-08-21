// GlobalUserObserver.js — Concrete observer that reacts to all users
const db = require('../singleton/Database');

function newId(prefix) {
  try {
    const { randomUUID } = require('crypto');
    if (typeof randomUUID === 'function') return `${prefix}_${randomUUID()}`;
  } catch (_) {}
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function nowLocalISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}:${s}`; // local-ish timestamp
}

class GlobalUserObserver {
  /**
   * Constructor - no userId filter needed, handles all users
   */
  constructor() {
    // No userId filter - handles all users
  }

  /**
   * Called by the Subject
   * Persists notifications for any user in the payload
   */
  async notify(event, payload) {
    if (!payload || !payload.userId) return;

    const message = this._formatMessage(event, payload);

    // Persist a user-specific notification
    await db.insert('notifications', {
      notificationId: newId('ntf'),
      userId: payload.userId,
      event,
      message,
      at: nowLocalISO(),
      refId: payload.incomeId || payload.expenseId || payload.savingsId || payload.loanId || null
    });

    // Optional: console feedback for demo
    console.log(`[notify ${payload.userId}] ${event} -> ${message}`);
  }

  _formatMessage(event, p) {
    const amt = (p && typeof p.amount === 'number') ? p.amount : '?';
    switch (event) {
      case 'income:added':  return `Income recorded: ${amt}`;
      case 'expense:added': return `Expense recorded: ${amt}`;
      case 'savings:added': return `Savings recorded: ${amt}`;
      case 'loan:added':    return `Loan recorded: ${amt}`;
      default:              return `Event: ${event}`;
    }
  }
}

module.exports = GlobalUserObserver;
