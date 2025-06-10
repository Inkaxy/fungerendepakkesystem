
-- Auto-confirm the demo email address (fixed version)
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'demobakeri@gmail.com';

-- Also update the profiles table to ensure email_confirmed is true
UPDATE public.profiles 
SET email_confirmed = true
WHERE email = 'demobakeri@gmail.com';
