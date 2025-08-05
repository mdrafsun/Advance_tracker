import React from 'react';
import { useApp } from '../../context/AppContext';

const Reports = () => {
  const { state } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            Generate detailed financial reports
          </p>
        </div>
        <button className="btn-primary">Generate New Report</button>
      </div>

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
    </div>
  );
};

export default Reports;