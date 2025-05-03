
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import ClientStatusBadge from './ClientStatusBadge';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    <Card className="overflow-hidden border border-[#E8E5DE] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="flex items-center flex-1">
            <Avatar className="w-10 h-10 rounded-md border border-white bg-white text-gray-700 font-medium text-lg">
              {client.logo ? (
                <AvatarImage src={client.logo} alt={client.name} />
              ) : (
                <AvatarFallback>
                  {client.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="ml-4">
              <h3 className="font-medium text-lg">{client.name}</h3>
              <Badge variant="outline" className="text-xs w-fit mt-1 bg-white text-gray-700 border border-gray-200">
                {countryName}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center">
            <ClientStatusBadge status={client.agent_status} />
            <div className="flex items-center gap-2 ml-4">
              <Link to={client.agent_status === 'ready' ? `/clients/${client.id}` : '#'}>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-gray-100"
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
