const Transactions = require('./Transactions');
const { assert, isPositiveNumber, toISODate, newId } = require('./utils');

/**
 * IncomeTransaction Strategy
 * data: { userId, amount, date, description, category, type } // type: 'regular' | 'irregular'
 */
class IncomeTransaction extends Transactions {
  async add(data) {
    assert(data && typeof data === 'object', "Income.add: data object required");
    const { userId, amount, date, description = '', category = '', type = 'regular' } = data;
    assert(typeof userId === 'string' && userId.length > 0, "Income.add: userId required");
    assert(isPositiveNumber(amount), "Income.add: amount must be a positive number");

    const doc = {
      incomeId: newId('inc'),
      userId,
      amount,
      date: toISODate(date || new Date()),
      description,
      category,
      type,                               // 'regular' or 'irregular'
      updateDate: toISODate(new Date())
    };
    return this.repo.add(doc);
  }

  async delete(id) {
    assert(typeof id === 'string' && id.length > 0, "Income.delete: id required");
    return this.repo.remove(id);
  }

  async getDetails(id) {
    assert(typeof id === 'string' && id.length > 0, "Income.getDetails: id required");
    const found = await this.repo.getById(id);
    return found ? { ...found } : null;
  }
}

module.exports = IncomeTransaction;
