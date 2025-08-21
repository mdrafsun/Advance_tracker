/**
 * Transactions (Strategy base "interface")
 * Concrete strategies must implement: add(data), delete(id), getDetails(id)
 * Repo contract (injected via constructor):
 *   - add(entity)
 *   - remove(id)
 *   - getById(id)
 *   - listByUser(userId)
 */
class Transactions {
  constructor(repo) {
    if (!repo) throw new Error("Transactions requires a repo instance");
    this.repo = repo;
  }
  async add(_data) { throw new Error("Not implemented"); }
  async delete(_id) { throw new Error("Not implemented"); }
  async getDetails(_id) { throw new Error("Not implemented"); }
}

module.exports = Transactions;
