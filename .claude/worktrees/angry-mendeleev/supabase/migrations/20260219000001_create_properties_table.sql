-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nit TEXT,
  address TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  units_count INTEGER DEFAULT 0,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add property_id to units
ALTER TABLE public.units 
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE;

-- Enable RLS for properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies for properties
CREATE POLICY "Properties viewable by their admin" ON public.properties
  FOR SELECT USING (auth.uid() = admin_id);

CREATE POLICY "Admins can update their own property" ON public.properties
  FOR UPDATE USING (auth.uid() = admin_id);
