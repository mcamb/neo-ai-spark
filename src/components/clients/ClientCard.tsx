
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import ClientStatusBadge from './ClientStatusBadge';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Client } from '@/hooks/useClients';

interface ClientCardProps {
  client: Client;
  countryName: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, countryName, onDelete, onEdit }) => {
  const isInProgress = client.agent_status === 'in_progress';
  
  return (
    <Card className="overflow-hidden border border-[#E8E5DE] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="flex items-center flex-1">
            <Avatar className="w-10 h-10 flex-shrink-0">
              {client.logo ? (
                <AvatarImage 
                  src={client.logo} 
                  alt={client.brand}
                  className="object-cover p-1.5"
                  style={{
                    objectFit: client.logo.includes('kitkat') ? 'contain' : 'cover',
                    padding: client.logo.includes('kitkat') ? '1.5px' : '0',
                  }}
                />
              ) : (
                <AvatarFallback>
                  {client.brand.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="ml-4">
              <div className="flex items-center gap-4">
                <h3 className="font-medium text-lg">{client.brand}</h3>
                <Badge variant="outline" className="text-xs w-fit bg-white text-gray-700 border border-gray-200">
                  {countryName}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <ClientStatusBadge status={client.agent_status} />
            <div className="flex items-center gap-2 ml-4">
              <Link to={isInProgress ? '#' : `/clients/${client.id}`}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`hover:bg-gray-100 ${isInProgress ? 'opacity-30 cursor-not-allowed' : ''}`}
                  disabled={isInProgress}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`hover:bg-gray-100 ${isInProgress ? 'opacity-30 cursor-not-allowed' : ''}`}
                onClick={() => !isInProgress && onEdit(client.id)}
                disabled={isInProgress}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`hover:bg-gray-100 ${isInProgress ? 'opacity-30 cursor-not-allowed' : ''}`}
                onClick={() => !isInProgress && onDelete(client.id)}
                disabled={isInProgress}
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
