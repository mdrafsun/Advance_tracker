// backend/test/all_patterns.smoke.js
const db = require('../src/patterns/singleton/Database');

// repos
const IncomeRepo  = require('../src/repos/IncomeRepo');
const ExpenseRepo = require('../src/repos/ExpenseRepo');
const SavingsRepo = require('../src/repos/SavingsRepo');
const LoanRepo    = require('../src/repos/LoanRepo');

// facade & proxy
const FinanceFacade = require('../src/patterns/facade/FinanceFacade');
const AdminService  = require('../src/patterns/proxy/AdminService');
const AdminProxy    = require('../src/patterns/proxy/AdminProxy');

// direct Strategy (optional)
const { ContextTransaction, ExpenseTransaction } = require('../src/patterns/strategy');

function assert(c, m){ if(!c) throw new Error('Assertion failed: ' + m); }

(async () => {
  await db.clearAll();

  await db.insert('users', { userId: 'u1', name: 'Test User',  role: 'user' });
  await db.insert('users', { userId: 'a1', name: 'Admin User', role: 'admin' });

  const repos = {
    income:  IncomeRepo(db),
    expense: ExpenseRepo(db),
    savings: SavingsRepo(db),
    loan:    LoanRepo(db),
  };

  const facade = new FinanceFacade(repos);

  await facade.recordIncome({  userId: 'u1', amount: 1500, date: '2025-08-15', description: 'Salary',   category: 'job', type: 'regular' });
  await facade.recordExpense({ userId: 'u1', amount: 300,  date: '2025-08-15', description: 'Groceries', category: 'food', kind: 'purchase' });
  await facade.recordSavings({ userId: 'u1', amount: 250,  date: '2025-08-15', description: 'Monthly saving', savingsCategory: 'emergency', bankName: 'ABC Bank' });
  await facade.recordLoan({    userId: 'u1', amount: 1000, date: '2025-08-15', description: 'Phone EMI', loanCategory: 'consumer', bankName: 'XYZ Bank' });

  const ctx = new ContextTransaction().setTransaction(new ExpenseTransaction(repos.expense));
  await ctx.addOperation({ userId: 'u1', amount: 50, date: '2025-08-15', description: 'Snacks', category: 'food', kind: 'purchase' });

  const before = await facade.getUserSummary('u1');
  console.log('Summary BEFORE delete:', before);
  assert(before.incomeTotal >= 1500, 'income total should reflect facade income');
  assert(before.expenseTotal >= 350, 'expense total should include extra expense');

  const adminSvc   = new AdminService();
  const asUser     = new AdminProxy(adminSvc,  { role: 'user' });
  const asAdmin    = new AdminProxy(adminSvc,  { role: 'admin' });

  try { await asUser.listUsers(); console.log('ERROR: non-admin listed users'); }
  catch (e) { console.log('As user, listUsers blocked ✅ ->', e.message); }

  console.log('As admin, users list:', await asAdmin.listUsers());
  await asAdmin.broadcast('System maintenance at 10 PM');
  await asAdmin.deleteUser('u1');

  const after = await facade.getUserSummary('u1');
  console.log('Summary AFTER delete:', after);
  assert(after.incomeTotal === 0 && after.expenseTotal === 0 && after.savingsTotal === 0 && after.loanTotal === 0,
         'all totals should be zero after delete');

  console.log('\nAll patterns (Strategy + Facade + Proxy) passed ✅');
})().catch(err => {
  console.error('All-patterns smoke test failed:', err);
  process.exit(1);
});
