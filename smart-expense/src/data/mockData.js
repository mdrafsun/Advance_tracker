// Mock Users
export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    role: "individual", // individual, business, admin
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@business.com",
    phone: "+1987654321",
    role: "business",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@smartexpense.com",
    phone: "+1555000123",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
  }
];

// Mock Categories
export const expenseCategories = [
  { id: 1, name: "Food & Dining", icon: "🍽️", color: "#FF6B6B" },
  { id: 2, name: "Transportation", icon: "🚗", color: "#4ECDC4" },
  { id: 3, name: "Shopping", icon: "🛒", color: "#45B7D1" },
  { id: 4, name: "Entertainment", icon: "🎬", color: "#96CEB4" },
  { id: 5, name: "Bills & Utilities", icon: "💡", color: "#FFEAA7" },
  { id: 6, name: "Healthcare", icon: "🏥", color: "#DDA0DD" },
  { id: 7, name: "Education", icon: "📚", color: "#98D8C8" },
  { id: 8, name: "Travel", icon: "✈️", color: "#F7DC6F" },
  { id: 9, name: "Business", icon: "💼", color: "#BB8FCE" },
  { id: 10, name: "Other", icon: "📋", color: "#AED6F1" }
];

export const incomeCategories = [
  { id: 1, name: "Salary", icon: "💼", color: "#22C55E" },
  { id: 2, name: "Freelance", icon: "💻", color: "#3B82F6" },
  { id: 3, name: "Business", icon: "🏢", color: "#8B5CF6" },
  { id: 4, name: "Investment", icon: "📈", color: "#F59E0B" },
  { id: 5, name: "Rental", icon: "🏠", color: "#EF4444" },
  { id: 6, name: "Other", icon: "📋", color: "#6B7280" }
];

// Mock Expenses
export const mockExpenses = [
  {
    id: 1,
    amount: 45.50,
    category: "Food & Dining",
    categoryId: 1,
    description: "Lunch at Italian restaurant",
    date: "2024-01-15",
    type: "one-time",
    userId: 1
  },
  {
    id: 2,
    amount: 120.00,
    category: "Bills & Utilities",
    categoryId: 5,
    description: "Monthly electricity bill",
    date: "2024-01-14",
    type: "recurring",
    userId: 1
  },
  {
    id: 3,
    amount: 35.75,
    category: "Transportation",
    categoryId: 2,
    description: "Gas for car",
    date: "2024-01-13",
    type: "one-time",
    userId: 1
  },
  {
    id: 4,
    amount: 89.99,
    category: "Shopping",
    categoryId: 3,
    description: "Clothing purchase",
    date: "2024-01-12",
    type: "one-time",
    userId: 1
  },
  {
    id: 5,
    amount: 25.00,
    category: "Entertainment",
    categoryId: 4,
    description: "Movie tickets",
    date: "2024-01-11",
    type: "one-time",
    userId: 1
  }
];

// Mock Income
export const mockIncome = [
  {
    id: 1,
    amount: 5000.00,
    category: "Salary",
    categoryId: 1,
    description: "Monthly salary",
    date: "2024-01-01",
    type: "recurring",
    userId: 1
  },
  {
    id: 2,
    amount: 1200.00,
    category: "Freelance",
    categoryId: 2,
    description: "Web development project",
    date: "2024-01-10",
    type: "one-time",
    userId: 1
  },
  {
    id: 3,
    amount: 500.00,
    category: "Investment",
    categoryId: 4,
    description: "Dividend income",
    date: "2024-01-15",
    type: "one-time",
    userId: 1
  }
];

// Mock Savings
export const mockSavings = [
  {
    id: 1,
    title: "Emergency Fund",
    amount: 10000.00,
    targetAmount: 15000.00,
    category: "Emergency",
    bankName: "Chase Bank",
    date: "2024-01-01",
    userId: 1
  },
  {
    id: 2,
    title: "Vacation Fund",
    amount: 2500.00,
    targetAmount: 5000.00,
    category: "Travel",
    bankName: "Bank of America",
    date: "2024-01-01",
    userId: 1
  }
];

