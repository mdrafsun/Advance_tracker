const Transactions = require('./Transactions');
const { assert, isPositiveNumber, toISODate, newId } = require('./utils');

/**
 * SavingsTransaction Strategy
 * data: { userId, amount, date, description, savingsCategory, bankName }
 */
class SavingsTransaction extends Transactions {
  async add(data) {
    assert(data && typeof data === 'object', "Savings.add: data object required");
    const { userId, amount, date, description = '', savingsCategory = '', bankName = '' } = data;
    assert(typeof userId === 'string' && userId.length > 0, "Savings.add: userId required");
    assert(isPositiveNumber(amount), "Savings.add: amount must be a positive number");

    const doc = {
      savingsId: newId('sav'),
      userId,
      amount,
      date: toISODate(date || new Date()),
      description,
      savingsCategory,
      bankName
    };
    return this.repo.add(doc);
  }

  async delete(id) {
    assert(typeof id === 'string' && id.length > 0, "Savings.delete: id required");
    return this.repo.remove(id);
  }

  async getDetails(id) {
    assert(typeof id === 'string' && id.length > 0, "Savings.getDetails: id required");
    const found = await this.repo.getById(id);
    return found ? { ...found } : null;
  }
}

module.exports = SavingsTransaction;
