-- Add color column to markers table
ALTER TABLE public.markers 
ADD COLUMN color TEXT DEFAULT '#6B7280';