// Mock Loans
export const mockLoans = [
  {
    id: 1,
    title: "Car Loan",
    amount: 25000.00,
    remainingAmount: 18000.00,
    category: "Vehicle",
    bankName: "Wells Fargo",
    interestRate: 4.5,
    monthlyPayment: 450.00,
    startDate: "2023-06-01",
    endDate: "2027-06-01",
    userId: 1
  },
  {
    id: 2,
    title: "Student Loan",
    amount: 40000.00,
    remainingAmount: 32000.00,
    category: "Education",
    bankName: "Federal Student Aid",
    interestRate: 3.8,
    monthlyPayment: 350.00,
    startDate: "2020-09-01",
    endDate: "2030-09-01",
    userId: 1
  }
];

// Mock Budget
export const mockBudget = [
  {
    id: 1,
    category: "Food & Dining",
    categoryId: 1,
    budgetAmount: 500.00,
    spentAmount: 245.50,
    userId: 1,
    month: "2024-01"
  },
  {
    id: 2,
    category: "Transportation",
    categoryId: 2,
    budgetAmount: 300.00,
    spentAmount: 135.75,
    userId: 1,
    month: "2024-01"
  },
  {
    id: 3,
    category: "Entertainment",
    categoryId: 4,
    budgetAmount: 200.00,
    spentAmount: 125.00,
    userId: 1,
    month: "2024-01"
  },
  {
    id: 4,
    category: "Shopping",
    categoryId: 3,
    budgetAmount: 400.00,
    spentAmount: 289.99,
    userId: 1,
    month: "2024-01"
  }
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 1,
    title: "Budget Alert",
    message: "You've exceeded your Food & Dining budget for this month",
    type: "warning",
    date: "2024-01-15T10:30:00Z",
    read: false,
    userId: 1
  },
  {
    id: 2,
    title: "Payment Reminder",
    message: "Car loan payment due in 3 days",
    type: "info",
    date: "2024-01-14T09:00:00Z",
    read: false,
    userId: 1
  },
  {
    id: 3,
    title: "Savings Goal",
    message: "Congratulations! You've reached 75% of your vacation fund goal",
    type: "success",
    date: "2024-01-13T14:15:00Z",
    read: true,
    userId: 1
  },
  {
    id: 4,
    title: "New Feature",
    message: "Check out our new expense categorization feature",
    type: "info",
    date: "2024-01-12T08:00:00Z",
    read: true,
    userId: 1
  }
];

// Mock Chart Data
export const mockChartData = {
  weeklyExpenses: [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 85 },
    { day: 'Wed', amount: 200 },
    { day: 'Thu', amount: 45 },
    { day: 'Fri', amount: 150 },
    { day: 'Sat', amount: 300 },
    { day: 'Sun', amount: 80 }
  ],
  monthlyIncome: [
    { month: 'Jan', amount: 6200 },
    { month: 'Feb', amount: 5800 },
    { month: 'Mar', amount: 6500 },
    { month: 'Apr', amount: 6000 },
    { month: 'May', amount: 6800 },
    { month: 'Jun', amount: 7200 }
  ],
  expensesByCategory: [
    { category: 'Food & Dining', amount: 450, color: '#FF6B6B' },
    { category: 'Transportation', amount: 300, color: '#4ECDC4' },
    { category: 'Shopping', amount: 250, color: '#45B7D1' },
    { category: 'Bills & Utilities', amount: 400, color: '#FFEAA7' },
    { category: 'Entertainment', amount: 200, color: '#96CEB4' },
    { category: 'Healthcare', amount: 150, color: '#DDA0DD' },
    { category: 'Other', amount: 100, color: '#AED6F1' }
  ]
};

// Mock Reports
export const mockReports = [
  {
    id: 1,
    title: "Monthly Expense Report - January 2024",
    type: "expense",
    dateRange: "2024-01-01 to 2024-01-31",
    totalAmount: 1850.00,
    generatedDate: "2024-01-31T23:59:59Z",
    userId: 1
  },
  {
    id: 2,
    title: "Income Summary - Q4 2023",
    type: "income",
    dateRange: "2023-10-01 to 2023-12-31",
    totalAmount: 18600.00,
    generatedDate: "2023-12-31T23:59:59Z",
    userId: 1
  }
];