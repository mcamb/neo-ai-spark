
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CountrySelector from './CountrySelector';
import { Loader } from 'lucide-react';

interface ClientFormProps {
  onSubmit: (clientData: any) => Promise<void>;
  isSubmitting: boolean;
  onAddCountry: () => void;
  countryId: string;
  onCountryChange: (value: string) => void;
  isLoadingCountries: boolean;
  countriesError: Error | null;
  countries: Array<{ id: string; country: string }>;
}

const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  isSubmitting,
  onAddCountry,
  countryId,
  onCountryChange,
  isLoadingCountries,
  countriesError,
  countries
}) => {
  const [brand, setBrand] = useState('');
  const [domain, setDomain] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand || !countryId || !domain) {
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
      setDomain('');
      
    } catch (error: any) {
      console.error("Error handling form submission:", error);
    }
  };

  return (
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
          onCountryChange={onCountryChange}
          isLoadingCountries={isLoadingCountries}
          countriesError={countriesError}
          countries={countries}
          onAddCountryClick={onAddCountry}
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
  );
};

export default ClientForm;
