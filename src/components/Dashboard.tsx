
import React from 'react';
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

const Dashboard: React.FC = () => {
  const { expenses, categoryTotals, monthlyTotals, totalExpenses, isLoading: expensesLoading } = useExpenses();
  const { totalBudget, isLoading: budgetLoading } = useBudgetGoals();
  const { toast } = useToast();

  // Calculate month-over-month change
  const calculateMonthlyChange = () => {
    if (monthlyTotals.length < 2) return 0;
    
    const currentMonth = monthlyTotals[0].amount;
    const lastMonth = monthlyTotals[1].amount;
    
    if (lastMonth === 0) return 100;
    
    return Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
  };

  const monthlyChange = calculateMonthlyChange();

  // Calculate budget used percentage
  const budgetUsedPercentage = totalBudget > 0
    ? Math.min(Math.round((totalExpenses / totalBudget) * 100), 100)
    : 0;
    
  // Get top spending category
  const topCategory = categoryTotals.length > 0 ? {
    name: categoryTotals[0].category,
    amount: categoryTotals[0].amount,
    percentage: categoryTotals[0].percentage
  } : { name: 'other', amount: 0, percentage: 0 };

  const recentExpenses = expenses.slice(0, 5);

  // Show loading state
  if (expensesLoading || budgetLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Your financial overview and insights.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="card-hover">
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
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
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your financial overview and insights.</p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Expenses */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold">${totalExpenses.toLocaleString()}</h3>
                  <span className={`text-xs font-medium flex items-center ${monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {monthlyChange >= 0 ? 
                      <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    }
                    {Math.abs(monthlyChange)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Compared to last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Usage */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Budget Used</p>
                <h3 className="text-2xl font-bold">{budgetUsedPercentage}%</h3>
                <div className="mt-2">
                  <Progress value={budgetUsedPercentage} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">${totalExpenses} of ${totalBudget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Category */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                <h3 className="text-2xl font-bold capitalize">{topCategory.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium">${topCategory.amount}</span>
                  <span className="text-xs text-muted-foreground ml-2">({topCategory.percentage}%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remaining Budget */}
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Remaining Budget</p>
                <h3 className="text-2xl font-bold">${Math.max(totalBudget - totalExpenses, 0).toLocaleString()}</h3>
                <p className="text-xs text-muted-foreground">for this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Expenses */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Expenses Over Time */}
        <Card className="col-span-7 md:col-span-4 card-hover">
          <CardHeader>
            <CardTitle>Expenses Over Time</CardTitle>
            <CardDescription>Your spending for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {monthlyTotals.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTotals}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]} 
                      labelStyle={{ color: "#1f2937" }}
                      contentStyle={{ 
                        backgroundColor: "white", 
                        borderColor: "#e5e7eb",
                        borderRadius: "0.375rem" 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ stroke: "#3b82f6", strokeWidth: 2, r: 4, fill: "white" }}
                      activeDot={{ stroke: "#3b82f6", strokeWidth: 2, r: 6, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No expense data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="col-span-7 md:col-span-3 card-hover">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Your spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col items-center justify-center">
              {categoryTotals.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="80%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryTotals}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {categoryTotals.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `$${value.toLocaleString()}`, 
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ]}
                        labelStyle={{ display: "none" }}
                        contentStyle={{ 
                          backgroundColor: "white", 
                          borderColor: "#e5e7eb",
                          borderRadius: "0.375rem" 
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {categoryTotals.map((category, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <div 
                          className="w-3 h-3 mr-1 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="capitalize">{category.category}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No category data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="col-span-7 card-hover">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => (
                  <div 
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-xs px-2 py-0.5 rounded-full bg-gray-200 capitalize">
                        {expense.category}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {format(expense.date, 'MMM dd, yyyy')}
                      </div>
                      <div className="font-medium">${expense.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No recent expenses</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
