
import React from 'react';
import ClientsList from './ClientsList';
import { Client } from '@/hooks/useClients';
import { countryNames } from '@/utils/clientDataUtils';
import { Loader, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientsContentProps {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  onDeleteClient: (id: string) => void;
  refetch: () => void;
}

const ClientsContent: React.FC<ClientsContentProps> = ({
  clients,
  isLoading,
  error,
  searchQuery,
  onDeleteClient,
  refetch
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
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p>Error loading clients: {error.message}</p>
        <div className="mt-4 text-sm text-gray-500">
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-w-full">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
        <Button onClick={refetch} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-dashed">
        <p className="text-gray-500">No clients found in the database.</p>
        <Button 
          onClick={refetch}
          className="mt-6 bg-neo-red hover:bg-red-600 text-white"
        >
          Refresh Data
        </Button>
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
