
import React from 'react';
import ClientsList from './ClientsList';
import { Client } from '@/hooks/useClients';
import { countryNames } from '@/utils/clientDataUtils';
import { Loader } from 'lucide-react';

interface ClientsContentProps {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  onDeleteClient: (id: string) => void;
}

const ClientsContent: React.FC<ClientsContentProps> = ({
  clients,
  isLoading,
  error,
  searchQuery,
  onDeleteClient
}) => {
  console.log("ClientsContent received clients:", clients);
  console.log("ClientsContent isLoading:", isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-6 w-6 animate-spin text-neo-red" />
          <span className="text-gray-500">Loading clients...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading clients: {error.message}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-dashed">
        <p className="text-gray-500">No clients found.</p>
        <p className="text-sm text-gray-400 mt-1">Add a new client by clicking the "Add client" button.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-1">
      <ClientsList 
        clients={clients} 
        searchQuery={searchQuery} 
        countryNames={countryNames} 
        onDeleteClient={onDeleteClient} 
      />
    </div>
  );
};

export default ClientsContent;
