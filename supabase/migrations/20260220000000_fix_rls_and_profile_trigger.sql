-- 1. Trigger for automatic profile creation
-- Note: Profiles table exists in initial_schema.sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid errors on reapplying
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Add INSERT policies for properties
CREATE POLICY "Admins can insert their own property" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = admin_id);

-- 3. Add INSERT policies for units
CREATE POLICY "Admins can insert units to their properties" ON public.units
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND admin_id = auth.uid()
    )
  );

-- 4. Fix Units SELECT policy (it was generic true, but let's make it more specific)
DROP POLICY IF EXISTS "Units viewable by residents and admins" ON public.units;
CREATE POLICY "Units viewable by residents and admins" ON public.units
  FOR SELECT USING (
    auth.uid() = resident_id OR 
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = public.units.property_id AND admin_id = auth.uid()
    )
  );

-- 5. Ensure profiles can be inserted (though the trigger handles it, it's good practice for manual updates)
CREATE POLICY "Profiles can be inserted by the user" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
