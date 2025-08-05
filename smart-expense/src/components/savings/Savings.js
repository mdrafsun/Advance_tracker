import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Savings = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('savings');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (current, target) => {
    return Math.min(100, (current / target) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings & Loans</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your savings goals and loan payments
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('savings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'savings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Savings Goals
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'loans'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Loans
          </button>
        </nav>
      </div>

      {/* Savings Tab */}
      {activeTab === 'savings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.savings.map((saving) => (
            <div key={saving.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{saving.title}</h3>
                  <p className="text-sm text-gray-500">{saving.category}</p>
                </div>
                <span className="text-xs text-gray-500">{saving.bankName}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Current Amount:</span>
                  <span className="font-medium text-green-600">{formatCurrency(saving.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target Amount:</span>
                  <span className="font-medium">{formatCurrency(saving.targetAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(saving.targetAmount - saving.amount)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(calculateProgress(saving.amount, saving.targetAmount))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${calculateProgress(saving.amount, saving.targetAmount)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          {state.loans.map((loan) => (
            <div key={loan.id} className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{loan.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span>{loan.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span>{loan.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span>{loan.interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Payment:</span>
                      <span className="font-medium">{formatCurrency(loan.monthlyPayment)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Amount:</span>
                      <span>{formatCurrency(loan.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-medium text-red-600">{formatCurrency(loan.remainingAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid Off:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(loan.amount - loan.remainingAmount)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{
                          width: `${((loan.amount - loan.remainingAmount) / loan.amount) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Start: {new Date(loan.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(loan.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Savings;