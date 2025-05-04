
import { ClientDetails, SocialMediaScore } from '@/models/clientDetails';

/**
 * Transform raw database client data into the ClientDetails format
 * @param clientData Raw client data from database
 * @param scoresData Social media scores data from database
 * @returns Formatted ClientDetails object
 */
export const transformClientData = (
  clientData: any, 
  scoresData: any[] | null
): ClientDetails => {
  // Transform the scores data into the format our frontend expects
  const socialMediaScores = scoresData?.map(score => ({
    platform: score.channels.channel,
    score: score.score,
    rationale: score.rationale || ''
  })) || [];
  
  // Extract country info from the countries relationship
  const countryInfo = clientData.countries || {};
  // Get country name from the relationship if available, otherwise default to "us"
  const country = countryInfo.country || "United States"; 
  
  // Build the client details object from the database data
  return {
    id: clientData.id,
    name: clientData.brand,
    country: country,
    domain: clientData.domain,
    logo: clientData.logo,
    description: clientData.profile || "Client details from database",
    brandPromise: clientData.brand_promise || "Brand promise not available.",
    brandChallenge: clientData.brand_challenge || "Brand challenge not available.",
    targetAudience: {
      b2c: {
        primary: clientData.primary_audience_b2c || "No B2C primary audience defined.",
        secondary: clientData.secondary_audience_b2c || "No B2C secondary audience defined."
      },
      b2b: {
        primary: clientData.primary_audience_b2b || "No B2B primary audience defined.",
        secondary: clientData.secondary_audience_b2b || "No B2B secondary audience defined."
      }
    },
    socialMediaScores: socialMediaScores.length > 0 ? socialMediaScores : [
      // Fallback scores if none found in database
      {
        platform: "LinkedIn",
        score: 80,
        rationale: "Professional platform matches well with business focus."
      },
      {
        platform: "Instagram",
        score: 60,
        rationale: "Visual platform provides good engagement opportunities."
      },
      {
        platform: "Facebook",
        score: 55,
        rationale: "Wide audience reach but declining organic engagement."
      },
      {
        platform: "Twitter",
        score: 45,
        rationale: "Good for quick updates but limited engagement depth."
      }
    ]
  };
};
