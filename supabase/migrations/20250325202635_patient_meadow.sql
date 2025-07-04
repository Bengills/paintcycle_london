/*
  # Fix profiles table RLS policies

  1. Changes
    - Add INSERT policy for profiles table to allow new users to create their profile
    - Keep existing SELECT and UPDATE policies

  2. Security
    - Users can only create their own profile
    - Profile ID must match the authenticated user's ID
*/

-- Add INSERT policy for profiles
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);