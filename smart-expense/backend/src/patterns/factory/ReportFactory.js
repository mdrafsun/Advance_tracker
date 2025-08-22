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

/*const CashFlowReport = require('./CashFlowReport');
const BankReport     = require('./BankReport');
const OverallReport  = require('./OverallReport');

class ReportFactory {
  static instance = null;

  static setFactory(factory) {
    this.instance = factory;
  }

  static create(type, { userId, startDate, endDate, repos }) {
    switch ((type || '').toLowerCase()) {
      case 'cashflow':
      case 'cash-flow':
      case 'cash_flow':
        this.setFactory(CashFlowReportFactory);
        break;
      case 'bank':
      case 'bankreport':
        this.setFactory(BankReportFactory);
        break;
      case 'overall':
      case 'summary':
        this.setFactory(OverallReportFactory);
        break;
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
    return this.instance.create({ userId, startDate, endDate, repos });
  }
}

class CashFlowReportFactory extends ReportFactory {
  static create({ userId, startDate, endDate, repos }) {
    return new CashFlowReport({ userId, startDate, endDate, repos });
  }
}

class BankReportFactory extends ReportFactory {
  static create({ userId, startDate, endDate, repos }) {
    return new BankReport({ userId, startDate, endDate, repos });
  }
}

class OverallReportFactory extends ReportFactory {
  static create({ userId, startDate, endDate, repos }) {
    return new OverallReport({ userId, startDate, endDate, repos });
  }
}

module.exports = {
  ReportFactory,
  CashFlowReportFactory,
  BankReportFactory,
  OverallReportFactory
};
*/

