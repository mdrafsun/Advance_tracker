// smart-expense/src/components/savings/Savings.js
import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { actionTypes } from '../../context/AppContext';
import {
  listSavings, addSavings, updateSavings, deleteSavings, getSummary, DEFAULT_USER_ID
} from '../../services/api';
import {
  PlusIcon, MagnifyingGlassIcon, CalendarIcon, FunnelIcon, PencilIcon, TrashIcon
} from '@heroicons/react/24/outline';

export default function Savings() {
  const { state, dispatch } = useApp();
  const userId = state?.user?.id ?? state?.user?.userId ?? DEFAULT_USER_ID;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lastSummary, setLastSummary] = useState(null);

  const fmtCur = (n) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(n||0));
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : '';
  const today = () => new Date().toISOString().slice(0,10);

  async function refreshList() {
    setLoading(true); setError('');
    try {
      const list = await listSavings(userId);
      list.sort((a,b)=> new Date((b.date||0)) - new Date((a.date||0)));
      setRows(list);
    } catch (e) { setError(e.message || 'Failed to load savings'); }
    finally { setLoading(false); }
  }

  async function refreshSummary() {
    try { setLastSummary(await getSummary(userId)); } catch {}
  }

  useEffect(() => { refreshList(); refreshSummary(); }, []);

  const hasActiveFilters = Boolean(searchTerm || categoryFilter || dateFilter);
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const text = (r.category || '').toLowerCase();
      const matchSearch = text.includes(searchTerm.toLowerCase());
      const matchCat = !categoryFilter || r.category === categoryFilter;
      const matchDate = !dateFilter || String(r.date || '').startsWith(dateFilter);
      return matchSearch && matchCat && matchDate;
    });
  }, [rows, searchTerm, categoryFilter, dateFilter]);

  const totalFiltered = filteredRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalAll      = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  function onChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function startAdd() {
    setEditingRow(null);
    setFormData({ amount:'', category:'', date: today() });
    setShowForm(true);
  }

  function startEdit(row) {
    setEditingRow(row);
    setFormData({
      amount: String(row.amount ?? ''),
      category: row.category ?? '',
      date: row.date ?? today(),
    });
    setShowForm(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (editingRow) {
        const payload = { amount: Number(formData.amount), category: formData.category, date: formData.date };
        const updated = await updateSavings(editingRow.savingsId, payload);
        setRows(prev => prev.map(r => r.savingsId === editingRow.savingsId ? { ...r, ...updated } : r));
        dispatch?.({ type: actionTypes.UPDATE_SAVINGS, payload: { id: editingRow.savingsId, ...payload } });
      } else {
        const payload = { userId, amount: Number(formData.amount), category: formData.category, date: formData.date };
        const created = await addSavings(payload);
        setRows(prev => [created, ...prev].sort((a,b)=> new Date((b.date||0)) - new Date((a.date||0))));
        dispatch?.({ type: actionTypes.ADD_SAVINGS, payload });
      }
      await refreshSummary();
      setSearchTerm(''); setCategoryFilter(''); setDateFilter('');
      setShowForm(false);
    } catch (e) { setError(e.message || 'Save failed'); }
    finally { setBusy(false); }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this savings entry?')) return;
    try {
      await deleteSavings(id);
      setRows(prev => prev.filter(r => r.savingsId !== id));
      dispatch?.({ type: actionTypes.DELETE_SAVINGS, payload: id });
      await refreshSummary();
    } catch (e) { alert(e.message || 'Delete failed'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings</h1>
          <p className="text-sm text-gray-600 mt-1">Track savings entries</p>
        </div>
        <button onClick={startAdd} className="btn-primary inline-flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" /> Add Savings
        </button>
      </div>

      <div className="card bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Total Savings (filtered)</h3>
          <p className="text-3xl font-bold text-teal-700 mt-2">{fmtCur(totalFiltered)}</p>
          <p className="text-sm text-gray-600 mt-1">{filteredRows.length} entries</p>
          <p className="text-xs text-gray-500 mt-2">All-time: <span className="font-semibold">{fmtCur(totalAll)}</span></p>
          {hasActiveFilters && <p className="text-xs text-amber-700 mt-1">Filters are on (category / month).</p>}
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </div>
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-10" placeholder="Category (exact)" value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} />
          </div>
          <div className="relative">
            <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="month" className="input-field pl-10" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
          </div>
          <button onClick={()=>{ setSearchTerm(''); setCategoryFilter(''); setDateFilter(''); }} className="btn-secondary">Clear</button>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRows.map(r => (
                  <tr key={r.savingsId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{r.category || '-'}</td>
                    <td className="px-6 py-4 text-teal-700 font-medium">{fmtCur(r.amount)}</td>
                    <td className="px-6 py-4 text-gray-500">{fmtDate(r.date)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-primary-600 hover:text-primary-900" onClick={()=>startEdit(r)} title="Edit"><PencilIcon className="h-4 w-4" /></button>
                        <button className="text-red-600 hover:text-red-900" onClick={()=>onDelete(r.savingsId)} title="Delete"><TrashIcon className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length === 0 && <div className="p-6 text-center text-gray-500">No savings entries</div>}
          </div>
        )}
      </div>

      {lastSummary && (
        <div className="text-sm text-gray-600">
          Latest totals — Income: {lastSummary.totals?.income ?? 0}, Expenses: {lastSummary.totals?.expenses ?? 0}, Savings: {lastSummary.totals?.savings ?? 0}, Balance: {lastSummary.balance ?? 0}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-600/50 z-50 flex items-start justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow p-5 mt-20">
            <h3 className="text-lg font-semibold mb-4">{editingRow ? 'Edit Savings' : 'Add Savings'}</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Amount</label>
                <input name="amount" type="number" step="0.01" className="input-field" value={formData.amount} onChange={onChange} required />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <input name="category" className="input-field" value={formData.category} onChange={onChange} placeholder="emergency / goal / other" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input name="date" type="date" className="input-field" value={formData.date} onChange={onChange} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button className="btn-primary flex-1" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
                <button type="button" className="btn-secondary flex-1" disabled={busy} onClick={()=>setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
