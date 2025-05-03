
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MainLayout from '@/components/MainLayout';
import NewClientModal from '@/components/NewClientModal';
import { Search, Eye, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  country: string;
  domain: string;
  logo?: string;
  agent_status: 'ready' | 'in_progress';
}

const countryNames: Record<string, string> = {
  'us': 'United States',
  'uk': 'United Kingdom',
  'ca': 'Canada',
  'au': 'Australia',
  'de': 'Germany',
  'fr': 'France',
  'jp': 'Japan',
};

const ClientsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Acme Corp', country: 'us', domain: 'acme.com', agent_status: 'ready' },
    { id: '2', name: 'Globex Industries', country: 'uk', domain: 'globex.co.uk', agent_status: 'in_progress' },
    { id: '3', name: 'TechFuture', country: 'ca', domain: 'techfuture.ca', agent_status: 'ready' },
  ]);
  
  // For polling the status of in_progress clients
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      // This would be a call to your Supabase database in a real implementation
      // For demo, we'll simulate randomly changing an in_progress client to ready
      const inProgressClients = clients.filter(client => client.agent_status === 'in_progress');
      
      if (inProgressClients.length > 0 && Math.random() > 0.7) {
        const randomClient = inProgressClients[Math.floor(Math.random() * inProgressClients.length)];
        
        setClients(prev => 
          prev.map(client => 
            client.id === randomClient.id 
              ? {...client, agent_status: 'ready' as const} 
              : client
          )
        );
        
        toast({
          title: "Client Ready",
          description: `${randomClient.name} is now ready!`,
        });
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(pollingInterval);
  }, [clients, toast]);
  
  const handleAddClient = (newClient: { name: string; country: string; domain: string }) => {
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      country: newClient.country,
      domain: newClient.domain,
      agent_status: 'in_progress'
    };
    
    setClients([client, ...clients]);
  };
  
  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
    toast({
      title: "Client Deleted",
      description: "The client has been deleted successfully",
    });
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    countryNames[client.country]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-600 mt-1">This is about selecting or creating clients.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-neo-red hover:bg-red-600 text-white"
          >
            New Client
          </Button>
        </div>
        
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No clients found. Add a new client to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium">
                        {client.name.charAt(0)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{countryNames[client.country]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-24 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            client.agent_status === 'ready' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {client.agent_status === 'ready' ? (
                            <ArrowUp className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDown className="w-3 h-3 mr-1" />
                          )}
                          {client.agent_status === 'ready' ? 'Ready' : 'In Progress'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <NewClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddClient} 
      />
    </MainLayout>
  );
};

export default ClientsPage;
