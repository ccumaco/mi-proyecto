-- 1. LIMPIEZA ABSOLUTA
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  phone TEXT, -- Usaremos solo 'phone'
  nit TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TRIGGER ROBUSTO QUE BUSCA EN TODAS LAS CLAVES POSIBLES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
DECLARE
  extracted_phone TEXT;
BEGIN
  -- Intentar extraer el teléfono de cualquier clave posible que el frontend envíe
  extracted_phone := COALESCE(
    NEW.raw_user_meta_data->>'phone', 
    NEW.raw_user_meta_data->>'celular',
    NEW.phone -- Campo nativo si existiera
  );

  -- Sincronizar con el campo nativo de auth.users (usando una técnica más segura)
  IF extracted_phone IS NOT NULL THEN
    BEGIN
      UPDATE auth.users SET phone = extracted_phone WHERE id = NEW.id;
    EXCEPTION WHEN OTHERS THEN
      -- Si falla el update nativo, al menos seguimos con el perfil
    END;
  END IF;

  -- Insertar en profiles
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    display_name, 
    phone, 
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    extracted_phone,
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    display_name = EXCLUDED.display_name;

  RETURN NEW;
END;
$$;

-- 3. RE-VINCULAR
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
