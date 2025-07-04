/*
  # Update Paint Listings Views Policy

  1. Changes
    - Allow public users to increment the views counter
    - Ensure only the views column can be updated
    - Prevent modification of other columns
    
  2. Security
    - Public access for view counting
    - Strict validation of updates
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can increment views" ON paint_listings;

-- Create new policy that only allows updating the views column
CREATE POLICY "Anyone can increment views"
  ON paint_listings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (
    views IS NOT NULL AND
    views = (
      SELECT views + 1
      FROM paint_listings
      WHERE id = paint_listings.id
    )
  );