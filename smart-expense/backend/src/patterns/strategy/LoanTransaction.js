const Transactions = require('./Transactions');
const { assert, isPositiveNumber, toISODate, newId } = require('./utils');

/**
 * LoanTransaction Strategy
 * data: { userId, amount, date, description, loanCategory, bankName }
 */
class LoanTransaction extends Transactions {
  async add(data) {
    assert(data && typeof data === 'object', "Loan.add: data object required");
    const { userId, amount, date, description = '', loanCategory = '', bankName = '' } = data;
    assert(typeof userId === 'string' && userId.length > 0, "Loan.add: userId required");
    assert(isPositiveNumber(amount), "Loan.add: amount must be a positive number");

    const doc = {
      loanId: newId('loan'),
      userId,
      amount,
      date: toISODate(date || new Date()),
      description,
      loanCategory,
      bankName
    };
    return this.repo.add(doc);
  }

  async delete(id) {
    assert(typeof id === 'string' && id.length > 0, "Loan.delete: id required");
    return this.repo.remove(id);
  }

  async getDetails(id) {
    assert(typeof id === 'string' && id.length > 0, "Loan.getDetails: id required");
    const found = await this.repo.getById(id);
    return found ? { ...found } : null;
  }
}

module.exports = LoanTransaction;
