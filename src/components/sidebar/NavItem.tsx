
import React from 'react';
import { cn } from '@/lib/utils';

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

export default NavItem;
