
import { BudgetGoal, CategoryTotal, DashboardStats, Expense, ExpenseCategory, MonthlyTotal } from './types';

export const categoryColors: Record<ExpenseCategory, string> = {
  housing: '#3b82f6',       // Blue
  transportation: '#10b981', // Green
  food: '#f59e0b',          // Yellow
  utilities: '#8b5cf6',     // Purple
  healthcare: '#ef4444',    // Red
  entertainment: '#ec4899', // Pink
  shopping: '#0ea5e9',      // Light Blue
  personal: '#6366f1',      // Indigo
  education: '#14b8a6',     // Teal
  travel: '#f97316',        // Orange
  other: '#6b7280',         // Gray
};

export const categoryIcons: Record<ExpenseCategory, string> = {
  housing: 'Home',
  transportation: 'Car',
  food: 'UtensilsCrossed',
  utilities: 'Lightbulb',
  healthcare: 'Heart',
  entertainment: 'Music',
  shopping: 'ShoppingBag',
  personal: 'User',
  education: 'GraduationCap',
  travel: 'Plane',
  other: 'MoreHorizontal',
};

export const sampleExpenses: Expense[] = [
  {
    id: '1',
    amount: 1200,
    description: 'Monthly rent',
    category: 'housing',
    date: new Date(2023, 3, 1),
  },
  {
    id: '2',
    amount: 65.50,
    description: 'Grocery shopping',
    category: 'food',
    date: new Date(2023, 3, 5),
  },
  {
    id: '3',
    amount: 45.99,
    description: 'Gas',
    category: 'transportation',
    date: new Date(2023, 3, 8),
  },
  {
    id: '4',
    amount: 120,
    description: 'Electric bill',
    category: 'utilities',
    date: new Date(2023, 3, 15),
  },
  {
    id: '5',
    amount: 59.99,
    description: 'Netflix and Spotify',
    category: 'entertainment',
    date: new Date(2023, 3, 20),
  },
  {
    id: '6',
    amount: 89.99,
    description: 'New shoes',
    category: 'shopping',
    date: new Date(2023, 3, 22),
  },
  {
    id: '7',
    amount: 35,
    description: 'Dinner with friends',
    category: 'food',
    date: new Date(2023, 3, 25),
  },
  {
    id: '8',
    amount: 200,
    description: 'Doctor appointment',
    category: 'healthcare',
    date: new Date(2023, 3, 28),
  },
  {
    id: '9',
    amount: 1200,
    description: 'Monthly rent',
    category: 'housing',
    date: new Date(2023, 4, 1),
  },
  {
    id: '10',
    amount: 78.50,
    description: 'Grocery shopping',
    category: 'food',
    date: new Date(2023, 4, 5),
  }
];

export const sampleBudgetGoals: BudgetGoal[] = [
  {
    id: '1',
    category: 'housing',
    amount: 1500,
    period: 'monthly',
    spent: 1200,
  },
  {
    id: '2',
    category: 'food',
    amount: 400,
    period: 'monthly',
    spent: 320,
  },
  {
    id: '3',
    category: 'transportation',
    amount: 200,
    period: 'monthly',
    spent: 150,
  },
  {
    id: '4',
    category: 'utilities',
    amount: 300,
    period: 'monthly',
    spent: 280,
  },
  {
    id: '5',
    category: 'entertainment',
    amount: 150,
    period: 'monthly',
    spent: 90,
  }
];

export const sampleMonthlyTotals: MonthlyTotal[] = [
  { month: 'Jan', amount: 2750 },
  { month: 'Feb', amount: 2820 },
  { month: 'Mar', amount: 2950 },
  { month: 'Apr', amount: 3100 },
  { month: 'May', amount: 2920 },
  { month: 'Jun', amount: 2850 }
];

export const sampleCategoryTotals: CategoryTotal[] = [
  { 
    category: 'housing', 
    amount: 1200, 
    percentage: 38.7,
    color: categoryColors.housing 
  },
  { 
    category: 'food', 
    amount: 420, 
    percentage: 13.5,
    color: categoryColors.food 
  },
  { 
    category: 'transportation', 
    amount: 150, 
    percentage: 4.8,
    color: categoryColors.transportation 
  },
  { 
    category: 'utilities', 
    amount: 280, 
    percentage: 9.0,
    color: categoryColors.utilities 
  },
  { 
    category: 'healthcare', 
    amount: 200, 
    percentage: 6.5,
    color: categoryColors.healthcare 
  },
  { 
    category: 'entertainment', 
    amount: 180, 
    percentage: 5.8,
    color: categoryColors.entertainment 
  },
  { 
    category: 'shopping', 
    amount: 320, 
    percentage: 10.3,
    color: categoryColors.shopping 
  },
  { 
    category: 'other', 
    amount: 350, 
    percentage: 11.4,
    color: categoryColors.other 
  }
];

export const sampleDashboardStats: DashboardStats = {
  totalExpenses: 3100,
  monthlyChange: 5.1,
  totalBudget: 3500,
  budgetUsedPercentage: 88.6,
  topCategory: {
    name: 'housing',
    amount: 1200,
    percentage: 38.7
  },
  monthlyTotals: sampleMonthlyTotals,
  categoryTotals: sampleCategoryTotals
};
