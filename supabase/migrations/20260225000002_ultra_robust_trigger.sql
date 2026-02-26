-- Trigger ultra-robusto: Asegura que el usuario siempre se cree
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  clean_celular TEXT;
  clean_nit TEXT;
BEGIN
  -- 1. Limpieza de Celular
  clean_celular := regexp_replace(COALESCE(NEW.raw_user_meta_data->>'celular', NEW.raw_user_meta_data->>'phone', ''), '\s+', '', 'g');
  IF clean_celular = '' THEN clean_celular := NULL; END IF;

  -- 2. Limpieza de NIT (si es cadena vacía, lo pasamos a NULL para no romper el Check)
  clean_nit := NEW.raw_user_meta_data->>'nit';
  IF clean_nit = '' THEN clean_nit := NULL; END IF;

  -- 3. Insert con ON CONFLICT por si el perfil ya existe (evita errores de duplicidad)
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    display_name, 
    celular, 
    nit,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    clean_celular,
    clean_nit,
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Fallback absoluto: Si todo lo anterior falla, inserta lo mínimo vital
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, 'Usuario Nuevo', 'resident')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
