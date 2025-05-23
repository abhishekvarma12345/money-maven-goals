
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currencySymbol})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
              className="dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full dark:text-white dark:bg-gray-800">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize dark:text-gray-200">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
              className="dark:text-white"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
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
