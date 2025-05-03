
import React from 'react';
import ClientCard from './ClientCard';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredClients.map((client) => (
        <ClientCard 
          key={client.id} 
          client={client} 
          countryName={countryNames[client.country]} 
          onDelete={onDeleteClient}
        />
      ))}
    </div>
  );
};

export default ClientsList;
