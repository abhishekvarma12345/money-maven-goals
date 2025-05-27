
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Sparkles, TrendingDown, TrendingUp, Brain, Target, Zap } from 'lucide-react';
import { useExpenses } from '@/hooks/use-expenses';
import { cn } from '@/lib/utils';

const SmartInsights = () => {
  const {
    categoryTotals,
    totalExpenses,
    monthlyTotals
  } = useExpenses();
  const [activeTab, setActiveTab] = useState('spending');

  // Example insights based on the data
  const getTopCategories = () => {
    if (categoryTotals.length === 0) return [];
    return categoryTotals.slice(0, 3);
  };

  const getSavingsOpportunity = () => {
    const topCategory = categoryTotals[0] || {
      category: 'none',
      amount: 0
    };
    return {
      category: topCategory.category,
      potential: Math.round(topCategory.amount * 0.2) // 20% potential savings
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
    <div className="space-y-6">
      <div className="mb-6 w-full">
        <h2 className="text-3xl font-bold tracking-tight mb-1 break-words text-foreground flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary" />
          Smart Insights
        </h2>
        <p className="text-muted-foreground">AI-powered financial recommendations and analysis.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spending" className="transition-all duration-200">
            <TrendingUp className="w-4 h-4 mr-2" />
            Spending
          </TabsTrigger>
          <TabsTrigger value="savings" className="transition-all duration-200">
            <Target className="w-4 h-4 mr-2" />
            Savings
          </TabsTrigger>
          <TabsTrigger value="trends" className="transition-all duration-200">
            <Zap className="w-4 h-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Top Categories
                </CardTitle>
                <CardDescription>Your highest spending categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCategories.map((category, index) => (
                    <div key={category.category} className="flex justify-between items-center">
                      <span>{category.category}</span>
                      <span className="font-semibold">€{category.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Monthly Trend
                </CardTitle>
                <CardDescription>Your spending pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {trend === 'increasing' && <TrendingUp className="w-6 h-6 text-red-500" />}
                  {trend === 'decreasing' && <TrendingDown className="w-6 h-6 text-green-500" />}
                  {trend === 'stable' && <BarChart className="w-6 h-6 text-blue-500" />}
                  <span className="capitalize">{trend} spending</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Savings Opportunity
              </CardTitle>
              <CardDescription>Potential ways to save money</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p>
                    Consider reducing your <strong>{savingsOpp.category}</strong> expenses. 
                    You could potentially save <strong>€{savingsOpp.potential}</strong> per month.
                  </p>
                </div>
                <Button className="w-full transition-all duration-200 hover:scale-105">
                  <Target className="w-4 h-4 mr-2" />
                  Set Savings Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-purple-500" />
                Spending Trends
              </CardTitle>
              <CardDescription>Monthly analysis of your expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTotals.slice(0, 3).map((month, index) => (
                  <div key={month.month} className="flex justify-between items-center p-2 rounded border">
                    <span>{month.month}</span>
                    <span className="font-semibold">€{month.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartInsights;
