
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface ColleagueData {
  id: string;
  first_name: string;
  last_name: string;
  agency_id: string;
  agency_name?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [colleagueData, setColleagueData] = useState<ColleagueData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchColleagueData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch colleague data that matches the auth user ID
          const { data, error } = await supabase
            .from('colleagues')
            .select('id, first_name, last_name, agency_id, agencies(name)')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching colleague data:', error);
            return;
          }
          
          if (data) {
            setColleagueData({
              id: data.id,
              first_name: data.first_name,
              last_name: data.last_name,
              agency_id: data.agency_id,
              agency_name: data.agencies?.name
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchColleagueData();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
      navigate('/'); // Navigate to the home/login page
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
    }
  };
  
  const fullName = colleagueData ? `${colleagueData.first_name} ${colleagueData.last_name}` : '';
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1">
        <header className="border-b border-gray-100 p-4">
          <div className="flex items-center max-w-5xl w-full mx-auto px-6">
            <div className="flex-1"></div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 outline-none">
                <span className="text-sm font-medium">Account</span>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="" alt={fullName} />
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5">
                  <p className="font-medium">{fullName}</p>
                  {colleagueData?.agency_name && (
                    <p className="text-xs text-muted-foreground">{colleagueData.agency_name}</p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/account')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
