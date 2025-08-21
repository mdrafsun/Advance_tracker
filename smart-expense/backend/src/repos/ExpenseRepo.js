// ExpenseRepo.js — raw JS repo for expenses table
// Exposes: add, remove, getById, listByUser
module.exports = (db) => ({
  async add(entity) {
    // entity fields expected:
    // expenseId, userId, amount, date, description, category, kind, updateDate
    return db.insert('expenses', entity);
  },
  async remove(id) {
    return db.remove('expenses', id);
  },
  async getById(id) {
    return db.getById('expenses', id);
  },
  async listByUser(userId) {
    return db.list('expenses', r => r.userId === userId);
  }
});
