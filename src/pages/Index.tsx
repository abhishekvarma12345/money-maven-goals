
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import ExpenseForm from '@/components/ExpenseForm';
import BudgetGoals from '@/components/BudgetGoals';
import ExpenseList from '@/components/ExpenseList';
import Charts from '@/components/Charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout>
      <div className="mb-6">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="budgets">Budget Goals</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Add Expense</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>New Expense</SheetTitle>
                  <SheetDescription>
                    Add a new expense to your budget tracker
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <ExpenseForm />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="expenses">
            <ExpenseList />
          </TabsContent>
          
          <TabsContent value="budgets">
            <BudgetGoals />
          </TabsContent>
          
          <TabsContent value="reports">
            <Charts />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
