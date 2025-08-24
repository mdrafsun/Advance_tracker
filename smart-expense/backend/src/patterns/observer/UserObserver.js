// UserObserver.js — Concrete observer that reacts per user

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

class UserObserver {
  /**
   * @param {string} userId - the user this observer is interested in
   */
  constructor(userId) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('UserObserver requires a userId');
    }
    this.userId = userId;
  }

  /**
   * Called by the Subject
   * Only persists/logs if payload.userId matches this.userId (so users get their own events)
   */
  async notify(event, payload) {
    if (!payload || payload.userId !== this.userId) return;

    const message = this._formatMessage(event, payload);

    // Persist a user-specific notification (creates "notifications" table if missing)
    await db.insert('notifications', {
      notificationId: newId('ntf'),
      userId: this.userId,
      event,
      message,
      at: nowLocalISO(),
      refId: payload.incomeId || payload.expenseId || payload.savingsId || payload.loanId || null
    });

    // Optional: console feedback for demo
    console.log(`[notify ${this.userId}] ${event} -> ${message}`);
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


module.exports = UserObserver;
