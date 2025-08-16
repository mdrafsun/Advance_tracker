const CashFlowReport = require('./CashFlowReport');
const BankReport     = require('./BankReport');
const OverallReport  = require('./OverallReport');

class ReportFactory {
  static create(type, { userId, startDate, endDate, repos }) {
    switch ((type||'').toLowerCase()) {
      case 'cashflow': case 'cash-flow': case 'cash_flow':
        return new CashFlowReport({ userId, startDate, endDate, repos });
      case 'bank': case 'bankreport':
        return new BankReport({ userId, startDate, endDate, repos });
      case 'overall': case 'summary':
        return new OverallReport({ userId, startDate, endDate, repos });
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }
}
module.exports = ReportFactory;
