
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart, Target } from 'lucide-react';
import { sampleDashboardStats, sampleExpenses } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = sampleDashboardStats;
  const recentExpenses = sampleExpenses.slice(0, 5);

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
                  <h3 className="text-2xl font-bold">${stats.totalExpenses.toLocaleString()}</h3>
                  <span className={`text-xs font-medium flex items-center ${stats.monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {stats.monthlyChange >= 0 ? 
                      <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    }
                    {Math.abs(stats.monthlyChange)}%
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
                <h3 className="text-2xl font-bold">{stats.budgetUsedPercentage}%</h3>
                <div className="mt-2">
                  <Progress value={stats.budgetUsedPercentage} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">${stats.totalExpenses} of ${stats.totalBudget}</p>
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
                <h3 className="text-2xl font-bold capitalize">{stats.topCategory.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium">${stats.topCategory.amount}</span>
                  <span className="text-xs text-muted-foreground ml-2">({stats.topCategory.percentage}%)</span>
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
                <h3 className="text-2xl font-bold">${(stats.totalBudget - stats.totalExpenses).toLocaleString()}</h3>
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyTotals}>
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
              <ResponsiveContainer width="100%" height="80%">
                <RechartsPieChart>
                  <Pie
                    data={stats.categoryTotals}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {stats.categoryTotals.map((entry, index) => (
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
                {stats.categoryTotals.map((category, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 mr-1 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="capitalize">{category.category}</span>
                  </div>
                ))}
              </div>
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
              {recentExpenses.map((expense) => (
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
                      {expense.date.toLocaleDateString()}
                    </div>
                    <div className="font-medium">${expense.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
