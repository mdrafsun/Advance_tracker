import React from 'react';
import { useApp } from '../../context/AppContext';
import { getReport } from '../../services/api';

const Reports = () => {
  const { state } = useApp();
  const userIdDefault = state?.user?.id || state?.user?.userId || 'u1';

  const [type, setType] = React.useState('cashflow'); // cashflow | bank | overall
  const [userId, setUserId] = React.useState(userIdDefault);
  const [start, setStart] = React.useState('2025-08-01');
  const [end, setEnd] = React.useState('2025-08-31');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [latest, setLatest] = React.useState(null);

  async function onGenerate() {
    setLoading(true); setError(''); setLatest(null);
    try {
      // Call as (userId, type, start?, end?) – api.js also tolerates (type, userId, ...)
      const data = await getReport(userId, type, start, end);
      setLatest(data);
    } catch (ex) {
      setError(ex.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">Generate detailed financial reports</p>
        </div>
      </div>

      {/* Generate form */}
      <div className="card">
        <div className="grid sm:grid-cols-5 gap-3">
          <select className="input-field" value={type} onChange={e=>setType(e.target.value)}>
            <option value="cashflow">Cash Flow</option>
            <option value="bank">Bank</option>
            <option value="overall">Overall</option>
          </select>
          <input className="input-field" placeholder="userId" value={userId} onChange={e=>setUserId(e.target.value)} />
          <input className="input-field" type="date" value={start} onChange={e=>setStart(e.target.value)} />
          <input className="input-field" type="date" value={end} onChange={e=>setEnd(e.target.value)} />
          <button className="btn-primary" onClick={onGenerate} disabled={loading}>{loading ? 'Generating…' : 'Generate Report'}</button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>

      {/* Your existing cards (from state.reports) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.reports && state.reports.map((report) => (
          <div key={report.id} className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.dateRange}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary-600">
                ${report.totalAmount.toLocaleString()}
              </span>
              <button className="btn-secondary text-sm">Download</button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Generated: {new Date(report.generatedDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Latest generated (from backend) */}
      {latest && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Latest Generated Report</h3>
          <pre className="bg-gray-50 p-3 rounded border">{JSON.stringify(latest, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Reports;
