/**
 * ContextTransaction — selects a concrete Strategy at runtime.
 * Usage:
 *   const ctx = new ContextTransaction();
 *   ctx.setTransaction(new IncomeTransaction(incomeRepo));
 *   await ctx.addOperation({...});
 */
class ContextTransaction {
  constructor() {
    this.strategy = null;
  }

  setTransaction(strategy) {
    const ok = strategy
      && typeof strategy.add === 'function'
      && typeof strategy.delete === 'function'
      && typeof strategy.getDetails === 'function';
    if (!ok) throw new Error("ContextTransaction.setTransaction: invalid strategy");
    this.strategy = strategy;
    return this; // chaining
  }

  getStrategy() {
    return this.strategy;
  }

  async addOperation(data) {
    if (!this.strategy) throw new Error("No strategy set");
    return this.strategy.add(data);
  }

  async deleteOperation(id) {
    if (!this.strategy) throw new Error("No strategy set");
    return this.strategy.delete(id);
  }

  async detailOperation(id) {
    if (!this.strategy) throw new Error("No strategy set");
    return this.strategy.getDetails(id);
  }
}

module.exports = ContextTransaction;
