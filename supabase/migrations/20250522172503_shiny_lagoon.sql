/*
  # Add policy for viewing own paint listings

  1. Security Changes
    - Add new RLS policy to allow users to view their own paint listings regardless of status
    - This ensures users can see all their listings in their profile, even if not active

  2. Changes
    - Add new SELECT policy on paint_listings table
*/

CREATE POLICY "Users can view their own listings"
ON public.paint_listings
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);