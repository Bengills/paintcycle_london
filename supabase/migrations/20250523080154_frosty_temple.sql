/*
  # Remove Views Counter

  1. Changes
    - Drop views-related policies and functions
    - Remove views column from paint_listings table
    - Keep all other functionality intact

  2. Security
    - Maintain existing RLS policies for paint listings
    - No impact on donation tracking
*/

-- First drop the policy that depends on the views column
DROP POLICY IF EXISTS "Anyone can increment views" ON paint_listings;

-- Drop views index
DROP INDEX IF EXISTS paint_listings_views_idx;

-- Drop increment_paint_views function
DROP FUNCTION IF EXISTS increment_paint_views;

-- Drop views column
ALTER TABLE paint_listings DROP COLUMN IF EXISTS views CASCADE;