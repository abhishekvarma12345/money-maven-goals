import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
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
  return;
};
export default SmartInsights;