
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import AddExpenseSheet from './expenses/AddExpenseSheet';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const hash = location.hash.slice(1) || 'dashboard';

  useEffect(() => {
    // Check authentication state
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        navigate('/auth');
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleNavigate = (route: string) => {
    window.location.hash = route;
  };

  if (!user) return null; // Prevent rendering until auth state is determined

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow"
        >
          {sidebarOpen ? (
            <X size={20} className="text-gray-500" />
          ) : (
            <Menu size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        currentHash={hash}
        setSidebarCollapsed={setSidebarCollapsed}
        handleNavigate={handleNavigate}
        handleSignOut={handleSignOut}
      />

      {/* Add Expense Sheet */}
      <AddExpenseSheet open={sheetOpen} onOpenChange={setSheetOpen} />

      {/* Main content */}
      <main className={cn(
        "transition-all duration-300 ease-in-out min-h-screen",
        sidebarOpen && !sidebarCollapsed ? "lg:ml-64" : (sidebarCollapsed ? "lg:ml-20" : "ml-0")
      )}>
        <div className="p-4 md:p-8">
          {/* Add Expense button for Expenses tab */}
          {hash === 'expenses' && (
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setSheetOpen(true)}
                className="bg-budget-primary hover:bg-budget-primary/90 text-white rounded-md py-2 px-4 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                <span>Add Expense</span>
              </button>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
