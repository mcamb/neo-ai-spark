
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ClientsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClient: () => void;
}

const ClientsToolbar: React.FC<ClientsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onAddClient
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Type here to search" 
          className="pl-10 border-gray-300 focus:border-neo-red focus:ring-neo-red" 
          value={searchQuery} 
          onChange={e => onSearchChange(e.target.value)} 
        />
      </div>
      <Button 
        onClick={onAddClient} 
        className="bg-neo-red hover:bg-red-600 text-white"
      >
        Add client
      </Button>
    </div>
  );
};

export default ClientsToolbar;
