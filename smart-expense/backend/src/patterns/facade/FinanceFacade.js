// FinanceFacade.js — single entrypoint; emits Observer notifications
const {
  ContextTransaction,
  IncomeTransaction,
  ExpenseTransaction,
  SavingsTransaction,
  LoanTransaction,
} = require('../strategy');

const Notification = require('../observer/Notification');

class FinanceFacade {
  constructor(repos) {
    if (!repos || !repos.income || !repos.expense || !repos.savings || !repos.loan) {
      throw new Error('FinanceFacade requires repos: income, expense, savings, loan');
    }
    this.repos = repos;

    // Subject for Observer pattern
    this.notify = new Notification();
  }

  // Allow external code to manage observers
  registerObserver(observer)  { this.notify.register(observer); }
  unregisterObserver(observer){ this.notify.unregister(observer); }

  // Use Strategy under the hood, then notify observers
  async recordIncome(data) {
    const created = await new ContextTransaction()
      .setTransaction(new IncomeTransaction(this.repos.income))
      .addOperation(data);
    await this.notify.notifyAll('income:added', created);
    return created;
  }

  async recordExpense(data) {
    const created = await new ContextTransaction()
      .setTransaction(new ExpenseTransaction(this.repos.expense))
      .addOperation(data);
    await this.notify.notifyAll('expense:added', created);
    return created;
  }

  async recordSavings(data) {
    const created = await new ContextTransaction()
      .setTransaction(new SavingsTransaction(this.repos.savings))
      .addOperation(data);
    await this.notify.notifyAll('savings:added', created);
    return created;
  }

  async recordLoan(data) {
    const created = await new ContextTransaction()
      .setTransaction(new LoanTransaction(this.repos.loan))
      .addOperation(data);
    await this.notify.notifyAll('loan:added', created);
    return created;
  }

  // Handy summary for demos/tests
  async getUserSummary(userId) {
    const [income, expenses, savings, loans] = await Promise.all([
      this.repos.income.listByUser(userId),
      this.repos.expense.listByUser(userId),
      this.repos.savings.listByUser(userId),
      this.repos.loan.listByUser(userId),
    ]);
    const sum = arr => arr.reduce((t, r) => t + (Number(r.amount) || 0), 0);

    return {
      userId,
      incomeTotal: sum(income),
      expenseTotal: sum(expenses),
      savingsTotal: sum(savings),
      loanTotal: sum(loans),
      counts: {
        income: income.length,
        expenses: expenses.length,
        savings: savings.length,
        loans: loans.length,
      }
    };
  }
}

module.exports = FinanceFacade;
