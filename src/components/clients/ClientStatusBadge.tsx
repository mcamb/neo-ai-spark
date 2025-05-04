
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
        status === 'ready' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-amber-500 text-white hover:bg-amber-600'
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
