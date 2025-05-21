
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BudgetGoal } from '@/lib/types';

export function useBudgetGoals() {
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBudgetGoals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch budget goals
        const { data, error } = await supabase
          .from('budget_goals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data
        const formattedGoals = (data || []).map(goal => ({
          ...goal,
          amount: Number(goal.amount),
          spent: 0 // We'll calculate this later
        })) as BudgetGoal[];

        const total = formattedGoals.reduce((sum, goal) => sum + goal.amount, 0);
        setTotalBudget(total);
        setBudgetGoals(formattedGoals);
      } catch (err) {
        console.error('Error fetching budget goals:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetGoals();
  }, []);

  return {
    budgetGoals,
    totalBudget,
    isLoading,
    error
  };
}
