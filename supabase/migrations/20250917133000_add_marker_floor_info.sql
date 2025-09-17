-- Optional floor info text for markers (e.g., "3. Kat - Ofisler")
ALTER TABLE public.markers
ADD COLUMN IF NOT EXISTS floor_info text;

-- Optionally backfill existing with NULL check (no-op)
UPDATE public.markers SET floor_info = floor_info;

-- Refresh PostgREST schema cache manually in SQL editor if necessary:
-- notify pgrst, 'reload schema';

