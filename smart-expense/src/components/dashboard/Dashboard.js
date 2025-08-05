import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockChartData } from '../../data/mockData';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { state, totalIncome, totalExpenses, totalSavings, totalLoans, netWorth } = useApp();

  const overviewCards = [
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: BanknotesIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: CreditCardIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Total Savings',
      amount: totalSavings,
      icon: BuildingLibraryIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+15.3%',
      trend: 'up'
    },
    {
      title: 'Outstanding Loans',
      amount: totalLoans,
      icon: CurrencyDollarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-5.1%',
      trend: 'down'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {state.user?.name}!</h1>
        <p className="mt-2 text-primary-100">
          Here's your financial overview for today. You're doing great!
        </p>
        <div className="mt-4 flex items-center">
          <span className="text-sm">Account Type: </span>
          <span className="ml-1 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium capitalize">
            {state.user?.role}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(card.amount)}
                </p>
                <div className="flex items-center mt-1">
                  {card.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Net Worth Card */}
      <div className="card bg-gradient-to-r from-secondary-50 to-primary-50 border-2 border-primary-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Net Worth</h3>
          <p className={`text-4xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netWorth)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Your total assets minus liabilities
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Expenses Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockChartData.weeklyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Income Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData.monthlyIncome}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses by Category Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockChartData.expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {mockChartData.expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex flex-col justify-center space-y-2">
            {mockChartData.expensesByCategory.map((entry, index) => (
              <div key={entry.category} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-700 flex-1">{entry.category}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(entry.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/expenses'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <CreditCardIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Expense</span>
          </button>
          <button 
            onClick={() => window.location.href = '/income'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
          >
            <BanknotesIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Income</span>
          </button>
          <button 
            onClick={() => window.location.href = '/budget'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <BuildingLibraryIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Set Budget</span>
          </button>
          <button 
            onClick={() => window.location.href = '/reports'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <ArrowTrendingUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;