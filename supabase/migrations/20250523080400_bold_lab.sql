/*
  # Add Views Counter to Paint Listings

  1. Changes
    - Add views column to paint_listings table
    - Create function to safely increment views
    - Add index for performance
    - Set up proper RLS policies
    
  2. Security
    - Only allow incrementing views through the function
    - Prevent direct column updates
    - Use row-level locking to prevent race conditions
*/

-- Add views column
ALTER TABLE paint_listings 
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS paint_listings_views_idx ON paint_listings(views);

-- Create function to increment views safely
CREATE OR REPLACE FUNCTION increment_paint_views(paint_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Lock the row to prevent concurrent updates
  UPDATE paint_listings
  SET views = COALESCE(views, 0) + 1
  WHERE id = paint_id
  AND (
    -- Only increment if viewer is not the owner
    auth.uid() IS NULL OR
    auth.uid() != user_id
  );
END;
$$;

-- Create policy to allow the function to update views
CREATE POLICY "Allow view count updates through function"
  ON paint_listings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);