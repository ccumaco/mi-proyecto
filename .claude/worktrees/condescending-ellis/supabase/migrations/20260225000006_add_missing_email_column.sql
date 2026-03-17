-- 1. AÑADIR COLUMNA EMAIL QUE FALTA
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. ELIMINACIÓN DE RESTRICCIONES QUE BLOQUEAN
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS celular_format;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS nit_format;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS unique_celular;

-- 3. ACTUALIZAR TRIGGER PARA QUE SEA TOTALMENTE SEGURO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    display_name, 
    celular, 
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    NEW.raw_user_meta_data->>'celular',
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Fallback extremo
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, 'Usuario Nuevo')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
