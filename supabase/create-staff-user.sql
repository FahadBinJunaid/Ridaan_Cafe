-- =============================================================
--  Create a staff user for the admin panel
-- =============================================================
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor).
-- It creates an auth user and inserts a corresponding profiles row
-- with role = 'staff'.
-- =============================================================

-- 1. Create the auth user (replace email/password)
SELECT supabase_admin.create_user(
  '{
    "email": "staff@ridaan.com",
    "password": "your-strong-password-here",
    "email_confirm": true
  }'::jsonb
) AS user_id;

-- 2. Insert a matching profiles row
-- Replace the id below with the UUID returned by step 1.
INSERT INTO public.profiles (id, name, role)
VALUES (
  'REPLACE-WITH-UUID-FROM-STEP-1',
  'Staff Name',
  'staff'
)
ON CONFLICT (id) DO UPDATE SET role = 'staff', name = EXCLUDED.name;
