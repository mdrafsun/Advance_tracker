// backend/test/observer.smoke.js
// Proves Observer gets events when Facade records transactions
const db = require('../src/patterns/singleton/Database');

const IncomeRepo  = require('../src/repos/IncomeRepo');
const ExpenseRepo = require('../src/repos/ExpenseRepo');
const SavingsRepo = require('../src/repos/SavingsRepo');
const LoanRepo    = require('../src/repos/LoanRepo');

const FinanceFacade = require('../src/patterns/facade/FinanceFacade');
const UserObserver  = require('../src/patterns/observer/UserObserver');

(async () => {
  await db.clearAll();

  // seed users
  await db.insert('users', { userId: 'u1', name: 'Test User', role: 'user' });

  const repos = {
    income:  IncomeRepo(db),
    expense: ExpenseRepo(db),
    savings: SavingsRepo(db),
    loan:    LoanRepo(db),
  };

  const facade = new FinanceFacade(repos);

  // Register an observer for u1
  const obsU1 = new UserObserver('u1');
  facade.registerObserver(obsU1);

  // Trigger events
  await facade.recordIncome({  userId: 'u1', amount: 1000, date: '2025-08-15', description: 'Salary',   category: 'job', type: 'regular' });
  await facade.recordExpense({ userId: 'u1', amount:  200, date: '2025-08-15', description: 'Groceries', category: 'food', kind: 'purchase' });
  await facade.recordSavings({ userId: 'u1', amount:  300, date: '2025-08-15', description: 'Save',      savingsCategory: 'emergency', bankName: 'ABC Bank' });
  await facade.recordLoan({    userId: 'u1', amount: 1500, date: '2025-08-15', description: 'Phone',     loanCategory: 'consumer', bankName: 'XYZ Bank' });

  // Verify persisted notifications
  const notesAll = await db.list('notifications');
  const notesU1  = notesAll.filter(n => n.userId === 'u1');

  console.log('Notifications for u1:', notesU1);
  if (notesU1.length < 4) {
    throw new Error('Expected at least 4 notifications for u1');
  }

  // Unregister and ensure no new note is added
  facade.unregisterObserver(obsU1);
  const beforeCount = notesU1.length;

  await facade.recordExpense({ userId: 'u1', amount: 50, date: '2025-08-15', description: 'Snacks', category: 'food', kind: 'purchase' });

  const after = (await db.list('notifications')).filter(n => n.userId === 'u1').length;
  console.log('Notifications count before/after unregister:', beforeCount, after);

  if (after !== beforeCount) {
    throw new Error('Observer still receiving notifications after unregister');
  }

  console.log('\nObserver pattern smoke test passed ✅');
})().catch(err => {
  console.error('Observer smoke test failed:', err);
  process.exit(1);
});
