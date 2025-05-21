import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExpenses } from '@/hooks/use-expenses';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserSettings } from '@/lib/settings';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const Charts: React.FC = () => {
  const [timeRange, setTimeRange] = useState<number>(6);
  const { categoryTotals, monthlyTotals, isLoading } = useExpenses({ months: timeRange });
  const [currencySymbol, setCurrencySymbol] = useState('€');

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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Visualize your spending patterns.</p>
        </div>
        <Tabs defaultValue="trends">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="trends">Spending Trends</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  const timeRangeOptions = [
    { label: '3 Months', value: 3 },
    { label: '6 Months', value: 6 },
    { label: '12 Months', value: 12 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Visualize your spending patterns.</p>
        </div>
        <div className="flex gap-2">
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>Your monthly spending patterns over the last {timeRange} months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {monthlyTotals.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTotals}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, "Amount"]} 
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
                    <p className="text-muted-foreground">No spending data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>See where your money is going</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {categoryTotals.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryTotals}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="amount"
                        nameKey="category"
                        label={({name, percent}) => `${name.charAt(0).toUpperCase() + name.slice(1)} (${(percent * 100).toFixed(1)}%)`}
                      >
                        {categoryTotals.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `${currencySymbol}${value.toLocaleString()}`, 
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ]}
                        contentStyle={{ 
                          backgroundColor: "white", 
                          borderColor: "#e5e7eb",
                          borderRadius: "0.375rem" 
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No category data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Category Comparison</CardTitle>
              <CardDescription>Compare spending across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {categoryTotals.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryTotals}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category" tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number, name: string, props: any) => [
                          `${currencySymbol}${value.toLocaleString()}`, 
                          name === "amount" ? "Amount" : name
                        ]}
                        contentStyle={{ 
                          backgroundColor: "white", 
                          borderColor: "#e5e7eb",
                          borderRadius: "0.375rem" 
                        }}
                      />
                      <Bar dataKey="amount" name="Amount">
                        {categoryTotals.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No comparison data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Charts;