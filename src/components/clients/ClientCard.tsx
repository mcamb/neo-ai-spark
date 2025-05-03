
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import ClientStatusBadge from './ClientStatusBadge';
import { Link } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  country: string;
  domain: string;
  logo?: string;
  agent_status: 'ready' | 'in_progress';
}

interface ClientCardProps {
  client: Client;
  countryName: string;
  onDelete: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, countryName, onDelete }) => {
  return (
    <Card className="overflow-hidden border border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium text-xl">
              {client.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-lg">{client.name}</h3>
              <p className="text-sm text-gray-600">{countryName}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <ClientStatusBadge status={client.agent_status} />
            </div>
            <div className="flex gap-2">
              <Link to={client.agent_status === 'ready' ? `/clients/${client.id}` : '#'}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={client.agent_status !== 'ready'}
                  className={`${client.agent_status !== 'ready' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete(client.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
