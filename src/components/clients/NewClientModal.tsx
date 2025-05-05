
import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CountrySelector from './CountrySelector';
import NewCountryForm from './NewCountryForm';
import { useCountries, createCountry } from '@/hooks/useCountries';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: any) => Promise<void>;
  isSubmitting?: boolean;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  isSubmitting = false 
}) => {
  const { toast } = useToast();
  const [brand, setBrand] = useState('');
  const [countryId, setCountryId] = useState('');
  const [domain, setDomain] = useState('');
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [isCreatingCountry, setIsCreatingCountry] = useState(false);

  const { 
    data: countries = [], 
    isLoading: isLoadingCountries,
    refetch: refetchCountries,
    error: countriesError
  } = useCountries();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand || !countryId || !domain) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create client data object
      const clientData = {
        brand,
        domain,
        country_id: countryId
      };
      
      // Submit to parent component
      await onSubmit(clientData);
      
      // Reset form
      setBrand('');
      setCountryId('');
      setDomain('');
      
    } catch (error: any) {
      console.error("Error handling form submission:", error);
      toast({
        title: "Error",
        description: `Failed to submit form: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleAddCountry = async (countryName: string) => {
    try {
      setIsCreatingCountry(true);
      const newCountry = await createCountry(countryName);
      await refetchCountries();
      setCountryId(newCountry.id);
      setIsAddingCountry(false);
      toast({
        title: "Success",
        description: `Country "${countryName}" created successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create country: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsCreatingCountry(false);
    }
  };
  
  const handleSelectChange = (value: string) => {
    if (value === 'add-new') {
      setIsAddingCountry(true);
    } else {
      setCountryId(value);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle>New Client</SheetTitle>
            <SheetDescription>
              Please follow the instructions.
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input 
                id="brand"
                value={brand} 
                onChange={(e) => setBrand(e.target.value)} 
                placeholder="Provide one simple brand term, such as BMW"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <CountrySelector
                countryId={countryId}
                onCountryChange={handleSelectChange}
                isLoadingCountries={isLoadingCountries}
                countriesError={countriesError as Error | null}
                countries={countries}
                onAddCountryClick={() => setIsAddingCountry(true)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domain">Domain *</Label>
              <Input 
                id="domain"
                value={domain} 
                onChange={(e) => setDomain(e.target.value)} 
                placeholder="Copy - paste the full URL, example: https://www.bmw.de"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !countryId}
              className="w-full bg-neo-red hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Adding Client..." : "Add Client"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={isAddingCountry} onOpenChange={setIsAddingCountry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Country</DialogTitle>
            <DialogDescription>
              Enter a country name to add to the database.
            </DialogDescription>
          </DialogHeader>
          <NewCountryForm 
            onSubmit={handleAddCountry}
            onCancel={() => setIsAddingCountry(false)}
            isSubmitting={isCreatingCountry}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewClientModal;
