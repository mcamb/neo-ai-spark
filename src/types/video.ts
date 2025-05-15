
export type VideoAnalysisData = {
  video_id: string;
  video_title?: string;
  video_craft?: string;
  video_format?: string;
  brand?: string | null;
  country?: string | null;
  channel?: string | null;
  creator?: string | null;
  video_description?: string;
  audience_fit_description?: string | null;
  brand_fit_description?: string | null;
  objective_fit_description?: string | null;
  platform_fit_description?: string | null;
  message_clarity_description?: string | null;
  creative_impact_description?: string | null;
  overall_assessment?: string | null;
  recommendations?: string | null;
}
