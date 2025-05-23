
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Expense, ExpenseCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getUserSettings, formatCurrency } from '@/lib/settings';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchExpenses();
    loadCurrencySettings();
  }, []);
  
  const loadCurrencySettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const settings = await getUserSettings(user.id);
      if (settings) {
        const symbol = settings.currency === 'EUR' ? '€' : 
                      settings.currency === 'USD' ? '$' : 
                      settings.currency === 'GBP' ? '£' : 
                      settings.currency === 'JPY' ? '¥' : 
                      settings.currency === 'CAD' ? 'C$' : 
                      settings.currency === 'AUD' ? 'A$' : '€';
        setCurrencySymbol(symbol);
      }
    }
  };
  
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
        amount: Number(expense.amount),
        category: expense.category as ExpenseCategory
      }));
      
      setExpenses(formattedExpenses);
      setFilteredExpenses(formattedExpenses);
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
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      
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

  // Filter expenses based on search query and category
  useEffect(() => {
    let result = [...expenses];
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(expense => 
        expense.description.toLowerCase().includes(query) || 
        expense.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(expense => expense.category === selectedCategory);
    }
    
    setFilteredExpenses(result);
  }, [searchQuery, selectedCategory, expenses]);

  // Get unique categories for the filter dropdown
  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));
  
  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="mb-6 w-full">
          <h2 className="text-3xl font-bold tracking-tight mb-1 break-words">Expenses</h2>
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
      <div className="mb-6 w-full">
        <h2 className="text-3xl font-bold tracking-tight mb-1 break-words">Expenses</h2>
        <p className="text-muted-foreground">Track and manage your spending</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border rounded-md bg-background dark:bg-gray-800 dark:border-gray-700">
            <Filter size={18} />
            <span>Filter</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem 
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-muted' : ''}
            >
              All Categories
            </DropdownMenuItem>
            {uniqueCategories.map(category => (
              <DropdownMenuItem 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-muted' : ''}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length > 0 ? (
            <div className="space-y-2">
              {filteredExpenses.map((expense) => (
                <div 
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="font-medium dark:text-gray-100">{expense.description}</div>
                    <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 capitalize">
                      {expense.category}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {format(expense.date, 'MMM d, yyyy')}
                    </div>
                    <div className="font-medium dark:text-gray-200">{currencySymbol}{expense.amount.toLocaleString()}</div>
                    <button 
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleDeleteExpense(expense.id)}
                      aria-label="Delete expense"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
              {expenses.length > 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filter</p>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add a new expense to get started</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseList;
