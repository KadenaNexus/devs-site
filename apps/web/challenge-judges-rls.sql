-- =====================================================
-- CHALLENGE_JUDGES RLS POLICIES
-- =====================================================
-- Run this in Supabase SQL Editor

-- 1. Enable RLS on challenge_judges table
ALTER TABLE challenge_judges ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any
DROP POLICY IF EXISTS "Admin can manage challenge judges" ON challenge_judges;
DROP POLICY IF EXISTS "Judges can view their assignments" ON challenge_judges;
DROP POLICY IF EXISTS "Admin can insert challenge judges" ON challenge_judges;
DROP POLICY IF EXISTS "Admin can update challenge judges" ON challenge_judges;
DROP POLICY IF EXISTS "Admin can delete challenge judges" ON challenge_judges;

-- 3. Create SELECT policy - Admins and assigned judges can view
CREATE POLICY "Judges and admins can view assignments" ON challenge_judges
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin() OR
    judge_user_id = auth.uid()
  );

-- 4. Create INSERT policy - Only admins can assign judges
CREATE POLICY "Admin can assign judges" ON challenge_judges
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 5. Create UPDATE policy - Only admins can update assignments
CREATE POLICY "Admin can update assignments" ON challenge_judges
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. Create DELETE policy - Only admins can remove assignments
CREATE POLICY "Admin can remove assignments" ON challenge_judges
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7. Verify policies were created
SELECT 
    schemaname,
    tablename,
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
AND tablename = 'challenge_judges'
ORDER BY cmd;
