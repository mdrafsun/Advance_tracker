const Transactions = require('./Transactions');
const { assert, isPositiveNumber, toISODate, newId } = require('./utils');

/**
 * ExpenseTransaction Strategy
 * data: { userId, amount, date, description, category, kind } // kind: 'bill' | 'purchase'
 */
class ExpenseTransaction extends Transactions {
  async add(data) {
    assert(data && typeof data === 'object', "Expense.add: data object required");
    const { userId, amount, date, description = '', category = '', kind = 'purchase' } = data;
    assert(typeof userId === 'string' && userId.length > 0, "Expense.add: userId required");
    assert(isPositiveNumber(amount), "Expense.add: amount must be a positive number");

    const doc = {
      expenseId: newId('exp'),
      userId,
      amount,
      date: toISODate(date || new Date()),
      description,
      category,
      kind,                               // 'bill' or 'purchase'
      updateDate: toISODate(new Date())
    };
    return this.repo.add(doc);
  }

  async delete(id) {
    assert(typeof id === 'string' && id.length > 0, "Expense.delete: id required");
    return this.repo.remove(id);
  }

  async getDetails(id) {
    assert(typeof id === 'string' && id.length > 0, "Expense.getDetails: id required");
    const found = await this.repo.getById(id);
    return found ? { ...found } : null;
  }
}

module.exports = ExpenseTransaction;
