-- 1. ELIMINAR Y RECREAR TABLA (BORRÓN Y CUENTA NUEVA)
-- Esto asegura que no queden restricciones viejas invisibles
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  display_name TEXT,
  celular TEXT,
  phone TEXT,
  nit TEXT,
  role TEXT DEFAULT 'resident',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HABILITAR RLS Y POLÍTICAS (Mínimas para que funcione)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todo el mundo puede ver perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Cada uno edita su perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. TRIGGER SIN BLOQUE EXCEPTION (Queremos ver el error real si falla)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'celular',
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin') -- Por ahora dejamos admin por defecto para tus pruebas
  );
  RETURN NEW;
END;
$$;

-- 4. VINCULAR TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
