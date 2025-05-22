
import React from 'react';
import { 
  Home, 
  PieChart, 
  BarChart, 
  Target,
  DollarSign
} from 'lucide-react';
import NavItem from './NavItem';

interface SidebarNavProps {
  currentHash: string;
  collapsed: boolean;
  handleNavigate: (route: string) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ currentHash, collapsed, handleNavigate }) => {
  return (
    <nav className="flex-1 p-4 space-y-1">
      <NavItem 
        icon={<Home size={18} />} 
        label="Dashboard"
        href="#dashboard" 
        active={currentHash === 'dashboard'}
        onClick={() => handleNavigate('dashboard')}
        collapsed={collapsed}
      />
      <NavItem 
        icon={<PieChart size={18} />} 
        label="Expenses"
        href="#expenses" 
        active={currentHash === 'expenses'}
        onClick={() => handleNavigate('expenses')}
        collapsed={collapsed}
      />
      <NavItem 
        icon={<DollarSign size={18} />} 
        label="Income"
        href="#income" 
        active={currentHash === 'income'}
        onClick={() => handleNavigate('income')}
        collapsed={collapsed}
      />
      <NavItem 
        icon={<BarChart size={18} />} 
        label="Reports"
        href="#reports" 
        active={currentHash === 'reports'}
        onClick={() => handleNavigate('reports')}
        collapsed={collapsed}
      />
      <NavItem 
        icon={<Target size={18} />} 
        label="Budget Goals"
        href="#budgets" 
        active={currentHash === 'budgets'}
        onClick={() => handleNavigate('budgets')}
        collapsed={collapsed}
      />
    </nav>
  );
};

export default SidebarNav;
