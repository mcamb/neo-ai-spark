
import React from 'react';
import ClientCard from './ClientCard';
import { Client } from '@/hooks/useClients';
import { countryNames, getCountryName } from '@/utils/clientDataUtils';

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

  // Show all clients when no search query, filter when there is one
  const filteredClients = searchQuery.trim() === "" 
    ? clients
    : clients.filter(client => 
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.country && countryNames[client.country]?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        client.domain?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  console.log("Filtered clients:", filteredClients);

  if (!clients || clients.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No clients found. Database might be empty.</p>
        </div>
      </div>
    );
  }

  if (filteredClients.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No clients found matching your search criteria.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-2">
      {filteredClients.map((client) => {
        const countryName = getCountryName(client.country);
        return (
          <ClientCard 
            key={client.id}
            client={client}
            countryName={countryName}
            onDelete={onDeleteClient}
          />
        );
      })}
    </div>
  );
};

export default ClientsList;
