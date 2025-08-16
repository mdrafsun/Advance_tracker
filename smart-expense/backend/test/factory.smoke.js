// backend/test/factory.smoke.js
// Factory pattern smoke test: builds CashFlow, Bank, and Overall reports
// using the backend ReportFactory and data seeded via the Facade.

const db = require('../src/patterns/singleton/Database');

// repos
const IncomeRepo  = require('../src/repos/IncomeRepo');
const ExpenseRepo = require('../src/repos/ExpenseRepo');
const SavingsRepo = require('../src/repos/SavingsRepo');
const LoanRepo    = require('../src/repos/LoanRepo');

// facade (to seed data using your Strategy layer under the hood)
const FinanceFacade = require('../src/patterns/facade/FinanceFacade');

// ReportFactory (direct path so we don't depend on factory/index.js)
const ReportFactory = require('../src/patterns/factory/ReportFactory');

(async () => {
  await db.clearAll();

  // seed one user
  await db.insert('users', { userId: 'u1', name: 'Test User', role: 'user' });

  // build repos and facade
  const repos = {
    income:  IncomeRepo(db),
    expense: ExpenseRepo(db),
    savings: SavingsRepo(db),
    loan:    LoanRepo(db),
  };
  const facade = new FinanceFacade(repos);

  // seed some data (all in August 2025)
  await facade.recordIncome({  userId: 'u1', amount: 1500, date: '2025-08-01', description: 'Salary',     category: 'job',    type: 'regular' });
  await facade.recordIncome({  userId: 'u1', amount:  200, date: '2025-08-10', description: 'Freelance',  category: 'side',   type: 'irregular' });
  await facade.recordExpense({ userId: 'u1', amount:  400, date: '2025-08-05', description: 'Rent',       category: 'housing', kind: 'bill' });
  await facade.recordExpense({ userId: 'u1', amount:   80, date: '2025-08-12', description: 'Groceries',  category: 'food',    kind: 'purchase' });
  await facade.recordSavings({ userId: 'u1', amount:  300, date: '2025-08-07', description: 'Saving',     savingsCategory: 'emergency', bankName: 'ABC Bank' });
  await facade.recordLoan({    userId: 'u1', amount: 1000, date: '2025-08-08', description: 'Phone EMI',  loanCategory: 'consumer',      bankName: 'XYZ Bank' });

  const args = { userId: 'u1', startDate: '2025-08-01', endDate: '2025-08-31', repos };

  // Build reports via the Factory
  const cashFlow = await ReportFactory.create('cashflow', args).build();
  const bank     = await ReportFactory.create('bank',     args).build();
  const overall  = await ReportFactory.create('overall',  args).build();

  // Show concise outputs
  console.log('CashFlow totals:', cashFlow.totals);
  console.log('CashFlow breakdown:', cashFlow.breakdown);
  console.log('Bank totals:', bank.totals);
  console.log('Bank byBank:', bank.byBank);
  console.log('Overall totals:', overall.totals);
  console.log('Overall counts:', overall.counts);

  // Simple sanity checks
  if (overall.totals.income < 1700) throw new Error('Income total seems off (< 1700).');
  if (overall.totals.expense < 480) throw new Error('Expense total seems off (< 480).');
  if (!('savings' in bank.totals) || !('loans' in bank.totals)) throw new Error('Bank totals missing keys.');

  console.log('\nFactory pattern smoke test passed ✅');
})().catch(e => { console.error('Factory smoke test failed:', e); process.exit(1); });
