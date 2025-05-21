
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  Home, 
  PieChart, 
  BarChart, 
  Target, 
  PlusCircle, 
  Settings,
  Menu,
  X,
  LogOut,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import ExpenseForm from '@/components/ExpenseForm';

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
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 bg-white shadow-lg z-40 transition-all duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className={cn(
            "p-4 border-b flex items-center",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}>
            {!sidebarCollapsed ? (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-budget-primary">MoneyMaven</h1>
                  <p className="text-xs text-gray-500">Finance Tracker</p>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <ChevronLeft size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <NavItem 
              icon={<Home size={18} />} 
              label="Dashboard"
              href="#dashboard" 
              active={hash === 'dashboard'}
              onClick={() => handleNavigate('dashboard')}
              collapsed={sidebarCollapsed}
            />
            <NavItem 
              icon={<PieChart size={18} />} 
              label="Expenses"
              href="#expenses" 
              active={hash === 'expenses'}
              onClick={() => handleNavigate('expenses')}
              collapsed={sidebarCollapsed}
            />
            <NavItem 
              icon={<DollarSign size={18} />} 
              label="Income"
              href="#income" 
              active={hash === 'income'}
              onClick={() => handleNavigate('income')}
              collapsed={sidebarCollapsed}
            />
            <NavItem 
              icon={<BarChart size={18} />} 
              label="Reports"
              href="#reports" 
              active={hash === 'reports'}
              onClick={() => handleNavigate('reports')}
              collapsed={sidebarCollapsed}
            />
            <NavItem 
              icon={<Target size={18} />} 
              label="Budget Goals"
              href="#budgets" 
              active={hash === 'budgets'}
              onClick={() => handleNavigate('budgets')}
              collapsed={sidebarCollapsed}
            />
          </nav>

          {/* Bottom actions */}
          <div className={cn(
            "p-4 border-t space-y-2",
            sidebarCollapsed && "flex flex-col items-center"
          )}>
            {!sidebarCollapsed && (
              <button 
                className="w-full text-gray-500 py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-md"
                onClick={() => handleNavigate('settings')}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            )}
            {sidebarCollapsed ? (
              <button 
                className="text-gray-500 p-2 hover:bg-gray-50 rounded-md w-10 h-10 flex items-center justify-center"
                onClick={() => handleNavigate('settings')}
              >
                <Settings size={18} />
              </button>
            ) : null}
            
            {!sidebarCollapsed && (
              <button 
                className="w-full text-red-500 py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-md"
                onClick={handleSignOut}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            )}
            {sidebarCollapsed ? (
              <button 
                className="text-red-500 p-2 hover:bg-gray-50 rounded-md w-10 h-10 flex items-center justify-center"
                onClick={handleSignOut}
              >
                <LogOut size={18} />
              </button>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Add Expense Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, active, onClick, collapsed }) => {
  return (
    <a 
      href={href} 
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        collapsed ? "justify-center" : "",
        active ? "bg-budget-primary/10 text-budget-primary font-medium" : "text-gray-600 hover:bg-gray-100"
      )}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </a>
  );
};

export default Layout;
