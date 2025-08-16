// SavingsRepo.js — raw JS repo for savings table
// Exposes: add, remove, getById, listByUser
module.exports = (db) => ({
  async add(entity) {
    // entity fields expected:
    // savingsId, userId, amount, date, description, savingsCategory, bankName
    return db.insert('savings', entity);
  },
  async remove(id) {
    return db.remove('savings', id);
  },
  async getById(id) {
    return db.getById('savings', id);
  },
  async listByUser(userId) {
    return db.list('savings', r => r.userId === userId);
  }
});
