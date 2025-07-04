/*
  # Add function to increment paint views

  1. Changes
    - Add a PostgreSQL function to safely increment the views counter
    - Function uses row-level locking to prevent race conditions
    - Returns the updated views count
    
  2. Security
    - Function is accessible to all users (public)
    - Only updates the views column
    - Uses SECURITY DEFINER to ensure it can update regardless of RLS
*/

CREATE OR REPLACE FUNCTION increment_paint_views(paint_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_views INTEGER;
BEGIN
  UPDATE paint_listings
  SET views = COALESCE(views, 0) + 1
  WHERE id = paint_id
  RETURNING views INTO new_views;
  
  RETURN new_views;
END;
$$;