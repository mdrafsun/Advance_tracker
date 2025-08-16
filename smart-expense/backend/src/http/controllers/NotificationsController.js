// backend/src/http/controllers/NotificationsController.js
const db = require('../../patterns/singleton/Database');

module.exports = () => ({
  async listForUser(userId) {
    if (!userId) throw new Error('userId required');
    return db.list('notifications', n => n.userId === userId);
  }
});
