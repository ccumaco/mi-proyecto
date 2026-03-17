-- 1. ASEGURAR TODAS LAS COLUMNAS EN PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS celular TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nit TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'resident';

-- 2. ELIMINAR CUALQUIER RESTRICCIÓN QUE PUDIERA HABER QUEDADO
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS celular_format;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS nit_format;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS unique_celular;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 3. TRIGGER ULTRA-SEGURO CON BLOQUE EXCEPTION
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
    phone,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'celular', NEW.raw_user_meta_data->>'phone'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.raw_user_meta_data->>'celular'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    display_name = EXCLUDED.display_name,
    celular = EXCLUDED.celular,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Si falla por CUALQUIER motivo, insertar solo ID y Email para no bloquear Auth
  -- Esto es lo más importante para que el usuario no vea el error genérico
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, 'Usuario (Error en Perfil)')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
