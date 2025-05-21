
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryColors } from '@/lib/data';
import { Expense, ExpenseCategory } from '@/lib/types';
import { Search, Filter, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getUserSettings } from '@/lib/settings';

// Define a type for the raw expense data from Supabase
interface DatabaseExpense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const { toast } = useToast();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setExpenses([]);
        setLoading(false);
        return;
      }

      // Get user currency settings
      const settings = await getUserSettings(user.id);
      if (settings) {
        const symbol = settings.currency === 'EUR' ? '€' : 
                      settings.currency === 'USD' ? '$' : 
                      settings.currency === 'GBP' ? '£' : '€';
        setCurrencySymbol(symbol);
      }

      // Fetch expenses from the database
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data) {
        // Convert the data to match our Expense type
        const formattedExpenses = data.map((expense: DatabaseExpense) => ({
          id: expense.id,
          amount: parseFloat(expense.amount as any),
          description: expense.description,
          category: expense.category as ExpenseCategory,
          date: new Date(expense.date)
        }));
        setExpenses(formattedExpenses);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch expenses: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value as ExpenseCategory | 'all');
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const filteredExpenses = expenses
    .filter(expense => 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(expense => categoryFilter === 'all' ? true : expense.category === categoryFilter)
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.date.getTime() - b.date.getTime();
      } else {
        return b.date.getTime() - a.date.getTime();
      }
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">View and manage your expense entries.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>Track where your money is going</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search expenses..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={toggleSortDirection}>
                {sortDirection === 'asc' ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading expenses...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2 sm:mb-0">
                      <span className="font-medium">{expense.description}</span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full capitalize inline-block w-fit"
                        style={{ 
                          backgroundColor: `${categoryColors[expense.category]}20`,
                          color: categoryColors[expense.category]
                        }}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                      <span className="text-sm text-gray-500">
                        {format(expense.date, 'MMM d, yyyy')}
                      </span>
                      <span className="font-medium">{currencySymbol}{expense.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {searchTerm || categoryFilter !== 'all' ? 
                    "No expenses found matching your search." : 
                    "You haven't added any expenses yet. Add an expense to get started!"}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseList;
