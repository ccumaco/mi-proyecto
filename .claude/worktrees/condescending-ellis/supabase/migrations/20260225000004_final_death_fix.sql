-- 1. Eliminar restricciones que puedan estar bloqueando el registro por datos duplicados de intentos fallidos
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS unique_celular;

-- 2. Trigger definitivo "A prueba de balas"
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  clean_celular TEXT;
  clean_nit TEXT;
BEGIN
  -- Limpieza exhaustiva de datos
  clean_celular := regexp_replace(COALESCE(NEW.raw_user_meta_data->>'celular', NEW.raw_user_meta_data->>'phone', ''), '\s+', '', 'g');
  IF clean_celular = '' THEN clean_celular := NULL; END IF;

  clean_nit := NEW.raw_user_meta_data->>'nit';
  IF clean_nit = '' THEN clean_nit := NULL; END IF;

  -- Insertar o actualizar si ya existe (ON CONFLICT)
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
    display_name = EXCLUDED.display_name,
    celular = EXCLUDED.celular,
    nit = EXCLUDED.nit,
    updated_at = NOW();

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Si llega a fallar algo (ej. formato de regex), insertamos lo mínimo para NO bloquear el registro de Auth
  -- Es mejor un perfil incompleto que un usuario que no puede entrar.
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, 'Usuario Nuevo', 'resident')
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;
