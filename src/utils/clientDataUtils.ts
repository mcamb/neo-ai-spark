
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

// Helper function to get country name safely
export const getCountryName = (countryCode?: string): string => {
  if (!countryCode) return 'Unknown';
  
  const code = countryCode.toLowerCase();
  return countryNames[code] || 'Unknown';
};
