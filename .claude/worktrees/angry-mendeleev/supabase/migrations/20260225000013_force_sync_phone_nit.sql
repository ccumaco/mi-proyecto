-- Trigger final para asegurar sincronización con auth.users y perfiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
DECLARE
  extracted_phone TEXT;
BEGIN
  -- 1. Extraer el teléfono de los metadatos
  extracted_phone := COALESCE(NEW.raw_user_meta_data->>'phone', NEW.raw_user_meta_data->>'celular');

  -- 2. Intentar inyectar el teléfono directamente en auth.users (vital para OTP)
  IF extracted_phone IS NOT NULL THEN
    UPDATE auth.users SET phone = extracted_phone WHERE id = NEW.id;
  END IF;

  -- 3. Insertar en profiles con todo lo que tengamos
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    display_name, 
    phone, 
    nit,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    extracted_phone,
    NEW.raw_user_meta_data->>'nit', -- Capturar el NIT si viene en el registro
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    nit = EXCLUDED.nit,
    display_name = EXCLUDED.display_name,
    full_name = EXCLUDED.full_name;

  RETURN NEW;
END;
$$;
