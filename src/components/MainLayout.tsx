
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

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [agencyName, setAgencyName] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }
      
      if (session.user) {
        setEmail(session.user.email || '');
        
        // Try to fetch colleague information including first_name and last_name
        try {
          const { data: colleagueData, error } = await supabase
            .from('colleagues')
            .select('first_name, last_name, agency_id, agencies(name)')
            .eq('id', session.user.id)
            .single();
          
          if (colleagueData) {
            if (colleagueData.agencies) {
              setAgencyName(colleagueData.agencies.name);
            }
            
            if (colleagueData.first_name && colleagueData.last_name) {
              setFullName(`${colleagueData.first_name} ${colleagueData.last_name}`);
            }
          }
        } catch (err) {
          console.error('Error fetching colleague data:', err);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/');
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
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
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1">
        <header className="border-b border-gray-100 p-4">
          <div className="flex items-center justify-end max-w-5xl w-full mx-auto">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 outline-none">
                <span className="text-sm font-medium">Account</span>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="" alt={fullName || "User"} />
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5">
                  {fullName && (
                    <p className="font-normal text-black">{fullName}</p>
                  )}
                  {agencyName && (
                    <p className="text-xs text-muted-foreground">{agencyName}</p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
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
