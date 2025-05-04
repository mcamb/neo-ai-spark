
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';

interface CampaignStatusBadgeProps {
  status: 'active' | 'draft' | 'completed';
}

const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  return (
    <Badge 
      variant={status === 'active' ? 'default' : 'outline'}
      className={`flex items-center gap-1 px-2 py-1 ${
        status === 'active' 
          ? 'bg-green-600 text-white hover:bg-green-700' 
          : status === 'draft' 
            ? 'bg-amber-500 text-white hover:bg-amber-600'
            : 'bg-gray-500 text-white hover:bg-gray-600'
      } border-0`}
    >
      {status === 'active' ? (
        <>
          <Check className="w-3 h-3" />
          <span>Active</span>
        </>
      ) : status === 'draft' ? (
        <>
          <Clock className="w-3 h-3" />
          <span>Draft</span>
        </>
      ) : (
        <>
          <Check className="w-3 h-3" />
          <span>Completed</span>
        </>
      )}
    </Badge>
  );
};

export default CampaignStatusBadge;
