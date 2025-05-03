
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Rocket, FlaskConical } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import LogoIcon from '@/components/LogoIcon';
import { useNavigate } from 'react-router-dom';

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
  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer border border-[#E8E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.05)]" 
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="bg-[#E8E5DE] p-3 rounded-full mb-4">
          <Icon size={24} className="text-neo-red" />
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const cta_items = [
  {
    title: "Create a Client",
    description: "Add new clients and manage their social media presence.",
    icon: UserPlus,
    path: "/clients"
  },
  {
    title: "Create a Campaign",
    description: "Launch powerful social media campaigns with AI-driven insights.",
    icon: Rocket,
    path: "/campaigns"
  },
  {
    title: "Create a Lab",
    description: "Experiment with new content strategies and AI-powered tools.",
    icon: FlaskConical,
    path: "/lab"
  }
];

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-gray-600">
              Ready to supercharge your social media automation with NEO AI?
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <LogoIcon className="w-24 h-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cta_items.map((item, index) => (
            <CTACard 
              key={index}
              title={item.title} 
              description={item.description} 
              icon={item.icon} 
              onClick={() => navigate(item.path)} 
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
