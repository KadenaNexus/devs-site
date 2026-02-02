# Admin Dashboard - RLS Issues Fix

## Problems Encountered

1. **Error when creating challenge:**
   ```
   "new row violates row-level security policy for table \"challenges\""
   ```

2. **Error when updating challenge:**
   ```
   "The result contains 0 rows - Cannot coerce the result to a single JSON object"
   ```

## Root Cause

These errors occur because Supabase Row Level Security (RLS) policies are either:
- Not configured for admin users
- Not checking for admin role correctly
- Missing entirely

## Solutions Applied

### 1. Updated Service Functions (`src/services/admin.ts`)

**Changes:**
- Added automatic user authentication check in `createChallenge()`
- Gets `created_by` from authenticated user instead of passing it
- Improved error handling with detailed console logs
- Fixed `.single()` issue by checking array results
- Added null checks for optional fields

### 2. Updated Component (`src/features/admin/dashboard/challenges-management.tsx`)

**Changes:**
- Removed `created_by` from mutation call (now handled in service)
- Added better error messages from the API response

### 3. Created RLS Policies SQL File (`supabase-rls-policies.sql`)

**What it does:**
- Creates proper RLS policies for admin users
- Allows admins to INSERT, UPDATE, DELETE challenges
- Creates `winners` table if it doesn't exist
- Creates `challenge_judges` table if it doesn't exist
- Sets up policies for submissions, scores, and profiles
- Creates indexes for better performance

## How to Fix

### Step 1: Apply the Updated RLS Policies

1. **Open Supabase SQL Editor**
2. **Copy the ENTIRE content from `supabase-rls-policies.sql`**
3. **Paste and Run it**

The key difference in the new policies:
- Old (didn't work): `auth.jwt() ->> 'role' = 'admin'`
- New (works): `EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin')`

### Step 2: Verify Policies Are Applied

Run this query to check:

```sql
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'challenges';
```

You should see 4 policies:
- `Allow admin to insert challenges` (INSERT)
- `Allow admin to update challenges` (UPDATE)
- `Allow admin to delete challenges` (DELETE)
- `Everyone can view challenges` (SELECT)

### Step 3: Test Your Setup

Use the queries in `test-rls-policies.sql` to verify everything works:

1. Verify your admin user has role='admin'
2. Check policies exist
3. Test INSERT (create challenge)
4. Test UPDATE (edit challenge)

### Step 4: Clear Session and Test in App

1. **Logout from your app**
2. **Clear browser cache/localStorage**
3. **Login again as admin (admin@gmail.com)**
4. **Try creating a challenge**
5. **Try editing a challenge**

Everything should work now! ✅

## Alternative: Disable RLS Temporarily (Not Recommended for Production)

If you're testing locally and want to bypass RLS temporarily:

```sql
ALTER TABLE challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING:** Only do this in development! Never disable RLS in production!

## Common Issues and Solutions

### Issue: "role is not in user_metadata"

**Solution:** The admin user's metadata needs to have the role field. Update it:

```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

### Issue: "Policy still not working"

**Solution:** The JWT might need to check both locations for the role:

```sql
-- Check both root and user_metadata
auth.jwt() ->> 'role' = 'admin' OR 
(auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
```

### Issue: "Cannot read properties of null"

**Solution:** Make sure you're logged in and the session is valid:

```typescript
// In browser console:
const { data } = await supabase.auth.getUser()
console.log('Current user:', data.user)
console.log('User metadata:', data.user?.user_metadata)
```

## Files Modified

1. ✅ `src/services/admin.ts` - Fixed create/update/toggle functions
2. ✅ `src/features/admin/dashboard/challenges-management.tsx` - Updated mutation calls
3. ✅ `supabase-rls-policies.sql` - Created RLS policies

## Testing Checklist

- [ ] Admin user has `role: "admin"` in user_metadata
- [ ] RLS policies are applied to all tables
- [ ] Can create new challenge
- [ ] Can update existing challenge
- [ ] Can delete challenge
- [ ] Can open/close challenge
- [ ] No console errors
- [ ] Success toast messages appear

## Still Having Issues?

If you're still experiencing problems:

1. Check the browser console for detailed error messages
2. Check the Network tab to see the exact Supabase response
3. Verify your Supabase project URL and anon key in `.env`
4. Make sure you're using the latest session token (logout and login again)
5. Check Supabase logs in the Dashboard → Logs section

## Need Help?

Check these resources:
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
