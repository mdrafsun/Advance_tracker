import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  expenseCategories,
  incomeCategories
} from '../data/mockData';
import {
  listIncome,
  listExpenses,
  listSavings,
  listLoans,
  getNotifications,
  getSummary,
  DEFAULT_USER_ID
} from '../services/api';

// Initial State
const initialState = {
  // init flag to avoid flash/blank routes during boot
  initialized: false,

  // Authentication - Start with user NOT authenticated
  user: null,
  isAuthenticated: false,

  // Data - Start with empty arrays, will be loaded from API
  expenses: [],
  income: [],
  savings: [],
  loans: [],
  budget: [],
  notifications: [],
  reports: [],
  summary: null,

  // Categories
  expenseCategories,
  incomeCategories,

  // UI State
  sidebarOpen: true,
  loading: false,
  error: null,

  // Filters
  dateFilter: {
    startDate: null,
    endDate: null
  },
  categoryFilter: null,
};

// Action Types
export const actionTypes = {
  // Init
  INIT_DONE: 'INIT_DONE',

  // Auth
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',

  // UI
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',

  // Expenses
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',

  // Income
  ADD_INCOME: 'ADD_INCOME',
  UPDATE_INCOME: 'UPDATE_INCOME',
  DELETE_INCOME: 'DELETE_INCOME',

  // Savings
  ADD_SAVINGS: 'ADD_SAVINGS',
  UPDATE_SAVINGS: 'UPDATE_SAVINGS',
  DELETE_SAVINGS: 'DELETE_SAVINGS',

  // Loans
  ADD_LOAN: 'ADD_LOAN',
  UPDATE_LOAN: 'UPDATE_LOAN',
  DELETE_LOAN: 'DELETE_LOAN',

  // Budget
  ADD_BUDGET: 'ADD_BUDGET',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',

  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',

  // Filters
  SET_DATE_FILTER: 'SET_DATE_FILTER',
  SET_CATEGORY_FILTER: 'SET_CATEGORY_FILTER',

  // Profile
  UPDATE_PROFILE: 'UPDATE_PROFILE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.INIT_DONE:
      return { ...state, initialized: true };

    case actionTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };

    case actionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };

    case actionTypes.ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };

    case actionTypes.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(e => (e.expenseId === action.payload.expenseId ? action.payload : e))
      };

    case actionTypes.DELETE_EXPENSE:
      return { ...state, expenses: state.expenses.filter(e => e.expenseId !== action.payload) };

    case actionTypes.ADD_INCOME:
      return { ...state, income: [...state.income, action.payload] };

    case actionTypes.UPDATE_INCOME:
      return {
        ...state,
        income: state.income.map(i => (i.incomeId === action.payload.incomeId ? action.payload : i))
      };

    case actionTypes.DELETE_INCOME:
      return { ...state, income: state.income.filter(i => i.incomeId !== action.payload) };

    case actionTypes.ADD_SAVINGS:
      return { ...state, savings: [...state.savings, action.payload] };

    case actionTypes.UPDATE_SAVINGS:
      return {
        ...state,
        savings: state.savings.map(s => (s.savingsId === action.payload.savingsId ? action.payload : s))
      };

    case actionTypes.DELETE_SAVINGS:
      return { ...state, savings: state.savings.filter(s => s.savingsId !== action.payload) };

    case actionTypes.ADD_LOAN:
      return { ...state, loans: [...state.loans, action.payload] };

    case actionTypes.UPDATE_LOAN:
      return {
        ...state,
        loans: state.loans.map(l => (l.loanId === action.payload.loanId ? action.payload : l))
      };

    case actionTypes.DELETE_LOAN:
      return { ...state, loans: state.loans.filter(l => l.loanId !== action.payload) };

    case actionTypes.ADD_BUDGET:
      return { ...state, budget: [...state.budget, { ...action.payload, id: Date.now() }] };

    case actionTypes.UPDATE_BUDGET:
      return {
        ...state,
        budget: state.budget.map(b => (b.id === action.payload.id ? action.payload : b))
      };

    case actionTypes.DELETE_BUDGET:
      return { ...state, budget: state.budget.filter(b => b.id !== action.payload) };

    case actionTypes.ADD_NOTIFICATION:
      return { ...state, notifications: [{ ...action.payload, id: Date.now() }, ...state.notifications] };

    case actionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(n => (n.id === action.payload ? { ...n, read: true } : n))
      };

    case actionTypes.DELETE_NOTIFICATION:
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };

    case actionTypes.SET_DATE_FILTER:
      return { ...state, dateFilter: action.payload };

    case actionTypes.SET_CATEGORY_FILTER:
      return { ...state, categoryFilter: action.payload };

    case actionTypes.UPDATE_PROFILE:
      return { ...state, user: { ...state.user, ...action.payload } };

    // New actions for setting data from API
    case 'SET_INCOME_DATA':
      return { ...state, income: action.payload };

    case 'SET_EXPENSES_DATA':
      return { ...state, expenses: action.payload };

    case 'SET_SAVINGS_DATA':
      return { ...state, savings: action.payload };

    case 'SET_LOANS_DATA':
      return { ...state, loans: action.payload };

    case 'SET_NOTIFICATIONS_DATA':
      return { ...state, notifications: action.payload };

    case 'SET_SUMMARY_DATA':
      return { ...state, summary: action.payload };

    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app without auto-login
  useEffect(() => {
    // Don't auto-login from localStorage - require proper authentication
    dispatch({ type: actionTypes.INIT_DONE });
  }, []);

  // Load data from API when component mounts and user is authenticated
  useEffect(() => {
    if (state.initialized && state.isAuthenticated && state.user) {
      const loadData = async () => {
        try {
          dispatch({ type: actionTypes.SET_LOADING, payload: true });
          
          const userId = state.user.userId || state.user.id || DEFAULT_USER_ID;
          
          // Load all data in parallel
          const [incomeData, expensesData, savingsData, loansData, notificationsData, summaryData] = await Promise.all([
            listIncome(userId),
            listExpenses(userId),
            listSavings(userId),
            listLoans(userId),
            getNotifications(userId),
            getSummary(userId)
          ]);

          // Update state with real data
          dispatch({ type: 'SET_INCOME_DATA', payload: incomeData });
          dispatch({ type: 'SET_EXPENSES_DATA', payload: expensesData });
          dispatch({ type: 'SET_SAVINGS_DATA', payload: savingsData });
          dispatch({ type: 'SET_LOANS_DATA', payload: loansData });
          dispatch({ type: 'SET_NOTIFICATIONS_DATA', payload: notificationsData });
          dispatch({ type: 'SET_SUMMARY_DATA', payload: summaryData });
          
        } catch (error) {
          console.error('Failed to load data:', error);
          dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to load data from server' });
        } finally {
          dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
      };

      loadData();
    }
  }, [state.initialized, state.isAuthenticated, state.user]);

  // Save user to localStorage when authenticated
  useEffect(() => {
    try {
      if (state.user) {
        localStorage.setItem('smartexpense_user', JSON.stringify(state.user));
      } else {
        localStorage.removeItem('smartexpense_user');
      }
    } catch {
      // ignore storage errors
    }
  }, [state.user]);

  // Calculated values
  const totalIncome = state.income.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalExpenses = state.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalSavings = state.savings.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalLoans = state.loans.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const netWorth = totalIncome - totalExpenses;
  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  const value = {
    state,
    dispatch,
    // Calculated
    totalIncome,
    totalExpenses,
    totalSavings,
    totalLoans,
    netWorth,
    unreadNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;
