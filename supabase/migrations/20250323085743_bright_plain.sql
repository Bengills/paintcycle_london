/*
  # Initial Schema Setup for PaintCycle

  1. New Tables
    - `profiles`
      - Extends Supabase Auth with additional user information
      - Stores user profile data like name, postcode, and avatar
    
    - `paint_listings`
      - Stores paint listing information
      - Links to user profiles
      - Includes paint details, location, and status
    
    - `messages`
      - Handles communication between users about paint listings
      - Links to both users and paint listings
    
    - `saved_paints`
      - Tracks paint listings saved by users
      - Many-to-many relationship between users and listings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only access their own data or public listings
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  postcode text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create paint_listings table
CREATE TABLE IF NOT EXISTS paint_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  brand text NOT NULL,
  color text NOT NULL,
  color_hex text NOT NULL,
  amount text NOT NULL,
  date_opened timestamptz NOT NULL,
  purchase_location text,
  postcode text NOT NULL,
  condition text NOT NULL,
  notes text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'collected', 'deleted')),
  image_url text,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paint_listing_id uuid REFERENCES paint_listings(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create saved_paints table
CREATE TABLE IF NOT EXISTS saved_paints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  paint_listing_id uuid REFERENCES paint_listings(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, paint_listing_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE paint_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_paints ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Paint listings policies
CREATE POLICY "Anyone can view active paint listings"
  ON paint_listings
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Users can create paint listings"
  ON paint_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON paint_listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark received messages as read"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id AND read = true);

-- Saved paints policies
CREATE POLICY "Users can view their saved paints"
  ON saved_paints
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save paints"
  ON saved_paints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave paints"
  ON saved_paints
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paint_listings_updated_at
  BEFORE UPDATE ON paint_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();