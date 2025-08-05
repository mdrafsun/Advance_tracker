import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { actionTypes } from '../../context/AppContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Income = () => {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    categoryId: '',
    description: '',
    date: '',
    type: 'one-time'
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update categoryId when category changes
    if (name === 'category') {
      const selectedCategory = state.incomeCategories.find(cat => cat.name === value);
      setFormData(prev => ({
        ...prev,
        categoryId: selectedCategory?.id || ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingIncome) {
      dispatch({
        type: actionTypes.UPDATE_INCOME,
        payload: {
          ...editingIncome,
          ...formData,
          amount: parseFloat(formData.amount),
          userId: state.user.id
        }
      });
    } else {
      dispatch({
        type: actionTypes.ADD_INCOME,
        payload: {
          ...formData,
          amount: parseFloat(formData.amount),
          userId: state.user.id
        }
      });
    }

    // Reset form
    setFormData({
      amount: '',
      category: '',
      categoryId: '',
      description: '',
      date: '',
      type: 'one-time'
    });
    setShowForm(false);
    setEditingIncome(null);
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      amount: income.amount.toString(),
      category: income.category,
      categoryId: income.categoryId.toString(),
      description: income.description,
      date: income.date,
      type: income.type
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      dispatch({
        type: actionTypes.DELETE_INCOME,
        payload: id
      });
    }
  };

  // Filter income based on search and filters
  const filteredIncome = state.income.filter(income => {
    const matchesSearch = income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || income.category === categoryFilter;
    const matchesDate = !dateFilter || income.date.startsWith(dateFilter);
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalIncome = filteredIncome.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage your income sources
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Income
        </button>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {filteredIncome.length} income entries
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search income..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="input-field pl-10"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {state.incomeCategories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="month"
              className="input-field pl-10"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setDateFilter('');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Income Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingIncome ? 'Edit Income' : 'Add New Income'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Category</option>
                    {state.incomeCategories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="input-field"
                    placeholder="Description of income"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="input-field"
                  >
                    <option value="one-time">One-time</option>
                    <option value="recurring">Recurring</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingIncome ? 'Update' : 'Add'} Income
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingIncome(null);
                      setFormData({
                        amount: '',
                        category: '',
                        categoryId: '',
                        description: '',
                        date: '',
                        type: 'one-time'
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Income Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncome.map((income) => (
                <tr key={income.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {income.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {state.incomeCategories.find(cat => cat.id === income.categoryId)?.icon}
                      </span>
                      <span className="text-sm text-gray-900">{income.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(income.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(income.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      income.type === 'recurring' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {income.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(income)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(income.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredIncome.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p className="text-lg">No income entries found</p>
                <p className="text-sm mt-1">Add your first income entry to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;