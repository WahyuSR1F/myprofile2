
/*
# Seed demo accounts

Creates two demo users for testing:
- pemohon@demo.test (role: pemohon) — password: password
- penilai@demo.test (role: penilai) — password: password

These are inserted directly into auth.users with bcrypt-hashed passwords.
Idempotent: checks for existing email before inserting.
*/

DO $$
DECLARE
  pemohon_id uuid;
  penilai_id uuid;
BEGIN
  -- Create pemohon user if not exists
  SELECT id INTO pemohon_id FROM auth.users WHERE email = 'pemohon@demo.test';
  IF pemohon_id IS NULL THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'pemohon@demo.test', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
    RETURNING id INTO pemohon_id;
  END IF;

  -- Create penilai user if not exists
  SELECT id INTO penilai_id FROM auth.users WHERE email = 'penilai@demo.test';
  IF penilai_id IS NULL THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'penilai@demo.test', crypt('password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
    RETURNING id INTO penilai_id;
  END IF;

  -- Create profiles if not exists
  IF pemohon_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = pemohon_id) THEN
    INSERT INTO profiles (id, name, email, role, company, phone)
    VALUES (pemohon_id, 'Ahmad Pemohon', 'pemohon@demo.test', 'pemohon', 'PT Maju Jaya', '081234567890');
  END IF;

  IF penilai_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = penilai_id) THEN
    INSERT INTO profiles (id, name, email, role, company, phone)
    VALUES (penilai_id, 'Siti Penilai', 'penilai@demo.test', 'penilai', 'Dinas Persetujuan', '089876543210');
  END IF;
END $$;
