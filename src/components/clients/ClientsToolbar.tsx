
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface ClientsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClient: () => void;
  isDisabled?: boolean;
}

const ClientsToolbar: React.FC<ClientsToolbarProps> = ({ 
  searchQuery, 
  onSearchChange,
  onAddClient,
  isDisabled = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="w-full sm:max-w-xs">
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
          disabled={isDisabled}
        />
      </div>
      <Button 
        onClick={onAddClient}
        className="bg-neo-red hover:bg-red-600 text-white"
        disabled={isDisabled}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Client
      </Button>
    </div>
  );
};

export default ClientsToolbar;
