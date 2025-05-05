
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
    throw error;
  }

  console.log("fetchCountries result:", data || []);
  return data || [];
};

// Function to create a new country
export const createCountry = async (countryName: string): Promise<CountryOption> => {
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

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries
  });
};
