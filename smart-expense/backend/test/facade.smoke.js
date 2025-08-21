// backend/test/facade.smoke.js
// Proves Facade works over Strategy and emits Observer notifications

const db = require('../src/patterns/singleton/Database');

const IncomeRepo  = require('../src/repos/IncomeRepo');
const ExpenseRepo = require('../src/repos/ExpenseRepo');
const SavingsRepo = require('../src/repos/SavingsRepo');
const LoanRepo    = require('../src/repos/LoanRepo');

const FinanceFacade = require('../src/patterns/facade/FinanceFacade');
const UserObserver  = require('../src/patterns/observer/UserObserver');

(async () => {
  await db.clearAll();

  // seed a user
  await db.insert('users', { userId: 'u1', name: 'Test User', role: 'user' });

  const repos = {
    income:  IncomeRepo(db),
    expense: ExpenseRepo(db),
    savings: SavingsRepo(db),
    loan:    LoanRepo(db),
  };

  const facade = new FinanceFacade(repos);

  // register an observer to see notifications for u1
  const obs = new UserObserver('u1');
  facade.registerObserver(obs);

  await facade.recordIncome({  userId: 'u1', amount: 1200, date: '2025-08-15', description: 'Salary', category: 'job', type: 'regular' });
  await facade.recordExpense({ userId: 'u1', amount:  200, date: '2025-08-15', description: 'Groceries', category: 'food', kind: 'purchase' });
  await facade.recordSavings({ userId: 'u1', amount:  300, date: '2025-08-15', description: 'Emergency fund', savingsCategory: 'emergency', bankName: 'ABC Bank' });
  await facade.recordLoan({    userId: 'u1', amount: 1500, date: '2025-08-15', description: 'Phone EMI', loanCategory: 'consumer', bankName: 'XYZ Bank' });

  const summary = await facade.getUserSummary('u1');
  console.log('Summary via Facade:', summary);

  const notesAll = await db.list('notifications');
  const notesU1  = notesAll.filter(n => n.userId === 'u1');
  console.log('Notifications for u1 (should be 4):', notesU1.length);

  if (notesU1.length < 4) throw new Error('Expected 4 notifications for u1');

  console.log('\nFacade pattern smoke test passed ✅');
})().catch(e => { console.error('Facade smoke test failed:', e); process.exit(1); });
