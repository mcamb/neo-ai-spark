
import React from 'react';
import { ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import ClientStatusBadge from './ClientStatusBadge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg">
        <div className="text-center">
          <p className="text-gray-500">No clients found.</p>
          <p className="text-sm text-gray-400 mt-1">Add a new client to get started.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {filteredClients.map((client) => (
        <div 
          key={client.id}
          className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-md transition-colors"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 bg-gray-100">
              <AvatarFallback className="text-gray-700">
                {client.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col min-w-[180px]">
              <span className="font-medium">{client.name}</span>
              <span className="text-sm text-gray-600">{countryNames[client.country]}</span>
            </div>
            
            <ClientStatusBadge status={client.agent_status} />
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              disabled={client.agent_status !== 'ready'}
              className={`${client.agent_status !== 'ready' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDeleteClient(client.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <ChevronRight className="h-4 w-4 text-gray-400 ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsList;
