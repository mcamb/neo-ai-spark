
-- Enable replica identity on clients table to get the full row data on updates
ALTER TABLE clients REPLICA IDENTITY FULL;

-- Add the clients table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE clients;

-- Add a helper function to check if a table is already in a publication
CREATE OR REPLACE FUNCTION public.check_table_in_publication(
  table_name text,
  publication_name text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = publication_name
    AND schemaname = 'public'
    AND tablename = table_name
  ) INTO table_exists;
  
  RETURN json_build_object('exists', table_exists);
END;
$$;
