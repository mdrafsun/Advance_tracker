const db = require('../singleton/Database');

class AdminService {
  async listUsers() {
    return db.list('users');
  }

  async deleteUser(userId) {
    if (!userId) throw new Error('deleteUser: userId required');

    await db.remove('users', userId);

    const tables = [
      { t: 'income',   idKey: 'incomeId'  },
      { t: 'expenses', idKey: 'expenseId' },
      { t: 'savings',  idKey: 'savingsId' },
      { t: 'loans',    idKey: 'loanId'    },
    ];
    for (const { t, idKey } of tables) {
      const rows = await db.list(t, r => r.userId === userId);
      for (const row of rows) await db.remove(t, row[idKey]);
    }
    return true;
  }

  async broadcast(message) {
    console.log('[ADMIN BROADCAST]:', message);
    return { ok: true, message };
  }
}

module.exports = AdminService;
