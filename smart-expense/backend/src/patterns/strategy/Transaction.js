let transactions = [];

class Transaction {
  constructor(amount, type) {
    this.amount = amount;
    this.type = type;
  }

  static createTransaction(amount, type) {
    const transaction = new Transaction(amount, type);
    transactions.push(transaction);
    return transaction;
  }

  static getTransactions() {
    return transactions;
  }
}

export default Transaction;
