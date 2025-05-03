
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
  console.log("ClientsList received clients:", clients);
  console.log("ClientsList searchQuery:", searchQuery);
  console.log("ClientsList countryNames:", countryNames);

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.country && countryNames[client.country]?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    client.domain?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  console.log("Filtered clients:", filteredClients);

  if (filteredClients.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-custom-background">
        <div className="text-center">
          <p className="text-gray-500">No clients found matching your search criteria.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new client.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-2">
      {filteredClients.map((client) => (
        <ClientCard 
          key={client.id}
          client={client}
          countryName={client.country && countryNames[client.country] ? countryNames[client.country] : 'Unknown'}
          onDelete={onDeleteClient}
        />
      ))}
    </div>
  );
};

export default ClientsList;
