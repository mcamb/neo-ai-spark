
import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ClientForm from './ClientForm';
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
  const [countryId, setCountryId] = useState('');
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [isCreatingCountry, setIsCreatingCountry] = useState(false);

  const { 
    data: countries = [], 
    isLoading: isLoadingCountries,
    refetch: refetchCountries,
    error: countriesError
  } = useCountries();

  const handleAddClient = async (clientData: any) => {
    try {
      await onSubmit(clientData);
      setCountryId('');
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
          
          <ClientForm 
            onSubmit={handleAddClient}
            isSubmitting={isSubmitting}
            onAddCountry={() => setIsAddingCountry(true)}
            countryId={countryId}
            onCountryChange={handleSelectChange}
            isLoadingCountries={isLoadingCountries}
            countriesError={countriesError as Error | null}
            countries={countries}
          />
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
