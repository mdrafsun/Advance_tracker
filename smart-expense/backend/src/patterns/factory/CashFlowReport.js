const { Report, inRange } = require('./Report');

class CashFlowReport extends Report {
  async build() {
    const [incomes, expenses] = await Promise.all([
      this.repos.income.listByUser(this.userId),
      this.repos.expense.listByUser(this.userId),
    ]);
    const inI = incomes.filter(r => inRange(r.date, this.start, this.end));
    const exE = expenses.filter(r => inRange(r.date, this.start, this.end));
    const sum = a => a.reduce((t,r)=>t+(+r.amount||0),0);

    return {
      type: 'cashflow',
      userId: this.userId,
      range: { start: this.start.toISOString().slice(0,10), end: this.end.toISOString().slice(0,10) },
      totals: { income: sum(inI), expense: sum(exE), net: sum(inI)-sum(exE) },
      breakdown: {
        incomeByCategory: groupSum(inI, r=>r.category||'uncategorized'),
        expenseByCategory: groupSum(exE, r=>r.category||'uncategorized')
      },
      lists: { incomes: inI, expenses: exE }
    };
  }
}
function groupSum(arr, key){ const m={}; for(const r of arr){ const k=key(r); m[k]=(m[k]||0)+(+r.amount||0); } return m; }
module.exports = CashFlowReport;
