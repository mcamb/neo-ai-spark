
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import ClientStatusBadge from './ClientStatusBadge';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

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
    <Card className="overflow-hidden border border-[#E8E5DE] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white border border-white text-gray-700 font-medium text-lg">
              {client.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-lg">{client.name}</h3>
              <Badge variant="outline" className="text-xs w-fit mt-1 bg-white text-gray-700 border border-gray-200">
                {countryName}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4">
              <ClientStatusBadge status={client.agent_status} />
            </div>
            <div className="flex items-center gap-2">
              <Link to={client.agent_status === 'ready' ? `/clients/${client.id}` : '#'}>
                <Button variant="outline" size="icon" className="border-gray-200 bg-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="border-gray-200 bg-white">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-gray-200 bg-white"
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
