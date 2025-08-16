'use strict';
// Minimal file-backed DB used by repos and strategies.
// Exposes: insert, remove, getById, list, update, clear, clearAll
// Node's module cache makes this a practical "Singleton".

const fs = require('fs');
const path = require('path');

// Path to your JSON "database" file
const DATA_PATH = path.resolve(__dirname, '../../../data/db.json');

// --- internal helpers ---
function ensureFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    const initial = {
      users: [],
      income: [],
      expenses: [],
      savings: [],
      loans: []
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(initial, null, 2));
  }
}

function load() {
  ensureFile();
  const raw = fs.readFileSync(DATA_PATH, 'utf-8') || '{}';
  let parsed;
  try { parsed = JSON.parse(raw); } catch { parsed = {}; }
  // ensure required tables always exist
  return Object.assign(
    { users: [], income: [], expenses: [], savings: [], loans: [] },
    parsed
  );
}

let state = load();

function save() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
}

function idKeyFor(table) {
  switch (table) {
    case 'users': return 'userId';
    case 'income': return 'incomeId';
    case 'expenses': return 'expenseId';
    case 'savings': return 'savingsId';
    case 'loans': return 'loanId';
    default: return 'id';
  }
}

function getTable(table) {
  if (!state[table]) state[table] = [];
  return state[table];
}

// --- public API (promise-friendly) ---
module.exports = {
  /**
   * Insert a record into a table.
   * @param {string} table - one of "users"|"income"|"expenses"|"savings"|"loans"
   * @param {object} record
   * @returns {Promise<object>}
   */
  async insert(table, record) {
    const t = getTable(table);
    t.push(record);
    save();
    return record;
  },

  /**
   * Remove a record by its id.
   * @param {string} table
   * @param {string} id
   * @returns {Promise<boolean>} true if removed
   */
  async remove(table, id) {
    const t = getTable(table);
    const idKey = idKeyFor(table);
    const idx = t.findIndex(r => r[idKey] === id);
    if (idx >= 0) {
      t.splice(idx, 1);
      save();
      return true;
    }
    return false;
  },

  /**
   * Get a record by its id.
   * @param {string} table
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async getById(table, id) {
    const t = getTable(table);
    const idKey = idKeyFor(table);
    return t.find(r => r[idKey] === id) || null;
  },

  /**
   * List records; apply an optional predicate filter.
   * @param {string} table
   * @param {(row:object)=>boolean} [predicate]
   * @returns {Promise<object[]>}
   */
  async list(table, predicate) {
    const t = getTable(table);
    return predicate ? t.filter(predicate) : t.slice();
  },

  /**
   * Shallow update of a record by id; returns updated record or null.
   * @param {string} table
   * @param {string} id
   * @param {object} partial
   * @returns {Promise<object|null>}
   */
  async update(table, id, partial) {
    const t = getTable(table);
    const idKey = idKeyFor(table);
    const idx = t.findIndex(r => r[idKey] === id);
    if (idx >= 0) {
      t[idx] = Object.assign({}, t[idx], partial);
      save();
      return t[idx];
    }
    return null;
  },

  // --- testing / maintenance helpers ---
  async clear(table) {
    if (state[table]) {
      state[table] = [];
      save();
    }
  },

  async clearAll() {
    state = { users: [], income: [], expenses: [], savings: [], loans: [] };
    save();
  }
};
