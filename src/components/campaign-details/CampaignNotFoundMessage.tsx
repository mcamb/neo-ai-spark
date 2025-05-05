
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const CampaignNotFoundMessage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Campaign Not Found</h2>
        <p className="text-gray-600">The campaign you are looking for does not exist or has been removed.</p>
        <Button 
          onClick={() => navigate('/campaigns')}
          className="mt-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Campaigns
        </Button>
      </div>
    </div>
  );
};
