
import React from 'react';
import { ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import ClientStatusBadge from './ClientStatusBadge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

interface ClientsListProps {
  clients: Client[];
  searchQuery: string;
  countryNames: Record<string, string>;
  onDeleteClient: (id: string) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  searchQuery, 
  countryNames, 
  onDeleteClient 
}) => {
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    countryNames[client.country]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filteredClients.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-custom-background">
        <div className="text-center">
          <p className="text-gray-500">No clients found.</p>
          <p className="text-sm text-gray-400 mt-1">Add a new client to get started.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-2">
      {filteredClients.map((client) => (
        <div 
          key={client.id}
          className="flex items-center justify-between p-4 rounded-lg bg-custom-background shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-md border border-white">
              <span className="text-xl font-medium">{client.name.charAt(0)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-medium text-lg">{client.name}</span>
              <Badge variant="outline" className="text-xs w-fit mt-1 bg-white text-gray-700 border border-gray-200">
                {countryNames[client.country]}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to={client.agent_status === 'ready' ? `/clients/${client.id}` : '#'}>
              <Button 
                variant="default" 
                className="bg-custom-accent text-white hover:bg-custom-accent/90"
              >
                Open
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="border-gray-200 bg-white">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="10" r="1.5" fill="#333"/>
                <circle cx="10" cy="10" r="1.5" fill="#333"/>
                <circle cx="16" cy="10" r="1.5" fill="#333"/>
              </svg>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsList;
