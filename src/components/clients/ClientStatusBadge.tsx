
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
        status === 'ready' ? 'bg-custom-status text-green-800 hover:bg-custom-status' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
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
