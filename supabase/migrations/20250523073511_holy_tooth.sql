/*
  # Fix paint views tracking

  1. Changes
    - Add RLS policy to allow all users to increment views
    - Improve increment_paint_views function with better locking
    - Add index on views column for better performance

  2. Security
    - Allow public access to increment views
    - Maintain data integrity with row-level locking
*/

-- Drop existing function
DROP FUNCTION IF EXISTS increment_paint_views;

-- Create improved function with proper locking
CREATE OR REPLACE FUNCTION increment_paint_views(paint_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_views INTEGER;
BEGIN
  -- Use row-level locking to prevent concurrent updates
  UPDATE paint_listings
  SET views = COALESCE(views, 0) + 1,
      updated_at = NOW()
  WHERE id = paint_id
  RETURNING views INTO new_views;
  
  RETURN COALESCE(new_views, 0);
END;
$$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS paint_listings_views_idx ON paint_listings(views);

-- Add policy to allow anyone to call the function
CREATE POLICY "Anyone can increment views"
  ON paint_listings
  FOR UPDATE
  USING (true)
  WITH CHECK (false); -- Prevent direct updates, only allow through the function