-- =====================================================
-- TEST AND VERIFY RLS POLICIES
-- =====================================================
-- Run these queries one by one to test your admin setup

-- =====================================================
-- STEP 1: Verify your admin user
-- =====================================================
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'admin@gmail.com';

-- Expected result: Should show role = 'admin'

-- =====================================================
-- STEP 2: Check existing policies on challenges table
-- =====================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'challenges';

-- Expected result: Should show 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- =====================================================
-- STEP 3: Test if you can insert a challenge (run as admin)
-- =====================================================
-- This should work if RLS is configured correctly
-- Replace 'YOUR_ADMIN_USER_ID' with your actual admin user ID from step 1

INSERT INTO challenges (
    title,
    description,
    status,
    created_by
) VALUES (
    'Test Challenge',
    'This is a test challenge to verify RLS policies',
    'draft',
    '7f217a26-165e-4eac-9eb0-157e5c2e67b8'  -- Replace with your admin user ID
) RETURNING *;

-- If this works, RLS is configured correctly!
-- If you get an error, the policy isn't working

-- =====================================================
-- STEP 4: Clean up test data (optional)
-- =====================================================
-- DELETE FROM challenges WHERE title = 'Test Challenge';

-- =====================================================
-- STEP 5: Verify all table policies
-- =====================================================
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('challenges', 'submissions', 'winners', 'challenge_judges', 'scores')
GROUP BY tablename
ORDER BY tablename;

-- Expected results:
-- challenges: 4 policies
-- submissions: 2 policies
-- winners: 2 policies
-- challenge_judges: 2 policies
-- scores: 2 policies

-- =====================================================
-- STEP 6: Test UPDATE on challenges
-- =====================================================
-- First, get a challenge ID
SELECT id, title FROM challenges LIMIT 1;

-- Then try to update it (replace the ID below)
-- UPDATE challenges 
-- SET title = 'Updated Test Challenge'
-- WHERE id = 'PASTE_CHALLENGE_ID_HERE';

-- If this works, UPDATE policy is correct!

-- =====================================================
-- TROUBLESHOOTING: If policies still don't work
-- =====================================================

-- Option 1: Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('challenges', 'submissions', 'winners', 'challenge_judges', 'scores');

-- All should show rowsecurity = true

-- Option 2: Temporarily disable RLS for testing (NOT FOR PRODUCTION!)
-- ALTER TABLE challenges DISABLE ROW LEVEL SECURITY;

-- Option 3: Check current session user
-- SELECT current_user, session_user;

-- Option 4: Test the policy condition directly
SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role' = 'admin')
) as is_admin;

-- This should return is_admin = true if you're logged in as admin

-- =====================================================
-- DONE! If all tests pass, your RLS is working correctly
-- =====================================================
