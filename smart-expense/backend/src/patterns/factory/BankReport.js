const { Report, inRange } = require('./Report');

class BankReport extends Report {
  async build() {
    const [savings, loans] = await Promise.all([
      this.repos.savings.listByUser(this.userId),
      this.repos.loan.listByUser(this.userId),
    ]);
    const saV = savings.filter(r => inRange(r.date, this.start, this.end));
    const loA = loans.filter(r => inRange(r.date, this.start, this.end));
    const sum = a => a.reduce((t,r)=>t+(+r.amount||0),0);

    return {
      type: 'bank',
      userId: this.userId,
      range: { start: this.start.toISOString().slice(0,10), end: this.end.toISOString().slice(0,10) },
      totals: { savings: sum(saV), loans: sum(loA) },
      byBank: {
        savings: groupSum(saV, r=>r.bankName||'unknown'),
        loans:   groupSum(loA, r=>r.bankName||'unknown')
      },
      lists: { savings: saV, loans: loA }
    };
  }
}
function groupSum(arr, key){ const m={}; for(const r of arr){ const k=key(r); m[k]=(m[k]||0)+(+r.amount||0); } return m; }
module.exports = BankReport;
