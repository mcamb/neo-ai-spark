
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Rocket, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import LogoIcon from './LogoIcon';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavItem = ({ 
    to, 
    icon: Icon, 
    label 
  }: { 
    to: string; 
    icon: React.ElementType; 
    label: string 
  }) => {
    const active = isActive(to);
    
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
          active 
            ? "text-white bg-neo-red" 
            : "text-gray-700 hover:bg-neo-lightgray"
        )}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="sticky top-0 h-screen w-64 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-6 flex items-center gap-2 border-b border-gray-100">
        <LogoIcon />
        <span className="font-semibold text-xl text-neo-black">NEO AI</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavItem to="/home" icon={Home} label="Home" />
        <NavItem to="/clients" icon={Users} label="Clients" />
        <NavItem to="/campaigns" icon={Rocket} label="Campaigns" />
        <NavItem to="/lab" icon={FlaskConical} label="Lab" />
      </nav>
    </aside>
  );
};

export default Sidebar;
