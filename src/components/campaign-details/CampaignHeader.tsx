
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface CampaignHeaderProps {
  title: string;
  status: string;
  clientName: string;
  clientLogo?: string;
  country?: string;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  title,
  status,
  clientName,
  clientLogo,
  country
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      {/* Navigation - Proper left alignment */}
      <div className="mb-6">
        <Button variant="ghost" className="pl-0" onClick={() => navigate('/campaigns')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 pb-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            {clientLogo ? (
              <AvatarImage 
                src={clientLogo} 
                alt={clientName}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-gray-700 text-xl">
                {clientName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-black">{title}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-black">
                {clientName}{country ? ` - ${country}` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
