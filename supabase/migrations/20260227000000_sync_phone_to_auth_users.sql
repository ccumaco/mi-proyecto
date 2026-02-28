-- Sync phone from user_metadata to auth.users for all existing users.
-- This is required for phone OTP login (signInWithOtp) to work.
-- Supabase looks up users by auth.users.phone, which is null for users
-- registered via email+password unless explicitly set.

-- The handle_new_user trigger (20260225000011) handles NEW users going forward.
-- This migration fixes EXISTING users who were created before that trigger was updated.

UPDATE auth.users
SET phone = raw_user_meta_data->>'phone'
WHERE (phone IS NULL OR phone = '')
  AND raw_user_meta_data->>'phone' IS NOT NULL
  AND raw_user_meta_data->>'phone' != '';
