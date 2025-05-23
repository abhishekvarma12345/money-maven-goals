
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { useExpenses } from '@/hooks/use-expenses';
import { cn } from '@/lib/utils';

const SmartInsights = () => {
  const { categoryTotals, totalExpenses, monthlyTotals } = useExpenses();
  const [activeTab, setActiveTab] = useState('spending');
  
  // Example insights based on the data
  const getTopCategories = () => {
    if (categoryTotals.length === 0) return [];
    return categoryTotals.slice(0, 3);
  };
  
  const getSavingsOpportunity = () => {
    const topCategory = categoryTotals[0] || { category: 'none', amount: 0 };
    return {
      category: topCategory.category,
      potential: Math.round(topCategory.amount * 0.2), // 20% potential savings
    };
  };
  
  const getMonthlyTrend = () => {
    if (monthlyTotals.length < 2) return 'stable';
    const latestMonth = monthlyTotals[0]?.amount || 0;
    const previousMonth = monthlyTotals[1]?.amount || 0;
    
    if (latestMonth < previousMonth) return 'decreasing';
    if (latestMonth > previousMonth * 1.1) return 'increasing';
    return 'stable';
  };

  const trend = getMonthlyTrend();
  const topCategories = getTopCategories();
  const savingsOpp = getSavingsOpportunity();
  
  return (
    <Card className="card-hover">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <CardTitle>Smart Insights</CardTitle>
        </div>
        <CardDescription>AI-powered analysis of your finances</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="spending">
              <div className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Spending</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="trends">
              <div className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Trends</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="savings">
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Savings</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spending" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 gradient-text">Top Spending Categories</h4>
              {topCategories.length > 0 ? (
                <ul className="space-y-2">
                  {topCategories.map((category, index) => (
                    <li key={index} className="flex justify-between items-center p-2 rounded-md bg-background">
                      <span className="capitalize">{category.category}</span>
                      <span className="font-medium">{category.percentage}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No spending data available yet</p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {topCategories.length > 0 && (
                <p>Your highest spending is on <span className="font-medium capitalize">{topCategories[0].category}</span>, 
                  accounting for <span className="font-medium">{topCategories[0].percentage}%</span> of your total expenses.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 gradient-text">Monthly Spending Trend</h4>
              <div className="flex items-center gap-2">
                {trend === 'decreasing' && (
                  <div className="flex items-center text-budget-success">
                    <TrendingDown className="mr-1 h-4 w-4" />
                    <span className="font-medium">Decreasing</span>
                  </div>
                )}
                {trend === 'increasing' && (
                  <div className="flex items-center text-budget-danger">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    <span className="font-medium">Increasing</span>
                  </div>
                )}
                {trend === 'stable' && (
                  <div className="flex items-center text-budget-info">
                    <span className="font-medium">Stable</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {trend === 'decreasing' && (
                <p>Great job! Your spending is trending downward compared to last month.</p>
              )}
              {trend === 'increasing' && (
                <p>Your spending is trending higher than last month. Consider reviewing your budget.</p>
              )}
              {trend === 'stable' && (
                <p>Your spending pattern is relatively stable compared to previous months.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="savings" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 gradient-text">Savings Opportunities</h4>
              {savingsOpp.category !== 'none' ? (
                <div className="p-2 rounded-md bg-background">
                  <p className="mb-1">You could save up to <span className="font-medium">{savingsOpp.potential}</span> by 
                  reducing <span className="capitalize">{savingsOpp.category}</span> expenses by 20%</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1">
                    <div className="bg-budget-success h-1.5 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Add more expenses to get personalized savings tips</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="text-xs">View full report</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartInsights;
