
import React from 'react';
import ClientsList from './ClientsList';
import { Client, addTestClient } from '@/hooks/useClients';
import { countryNames } from '@/utils/clientDataUtils';
import { Loader, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  console.log("ClientsContent received clients:", clients);
  console.log("ClientsContent isLoading:", isLoading);

  const handleAddTestClient = async () => {
    try {
      await addTestClient();
      toast({
        title: "Test Client Added",
        description: "A test client has been added to the database"
      });
      refetch(); // Refresh the client list
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add test client: ${error.message}`,
        variant: "destructive"
      });
    }
  };

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
        <p className="text-sm mt-2">Please check your database connection and try again.</p>
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
        <p className="text-sm text-gray-400 mt-1">Add a new client by clicking the "Add client" button.</p>
        <div className="mt-6">
          <Button 
            onClick={handleAddTestClient}
            className="bg-neo-red hover:bg-red-600 text-white"
          >
            Add Test Client
          </Button>
        </div>
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
