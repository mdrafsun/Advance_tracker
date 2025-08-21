/**
 * Small helpers (no external deps)
 */
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function isPositiveNumber(n) {
  return typeof n === 'number' && Number.isFinite(n) && n > 0;
}

function toISODate(input) {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;  // local YYYY-MM-DD
}


function newId(prefix) {
  try {
    const { randomUUID } = require('crypto');
    if (typeof randomUUID === 'function') {
      return prefix + "_" + randomUUID();
    }
  } catch (_) {}
  // Fallback if randomUUID not available
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

module.exports = { assert, isPositiveNumber, toISODate, newId };
