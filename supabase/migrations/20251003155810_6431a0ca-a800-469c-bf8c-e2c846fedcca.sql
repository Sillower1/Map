-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_public_faculty_members();

-- Add new columns to faculty_members table
ALTER TABLE public.faculty_members 
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS contact_info TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create the function with the new return type
CREATE FUNCTION public.get_public_faculty_members()
RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  department TEXT,
  office TEXT,
  image_url TEXT,
  education TEXT,
  specialization TEXT,
  contact_info TEXT,
  category TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    name,
    title,
    department,
    office,
    image_url,
    education,
    specialization,
    contact_info,
    category,
    display_order,
    created_at,
    updated_at
  FROM public.faculty_members
  ORDER BY display_order ASC, name ASC;
$$;