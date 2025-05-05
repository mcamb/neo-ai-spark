
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Loader } from 'lucide-react';

interface ClientStatusBadgeProps {
  status: 'ready' | 'in_progress';
}

const ClientStatusBadge: React.FC<ClientStatusBadgeProps> = ({ status }) => {
  return (
    <Badge 
      variant={status === 'ready' ? 'default' : 'outline'}
      className={`flex items-center gap-1 px-2 py-1 ${
        status === 'ready' ? 'bg-[#94C29D] text-white hover:bg-[#85b38e]' : 'bg-[#FF4B4F] text-white hover:bg-[#e6444a]'
      } border-0`}
    >
      {status === 'ready' ? (
        <>
          <Check className="w-3 h-3" />
          <span>Ready</span>
        </>
      ) : (
        <>
          <Loader className="w-3 h-3 animate-spin" />
          <span>In Progress</span>
        </>
      )}
    </Badge>
  );
};

export default ClientStatusBadge;
