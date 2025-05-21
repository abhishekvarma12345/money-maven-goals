
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Expense, ExpenseCategory, CategoryTotal, MonthlyTotal } from '@/lib/types';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface UseExpensesOptions {
  months?: number;
}

export function useExpenses({ months = 6 }: UseExpensesOptions = {}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Color mapping for categories
  const categoryColors: Record<string, string> = {
    housing: '#4f46e5',
    transportation: '#06b6d4',
    food: '#10b981',
    utilities: '#f59e0b',
    healthcare: '#ef4444',
    entertainment: '#8b5cf6',
    shopping: '#ec4899',
    personal: '#6366f1',
    education: '#f97316',
    travel: '#14b8a6',
    other: '#64748b'
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get current date
        const currentDate = new Date();
        const startDate = subMonths(startOfMonth(currentDate), months - 1);
        
        // Fetch expenses for the last X months
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .gte('date', startDate.toISOString())
          .order('date', { ascending: false });

        if (error) throw error;

        // Transform the data
        const formattedExpenses = (data || []).map(expense => ({
          ...expense,
          date: new Date(expense.date),
          amount: Number(expense.amount)
        })) as Expense[];

        setExpenses(formattedExpenses);
        
        // Calculate total expenses
        const total = formattedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpenses(total);
        
        // Process category totals
        const categoryMap = new Map<ExpenseCategory, number>();
        
        formattedExpenses.forEach(expense => {
          const currentAmount = categoryMap.get(expense.category) || 0;
          categoryMap.set(expense.category, currentAmount + expense.amount);
        });
        
        const categoryData: CategoryTotal[] = Array.from(categoryMap.entries())
          .map(([category, amount]) => {
            return {
              category,
              amount,
              percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
              color: categoryColors[category] || '#64748b'  // Default color if not found
            };
          })
          .sort((a, b) => b.amount - a.amount);
        
        setCategoryTotals(categoryData);
        
        // Process monthly totals
        const monthlyMap = new Map<string, number>();
        
        // Initialize all months with zero
        for (let i = 0; i < months; i++) {
          const monthDate = subMonths(currentDate, i);
          const monthKey = format(monthDate, 'MMM yyyy');
          monthlyMap.set(monthKey, 0);
        }
        
        formattedExpenses.forEach(expense => {
          const monthKey = format(expense.date, 'MMM yyyy');
          if (monthlyMap.has(monthKey)) {
            monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + expense.amount);
          }
        });
        
        // Convert map to array and sort by date
        const monthlyData = Array.from(monthlyMap.entries())
          .map(([month, amount]) => ({ month, amount }))
          .reverse();
        
        setMonthlyTotals(monthlyData);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [months]);

  return {
    expenses,
    categoryTotals,
    monthlyTotals,
    totalExpenses,
    isLoading,
    error
  };
}
