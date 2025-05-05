
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const CampaignNotFoundMessage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-3xl font-bold text-gray-800">Campaign Not Found</h2>
        <p className="text-gray-600 text-lg">The campaign you are looking for does not exist or has been removed.</p>
      </div>
      
      <Button 
        onClick={() => navigate('/campaigns')}
        variant="default"
        className="flex items-center gap-2 px-6 py-2 text-base"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Campaigns
      </Button>
    </div>
  );
};
