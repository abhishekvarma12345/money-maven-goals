import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryColors } from '@/lib/data';
import { ExpenseCategory } from '@/lib/types';
import { Home, Car, UtensilsCrossed, Lightbulb, Heart, Music, ShoppingBag, User, GraduationCap, Plane, MoreHorizontal, PlusCircle, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getUserSettings, formatCurrency } from '@/lib/settings';
interface BudgetGoal {
  id: string;
  category: ExpenseCategory;
  amount: number;
  period: 'monthly' | 'annual';
  spent: number;
}
const BudgetGoals: React.FC = () => {
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [newGoalCategory, setNewGoalCategory] = useState<ExpenseCategory>('housing');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalPeriod, setNewGoalPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const {
    toast
  } = useToast();

  // Map of category to icon component
  const iconMap = {
    housing: Home,
    transportation: Car,
    food: UtensilsCrossed,
    utilities: Lightbulb,
    healthcare: Heart,
    entertainment: Music,
    shopping: ShoppingBag,
    personal: User,
    education: GraduationCap,
    travel: Plane,
    other: MoreHorizontal
  };
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchBudgetGoals(user.id);
        const settings = await getUserSettings(user.id);
        if (settings) {
          const symbol = settings.currency === 'EUR' ? '€' : settings.currency === 'USD' ? '$' : settings.currency === 'GBP' ? '£' : '$';
          setCurrencySymbol(symbol);
        }
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  const fetchBudgetGoals = async (userId: string) => {
    try {
      setLoading(true);

      // Fetch budget goals
      const {
        data: goalData,
        error: goalError
      } = await supabase.from('budget_goals').select('*').eq('user_id', userId);
      if (goalError) throw goalError;

      // Fetch expenses to calculate spent amounts
      const {
        data: expenseData,
        error: expenseError
      } = await supabase.from('expenses').select('category, amount').eq('user_id', userId);
      if (expenseError) throw expenseError;

      // Calculate spent amount for each category
      const spentByCategory: Record<string, number> = {};
      expenseData?.forEach(expense => {
        if (!spentByCategory[expense.category]) {
          spentByCategory[expense.category] = 0;
        }
        spentByCategory[expense.category] += parseFloat(expense.amount as any);
      });

      // Combine data
      const formattedGoals: BudgetGoal[] = goalData?.map(goal => ({
        id: goal.id,
        category: goal.category as ExpenseCategory,
        amount: parseFloat(goal.amount as any),
        period: goal.period as 'monthly' | 'annual',
        spent: spentByCategory[goal.category] || 0
      })) || [];
      setBudgetGoals(formattedGoals);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch budget goals: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAddBudgetGoal = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to add budget goals.",
        variant: "destructive"
      });
      return;
    }
    if (!newGoalCategory || !newGoalAmount) {
      toast({
        title: "Error",
        description: "Please enter both category and amount.",
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.from('budget_goals').insert({
        user_id: userId,
        category: newGoalCategory,
        amount: parseFloat(newGoalAmount),
        period: newGoalPeriod
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Budget goal added successfully."
      });

      // Reset form and refetch goals
      setNewGoalCategory('housing');
      setNewGoalAmount('');
      setNewGoalPeriod('monthly');
      setIsAddingGoal(false);
      if (userId) {
        fetchBudgetGoals(userId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add budget goal: " + error.message,
        variant: "destructive"
      });
    }
  };
  return <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budget Goals</h2>
          <p className="text-muted-foreground">Track your spending against your budget targets.</p>
        </div>
        <Sheet open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Add Budget Goal</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create Budget Goal</SheetTitle>
              <SheetDescription>
                Set a budget goal for a specific category
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newGoalCategory} onValueChange={value => setNewGoalCategory(value as ExpenseCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount ({currencySymbol})</Label>
                <Input id="amount" type="number" min="0" step="0.01" value={newGoalAmount} onChange={e => setNewGoalAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={newGoalPeriod} onValueChange={value => setNewGoalPeriod(value as 'monthly' | 'annual')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4" onClick={handleAddBudgetGoal}>
                Save Budget Goal
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/5"></div>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgetGoals.length > 0 ? budgetGoals.map(goal => {
        const percentage = Math.round(goal.spent / goal.amount * 100);
        const IconComponent = iconMap[goal.category];
        const progressColor = percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500';
        return <Card key={goal.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                  backgroundColor: `${categoryColors[goal.category]}20`
                }}>
                          <IconComponent size={16} style={{
                    color: categoryColors[goal.category]
                  }} />
                        </div>
                        <CardTitle className="text-lg capitalize">{goal.category}</CardTitle>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black-100">
                        {goal.period}
                      </span>
                    </div>
                    <CardDescription>Budget progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{currencySymbol}{goal.spent.toFixed(2)} spent</span>
                        <span className="font-medium">{currencySymbol}{goal.amount.toFixed(2)} budget</span>
                      </div>
                      <Progress value={percentage} className={`h-2 ${progressColor}`} />
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{percentage}% used</span>
                        <span>{currencySymbol}{(goal.amount - goal.spent).toFixed(2)} remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>;
      }) : <div className="col-span-full text-center py-10">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Target size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No budget goals yet</h3>
              <p className="text-gray-500 mb-4">Create your first budget goal to start tracking your spending.</p>
              <Button onClick={() => setIsAddingGoal(true)}>
                <PlusCircle size={16} className="mr-2" />
                Add Your First Budget Goal
              </Button>
            </div>}
        </div>}
    </div>;
};
export default BudgetGoals;