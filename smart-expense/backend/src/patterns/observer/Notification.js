// Notification.js — Subject in Observer pattern
class Notification {
  constructor() {
    this.subs = [];
  }

  register(observer) {
    if (!observer || typeof observer.notify !== 'function') {
      throw new Error('Observer must implement notify(event, payload)');
    }
    this.subs.push(observer);
  }

  unregister(observer) {
    this.subs = this.subs.filter(o => o !== observer);
  }

  async notifyAll(event, payload) {
    // fan-out to all observers; each observer decides whether to act
    for (const obs of this.subs) {
      try {
        await obs.notify(event, payload);
      } catch (e) {
        // do not crash the whole app if a single observer fails
        console.error('[Observer error]', e.message);
      }
    }
  }
}

module.exports = Notification;


