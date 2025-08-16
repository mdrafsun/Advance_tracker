// backend/src/http/router.js
const { URL } = require('url');

// Singletons & repos
const db = require('../patterns/singleton/Database');
const IncomeRepo  = require('../repos/IncomeRepo');
const ExpenseRepo = require('../repos/ExpenseRepo');
const SavingsRepo = require('../repos/SavingsRepo');
const LoanRepo    = require('../repos/LoanRepo');

// Patterns
const FinanceFacade = require('../patterns/facade/FinanceFacade');
const AdminService  = require('../patterns/proxy/AdminService');
const AdminProxy    = require('../patterns/proxy/AdminProxy');
const ReportFactory = require('../patterns/factory/ReportFactory');

// Controllers
const TxController   = require('./controllers/TransactionsController');
const RptController  = require('./controllers/ReportsController');
const AdmController  = require('./controllers/AdminController');
const NotifController= require('./controllers/NotificationsController');

// Build dependencies once
const repos = {
  income:  IncomeRepo(db),
  expense: ExpenseRepo(db),
  savings: SavingsRepo(db),
  loan:    LoanRepo(db),
};
const facade  = new FinanceFacade(repos);
const adminSv = new AdminService({ db });

const tx   = TxController(facade);
const rpt  = RptController(facade, ReportFactory);
const adm  = AdmController(adminSv);
const ntf  = NotifController();

// Helpers
function send(res, code, data) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,X-Role',
  });
  res.end(JSON.stringify(data));
}
function parseBody(req) {
  return new Promise(resolve => {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => {
      try { resolve(b ? JSON.parse(b) : {}); } catch { resolve({}); }
    });
  });
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});

  const url  = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  // Simple "auth": header X-Role: admin
  const role  = req.headers['x-role'] || 'user';
  const admin = new AdminProxy(adminSv, { role });

  try {
    // ---- health ----
    if (req.method === 'GET' && path === '/api/health') {
      return send(res, 200, { ok: true });
    }

    // ---- transactions ----
    if (req.method === 'POST' && path === '/api/income') {
      const body = await parseBody(req);
      return send(res, 201, await tx.addIncome(body));
    }
    if (req.method === 'POST' && path === '/api/expense') {
      const body = await parseBody(req);
      return send(res, 201, await tx.addExpense(body));
    }
    if (req.method === 'POST' && path === '/api/savings') {
      const body = await parseBody(req);
      return send(res, 201, await tx.addSavings(body));
    }
    if (req.method === 'POST' && path === '/api/loan') {
      const body = await parseBody(req);
      return send(res, 201, await tx.addLoan(body));
    }

    // ---- summary ----
    if (req.method === 'GET' && path === '/api/summary') {
      const userId = url.searchParams.get('userId');
      return send(res, 200, await tx.getSummary(userId));
    }

    // ---- reports (Factory) ----
    if (req.method === 'GET' && path === '/api/report') {
      const type   = url.searchParams.get('type');   // cashflow|bank|overall
      const userId = url.searchParams.get('userId');
      const start  = url.searchParams.get('start');  // YYYY-MM-DD
      const end    = url.searchParams.get('end');    // YYYY-MM-DD
      return send(res, 200, await rpt.getReport({ type, userId, start, end }));
    }

    // ---- notifications (Observer) ----
    if (req.method === 'GET' && path === '/api/notifications') {
      const userId = url.searchParams.get('userId');
      return send(res, 200, await ntf.listForUser(userId));
    }

    // ---- admin (Proxy) ----
    if (req.method === 'GET' && path === '/api/admin/users') {
      return send(res, 200, await adm.listUsers(admin));
    }
    if (req.method === 'DELETE' && path.startsWith('/api/admin/users/')) {
      const userId = path.split('/').pop();
      return send(res, 200, await adm.deleteUser(admin, userId));
    }

    // ---- fallback ----
    return send(res, 404, { error: 'Not found' });
  } catch (e) {
    const code = /Access denied/i.test(e.message) ? 403 : 400;
    return send(res, code, { error: e.message });
  }
};
