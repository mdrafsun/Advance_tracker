// LoanRepo.js — raw JS repo for loans table
// Exposes: add, remove, getById, listByUser
module.exports = (db) => ({
  async add(entity) {
    // entity fields expected:
    // loanId, userId, amount, date, description, loanCategory, bankName
    return db.insert('loans', entity);
  },
  async remove(id) {
    return db.remove('loans', id);
  },
  async getById(id) {
    return db.getById('loans', id);
  },
  async listByUser(userId) {
    return db.list('loans', r => r.userId === userId);
  }
});
