
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useExpenses } from '@/hooks/use-expenses';
import { useBudgetGoals } from '@/hooks/use-budget-goals';
import { format, subMonths } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getUserSettings } from '@/lib/settings';
import SmartInsights from '@/components/SmartInsights';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Dashboard: React.FC = () => {
  const {
    expenses,
    categoryTotals,
    monthlyTotals,
    totalExpenses,
    isLoading: expensesLoading
  } = useExpenses();
  
  const {
    totalBudget,
    isLoading: budgetLoading
  } = useBudgetGoals();
  
  const {
    toast
  } = useToast();
  
  const [currencySymbol, setCurrencySymbol] = useState('€');
  
  useEffect(() => {
    const loadCurrencySettings = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
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
    loadCurrencySettings();
  }, []);

  // Calculate month-over-month change
  const calculateMonthlyChange = () => {
    if (monthlyTotals.length < 2) return 0;
    const currentMonth = monthlyTotals[0].amount;
    const lastMonth = monthlyTotals[1].amount;
    if (lastMonth === 0) return 100;
    return Math.round((currentMonth - lastMonth) / lastMonth * 100);
  };
  const monthlyChange = calculateMonthlyChange();

  // Calculate budget used percentage
  const budgetUsedPercentage = totalBudget > 0 ? Math.min(Math.round(totalExpenses / totalBudget * 100), 100) : 0;

  // Get top spending category
  const topCategory = categoryTotals.length > 0 ? {
    name: categoryTotals[0].category,
    amount: categoryTotals[0].amount,
    percentage: categoryTotals[0].percentage
  } : {
    name: 'other',
    amount: 0,
    percentage: 0
  };
  const recentExpenses = expenses.slice(0, 5);

  // Show loading state
  if (expensesLoading || budgetLoading) {
    return <div className="space-y-8 animate-slow-slide-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Your financial overview and insights.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => <Card key={i} className="card-hover">
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>)}
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-7 md:col-span-4 card-hover">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>

          <Card className="col-span-7 md:col-span-3 card-hover">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  
  return (
    <div className="space-y-8 animate-slow-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Your financial overview and insights.</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Expenses */}
        <Card className="card-hover animate-gentle-float">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold text-foreground">{currencySymbol}{totalExpenses.toLocaleString()}</h3>
                  <span className={`text-xs font-medium flex items-center ${monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {monthlyChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {Math.abs(monthlyChange)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Compared to last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Usage */}
        <Card className="card-hover animate-gentle-float" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50">
                <Target className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Budget Used</p>
                <h3 className="text-2xl font-bold text-foreground">{budgetUsedPercentage}%</h3>
                <div className="mt-2">
                  <Progress value={budgetUsedPercentage} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{currencySymbol}{totalExpenses} of {currencySymbol}{totalBudget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Category */}
        <Card className="card-hover animate-gentle-float" style={{ animationDelay: "0.4s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50">
                <PieChart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                <h3 className="text-2xl font-bold text-foreground capitalize">{topCategory.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium text-foreground">{currencySymbol}{topCategory.amount}</span>
                  <span className="text-xs text-muted-foreground ml-2">({topCategory.percentage}%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remaining Budget */}
        <Card className="card-hover animate-gentle-float" style={{ animationDelay: "0.6s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Remaining Budget</p>
                <h3 className="text-2xl font-bold text-foreground">{currencySymbol}{Math.max(totalBudget - totalExpenses, 0).toLocaleString()}</h3>
                <p className="text-xs text-muted-foreground">for this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Insights Section */}
      <SmartInsights />

      {/* Recent Expenses */}
      <Card className="col-span-7 card-hover">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-foreground">Recent Expenses</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {recentExpenses.length > 0 ? recentExpenses.map(expense => <div key={expense.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="font-medium text-foreground">{expense.description}</div>
                    <div className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 capitalize text-foreground">
                      {expense.category}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {format(expense.date, 'MMM dd, yyyy')}
                    </div>
                    <div className="font-medium text-foreground">{currencySymbol}{expense.amount.toLocaleString()}</div>
                  </div>
                </div>) : <div className="text-center p-4">
                <p className="text-muted-foreground">No recent expenses</p>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
