import React from 'react';
import { useApp } from '../../context/AppContext';

const Budget = () => {
  const { state } = useApp();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Planning</h1>
          <p className="mt-2 text-sm text-gray-600">
            Plan and track your monthly budgets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.budget.map((budget) => (
          <div key={budget.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{budget.category}</h3>
              <span className="text-sm text-gray-500">{budget.month}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Budgeted:</span>
                <span className="font-medium">{formatCurrency(budget.budgetAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Spent:</span>
                <span className="font-medium text-red-600">{formatCurrency(budget.spentAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining:</span>
                <span className={`font-medium ${
                  budget.budgetAmount - budget.spentAmount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(budget.budgetAmount - budget.spentAmount)}
                </span>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((budget.spentAmount / budget.budgetAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      budget.spentAmount > budget.budgetAmount
                        ? 'bg-red-500'
                        : budget.spentAmount > budget.budgetAmount * 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (budget.spentAmount / budget.budgetAmount) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budget;