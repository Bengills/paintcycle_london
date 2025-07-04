/*
  # Remove views functionality

  1. Changes
    - Drop the policy that allows view increments
    - Drop the views index
    - Drop the views column from paint_listings table
    - Remove increment_paint_views function

  2. Order of Operations
    - Drop policy first to remove dependency on views column
    - Then drop index and column
    - Finally drop the function
*/

-- First drop the policy that depends on the views column
DROP POLICY IF EXISTS "Anyone can increment views" ON paint_listings;

-- Drop views index
DROP INDEX IF EXISTS paint_listings_views_idx;

-- Drop views column
ALTER TABLE paint_listings DROP COLUMN IF EXISTS views;

-- Drop increment_paint_views function
DROP FUNCTION IF EXISTS increment_paint_views;