
import React from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import ExpenseList from '@/components/ExpenseList';
import BudgetGoals from '@/components/BudgetGoals';
import Charts from '@/components/Charts';
import { useLocation } from 'react-router-dom';

const Index: React.FC = () => {
  const location = useLocation();
  const hash = location.hash.slice(1) || 'dashboard';

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
      {renderContent()}
    </Layout>
  );
};

export default Index;

