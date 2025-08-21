// backend/src/http/router.js
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// ---- FS database path ----
const DATA_FILE = path.resolve(__dirname, '../../data/db.json');
const DATA_DIR  = path.dirname(DATA_FILE);
const SEED = { users: [], income: [], expenses: [], savings: [], loans: [], notifications: [] };

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(SEED, null, 2));
}

function readDBFS() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const json = JSON.parse(raw || '{}');
    return { ...SEED, ...json };
  } catch {
    const backup = DATA_FILE + '.corrupted.' + Date.now();
    try { fs.renameSync(DATA_FILE, backup); } catch {}
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED, null, 2));
    return { ...SEED };
  }
}

function writeDBFS(nextData) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(nextData, null, 2));
  return nextData;
}

// ---- optional project modules (safe) ----
function safeRequire(p) { try { return require(p); } catch { return null; } }
const db = safeRequire('../patterns/singleton/Database');

const IncomeRepo  = safeRequire('../repos/IncomeRepo');
const ExpenseRepo = safeRequire('../repos/ExpenseRepo');
const SavingsRepo = safeRequire('../repos/SavingsRepo');
const LoanRepo    = safeRequire('../repos/LoanRepo');

const FinanceFacade = safeRequire('../patterns/facade/FinanceFacade');
const AdminService  = safeRequire('../patterns/proxy/AdminService');
const AdminProxy    = safeRequire('../patterns/proxy/AdminProxy');
const ReportFactory = safeRequire('../patterns/factory/ReportFactory');
const GlobalUserObserver = safeRequire('../patterns/observer/GlobalUserObserver');

const TxController    = safeRequire('./controllers/TransactionsController');
const RptController   = safeRequire('./controllers/ReportsController');
const AdmController   = safeRequire('./controllers/AdminController');
const NotifController = safeRequire('./controllers/NotificationsController');

// Build dependencies once (if modules exist)
const repos = {
  income:  IncomeRepo  ? IncomeRepo(db || {})  : null,
  expense: ExpenseRepo ? ExpenseRepo(db || {}) : null,
  savings: SavingsRepo ? SavingsRepo(db || {}) : null,
  loan:    LoanRepo    ? LoanRepo(db || {})    : null,
};
const facade  = FinanceFacade && repos ? new FinanceFacade(repos) : null;

// Register Observer for notifications
if (facade && GlobalUserObserver) {
  try {
    const globalObserver = new GlobalUserObserver(); // no filter = all users
    facade.registerObserver(globalObserver);
  } catch (e) {
    console.warn('[observer] failed to register:', e.message);
  }
}

const adminSv = AdminService ? new AdminService({ db: db || {} }) : null;

const tx   = TxController  && facade ? TxController(facade)                : null;
const rpt  = RptController && repos  ? RptController(ReportFactory, repos) : null;
const adm  = AdmController && adminSv? AdmController(adminSv)              : null;
const ntf  = NotifController           ? NotifController(db || {})         : null;

// ---- helpers ----
function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,X-Role,x-role',
    'Access-Control-Max-Age': '86400',
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise(resolve => {
    let b = '';
    req.on('data', c => (b += c));
    req.on('end', () => {
      try { resolve(b ? JSON.parse(b) : {}); } catch { resolve({}); }
    });
  });
}

function sumAmt(arr) { return arr.reduce((s, x) => s + (Number(x?.amount) || 0), 0); }
function getRows(obj, keys) { const out = []; for (const k of keys) if (Array.isArray(obj[k])) out.push(...obj[k]); return out; }
function pickUser(rows, uid) { return rows.filter(r => r?.userId === uid); }
function coerceAmount(x) { const n = Number(x?.amount); return Number.isFinite(n) ? n : 0; }
function recentize(income, expenses) {
  const ts = t => t.createdAt || t.ts || t.date || t.updateDate || 0;
  return [...income, ...expenses].sort((a,b)=> new Date(ts(b)) - new Date(ts(a))).slice(0,10);
}
function cryptoRandom() { return Math.random().toString(36).slice(2) + '-' + Math.random().toString(36).slice(2); }

