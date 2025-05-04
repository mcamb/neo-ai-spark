export const countryNames: Record<string, string> = {
  'us': 'United States',
  'uk': 'United Kingdom',
  'ca': 'Canada',
  'au': 'Australia',
  'de': 'Germany',
  'fr': 'France',
  'jp': 'Japan',
  'ge': 'Germany',
  'sp': 'Spain',
  'it': 'Italy',
  'br': 'Brazil',
  'mx': 'Mexico',
  'ch': 'China',
  'in': 'India',
  'ru': 'Russia',
  'so': 'South Africa',
  'ar': 'Argentina',
  'sw': 'Switzerland',
  'ne': 'Netherlands',
  'po': 'Poland',
  'se': 'Sweden',
  'no': 'Norway',
  'fi': 'Finland',
  'be': 'Belgium',
  'gr': 'Greece',
  'tu': 'Turkey',
  'nz': 'New Zealand',
  'sg': 'Singapore',
  'kr': 'South Korea',
  'za': 'South Africa',
  'un': 'United States', // Fallback mapping
  // Generic fallbacks
  'unkn': 'Unknown Country',
  'undefined': 'Unknown',
  '': 'Unknown'
};

// Helper function to get country name safely from the countries object
export const getCountryName = (countryData?: any): string => {
  if (!countryData) return 'Unknown';
  
  if (typeof countryData === 'string') {
    // Legacy support for old code that might pass a country code
    const code = countryData.toLowerCase();
    return countryNames[code] || 'Unknown';
  }
  
  if (countryData.country) {
    // If we have the full country object from the relationship
    return countryData.country;
  }
  
  if (countryData.code) {
    // If we just have the code
    const code = countryData.code.toLowerCase();
    return countryNames[code] || 'Unknown';
  }
  
  return 'Unknown';
};
