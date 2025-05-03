
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundMessage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
      </div>
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg">
        <div className="text-center">
          <p className="text-gray-500">Client not found.</p>
          <p className="text-sm text-gray-400 mt-1">The requested client could not be found.</p>
        </div>
      </div>
    </div>
  );
};
