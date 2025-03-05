/*
  # Fix Profiles RLS Policies

  1. Changes
    - Add INSERT policy for profiles table to allow new users to create their profiles
    - Add SELECT policy for profiles to allow users to view other users' basic information
    - Fix error with profiles table access

  2. Security
    - Maintain security while allowing necessary operations
    - Ensure users can only modify their own data
*/

-- Add policy to allow users to insert their own profile
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add policy to allow users to view other users' basic information
CREATE POLICY "Users can view other users' basic information"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Add policy to allow public access to view tutor profiles
CREATE POLICY "Public can view tutor profiles"
  ON profiles
  FOR SELECT
  TO anon
  USING (role = 'tutor');