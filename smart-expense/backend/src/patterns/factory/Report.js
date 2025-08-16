class Report {
  constructor({ userId, startDate, endDate, repos }) {
    if (!userId) throw new Error('Report requires userId');
    if (!startDate || !endDate) throw new Error('Report requires startDate and endDate');
    if (!repos) throw new Error('Report requires repos');

    this.userId = userId;
    this.start = toLocalDate(startDate);
    this.end   = toLocalDate(endDate);
    this.repos = repos;
  }
  async build() { throw new Error('Not implemented'); }
}

function toLocalDate(input) {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date');
  d.setHours(0,0,0,0);
  return d;
}
function inRange(dateStr, start, end) {
  const d = toLocalDate(dateStr);
  return d >= start && d <= end;
}

module.exports = { Report, toLocalDate, inRange };
