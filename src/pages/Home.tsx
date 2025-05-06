
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Rocket, FlaskConical } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import LogoIcon from '@/components/LogoIcon';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const CTACard = ({
  title,
  description,
  icon: Icon,
  onClick
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}) => {
  return <Card className="hover:shadow-md transition-all cursor-pointer border border-[#E8E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.05)]" onClick={onClick}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="bg-[#E8E5DE] p-3 rounded-full mb-4">
          <Icon size={24} className="text-neo-red" />
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-custom-text">{description}</p>
      </CardContent>
    </Card>;
};

const cta_items = [
  {
    title: "Clients",
    description: "Start by creating clients and discover valuable insights.",
    icon: UserPlus,
    path: "/clients"
  }, 
  {
    title: "Campaigns",
    description: "Create campaigns and receive valuable recommendations.",
    icon: Rocket,
    path: "/campaigns"
  }, 
  {
    title: "Lab",
    description: "Analyze your campaigns or generate content.",
    icon: FlaskConical,
    path: "/lab"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchColleagueData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch colleague data that matches the auth user ID
          const { data, error } = await supabase
            .from('colleagues')
            .select('first_name')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching colleague data:', error);
            return;
          }
          
          if (data) {
            setFirstName(data.first_name);
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
  
  return <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold pb-2">Hi {firstName || 'there'}!</h1>
            <p className="text-custom-text">
              Welcome to NEO AI - our very own AI platform.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <LogoIcon className="w-24 h-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cta_items.map((item, index) => <CTACard key={index} title={item.title} description={item.description} icon={item.icon} onClick={() => navigate(item.path)} />)}
        </div>
      </div>
    </MainLayout>;
};

export default Home;
