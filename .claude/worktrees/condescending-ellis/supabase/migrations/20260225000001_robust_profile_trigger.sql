-- Actualizar el trigger para ser más robusto y manejar limpieza de datos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_celular TEXT;
BEGIN
  -- Intentar obtener el celular de 'celular' o 'phone'
  raw_celular := COALESCE(NEW.raw_user_meta_data->>'celular', NEW.raw_user_meta_data->>'phone');
  
  -- Limpiar el celular de espacios por si acaso llega sucio desde otros orígenes
  IF raw_celular IS NOT NULL THEN
    raw_celular := regexp_replace(raw_celular, '\s+', '', 'g');
  END IF;

  INSERT INTO public.profiles (id, email, celular, nit, role, full_name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    raw_celular,
    NEW.raw_user_meta_data->>'nit',
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Fallback: Si hay un error (ej. formato de celular inválido), insertar lo mínimo para no bloquear el registro
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nuevo Usuario'), 
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
