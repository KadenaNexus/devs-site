-- ========================================
-- AVATAR STORAGE SETUP FOR SUPABASE
-- ========================================

-- STEP 1: Create the bucket manually in Supabase Dashboard
-- 1. Go to: Storage section in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Bucket name: avatars
-- 4. Toggle "Public bucket" to ON
-- 5. Click "Create bucket"

-- STEP 2: Run these SQL commands in the SQL Editor
-- Go to: SQL Editor in Supabase Dashboard and run the commands below

-- Policy 1: Allow authenticated users to INSERT their avatar
INSERT INTO storage.policies (name, bucket_id, definition, check, owner)
VALUES (
  'Users can upload avatar to own folder',
  'avatars',
  'FOR INSERT TO authenticated USING ((bucket_id = ''avatars''::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)) WITH CHECK ((bucket_id = ''avatars''::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))',
  '((bucket_id = ''avatars''::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))',
  true
);

-- Policy 2: Allow public to SELECT/view all avatars
INSERT INTO storage.policies (name, bucket_id, definition, check, owner)
VALUES (
  'Anyone can view avatars',
  'avatars',
  'FOR SELECT TO public USING (bucket_id = ''avatars''::text)',
  'bucket_id = ''avatars''::text',
  true
);

-- Policy 3: Allow users to UPDATE their own avatar
INSERT INTO storage.policies (name, bucket_id, definition, check, owner)
VALUES (
  'Users can update own avatar',
  'avatars',
  'FOR UPDATE TO authenticated USING ((bucket_id = ''avatars''::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)) WITH CHECK ((bucket_id = ''avatars''::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))',
  '((bucket_id = ''avatars''::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))',
  true
);

-- Policy 4: Allow users to DELETE their own avatar
INSERT INTO storage.policies (name, bucket_id, definition, check, owner)
VALUES (
  'Users can delete own avatar',
  'avatars',
  'FOR DELETE TO authenticated USING ((bucket_id = ''avatars''::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))',
  '((bucket_id = ''avatars''::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))',
  true
);

-- STEP 3: Verify the policies were created
-- Run this to check:
-- SELECT * FROM storage.policies WHERE bucket_id = 'avatars';
