
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
    throw new Error(error.message);
  }

  return data || [];
};

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: { name: string; country: string; domain: string; country_id: string }) => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !countryId || !domain) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
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
      country_id: countryId
    });
    
    // Reset form
    setName('');
    setCountryId('');
    setDomain('');
    setIsSubmitting(false);
    onClose();
  };
  
  return (
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
            <Label htmlFor="name">Client Name</Label>
            <Input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Acme Inc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={countryId} onValueChange={setCountryId} required>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCountries ? (
                  <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                ) : (
                  countries.map(country => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.country}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input 
              id="domain"
              value={domain} 
              onChange={(e) => setDomain(e.target.value)} 
              placeholder="example.com"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-neo-red hover:bg-red-600 text-white"
          >
            {isSubmitting ? "Adding Client..." : "Add Client"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default NewClientModal;
