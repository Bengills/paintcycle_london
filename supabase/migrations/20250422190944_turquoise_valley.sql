/*
  # Fix profile visibility for messaging

  1. Changes
    - Add new RLS policy to allow viewing profiles of users you're messaging with
    - Keep existing profile policies intact
    - Ensure secure access to profile data

  2. Security
    - Users can still only modify their own profile
    - Users can view profiles of people they're messaging with
    - Maintains data privacy while enabling messaging functionality
*/

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new SELECT policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
  );

CREATE POLICY "Users can view profiles of message participants"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT sender_id FROM messages WHERE receiver_id = auth.uid()
      UNION
      SELECT receiver_id FROM messages WHERE sender_id = auth.uid()
    )
  );