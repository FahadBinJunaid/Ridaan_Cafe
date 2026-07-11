-- Enable Realtime for the orders table so new-INSERT alerts work
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
