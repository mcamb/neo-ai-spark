
import React, { useState, useEffect } from 'react';
import { 
  Sheet,
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader, AlertTriangle } from 'lucide-react';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onSubmit: () => void;
}

const fetchClient = async (clientId: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error) {
    console.error("Error fetching client:", error);
    throw new Error(error.message);
  }

  return data;
};

const EditClientModal: React.FC<EditClientModalProps> = ({ 
  isOpen, 
  onClose, 
  clientId, 
  onSubmit 
}) => {
  const { toast } = useToast();
  const [brand, setBrand] = useState('');
  const [logo, setLogo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client data
  const { 
    data: client,
    isLoading: isLoadingClient,
    error: clientError
  } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => fetchClient(clientId),
    enabled: !!clientId && isOpen,
  });

  // Populate form when client data is available
  useEffect(() => {
    if (client) {
      setBrand(client.brand || '');
      setLogo(client.logo || '');
    }
  }, [client]);

  // Log any errors
  useEffect(() => {
    if (clientError) {
      toast({
        title: "Error loading client",
        description: `${clientError instanceof Error ? clientError.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  }, [clientError, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand) {
      toast({
        title: "Error",
        description: "Please fill in the brand field",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the client in the database, but only brand and logo
      const { error } = await supabase
        .from('clients')
        .update({
          brand,
          logo: logo || null
        })
        .eq('id', clientId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Client updated successfully"
      });
      
      // Notify parent component and close
      onSubmit();
      onClose();
      
    } catch (error: any) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: `Failed to update client: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Client</SheetTitle>
          <SheetDescription>
            Update client information.
          </SheetDescription>
        </SheetHeader>
        
        {isLoadingClient ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="h-8 w-8 animate-spin text-neo-red" />
          </div>
        ) : clientError ? (
          <div className="text-center py-10">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-red-500">Error loading client information.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input 
                id="brand"
                value={brand} 
                onChange={(e) => setBrand(e.target.value)} 
                required
              />
              <div className="bg-[#E8E5DE] p-3 rounded text-black text-sm">
                Only change the brand name if necessary. But do not change the brand itself. Automations only work when a new client is created.
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Option: Change the logo URL</Label>
              <Input 
                id="logo"
                value={logo} 
                onChange={(e) => setLogo(e.target.value)} 
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-neo-red hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Updating..." : "Update Client"}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EditClientModal;
