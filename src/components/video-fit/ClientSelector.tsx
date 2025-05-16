
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Define proper types based on the database schema
type Client = {
  id: string;
  brand: string;
  country: string;
};

type ClientSelectorProps = {
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  disabled?: boolean;
  required?: boolean;
};

const ClientSelector: React.FC<ClientSelectorProps> = ({ 
  selectedClientId, 
  setSelectedClientId,
  disabled = false,
  required = false
}) => {
  // Fetch clients - using 'brand' instead of 'name'
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, brand, country')
        .order('brand');
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="client">
        Client
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select 
        value={selectedClientId} 
        onValueChange={setSelectedClientId}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger id="client">
          <SelectValue placeholder="Select a client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.brand} - {client.country || "Global"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
