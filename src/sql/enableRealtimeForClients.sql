
-- Enable replica identity on clients table to get the full row data on updates
ALTER TABLE clients REPLICA IDENTITY FULL;

-- Add the clients table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
