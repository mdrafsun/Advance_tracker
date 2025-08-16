// UserRepo.js
function newId(prefix='usr'){
  try { const { randomUUID } = require('crypto'); if (randomUUID) return `${prefix}_${randomUUID()}`; }
  catch(_) {}
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;
}

module.exports = (db) => ({
  async add(user) {
    const rec = {
      userId: user.userId || newId(),
      name:   user.name   || '',
      role:   user.role   || 'user',
      createdAt: new Date().toISOString(),
    };
    await db.insert('users', rec);
    return rec;
  },
  async getById(userId)   { return db.getById('users', userId); },
  async list()            { return db.list('users'); },
  async remove(userId)    { return db.remove('users', userId); },
});
