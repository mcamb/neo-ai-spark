
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface CountryOption {
  id: string;
  country: string;
}

interface CountrySelectorProps {
  countryId: string;
  onCountryChange: (value: string) => void;
  isLoadingCountries: boolean;
  countriesError: Error | null;
  countries: CountryOption[];
  onAddCountryClick: () => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countryId,
  onCountryChange,
  isLoadingCountries,
  countriesError,
  countries,
  onAddCountryClick
}) => {
  if (isLoadingCountries) {
    return (
      <div className="flex items-center gap-2">
        <Loader className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-500">Loading countries...</span>
      </div>
    );
  }
  
  if (countriesError) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">Error loading countries</span>
        </div>
        <Button 
          type="button" 
          onClick={onAddCountryClick}
          className="w-full"
        >
          Add a country manually
        </Button>
      </div>
    );
  }
  
  if (countries.length > 0) {
    return (
      <Select value={countryId} onValueChange={onCountryChange} required>
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
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        type="button" 
        onClick={onAddCountryClick}
        className="w-full"
      >
        Add a country first
      </Button>
    </div>
  );
};

export default CountrySelector;
