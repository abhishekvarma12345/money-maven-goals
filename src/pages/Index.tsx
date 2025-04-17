
import React from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import ExpenseForm from '@/components/ExpenseForm';
import BudgetGoals from '@/components/BudgetGoals';
import ExpenseList from '@/components/ExpenseList';
import Charts from '@/components/Charts';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Index: React.FC = () => {
  const location = useLocation();
  const hash = location.hash.slice(1) || 'dashboard';
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // Render the appropriate component based on the URL hash
  const renderContent = () => {
    switch (hash) {
      case 'expenses':
        return <ExpenseList />;
      case 'budgets':
        return <BudgetGoals />;
      case 'reports':
        return <Charts />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {hash.charAt(0).toUpperCase() + hash.slice(1)}
          </h1>
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                <ExpenseForm onSuccess={() => setSheetOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {renderContent()}
      </div>
    </Layout>
  );
};

export default Index;
