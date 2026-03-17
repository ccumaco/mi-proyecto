-- Add phone and display_name to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update the existing fullName mapping if needed (optional, depends on your preference)
-- For now, we'll keep both for compatibility or migrate full_name to display_name
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
        UPDATE public.profiles SET display_name = full_name WHERE display_name IS NULL;
    END IF;
END $$;
