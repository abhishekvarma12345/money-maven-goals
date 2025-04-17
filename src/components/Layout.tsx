
import React from 'react';
import { 
  Home, 
  PieChart, 
  BarChart, 
  Target, 
  PlusCircle, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
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
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const location = useLocation();
  const hash = location.hash.slice(1) || 'dashboard';

  const handleNavigate = (route: string) => {
    window.location.hash = route;
  };

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
          "fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 transition-transform transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-budget-primary">MoneyMaven</h1>
            <p className="text-xs text-gray-500">Personal Finance Tracker</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <NavItem 
              icon={<Home size={18} />} 
              href="#dashboard" 
              active={hash === 'dashboard'}
              onClick={() => handleNavigate('dashboard')}
            >
              Dashboard
            </NavItem>
            <NavItem 
              icon={<PieChart size={18} />} 
              href="#expenses" 
              active={hash === 'expenses'}
              onClick={() => handleNavigate('expenses')}
            >
              Expenses
            </NavItem>
            <NavItem 
              icon={<BarChart size={18} />} 
              href="#reports" 
              active={hash === 'reports'}
              onClick={() => handleNavigate('reports')}
            >
              Reports
            </NavItem>
            <NavItem 
              icon={<Target size={18} />} 
              href="#budgets" 
              active={hash === 'budgets'}
              onClick={() => handleNavigate('budgets')}
            >
              Budget Goals
            </NavItem>
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t">
            <button 
              className="w-full bg-budget-primary hover:bg-budget-primary/90 text-white rounded-md py-2 px-4 flex items-center justify-center gap-2"
              onClick={() => setSheetOpen(true)}
            >
              <PlusCircle size={18} />
              <span>Add Expense</span>
            </button>
            <button className="w-full mt-2 text-gray-500 py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-md">
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Add Expense Sheet for sidebar button */}
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
        "transition-all duration-200 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, href, children, active, onClick }) => {
  return (
    <a 
      href={href} 
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active ? "bg-budget-primary/10 text-budget-primary font-medium" : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
};

export default Layout;
