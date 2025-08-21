module.exports = (facade, ReportFactory) => ({
  async getReport({ type, userId, start, end }) {
    const report = await ReportFactory
      .create(type, { userId, startDate: start, endDate: end, repos: facade.repos })
      .build();
    return report;
  }
});
