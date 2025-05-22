
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExpenseCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getUserSettings } from '@/lib/settings';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExpenseFormProps {
  onSuccess?: () => void;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'housing', 
  'transportation', 
  'food', 
  'utilities', 
  'healthcare', 
  'entertainment', 
  'shopping', 
  'personal',
  'education',
  'travel',
  'other'
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const { toast } = useToast();

  useEffect(() => {
    const loadCurrencySettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const settings = await getUserSettings(user.id);
        if (settings) {
          const symbol = settings.currency === 'EUR' ? '€' : 
                        settings.currency === 'USD' ? '$' : 
                        settings.currency === 'GBP' ? '£' : '€';
          setCurrencySymbol(symbol);
        }
      }
    };

    loadCurrencySettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Insert expense into the expenses table
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          description,
          amount: parseFloat(amount),
          category,
          date: new Date(date).toISOString()
        });
      
      if (error) throw error;
      
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('other');
      setDate(new Date().toISOString().substring(0, 10));
      
      toast({
        title: "Expense added",
        description: "Your expense has been successfully saved",
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in hover:shadow-lg transition-all duration-300 border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 pb-4">
        <CardTitle className="text-gray-800 dark:text-gray-100">Add New Expense</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">Amount ({currencySymbol})</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting}
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-gray-400 focus:border-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-gray-400 focus:border-gray-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize text-gray-800 dark:text-gray-200">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description</Label>
            <Textarea
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-gray-400 focus:border-gray-500"
            />
          </div>
        </CardContent>
        
        <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 pt-4">
          <Button 
            type="submit" 
            className="w-full bg-gray-700 hover:bg-gray-800 text-white dark:bg-gray-600 dark:hover:bg-gray-500 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Expense'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExpenseForm;
