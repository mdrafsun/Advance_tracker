const { Report, inRange } = require('./Report');

class OverallReport extends Report {
  async build() {
    const [incomes, expenses, savings, loans] = await Promise.all([
      this.repos.income.listByUser(this.userId),
      this.repos.expense.listByUser(this.userId),
      this.repos.savings.listByUser(this.userId),
      this.repos.loan.listByUser(this.userId),
    ]);
    const filt = r => inRange(r.date, this.start, this.end);
    const inI = incomes.filter(filt), exE = expenses.filter(filt), saV = savings.filter(filt), loA = loans.filter(filt);
    const sum = a => a.reduce((t,r)=>t+(+r.amount||0),0);

    return {
      type: 'overall',
      userId: this.userId,
      range: { start: this.start.toISOString().slice(0,10), end: this.end.toISOString().slice(0,10) },
      totals: { income: sum(inI), expense: sum(exE), savings: sum(saV), loan: sum(loA) },
      counts: { income: inI.length, expenses: exE.length, savings: saV.length, loans: loA.length },
      lists: { income: inI, expenses: exE, savings: saV, loans: loA }
    };
  }
}
module.exports = OverallReport;
