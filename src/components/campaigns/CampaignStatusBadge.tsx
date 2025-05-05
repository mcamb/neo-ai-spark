
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';

interface CampaignStatusBadgeProps {
  status: 'active' | 'draft' | 'completed' | 'Idea' | 'Planned' | 'Running' | 'Finished';
}

const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  // Always use #E8E5DE background with black text for campaign status
  return (
    <Badge 
      variant="outline"
      className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8E5DE] text-black hover:bg-[#D8D5CE] border-0 whitespace-nowrap"
    >
      {status === 'active' || status === 'Running' ? (
        <>
          <Check className="w-3 h-3" />
          <span>{status}</span>
        </>
      ) : status === 'draft' || status === 'Idea' || status === 'Planned' ? (
        <>
          <Clock className="w-3 h-3" />
          <span>{status}</span>
        </>
      ) : (
        <>
          <Check className="w-3 h-3" />
          <span>{status}</span>
        </>
      )}
    </Badge>
  );
};

export default CampaignStatusBadge;
