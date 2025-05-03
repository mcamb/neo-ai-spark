
import React from 'react';
import ClientsList from './ClientsList';
import { Client } from '@/hooks/useClients';
import { countryNames } from '@/utils/clientDataUtils';
import { Loader, AlertTriangle, RefreshCw } from 'lucide-react';
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
  console.log("ClientsContent error:", error);

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
      <div className="text-center py-10">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
        <p className="text-red-500">Error loading clients: {error.message}</p>
        <Button 
          onClick={refetch} 
          className="mt-4 bg-neo-red hover:bg-red-600 text-white"
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
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
      {clients && clients.length === 0 && (
        <div className="text-center py-6">
          <Button 
            onClick={refetch}
            className="mt-2 bg-neo-red hover:bg-red-600 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientsContent;
