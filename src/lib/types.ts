
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: Date;
}

export type ExpenseCategory = 
  | 'housing' 
  | 'transportation' 
  | 'food' 
  | 'utilities' 
  | 'healthcare' 
  | 'entertainment' 
  | 'shopping' 
  | 'personal'
  | 'education'
  | 'travel'
  | 'other';

export interface BudgetGoal {
  id: string;
  category: ExpenseCategory;
  amount: number;
  period: 'monthly' | 'annual';
  spent: number;
}

export interface MonthlyTotal {
  month: string;
  amount: number;
}

export interface CategoryTotal {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyChange: number;
  totalBudget: number;
  budgetUsedPercentage: number;
  topCategory: {
    name: ExpenseCategory;
    amount: number;
    percentage: number;
  };
  monthlyTotals: MonthlyTotal[];
  categoryTotals: CategoryTotal[];
}
