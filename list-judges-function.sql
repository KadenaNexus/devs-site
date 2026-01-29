-- =====================================================
-- JUDGES MANAGEMENT - POSTGRES FUNCTION
-- =====================================================
-- Run this in Supabase SQL Editor

-- 1. Create a function to list all judges
CREATE OR REPLACE FUNCTION public.list_judges()
RETURNS TABLE (
  id uuid,
  email varchar,
  name text,
  created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can list judges';
  END IF;

  -- Return all users with judge role from auth.users
  RETURN QUERY
  SELECT 
    u.id,
    u.email::varchar,
    COALESCE(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name', u.email)::text as name,
    u.created_at
  FROM auth.users u
  WHERE u.raw_user_meta_data->>'role' = 'judge'
  ORDER BY u.created_at DESC;
END;
$$;

-- 2. Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.list_judges() TO authenticated;

-- 3. Test the function (should return judges if you're logged in as admin)
-- SELECT * FROM public.list_judges();
