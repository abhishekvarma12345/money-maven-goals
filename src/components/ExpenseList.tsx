
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  const fetchExpenses = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      const formattedExpenses = data.map(expense => ({
        ...expense,
        date: new Date(expense.date),
        amount: Number(expense.amount)
      }));
      
      setExpenses(formattedExpenses);
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load expenses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from local state
      setExpenses(expenses.filter(expense => expense.id !== id));
      
      toast({
        title: "Expense deleted",
        description: "Expense has been removed successfully"
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">Track and manage your spending</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full my-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">Track and manage your spending</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div 
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100 capitalize">
                      {expense.category}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {format(expense.date, 'MMM d, yyyy')}
                    </div>
                    <div className="font-medium">${expense.amount.toLocaleString()}</div>
                    <button 
                      className="text-sm text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses found</p>
              <p className="text-sm text-gray-400 mt-1">Add a new expense to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseList;
