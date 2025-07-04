/*
  # Update Paint Listings Access Policy

  1. Changes
    - Modify paint listings SELECT policy to allow public access
    - Keep other policies restricted to authenticated users
    
  2. Security
    - Anyone can view active paint listings
    - Only authenticated users can create, update, or interact with listings
*/

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Anyone can view active paint listings" ON paint_listings;

-- Create new public SELECT policy
CREATE POLICY "Anyone can view active paint listings"
  ON paint_listings
  FOR SELECT
  USING (status = 'active');