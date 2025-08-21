// backend/test/all_patterns.smoke.js
// Runs Strategy + Facade + Proxy end-to-end

const db = require('../src/patterns/singleton/Database');

// Repos used by Strategy & Facade
const IncomeRepo  = require('../src/repos/IncomeRepo');
const ExpenseRepo = require('../src/repos/ExpenseRepo');
const SavingsRepo = require('../src/repos/SavingsRepo');
const LoanRepo    = require('../src/repos/LoanRepo');

// Facade & Proxy
const FinanceFacade = require('../src/patterns/facade/FinanceFacade');
const AdminService  = require('../src/patterns/proxy/AdminService');
const AdminProxy    = require('../src/patterns/proxy/AdminProxy');

// (Optional) Direct Strategy import to show Strategy independently too
const {
  ContextTransaction,
  ExpenseTransaction,
} = require('../src/patterns/strategy');

// tiny assert helper
function assert(cond, msg) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

(async () => {
  // Start clean
  await db.clearAll();

  // Seed users (one normal user u1, one admin a1)
  await db.insert('users', { userId: 'u1', name: 'Test User',  role: 'user' });
  await db.insert('users', { userId: 'a1', name: 'Admin User', role: 'admin' });

  // Build repos
  const repos = {
    income:  IncomeRepo(db),
    expense: ExpenseRepo(db),
    savings: SavingsRepo(db),
    loan:    LoanRepo(db),
  };

  // ---- FACADE (uses Strategy under the hood) ----
  const facade = new FinanceFacade(repos);

  // Record a few transactions for u1 via the Facade
  await facade.recordIncome({
    userId: 'u1', amount: 1500, date: '2025-08-15',
    description: 'Salary', category: 'job', type: 'regular'
  });

  await facade.recordExpense({
    userId: 'u1', amount: 300, date: '2025-08-15',
    description: 'Groceries', category: 'food', kind: 'purchase'
  });

  await facade.recordSavings({
    userId: 'u1', amount: 250, date: '2025-08-15',
    description: 'Monthly saving', savingsCategory: 'emergency', bankName: 'ABC Bank'
  });

  await facade.recordLoan({
    userId: 'u1', amount: 1000, date: '2025-08-15',
    description: 'Phone EMI', loanCategory: 'consumer', bankName: 'XYZ Bank'
  });

  // ---- STRATEGY directly (optional proof) ----
  const ctx = new ContextTransaction().setTransaction(new ExpenseTransaction(repos.expense));
  const extraExpense = await ctx.addOperation({
    userId: 'u1', amount: 50, date: '2025-08-15',
    description: 'Snacks', category: 'food', kind: 'purchase'
  });
  console.log('Extra expense via direct Strategy:', extraExpense);

  // Summary BEFORE admin delete
  const before = await facade.getUserSummary('u1');
  console.log('Summary BEFORE delete:', before);
  assert(before.incomeTotal >= 1500, 'income total should reflect facade income');
  assert(before.expenseTotal >= 350, 'expense total should include facade + strategy extra expense');

  // ---- PROXY (Protection Proxy around admin operations) ----
  const adminSvc   = new AdminService();
  const asUser     = new AdminProxy(adminSvc,  { role: 'user' });
  const asAdmin    = new AdminProxy(adminSvc,  { role: 'admin' });

  // User should be blocked
  try {
    await asUser.listUsers();
    console.log('ERROR: non-admin listed users (should have thrown)');
  } catch (e) {
    console.log('As user, listUsers blocked ✅ ->', e.message);
  }

  // Admin should succeed
  const users = await asAdmin.listUsers();
  console.log('As admin, users list:', users);

  await asAdmin.broadcast('System maintenance at 10 PM');

  // Admin deletes u1 entirely
  await asAdmin.deleteUser('u1');

  // Summary AFTER delete should be zeros
  const after = await facade.getUserSummary('u1');
  console.log('Summary AFTER delete:', after);
  assert(after.incomeTotal === 0 && after.expenseTotal === 0 && after.savingsTotal === 0 && after.loanTotal === 0,
         'all totals should be zero after delete');

  console.log('\nAll patterns (Strategy + Facade + Proxy) passed ✅');
})().catch(err => {
  console.error('All-patterns smoke test failed:', err);
  process.exit(1);
});
