import React from 'react';
import ClientCard from './ClientCard';
import { Client } from '@/hooks/useClients';
import { countryNames, getCountryName } from '@/utils/clientDataUtils';

interface ClientsListProps {
  clients: Client[];
  searchQuery: string;
  countryNames: Record<string, string>;
  onDeleteClient: (id: string) => void;
  onEditClient: (id: string) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  searchQuery, 
  countryNames, 
  onDeleteClient,
  onEditClient
}) => {
  console.log("ClientsList received clients:", clients);

  // Show all clients when no search query, filter when there is one
  const filteredClients = searchQuery.trim() === "" 
    ? clients
    : clients.filter(client => 
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.country && getCountryName(client.country).toLowerCase().includes(searchQuery.toLowerCase())) ||
        client.domain?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Sort clients by created_at time (newer first)
  const sortedClients = [...filteredClients].sort((a, b) => {
    // If created_at exists, use it for sorting
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    // Otherwise use the id as a fallback
    return a.id < b.id ? 1 : -1;
  });
  
  console.log("Filtered and sorted clients:", sortedClients);

  if (!clients || clients.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 border border-dashed rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No clients found. Database might be empty.</p>
        </div>
      </div>
    );
  }

  if (sortedClients.length === 0) {
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
      {sortedClients.map((client) => {
        const countryName = getCountryName(client.country);
        return (
          <ClientCard 
            key={client.id}
            client={client}
            countryName={countryName}
            onDelete={onDeleteClient}
            onEdit={onEditClient}
          />
        );
      })}
    </div>
  );
};

export default ClientsList;
