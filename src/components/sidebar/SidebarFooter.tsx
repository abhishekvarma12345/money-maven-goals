
import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarFooterProps {
  collapsed: boolean;
  onSignOut: () => void;
  onNavigate: (route: string) => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, onSignOut, onNavigate }) => {
  return (
    <div className={cn(
      "p-4 border-t space-y-2",
      collapsed && "flex flex-col items-center"
    )}>
      {!collapsed && (
        <button 
          className="w-full text-gray-500 py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-md"
          onClick={() => onNavigate('settings')}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      )}
      {collapsed && (
        <button 
          className="text-gray-500 p-2 hover:bg-gray-50 rounded-md w-10 h-10 flex items-center justify-center"
          onClick={() => onNavigate('settings')}
        >
          <Settings size={18} />
        </button>
      )}
      
      {!collapsed && (
        <button 
          className="w-full text-red-500 py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-md"
          onClick={onSignOut}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      )}
      {collapsed && (
        <button 
          className="text-red-500 p-2 hover:bg-gray-50 rounded-md w-10 h-10 flex items-center justify-center"
          onClick={onSignOut}
        >
          <LogOut size={18} />
        </button>
      )}
    </div>
  );
};

export default SidebarFooter;
