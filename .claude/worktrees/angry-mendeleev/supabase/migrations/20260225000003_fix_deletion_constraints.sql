-- 1. Corregir relación en announcements (permitir borrar al autor)
ALTER TABLE public.announcements 
DROP CONSTRAINT IF EXISTS announcements_author_id_fkey,
ADD CONSTRAINT announcements_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

-- 2. Corregir relación en units (asegurar SET NULL al borrar residente)
ALTER TABLE public.units 
DROP CONSTRAINT IF EXISTS units_resident_id_fkey,
ADD CONSTRAINT units_resident_id_fkey 
  FOREIGN KEY (resident_id) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

-- 3. Asegurar que el perfil se borre si el usuario de Auth se borra (CASCADE ya debería estar, pero lo reforzamos)
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;
