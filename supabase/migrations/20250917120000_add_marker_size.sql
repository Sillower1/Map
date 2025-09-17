-- Add size column to markers table for adjustable icon size
ALTER TABLE public.markers
ADD COLUMN IF NOT EXISTS size integer DEFAULT 24;

-- Backfill existing nulls to default (in case DEFAULT doesn't retroactively apply)
UPDATE public.markers SET size = 24 WHERE size IS NULL;

