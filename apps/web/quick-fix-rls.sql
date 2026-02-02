-- =====================================================
-- QUICK FIX - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- This is the minimal fix for your RLS issue
-- Copy and paste this entire block and run it

-- 1. Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role'),
      (SELECT raw_user_meta_data ->> 'role' FROM auth.users WHERE id = auth.uid())
    ) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop ALL existing policies on challenges
DROP POLICY IF EXISTS "Admin can insert challenges" ON challenges;
DROP POLICY IF EXISTS "Admin can update challenges" ON challenges;
DROP POLICY IF EXISTS "Admin can delete challenges" ON challenges;
DROP POLICY IF EXISTS "Allow admin to insert challenges" ON challenges;
DROP POLICY IF EXISTS "Allow admin to update challenges" ON challenges;
DROP POLICY IF EXISTS "Allow admin to delete challenges" ON challenges;
DROP POLICY IF EXISTS "Everyone can view challenges" ON challenges;
DROP POLICY IF EXISTS "Public challenges are viewable by everyone" ON challenges;
DROP POLICY IF EXISTS "Enable read access for all users" ON challenges;

-- 3. Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 4. Disable RLS temporarily to clean slate
ALTER TABLE challenges DISABLE ROW LEVEL SECURITY;

-- 5. Re-enable RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- 6. Create SELECT policy - MUST come first!
CREATE POLICY "Everyone can view challenges" ON challenges
  FOR SELECT
  TO authenticated
  USING (true);  -- All authenticated users can view all challenges

-- 7. Create INSERT policy for admins
CREATE POLICY "Allow admin to insert challenges" ON challenges
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

-- 8. Create UPDATE policy for admins
CREATE POLICY "Allow admin to update challenges" ON challenges
  FOR UPDATE 
  TO authenticated
  USING (true)  -- Admin can see all rows to update
  WITH CHECK (public.is_admin());

-- 9. Create DELETE policy for admins
CREATE POLICY "Allow admin to delete challenges" ON challenges
  FOR DELETE 
  TO authenticated
  USING (public.is_admin());

-- 8. Verify policies were created
SELECT 
    policyname,
    cmd as operation,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as using_status,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK'
        ELSE 'No WITH CHECK'
    END as check_status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'challenges'
ORDER BY cmd;

-- 9. Test if you're authenticated as admin
SEL10. Test the helper function
SELECT public.is_admin() as am_i_admin;

-- 11CT 
    auth.uid() as your_user_id,
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ) as is_admin;

-- 10. Test UPDATE directly (replace with actual challenge ID)
-- UPDATE challenges 
-- SET title = 'Test Update'
-- WHEyou see policies created and test passes,
-- logout/login in your app at http://localhost:5174

-- 12