function appendNotification({ userId, event, message }) {
  try {
    const data = readDBFS();
    data.notifications = Array.isArray(data.notifications) ? data.notifications : [];
    data.notifications.push({
      notificationId: 'ntf_' + cryptoRandom(),
      userId,
      event,
      message,
      at: new Date().toISOString(),
      read: false
    });
    writeDBFS(data);
  } catch {}
}

// ensure userId + createdAt exist for POST bodies
function ensureUser(body, url) {
  const userId = body.userId || url.searchParams.get('userId') || 'u1';
  const createdAt = body.createdAt || new Date().toISOString();
  return { ...body, userId, createdAt };
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});

  const url  = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  const role  = req.headers['x-role'] || req.headers['X-Role'] || 'user';
  const admin = AdminProxy && adminSv ? new AdminProxy(adminSv, { role }) : null;

  try {
    // ---- health ----
    if (req.method === 'GET' && path === '/api/health') {
      return send(res, 200, { ok: true, service: 'smart-expense', time: new Date().toISOString() });
    }

    // ---- debug db ----
    if (req.method === 'GET' && path === '/api/debug/db') {
      const data = readDBFS();
      return send(res, 200, {
        ok: true,
        counts: {
          users: (data.users || []).length,
          income: (data.income || []).length,
          expenses: (data.expenses || []).length,
          savings: (data.savings || []).length,
          loans: (data.loans || []).length,
          notifications: (data.notifications || []).length
        }
      });
    }

    // =====================================================================================
    // TRANSACTIONS: CREATE  (now tolerant to missing userId/createdAt)
    // =====================================================================================

    if (req.method === 'POST' && path === '/api/income') {
      let body = await parseBody(req);
      body = ensureUser(body, url);

      // Try controller first; fall back to FS if it rejects
      if (tx?.addIncome) {
        try {
          const created = await tx.addIncome(body);
          // Observer will handle notification, so we don't need to call appendNotification here
          return send(res, 201, created);
        } catch (e) {
          // fall through to FS path
        }
      }

      const data = readDBFS();
      const item = {
        incomeId: 'inc_' + cryptoRandom(),
        userId: body.userId,
        amount: Number(body.amount) || 0,
        date: body.date || new Date().toISOString().slice(0,10),
        description: body.note || body.description || '',
        category: body.category || 'general',
        type: body.type || 'regular',
        updateDate: new Date().toISOString().slice(0,10),
        createdAt: body.createdAt,
      };
      data.income.push(item);
      appendNotification({ userId: body.userId, event: 'income:added', message: `Added ${item.amount} to ${item.category}` });
      writeDBFS(data);
      return send(res, 201, item);
    }

    if (req.method === 'POST' && path === '/api/expense') {
      let body = await parseBody(req);
      body = ensureUser(body, url);

      if (tx?.addExpense) {
        try {
          const created = await tx.addExpense(body);
          // Observer will handle notification, so we don't need to call appendNotification here
          return send(res, 201, created);
        } catch (e) {}
      }

      const data = readDBFS();
      const item = {
        expenseId: 'exp_' + cryptoRandom(),
        userId: body.userId,
        amount: Number(body.amount) || 0,
        description: body.note || body.description || '',
        category: body.category || 'general',
        kind: body.kind || 'purchase',
        date: body.date || new Date().toISOString().slice(0,10),
        updateDate: new Date().toISOString().slice(0,10),
        createdAt: body.createdAt,
      };
      data.expenses.push(item);
      appendNotification({ userId: body.userId, event: 'expense:added', message: `Recorded ${item.amount} for ${item.category}` });
      writeDBFS(data);
      return send(res, 201, item);
    }

    if (req.method === 'POST' && path === '/api/savings') {
      let body = await parseBody(req);
      body = ensureUser(body, url);

      if (tx?.addSavings) {
        try {
          const created = await tx.addSavings(body);
          // Observer will handle notification, so we don't need to call appendNotification here
          return send(res, 201, created);
        } catch (e) {}
      }

      const data = readDBFS();
      const item = {
        savingsId: 'sav_' + cryptoRandom(),
        userId: body.userId,
        amount: Number(body.amount) || 0,
        category: body.category || 'general',
        date: body.date || new Date().toISOString().slice(0,10),
        createdAt: body.createdAt,
      };
      data.savings.push(item);
      appendNotification({ userId: body.userId, event: 'savings:added', message: `Saved ${item.amount} to ${item.category}` });
      writeDBFS(data);
      return send(res, 201, item);
    }

    if (req.method === 'POST' && path === '/api/loan') {
      let body = await parseBody(req);
      body = ensureUser(body, url);

      if (tx?.addLoan) {
        try {
          const created = await tx.addLoan(body);
          // Observer will handle notification, so we don't need to call appendNotification here
          return send(res, 201, created);
        } catch (e) {}
      }

      const data = readDBFS();
      const item = {
        loanId: 'loan_' + cryptoRandom(),
        userId: body.userId,
        amount: Number(body.amount) || 0,
        category: body.category || 'general',
        date: body.date || new Date().toISOString().slice(0,10),
        createdAt: body.createdAt,
      };
      data.loans.push(item);
      appendNotification({ userId: body.userId, event: 'loan:added', message: `Loaned ${item.amount} for ${item.category}` });
      writeDBFS(data);
      return send(res, 201, item);
    }

    // =====================================================================================
    // TRANSACTIONS: LIST
    // =====================================================================================
    if (req.method === 'GET' && path === '/api/income') {
      const userId = url.searchParams.get('userId');
      if (!userId) return send(res, 400, { ok: false, error: 'userId is required' });
      const data = readDBFS();
      return send(res, 200, pickUser(data.income || [], userId));
    }

    if (req.method === 'GET' && path === '/api/expense') {
      const userId = url.searchParams.get('userId');
      if (!userId) return send(res, 400, { ok: false, error: 'userId is required' });
      const data = readDBFS();
      return send(res, 200, pickUser(data.expenses || [], userId));
    }

    if (req.method === 'GET' && path === '/api/savings') {
      const userId = url.searchParams.get('userId');
      if (!userId) return send(res, 400, { ok: false, error: 'userId is required' });
      const data = readDBFS();
      return send(res, 200, pickUser(data.savings || [], userId));
    }

    if (req.method === 'GET' && path === '/api/loan') {
      const userId = url.searchParams.get('userId');
      if (!userId) return send(res, 400, { ok: false, error: 'userId is required' });
      const data = readDBFS();
      return send(res, 200, pickUser(data.loans || [], userId));
    }

    // =====================================================================================
    // TRANSACTIONS: UPDATE
    // =====================================================================================
    if (req.method === 'PUT' && path.startsWith('/api/income/')) {
      const id = path.split('/').pop();
      const body = await parseBody(req);
      const data = readDBFS();
      const list = data.income || [];
      const idx = list.findIndex(x => x.incomeId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Income not found' });

      const prev = list[idx];
      const next = {
        ...prev,
        amount: body.amount != null ? Number(body.amount) : prev.amount,
        description: body.description != null ? body.description : prev.description,
        category: body.category != null ? body.category : prev.category,
        type: body.type != null ? body.type : prev.type,
        date: body.date || prev.date,
        updateDate: new Date().toISOString().slice(0,10),
      };
      list[idx] = next;
      writeDBFS(data);
      const amt = next.amount;
      const cat = next.category || 'income';
      appendNotification({ userId: next.userId, event: 'income:updated', message: `Updated ${amt} (${cat})` });
      return send(res, 200, next);
    }

    if (req.method === 'PUT' && path.startsWith('/api/expense/')) {
      const id = path.split('/').pop();
      const body = await parseBody(req);
      const data = readDBFS();
      const list = data.expenses || [];
      const idx = list.findIndex(x => x.expenseId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Expense not found' });

      const prev = list[idx];
      const next = {
        ...prev,
        amount: body.amount != null ? Number(body.amount) : prev.amount,
        description: body.description != null ? body.description : prev.description,
        category: body.category != null ? body.category : prev.category,
        kind: body.kind != null ? body.kind : prev.kind,
        date: body.date || prev.date,
        updateDate: new Date().toISOString().slice(0,10),
      };
      list[idx] = next;
      writeDBFS(data);
      const amt = next.amount;
      const cat = next.category || 'expense';
      appendNotification({ userId: next.userId, event: 'expense:updated', message: `Updated ${amt} (${cat})` });
      return send(res, 200, next);
    }

    if (req.method === 'PUT' && path.startsWith('/api/savings/')) {
      const id = path.split('/').pop();
      const body = await parseBody(req);
      const data = readDBFS();
      const list = data.savings || [];
      const idx = list.findIndex(x => x.savingsId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Savings not found' });

      const prev = list[idx];
      const next = {
        ...prev,
        amount: body.amount != null ? Number(body.amount) : prev.amount,
        category: body.category != null ? body.category : prev.category,
        date: body.date || prev.date,
      };
      list[idx] = next;
      writeDBFS(data);
      const amt = next.amount;
      const cat = next.category || 'savings';
      appendNotification({ userId: next.userId, event: 'savings:updated', message: `Updated ${amt} (${cat})` });
      return send(res, 200, next);
    }

    if (req.method === 'PUT' && path.startsWith('/api/loan/')) {
      const id = path.split('/').pop();
      const body = await parseBody(req);
      const data = readDBFS();
      const list = data.loans || [];
      const idx = list.findIndex(x => x.loanId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Loan not found' });

      const prev = list[idx];
      const next = {
        ...prev,
        amount: body.amount != null ? Number(body.amount) : prev.amount,
        category: body.category != null ? body.category : prev.category,
        date: body.date || prev.date,
      };
      list[idx] = next;
      writeDBFS(data);
      const amt = next.amount;
      const cat = next.category || 'loan';
      appendNotification({ userId: next.userId, event: 'loan:updated', message: `Updated ${amt} (${cat})` });
      return send(res, 200, next);
    }

    // =====================================================================================
    // TRANSACTIONS: DELETE  (fixed small typo here)
    // =====================================================================================
    if (req.method === 'DELETE' && path.startsWith('/api/income/')) {
      const id = path.split('/').pop();
      const data = readDBFS();
      const list = data.income || [];
      const idx = list.findIndex(x => x.incomeId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Income not found' });
      const [removed] = list.splice(idx, 1);
      writeDBFS(data);
      const amt = removed.amount;
      const cat = removed.category || 'income';
      appendNotification({ userId: removed.userId, event: 'income:deleted', message: `Deleted ${amt} (${cat})` });
      return send(res, 200, { ok: true, removedId: id });
    }

    if (req.method === 'DELETE' && path.startsWith('/api/expense/')) {
      const id = path.split('/').pop();
      const data = readDBFS();
      const list = data.expenses || [];
      const idx = list.findIndex(x => x.expenseId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Expense not found' });
      const [removed] = list.splice(idx, 1);
      writeDBFS(data);
      const amt = removed.amount;
      const cat = removed.category || 'expense';
      appendNotification({ userId: removed.userId, event: 'expense:deleted', message: `Deleted ${amt} (${cat})` });
      return send(res, 200, { ok: true, removedId: id });
    }

    if (req.method === 'DELETE' && path.startsWith('/api/savings/')) {
      const id = path.split('/').pop();
      const data = readDBFS();
      const list = data.savings || [];
      const idx = list.findIndex(x => x.savingsId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Savings not found' });
      const [removed] = list.splice(idx, 1);
      writeDBFS(data);
      const amt = removed.amount;
      const cat = removed.category || 'savings';
      appendNotification({ userId: removed.userId, event: 'savings:deleted', message: `Deleted ${amt} (${cat})` });
      return send(res, 200, { ok: true, removedId: id });
    }

    if (req.method === 'DELETE' && path.startsWith('/api/loan/')) {
      const id = path.split('/').pop();
      const data = readDBFS();
      const list = data.loans || [];
      const idx = list.findIndex(x => x.loanId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Loan not found' });
      const [removed] = list.splice(idx, 1);
      writeDBFS(data);
      const amt = removed.amount;
      const cat = removed.category || 'loan';
      appendNotification({ userId: removed.userId, event: 'loan:deleted', message: `Deleted ${amt} (${cat})` });
      return send(res, 200, { ok: true, removedId: id });
    }

    // =====================================================================================
    // SUMMARY / REPORT / NOTIFICATIONS  (unchanged)
    // =====================================================================================
    if (req.method === 'GET' && path === '/api/summary') {
      const userId = url.searchParams.get('userId');
      if (!userId) return send(res, 400, { ok: false, error: 'userId is required' });

      if (rpt?.getSummary) {
        try {
          const result = await rpt.getSummary(userId);
          if (result && typeof result === 'object') return send(res, 200, result);
        } catch (e) { console.warn('[summary] controller threw, falling back:', e.message); }
      }

      const data = readDBFS();
      const income   = pickUser(getRows(data, ['income', 'incomes']), userId);
      const expenses = pickUser(getRows(data, ['expenses', 'expense']), userId);
      const savings  = pickUser(getRows(data, ['savings', 'saving']), userId);
      const loans    = pickUser(getRows(data, ['loans', 'loan']), userId);

      if (Array.isArray(data.transactions)) {
        income.push(...pickUser(data.transactions.filter(t => (t.type || t.kind) === 'income'), userId));
        expenses.push(...pickUser(data.transactions.filter(t => (t.type || t.kind) === 'expense'), userId));
      }

      const totals = {
        income:   sumAmt(income),
        expenses: sumAmt(expenses),
        savings:  sumAmt(savings),
        loans:    sumAmt(loans),
      };
      const balance = totals.income - totals.expenses;

      return send(res, 200, {
        ok: true,
        userId,
        totals,
        balance,
        counts: {
          income: income.length,
          expenses: expenses.length,
          savings: savings.length,
          loans: loans.length,
        },
        recent: recentize(income, expenses),
      });
    }

    if (req.method === 'GET' && path === '/api/report') {
      const userId = url.searchParams.get('userId');
      const type   = (url.searchParams.get('type') || 'overall').toLowerCase();
      if (!userId) return send(res, 400, { ok: false, error: 'userId is required' });

      const data = readDBFS();
      let income   = pickUser(getRows(data, ['income', 'incomes']), userId);
      let expenses = pickUser(getRows(data, ['expenses', 'expense']), userId);
      if (Array.isArray(data.transactions)) {
        income.push(...pickUser(data.transactions.filter(t => (t.type || t.kind) === 'income'), userId));
        expenses.push(...pickUser(data.transactions.filter(t => (t.type || t.kind) === 'expense'), userId));
      }

      const fallbackTotals = () => {
        const totalIncome   = income.reduce((s, x) => s + coerceAmount(x), 0);
        const totalExpenses = expenses.reduce((s, x) => s + coerceAmount(x), 0);
        const net           = totalIncome - totalExpenses;
        const base = { ok: true, userId, type };
        if (type === 'cashflow') return { ...base, totalIncome, totalExpenses, net };
        if (type === 'bank') {
          return {
            ...base,
            accounts: [
              { name: 'Cash',     balance: net >= 0 ? net : 0 },
              { name: 'Payables', balance: net <  0 ? Math.abs(net) : 0 }
            ]
          };
        }
        return { ...base, totalIncome, totalExpenses, net };
      };

      if (rpt?.getReport) {
        try {
          const result = await rpt.getReport({ userId, type });
          const totalsAllZero =
            result && typeof result === 'object' &&
            Number(result.totalIncome || 0) === 0 &&
            Number(result.totalExpenses || 0) === 0 &&
            Number(result.net || 0) === 0;
          const dbHasRowsForUser = income.length + expenses.length > 0;
          if (!totalsAllZero || !dbHasRowsForUser) return send(res, 200, result);
          return send(res, 200, fallbackTotals());
        } catch (e) {
          console.warn('[report] controller threw, falling back:', e.message);
          return send(res, 200, fallbackTotals());
        }
      }

      return send(res, 200, fallbackTotals());
    }

    if (req.method === 'GET' && path === '/api/notifications') {
      const userId = url.searchParams.get('userId');
      if (!userId) return send(res, 400, { ok: false, error: 'userId is required' });

      let ctrl = [];
      if (ntf?.listForUser) {
        try {
          const maybe = await ntf.listForUser(userId);
          if (Array.isArray(maybe)) ctrl = maybe;
        } catch (e) {
          console.warn('[notifications] controller threw, continuing with FS:', e.message);
        }
      }

      const data = readDBFS();
      const fsList = Array.isArray(data.notifications) ? data.notifications.filter(n => n.userId === userId) : [];

      const keyOf = (n) => {
        // For de-duplication, use event + userId + timestamp (within 5 seconds to handle timezone differences)
        const timestamp = new Date(n.at || n.date || n.createdAt || 0).getTime();
        const roundedTime = Math.floor(timestamp / 5000) * 5000; // Round to nearest 5 seconds
        return `${n.event || ''}|${n.userId || ''}|${roundedTime}`;
      };
      const map = new Map();
      for (const n of [...ctrl, ...fsList]) map.set(keyOf(n), n);

      const all = Array.from(map.values()).sort((a, b) => {
        const ta = new Date(a.at || a.date || a.createdAt || 0).getTime();
        const tb = new Date(b.at || b.date || b.createdAt || 0).getTime();
        return tb - ta;
      });

      return send(res, 200, all);
    }

    if (req.method === 'PATCH' && path.startsWith('/api/notifications/')) {
      const id = path.split('/').pop();
      const body = await parseBody(req);
      const data = readDBFS();
      const list = Array.isArray(data.notifications) ? data.notifications : [];
      const idx = list.findIndex(n => n.notificationId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Notification not found' });
      list[idx].read = Boolean(body.read);
      writeDBFS(data);
      return send(res, 200, { ok: true, notification: list[idx] });
    }

    if (req.method === 'DELETE' && path.startsWith('/api/notifications/')) {
      const id = path.split('/').pop();
      const data = readDBFS();
      const list = Array.isArray(data.notifications) ? data.notifications : [];
      const idx = list.findIndex(n => n.notificationId === id);
      if (idx === -1) return send(res, 404, { ok: false, error: 'Notification not found' });
      const [removed] = list.splice(idx, 1);
      writeDBFS(data);
      return send(res, 200, { ok: true, removed });
    }

    // Users endpoint for admin panel
    if (req.method === 'GET' && path === '/api/users') {
      const data = readDBFS();
      const users = Array.isArray(data.users) ? data.users : [];
      return send(res, 200, users);
    }

    // User registration endpoint
    if (req.method === 'POST' && path === '/api/users') {
      const body = await parseBody(req);
      
      if (!body.email || !body.name) {
        return send(res, 400, { ok: false, error: 'Email and name are required' });
      }

      const data = readDBFS();
      data.users = Array.isArray(data.users) ? data.users : [];
      
      // Check if user already exists
      const existingUser = data.users.find(u => u.email === body.email);
      if (existingUser) {
        return send(res, 409, { ok: false, error: 'User with this email already exists' });
      }

      // Create new user
      const newUser = {
        id: body.id || body.userId || 'u_' + cryptoRandom(),
        userId: body.userId || body.id || 'u_' + cryptoRandom(),
        name: body.name,
        email: body.email,
        phone: body.phone || '+1234567890',
        role: body.role || 'individual',
        createdAt: new Date().toISOString()
      };

      data.users.push(newUser);
      writeDBFS(data);
      
      return send(res, 201, newUser);
    }

    return send(res, 404, { error: 'Not found' });
  } catch (e) {
    const code = /Access denied/i.test(e.message) ? 403 : 400;
    return send(res, code, { error: e.message });
  }
};
