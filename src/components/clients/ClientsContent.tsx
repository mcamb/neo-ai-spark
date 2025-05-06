
import React from 'react';
import ClientsList from './ClientsList';
import { Client } from '@/hooks/useClients';
import { countryNames } from '@/utils/clientDataUtils';
import { Loader, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientsContentProps {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  onDeleteClient: (id: string) => void;
  onEditClient: (id: string) => void;
  refetch: () => void;
}

const ClientsContent: React.FC<ClientsContentProps> = ({
  clients,
  isLoading,
  error,
  searchQuery,
  onDeleteClient,
  onEditClient,
  refetch
}) => {
  console.log("ClientsContent received clients:", clients);
  console.log("ClientsContent isLoading:", isLoading);
  console.log("ClientsContent error:", error);

  // Show loading state only when loading and there are no clients to display
  const showLoadingState = isLoading && (!clients || clients.length === 0);

  if (showLoadingState) {
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

  // Show an empty state when there are no clients
  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-10">
        <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">No clients found</h3>
        <p className="mt-2 text-sm text-gray-500">
          There are no clients in the database yet or there may be an issue accessing them.
        </p>
        <Button 
          onClick={refetch}
          className="mt-4 bg-neo-red hover:bg-red-600 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
        </Button>
      </div>
    );
  }

  // Add a subtle loading indicator when refreshing with existing data
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
          <div className="h-full bg-neo-red animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
      <ClientsList 
        clients={clients} 
        searchQuery={searchQuery} 
        countryNames={countryNames}
        onDeleteClient={onDeleteClient}
        onEditClient={onEditClient}
      />
    </div>
  );
};

export default ClientsContent;
