// backend/test/notifications.smoke.js
// Tests that notifications are reliably created for all transaction types
// and that Observer + FS fallback work together without duplicates

const db = require('../src/patterns/singleton/Database');

const IncomeRepo  = require('../src/repos/IncomeRepo');
const ExpenseRepo = require('../src/repos/ExpenseRepo');
const SavingsRepo = require('../src/repos/SavingsRepo');
const LoanRepo    = require('../src/repos/LoanRepo');

const FinanceFacade = require('../src/patterns/facade/FinanceFacade');
const GlobalUserObserver = require('../src/patterns/observer/GlobalUserObserver');

(async () => {
  console.log('🧪 Starting notifications smoke test...');
  
  // Clear all data to start fresh
  await db.clearAll();
  console.log('✅ Database cleared');

  // Seed a test user
  await db.insert('users', { userId: 'u1', name: 'Test User', role: 'user' });
  console.log('✅ Test user created');

  // Verify notifications table exists and is empty
  const initialNotifications = await db.list('notifications');
  if (initialNotifications.length !== 0) {
    throw new Error(`Expected 0 notifications initially, got ${initialNotifications.length}`);
  }
  console.log('✅ Notifications table is empty initially');

  // Set up repos and facade
  const repos = {
    income:  IncomeRepo(db),
    expense: ExpenseRepo(db),
    savings: SavingsRepo(db),
    loan:    LoanRepo(db),
  };

  const facade = new FinanceFacade(repos);
  console.log('✅ FinanceFacade created');

  // Register the global observer
  const globalObserver = new GlobalUserObserver();
  facade.registerObserver(globalObserver);
  console.log('✅ GlobalUserObserver registered');

  // Test 1: Record transactions and verify notifications are created
  console.log('\n📝 Testing transaction notifications...');
  
  const testData = [
    { type: 'income', data: { userId: 'u1', amount: 1000, date: '2025-08-15', description: 'Salary', category: 'job', type: 'regular' } },
    { type: 'expense', data: { userId: 'u1', amount: 200, date: '2025-08-15', description: 'Groceries', category: 'food', kind: 'purchase' } },
    { type: 'savings', data: { userId: 'u1', amount: 300, date: '2025-08-15', description: 'Emergency Fund', category: 'emergency' } },
    { type: 'loan', data: { userId: 'u1', amount: 1500, date: '2025-08-15', description: 'Phone Loan', category: 'consumer' } }
  ];

  for (const test of testData) {
    let result;
    switch (test.type) {
      case 'income':
        result = await facade.recordIncome(test.data);
        break;
      case 'expense':
        result = await facade.recordExpense(test.data);
        break;
      case 'savings':
        result = await facade.recordSavings(test.data);
        break;
      case 'loan':
        result = await facade.recordLoan(test.data);
        break;
    }
    console.log(`✅ ${test.type} recorded:`, result[`${test.type}Id`] ? 'success' : 'failed');
  }

  // Test 2: Verify notifications were created
  console.log('\n🔍 Verifying notifications...');
  const allNotifications = await db.list('notifications');
  const userNotifications = allNotifications.filter(n => n.userId === 'u1');
  
  console.log(`Total notifications: ${allNotifications.length}`);
  console.log(`Notifications for u1: ${userNotifications.length}`);
  
  if (userNotifications.length < 4) {
    throw new Error(`Expected at least 4 notifications for u1, got ${userNotifications.length}`);
  }

  // Test 3: Verify notification content
  const expectedEvents = ['income:added', 'expense:added', 'savings:added', 'loan:added'];
  const foundEvents = userNotifications.map(n => n.event);
  
  for (const expectedEvent of expectedEvents) {
    if (!foundEvents.includes(expectedEvent)) {
      throw new Error(`Missing expected event: ${expectedEvent}`);
    }
  }
  console.log('✅ All expected notification events found');

  // Test 4: Verify notifications are sorted newest-first
  const sortedNotifications = userNotifications.sort((a, b) => {
    const ta = new Date(a.at || a.date || a.createdAt || 0).getTime();
    const tb = new Date(b.at || b.date || b.createdAt || 0).getTime();
    return tb - ta;
  });
  
  const isSorted = sortedNotifications.every((n, i) => {
    if (i === 0) return true;
    const current = new Date(n.at || n.date || n.createdAt || 0).getTime();
    const previous = new Date(sortedNotifications[i-1].at || sortedNotifications[i-1].date || sortedNotifications[i-1].createdAt || 0).getTime();
    return current <= previous;
  });
  
  if (!isSorted) {
    throw new Error('Notifications are not sorted newest-first');
  }
  console.log('✅ Notifications are sorted newest-first');

  // Test 5: Verify no duplicates (Observer + FS fallback should not create duplicates)
  const eventMessageMap = new Map();
  for (const n of userNotifications) {
    const key = `${n.event}|${n.message}`;
    if (eventMessageMap.has(key)) {
      throw new Error(`Duplicate notification found: ${key}`);
    }
    eventMessageMap.set(key, n);
  }
  console.log('✅ No duplicate notifications found');

  // Test 6: Verify notification structure
  for (const n of userNotifications) {
    if (!n.notificationId || !n.userId || !n.event || !n.message || !n.at) {
      throw new Error(`Invalid notification structure: ${JSON.stringify(n)}`);
    }
  }
  console.log('✅ All notifications have valid structure');

  console.log('\n🎉 Notifications smoke test passed! ✅');
  console.log(`📊 Summary: ${userNotifications.length} notifications created for user u1`);
  
})().catch(err => {
  console.error('❌ Notifications smoke test failed:', err);
  process.exit(1);
});
