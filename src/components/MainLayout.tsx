
import React from 'react';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface User {
  firstName: string;
  lastName: string;
}

// This would be replaced with actual user authentication in a real app
const getCurrentUser = (): User => {
  // Hard-coded for now, but would be replaced with actual user data
  return {
    firstName: 'Marcus',
    lastName: 'Ambrus'
  };
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const user = getCurrentUser();
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1">
        <header className="border-b border-gray-100 p-4 flex justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{fullName}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
