-- Fix: RLS was enabled on profiles but no policies existed
-- This caused all PostgREST queries to return 0 rows (PGRST116)
-- Breaking the login OTP flow (phone lookup by email)

-- 1. Allow reading profiles (needed by anon for login OTP phone lookup)
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (true);

-- 2. Allow users to update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. Allow insert for authenticated users (their own row only)
-- Note: handle_new_user trigger uses SECURITY DEFINER so it bypasses RLS
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
