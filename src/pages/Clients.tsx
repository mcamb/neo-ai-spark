
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/MainLayout';
import NewClientModal from '@/components/NewClientModal';
import { Search, Eye, Pencil, Trash2, Check, Loader } from 'lucide-react';
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
        
        {filteredClients.length === 0 ? (
          <div className="flex items-center justify-center p-10 border border-dashed rounded-lg">
            <div className="text-center">
              <p className="text-gray-500">No clients found.</p>
              <p className="text-sm text-gray-400 mt-1">Add a new client to get started.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="overflow-hidden border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium text-xl">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{client.name}</h3>
                        <p className="text-sm text-gray-600">{countryNames[client.country]}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge 
                          variant={client.agent_status === 'ready' ? 'default' : 'outline'}
                          className={`flex items-center gap-1 px-2 py-1 ${
                            client.agent_status === 'ready' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                          } border-0`}
                        >
                          {client.agent_status === 'ready' ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Ready</span>
                            </>
                          ) : (
                            <>
                              <Loader className="w-3 h-3 animate-spin" />
                              <span>In Progress</span>
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
