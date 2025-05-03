
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface CountryOption {
  id: string;
  country: string;
}

const fetchCountries = async (): Promise<CountryOption[]> => {
  const { data, error } = await supabase
    .from('countries')
    .select('id, country')
    .order('country');

  if (error) {
    console.error("Error fetching countries:", error);
    throw new Error(error.message);
  }

  console.log("fetchCountries result:", data || []);
  return data || [];
};

// Function to create a new country
const createCountry = async (countryName: string): Promise<CountryOption> => {
  console.log("Creating new country:", countryName);
  
  // Generate a 2-letter code from the country name
  const code = countryName.substring(0, 2).toLowerCase();
  
  const { data, error } = await supabase
    .from('countries')
    .insert({ 
      country: countryName,
      code: code  // Include the required code field
    })
    .select();

  if (error) {
    console.error("Error creating country:", error);
    if (error.message.includes('row-level security policy')) {
      throw new Error("Permission denied: Unable to create country due to database security rules. Please contact your administrator.");
    }
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("No country data returned after creation");
  }

  console.log("Created new country:", data[0]);
  return data[0];
};

interface NewCountryFormProps {
  onSubmit: (countryName: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const NewCountryForm: React.FC<NewCountryFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const form = useForm({
    defaultValues: {
      countryName: '',
    }
  });

  const handleSubmit = async (values: { countryName: string }) => {
    await onSubmit(values.countryName);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="countryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Name</FormLabel>
              <FormControl>
                <Input placeholder="United States" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Country"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: { name: string; country: string; domain: string; country_id: string; logo?: string }) => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [domain, setDomain] = useState('');
  const [logo, setLogo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [isCreatingCountry, setIsCreatingCountry] = useState(false);

  const { 
    data: countries = [], 
    isLoading: isLoadingCountries,
    refetch: refetchCountries,
    error: countriesError
  } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries
  });

  // Log any errors with fetching countries
  useEffect(() => {
    if (countriesError) {
      console.error("Error in countries query:", countriesError);
      toast({
        title: "Error loading countries",
        description: `${countriesError instanceof Error ? countriesError.message : 'Unknown error'}. This may be due to database permissions.`,
        variant: "destructive"
      });
    }
  }, [countriesError, toast]);

  // Log countries when they change
  useEffect(() => {
    console.log("Countries in modal:", countries);
  }, [countries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !countryId || !domain) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Get the country code from the full country name for UI display purposes
    const selectedCountry = countries.find(c => c.id === countryId);
    const countryCode = selectedCountry 
      ? selectedCountry.country.toLowerCase().substring(0, 2)
      : 'us';
    
    onSubmit({ 
      name, 
      country: countryCode,
      domain, 
      country_id: countryId,
      logo: logo || undefined // Only include if provided
    });
    
    // Reset form
    setName('');
    setCountryId('');
    setDomain('');
    setLogo('');
    setIsSubmitting(false);
    onClose();
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
              Add a new client to manage their social media presence.
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name *</Label>
              <Input 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Acme Inc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              {isLoadingCountries ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Loading countries...</span>
                </div>
              ) : countriesError ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Error loading countries</span>
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => setIsAddingCountry(true)}
                    className="w-full"
                  >
                    Add a country manually
                  </Button>
                </div>
              ) : countries.length > 0 ? (
                <Select value={countryId} onValueChange={handleSelectChange} required>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.country}
                      </SelectItem>
                    ))}
                    <SelectItem value="add-new" className="text-neo-red">
                      + Add new country
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    onClick={() => setIsAddingCountry(true)}
                    className="w-full"
                  >
                    Add a country first
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domain">Domain *</Label>
              <Input 
                id="domain"
                value={domain} 
                onChange={(e) => setDomain(e.target.value)} 
                placeholder="example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (Optional)</Label>
              <Input 
                id="logo"
                value={logo} 
                onChange={(e) => setLogo(e.target.value)} 
                placeholder="https://example.com/logo.png"
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
