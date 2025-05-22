
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  currentHash: string;
  setSidebarCollapsed: (collapsed: boolean) => void;
  handleNavigate: (route: string) => void;
  handleSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  sidebarCollapsed,
  currentHash,
  setSidebarCollapsed,
  handleNavigate,
  handleSignOut,
}) => {
  return (
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
                <h1 className="text-2xl font-bold text-budget-primary">Kubeer</h1>
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
        <SidebarNav 
          currentHash={currentHash}
          collapsed={sidebarCollapsed}
          handleNavigate={handleNavigate}
        />

        {/* Footer */}
        <SidebarFooter
          collapsed={sidebarCollapsed}
          onSignOut={handleSignOut}
          onNavigate={handleNavigate}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
