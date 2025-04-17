
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleCategoryTotals, sampleMonthlyTotals } from '@/lib/data';
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
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>Your monthly spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleMonthlyTotals}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]} 
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
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sampleCategoryTotals}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="amount"
                      nameKey="category"
                      label={({name, percent}) => `${name.charAt(0).toUpperCase() + name.slice(1)} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {sampleCategoryTotals.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${value.toLocaleString()}`, 
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sampleCategoryTotals}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `$${value.toLocaleString()}`, 
                        name === "amount" ? "Amount" : name
                      ]}
                      contentStyle={{ 
                        backgroundColor: "white", 
                        borderColor: "#e5e7eb",
                        borderRadius: "0.375rem" 
                      }}
                    />
                    <Bar dataKey="amount" name="Amount">
                      {sampleCategoryTotals.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Charts;
