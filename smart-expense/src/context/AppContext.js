import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  mockUsers,
  mockExpenses,
  mockIncome,
  mockSavings,
  mockLoans,
  mockBudget,
  mockNotifications,
  mockReports,
  expenseCategories,
  incomeCategories
} from '../data/mockData';

// Initial State
const initialState = {
  // Authentication
  user: null,
  isAuthenticated: false,
  
  // Data
  expenses: mockExpenses,
  income: mockIncome,
  savings: mockSavings,
  loans: mockLoans,
  budget: mockBudget,
  notifications: mockNotifications,
  reports: mockReports,
  
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
        isAuthenticated: false,
      };
      
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
      
    case actionTypes.ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: Date.now() }]
      };
      
    case actionTypes.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };
      
    case actionTypes.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
      
    case actionTypes.ADD_INCOME:
      return {
        ...state,
        income: [...state.income, { ...action.payload, id: Date.now() }]
      };
      
    case actionTypes.UPDATE_INCOME:
      return {
        ...state,
        income: state.income.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
      
    case actionTypes.DELETE_INCOME:
      return {
        ...state,
        income: state.income.filter(item => item.id !== action.payload)
      };
      
    case actionTypes.ADD_SAVINGS:
      return {
        ...state,
        savings: [...state.savings, { ...action.payload, id: Date.now() }]
      };
      
    case actionTypes.UPDATE_SAVINGS:
      return {
        ...state,
        savings: state.savings.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
      
    case actionTypes.DELETE_SAVINGS:
      return {
        ...state,
        savings: state.savings.filter(item => item.id !== action.payload)
      };
      
    case actionTypes.ADD_LOAN:
      return {
        ...state,
        loans: [...state.loans, { ...action.payload, id: Date.now() }]
      };
      
    case actionTypes.UPDATE_LOAN:
      return {
        ...state,
        loans: state.loans.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
      
    case actionTypes.DELETE_LOAN:
      return {
        ...state,
        loans: state.loans.filter(item => item.id !== action.payload)
      };
      
    case actionTypes.ADD_BUDGET:
      return {
        ...state,
        budget: [...state.budget, { ...action.payload, id: Date.now() }]
      };
      
    case actionTypes.UPDATE_BUDGET:
      return {
        ...state,
        budget: state.budget.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
      
    case actionTypes.DELETE_BUDGET:
      return {
        ...state,
        budget: state.budget.filter(item => item.id !== action.payload)
      };
      
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [{ ...action.payload, id: Date.now() }, ...state.notifications]
      };
      
    case actionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        )
      };
      
    case actionTypes.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
      
    case actionTypes.SET_DATE_FILTER:
      return {
        ...state,
        dateFilter: action.payload
      };
      
    case actionTypes.SET_CATEGORY_FILTER:
      return {
        ...state,
        categoryFilter: action.payload
      };
      
    case actionTypes.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('smartexpense_user');
    if (savedUser) {
      dispatch({
        type: actionTypes.LOGIN,
        payload: JSON.parse(savedUser)
      });
    }
  }, []);

  // Save user to localStorage when authenticated
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('smartexpense_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('smartexpense_user');
    }
  }, [state.user]);

  // Calculated values
  const totalIncome = state.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings = state.savings.reduce((sum, item) => sum + item.amount, 0);
  const totalLoans = state.loans.reduce((sum, item) => sum + item.remainingAmount, 0);
  const netWorth = totalIncome - totalExpenses;
  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  const value = {
    state,
    dispatch,
    // Calculated values
    totalIncome,
    totalExpenses,
    totalSavings,
    totalLoans,
    netWorth,
    unreadNotifications,
    // Action creators will be added as needed
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
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