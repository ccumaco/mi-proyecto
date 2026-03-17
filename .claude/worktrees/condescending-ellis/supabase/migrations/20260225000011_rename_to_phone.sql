-- 1. Renombrar columna y limpiar
ALTER TABLE public.profiles DROP COLUMN IF EXISTS celular;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Actualizar el Trigger para usar 'phone'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
  -- Sincronizar con el campo nativo de auth.users
  IF NEW.raw_user_meta_data->>'phone' IS NOT NULL THEN
    UPDATE auth.users 
    SET phone = NEW.raw_user_meta_data->>'phone'
    WHERE id = NEW.id;
  END IF;

  -- Insertar/Actualizar en public.profiles usando la columna 'phone'
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name;

  RETURN NEW;
END;
$$;
