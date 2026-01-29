-- =====================================================
-- SUPABASE RLS POLICIES FOR ADMIN DASHBOARD
-- =====================================================
-- Run these SQL commands in your Supabase SQL Editor

-- =====================================================
-- 1. CHALLENGES TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist (optional, comment out if you want to keep existing ones)
DROP POLICY IF EXISTS "Admin can insert challenges" ON challenges;
DROP POLICY IF EXISTS "Admin can update challenges" ON challenges;
DROP POLICY IF EXISTS "Admin can delete challenges" ON challenges;
DROP POLICY IF EXISTS "Everyone can view challenges" ON challenges;
DROP POLICY IF EXISTS "Allow admin to insert challenges" ON challenges;
DROP POLICY IF EXISTS "Allow admin to update challenges" ON challenges;
DROP POLICY IF EXISTS "Allow admin to delete challenges" ON challenges;

-- Enable RLS on challenges table
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Policy: Allow admins to insert challenges
-- This checks if the user's metadata has role = 'admin'
CREATE POLICY "Allow admin to insert challenges" ON challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Policy: Allow admins to update challenges
CREATE POLICY "Allow admin to update challenges" ON challenges
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Policy: Allow admins to delete challenges
CREATE POLICY "Allow admin to delete challenges" ON challenges
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Policy: Allow everyone to view challenges (or restrict to authenticated)
CREATE POLICY "Everyone can view challenges" ON challenges
  FOR SELECT
  TO authenticated
  USING (
    true OR  -- Allow all authenticated users to view
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- =====================================================
-- 2. SUBMISSIONS TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Admin can update submissions" ON submissions;
DROP POLICY IF EXISTS "Everyone can view submissions" ON submissions;
DROP POLICY IF EXISTS "Allow admin to update submissions" ON submissions;

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow admins to update submissions (approve/reject/visibility)
CREATE POLICY "Allow admin to update submissions" ON submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Policy: Allow authenticated users to view submissions
CREATE POLICY "Everyone can view submissions" ON submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- 3. WINNERS TABLE (Create if not exists)
-- =====================================================

-- Create winners table if it doesn't exist
CREATE TABLE IF NOT EXISTS winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  prize_amount TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
DROP POLICY IF EXISTS "Allow admin to manage winners" ON winners;

-- Policy: Allow admins to manage winners
CREATE POLICY "Allow admin to manage winners" ON winners
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Allow everyone to view winners
CREATE POLICY "Everyone can view winners" ON winners
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- 4. CHALLENGE_JUDGES TABLE (Create if not exists)
-- =====================================================

-- Create challenge_judges table if it doesn't exist
CREATE TABLE IF NOT EXISTS challenge_judges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, judge_id)
DROP POLICY IF EXISTS "Allow admin to manage judge assignments" ON challenge_judges;

-- Policy: Allow admins to manage judge assignments
CREATE POLICY "Allow admin to manage judge assignments" ON challenge_judges
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy: Allow authenticated users to view judge assignments
CREATE POLICY "Everyone can view judge assignments" ON challenge_judges
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- 5. PROFILES TABLE (if you're using it for judges)
-- =====================================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Policy: Allow authenticated users to view profiles
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Allow judges to view scores" ON scores;
DROP POLICY IF EXISTS "Allow judges to manage their own scores" ON scores;

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Policy: Allow judges and admins to view scores
CREATE POLICY "Allow judges to view scores" ON scores
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.raw_user_meta_data->>'role' = 'judge' OR
        auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Policy: Allow judges to insert/update their own scores
CREATE POLICY "Allow judges to manage their own scores" ON scores
  FOR ALL
  TO authenticated
  USING (
    judge_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    judge_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    judge_user_id = auth.uid() OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- =====================================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_created_by ON challenges(created_by);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_winners_challenge_id ON winners(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_judges_challenge_id ON challenge_judges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_judges_judge_id ON challenge_judges(judge_id);
CREATE INDEX IF NOT EXISTS idx_scores_submission_id ON scores(submission_id);
CREATE INDEX IF NOT EXISTS idx_scores_judge_user_id ON scores(judge_user_id);

-- =====================================================
-- 8. VERIFY YOUR ADMIN USER
-- =====================================================

-- Check if your admin user has the correct role in user_metadata
-- Run this query to verify:
-- SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'your-admin-email@example.com';

-- If the role is not set, update it:
-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"')
-- WHERE email = 'your-admin-email@example.com';

-- =====================================================
-- DONE! Your RLS policies are now configured.
-- =====================================================
