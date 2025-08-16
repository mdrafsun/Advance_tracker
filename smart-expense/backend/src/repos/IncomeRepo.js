// IncomeRepo.js — raw JS repo for income table
// Exposes: add, remove, getById, listByUser
module.exports = (db) => ({
  async add(entity) {
    // entity fields expected:
    // incomeId, userId, amount, date, description, category, type, updateDate
    return db.insert('income', entity);
  },
  async remove(id) {
    return db.remove('income', id);
  },
  async getById(id) {
    return db.getById('income', id);
  },
  async listByUser(userId) {
    return db.list('income', r => r.userId === userId);
  }
});
