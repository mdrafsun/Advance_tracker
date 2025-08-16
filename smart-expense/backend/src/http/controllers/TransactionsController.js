module.exports = (facade) => ({
  addIncome:  (body)   => facade.recordIncome(body),
  addExpense: (body)   => facade.recordExpense(body),
  addSavings: (body)   => facade.recordSavings(body),
  addLoan:    (body)   => facade.recordLoan(body),
  getSummary: (userId) => facade.getUserSummary(userId),
});
