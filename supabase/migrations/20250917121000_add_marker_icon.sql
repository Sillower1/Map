-- Add icon column to markers table to store chosen icon key
ALTER TABLE public.markers
ADD COLUMN IF NOT EXISTS icon text;

-- Optional: set a sensible default for existing rows
UPDATE public.markers SET icon = COALESCE(icon, 'map-pin');

-- Refresh PostgREST schema cache (run in SQL editor if needed)
-- notify pgrst, 'reload schema';

