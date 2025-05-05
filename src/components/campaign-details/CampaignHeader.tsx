
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import CampaignStatusBadge from '@/components/campaigns/CampaignStatusBadge';

interface CampaignHeaderProps {
  title: string;
  status: string;
  clientName: string;
  clientLogo?: string;
  createdAt: string;
  country?: string;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  title,
  status,
  clientName,
  clientLogo,
  createdAt,
  country
}) => {
  const navigate = useNavigate();
  
  // Format date for display
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Properly cast the status to match CampaignStatusBadge's expected types
  const normalizedStatus = status as 'active' | 'draft' | 'completed' | 'Idea' | 'Planned' | 'Running' | 'Finished';
  
  return (
    <>
      {/* Navigation */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => navigate('/campaigns')}>
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
              <CampaignStatusBadge status={normalizedStatus} />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{clientName}</span>
              {country && <span className="text-sm text-gray-600">• {country}</span>}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Created on {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
