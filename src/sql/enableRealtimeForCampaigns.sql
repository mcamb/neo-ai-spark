
-- Function to enable realtime for campaigns table
CREATE OR REPLACE FUNCTION public.enable_realtime_for_campaigns()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result json;
BEGIN
  -- Enable replica identity full on campaigns table to get the full row data on updates
  EXECUTE 'ALTER TABLE public.campaigns REPLICA IDENTITY FULL';
  
  -- Add the campaigns table to the supabase_realtime publication if it exists
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns';
  EXCEPTION
    WHEN undefined_object THEN
      -- Create the publication if it doesn't exist
      EXECUTE 'CREATE PUBLICATION supabase_realtime FOR TABLE public.campaigns';
  END;
  
  -- Return success message
  result := json_build_object('success', true);
  RETURN result;
END;
$function$;
