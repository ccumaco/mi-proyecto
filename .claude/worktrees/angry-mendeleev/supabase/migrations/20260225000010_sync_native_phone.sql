-- Trigger que sincroniza metadatos con el campo nativo 'phone' de Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
  -- 1. Sincronizar el celular con el campo nativo de auth.users (necesario para OTP/SMS)
  IF NEW.raw_user_meta_data->>'celular' IS NOT NULL THEN
    UPDATE auth.users 
    SET phone = NEW.raw_user_meta_data->>'celular'
    WHERE id = NEW.id;
  END IF;

  -- 2. Insertar/Actualizar en public.profiles
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'celular',
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  )
  ON CONFLICT (id) DO UPDATE SET
    celular = EXCLUDED.celular,
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name;

  RETURN NEW;
END;
$$;
