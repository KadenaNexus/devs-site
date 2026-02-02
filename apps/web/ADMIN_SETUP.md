# Admin Setup Guide

## Step 1: Create Admin User in Supabase

To create an admin user in Supabase, follow these steps:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** button
4. Enter the following details:
   - **Email**: `admin@example.com` (or your preferred admin email)
   - **Password**: Enter a secure password
5. Click **Create user**

### Option B: Using Supabase SQL Editor

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Create a new query and run the following SQL:

```sql
-- First, create the auth user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('your_secure_password_here', gen_salt('bf')),
  now(),
  now(),
  now(),
  jsonb_build_object('role', 'admin', 'username', 'admin')
);
```

Replace `'your_secure_password_here'` with your actual password.

## Step 2: Update User Metadata (if needed)

If the user was created but doesn't have the admin role metadata, run:

```sql
-- Update the user metadata with admin role
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object(
  'role', 'admin', 
  'username', 'admin'
)
WHERE email = 'admin@example.com';
```

## Step 3: Test Admin Login

1. Navigate to `http://localhost:5173/admin`
2. Enter your admin email and password
3. You should be redirected to `http://localhost:5173/admin-dashboard`

## Admin Routes

- **Admin Login**: `http://localhost:5173/admin`
- **Admin Dashboard**: `http://localhost:5173/admin-dashboard`

## Important Notes

- Only users with the `admin` role in their metadata can access the admin dashboard
- The admin password must meet Supabase's password requirements (minimum 6 characters)
- The admin session is stored in browser cookies and Supabase session
- Make sure to use a strong password for your admin account

## Troubleshooting

### "Only admin users can access this area" error
- Verify the user has `role: 'admin'` in their user metadata
- Check the Supabase dashboard to confirm the metadata was saved

### "Authentication failed" error
- Double-check your email and password
- Ensure the user exists in your Supabase project
- Try creating the user again

### Routes not loading
- Clear browser cache and cookies
- Restart the development server with `npm run dev`
