-- Add phone and display_name to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update the existing fullName mapping if needed (optional, depends on your preference)
-- For now, we'll keep both for compatibility or migrate full_name to display_name
UPDATE public.profiles SET display_name = full_name WHERE display_name IS NULL;
