-- 1. Agregar columnas celular y nit si no existen
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS celular TEXT,
ADD COLUMN IF NOT EXISTS nit TEXT;

-- 2. Restricciones de formato y unicidad
-- Eliminar constraints si existen para evitar errores al re-aplicar
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS unique_celular;
ALTER TABLE public.profiles ADD CONSTRAINT unique_celular UNIQUE (celular);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS celular_format;
-- Formato E.164: + seguido de 1 a 15 dígitos. Permitimos NULL si el usuario aún no lo ha completado.
ALTER TABLE public.profiles ADD CONSTRAINT celular_format CHECK (celular IS NULL OR celular ~ '^\+[1-9]\d{1,14}$');

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS nit_format;
-- Formato NIT: XXXXXXXX-Y. Permitimos NULL.
ALTER TABLE public.profiles ADD CONSTRAINT nit_format CHECK (nit IS NULL OR nit ~ '^\d{7,10}-\d$');

-- 3. Actualizar la función handle_new_user para capturar metadatos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, celular, nit, role, full_name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'celular',
    NEW.raw_user_meta_data->>'nit',
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-crear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Actualizar Políticas de Seguridad (RLS)
-- Permitir que el usuario lea su propio perfil
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Permitir que el usuario actualice su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Eliminar política pública si existe (para cumplir requerimiento estricto)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
