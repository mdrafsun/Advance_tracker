# SmartExpense - Advanced Expense Tracker

A comprehensive web-based expense tracking application built with React.js and Tailwind CSS, designed for both individuals and businesses to manage their finances effectively.

## Features

### 🔐 Authentication System
- **Multi-role Login/Signup**: Support for Individual, Business, and Admin accounts
- **Secure Authentication**: Role-based access control
- **Password Recovery**: Forgot password functionality (mock implementation)

### 📊 Dashboard & Analytics
- **Financial Overview**: Total Income, Expenses, Savings, and Loans cards
- **Interactive Charts**: 
  - Weekly expense trends (Area Chart)
  - Monthly income patterns (Bar Chart)
  - Expense breakdown by category (Pie Chart)
- **Net Worth Calculation**: Real-time calculation of financial position
- **Quick Actions**: Fast access to common tasks

### 💰 Income Management
- **Income Tracking**: Add, edit, and delete income entries
- **Categorization**: Multiple income categories (Salary, Freelance, Business, etc.)
- **Filtering & Search**: Advanced filtering by category, date, and search terms
- **Income Types**: Support for both one-time and recurring income

### 💳 Expense Management
- **Expense Tracking**: Comprehensive expense management
- **Category Management**: 10+ expense categories with visual icons
- **Advanced Filtering**: Filter by category, date range, and search
- **Expense Analysis**: Real-time expense calculations and summaries

### 🎯 Budget Planning
- **Budget Creation**: Set monthly budget targets for each category
- **Progress Tracking**: Visual progress bars showing budget vs. actual spending
- **Budget Alerts**: Color-coded indicators for budget status
- **Historical Tracking**: Month-over-month budget analysis

### 🏦 Savings & Loans
- **Savings Goals**: Track multiple savings objectives with progress indicators
- **Loan Management**: Monitor outstanding loans with payment schedules
- **Bank Integration**: Link savings and loans to specific banks
- **Progress Visualization**: Visual progress tracking for goals

### 📈 Reports & Graphs
- **Report Generation**: Create downloadable financial reports
- **Date Range Selection**: Custom reporting periods
- **Multiple Report Types**: Income, expense, and comprehensive reports
- **Export Functionality**: Download reports for external use

### 🔔 Notification System
- **Real-time Alerts**: Budget overages, payment reminders, goal achievements
- **Notification Management**: Mark as read, delete, and categorize notifications
- **Visual Indicators**: Color-coded notification types (info, warning, error, success)
- **Unread Counter**: Badge showing unread notification count

### 👨‍💼 Admin Panel
- **User Management**: View all registered users
- **System Notifications**: Send notifications to all users or specific groups
- **Role-based Access**: Admin-only features and controls
- **User Analytics**: Basic user statistics and information

### 👤 Profile Management
- **Profile Editing**: Update personal information
- **Account Settings**: Manage notification preferences
- **Privacy Controls**: Data export and account deletion options
- **Avatar Support**: Profile picture integration

## Technology Stack

- **Frontend Framework**: React.js (Functional Components + Hooks)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Context API with useReducer
- **Charts & Visualization**: Recharts
- **Icons**: Heroicons
- **Development**: Create React App

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── common/            # Shared components (Layout, Sidebar, Navbar)
│   ├── dashboard/         # Dashboard and overview components
│   ├── income/            # Income management components
│   ├── expenses/          # Expense management components
│   ├── budget/            # Budget planning components
│   ├── savings/           # Savings and loans components
│   ├── reports/           # Reports and analytics components
│   ├── notifications/     # Notification system components
│   ├── admin/             # Admin panel components
│   └── profile/           # User profile components
├── context/               # Context API for state management
├── data/                  # Mock data and constants
├── hooks/                 # Custom React hooks
└── utils/                 # Utility functions
```

## Demo Credentials

### Individual User
- **Email**: john@example.com
- **Password**: Any 6+ characters

### Business User
- **Email**: sarah@business.com
- **Password**: Any 6+ characters

### Admin User
- **Email**: admin@smartexpense.com
- **Password**: Any 6+ characters

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-expense
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Features Overview

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Experience**: Full-featured desktop interface
- **Cross-Browser**: Compatible with modern browsers

### User Experience
- **Intuitive Navigation**: Collapsible sidebar with icons
- **Quick Actions**: Fast access to common operations
- **Real-time Updates**: Immediate feedback on user actions
- **Loading States**: Smooth loading transitions
- **Error Handling**: Comprehensive error management

### Data Management
- **Local Storage**: Persistent user sessions
- **Mock Data**: Comprehensive demo data for testing
- **State Management**: Centralized state with Context API
- **Real-time Calculations**: Dynamic financial calculations

## Customization

### Adding New Categories
Categories can be easily added by updating the `mockData.js` file:

```javascript
// Add to expenseCategories or incomeCategories
{ id: 11, name: "New Category", icon: "🎯", color: "#FF5733" }
```

### Styling Customization
The application uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors
    }
  }
}
```

## Future Enhancements

- **Backend Integration**: Connect to a real backend API
- **Multi-currency Support**: Support for multiple currencies
- **Advanced Analytics**: More detailed financial insights
- **Export Options**: PDF and CSV export functionality
- **Mobile App**: React Native mobile application
- **Collaboration**: Multi-user business account features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@smartexpense.com or create an issue in the repository.

---

**Note**: This is a frontend-only application with mock data. For production use, integrate with a backend API for data persistence and user authentication.
