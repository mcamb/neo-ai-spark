
export interface SocialMediaScore {
  platform: string;
  score: number;
  rationale: string;
}

export interface TargetAudience {
  b2c: {
    primary: string;
    secondary: string;
  };
  b2b: {
    primary: string;
    secondary: string;
  };
}

export interface ClientDetails {
  id: string;
  name: string;
  country: string;
  domain: string;
  logo?: string;
  description: string;
  brandPromise: string;
  brandChallenge: string;
  targetAudience: TargetAudience;
  socialMediaScores: SocialMediaScore[];
}
