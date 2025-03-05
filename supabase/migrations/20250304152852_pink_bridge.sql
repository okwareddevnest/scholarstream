/*
  # Initial Schema for ScholarStream

  1. New Tables
    - `profiles` - Stores user profile information
    - `subjects` - List of available academic subjects
    - `tutor_subjects` - Junction table for tutors and their subjects
    - `availability` - Tutor availability schedule
    - `assignments` - Student assignment requests
    - `assignment_files` - Files attached to assignments
    - `sessions` - Tutoring sessions
    - `messages` - Chat messages between users
    - `reviews` - Tutor reviews from students
    - `payments` - Payment records

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'tutor', 'admin')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  education TEXT,
  hourly_rate DECIMAL(10, 2),
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Junction table for tutors and subjects
CREATE TABLE IF NOT EXISTS tutor_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tutor_id, subject_id)
);

-- Tutor availability
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (start_time < end_time)
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'matched', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assignment files
CREATE TABLE IF NOT EXISTS assignment_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tutoring sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'refunded')),
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

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

-- Subjects policies (public read)
CREATE POLICY "Anyone can view subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (true);

-- Tutor subjects policies
CREATE POLICY "Tutors can manage their subjects"
  ON tutor_subjects
  FOR ALL
  TO authenticated
  USING (auth.uid() = tutor_id);

CREATE POLICY "Anyone can view tutor subjects"
  ON tutor_subjects
  FOR SELECT
  TO authenticated
  USING (true);

-- Availability policies
CREATE POLICY "Tutors can manage their availability"
  ON availability
  FOR ALL
  TO authenticated
  USING (auth.uid() = tutor_id);

CREATE POLICY "Anyone can view tutor availability"
  ON availability
  FOR SELECT
  TO authenticated
  USING (true);

-- Assignments policies
CREATE POLICY "Students can view and manage their assignments"
  ON assignments
  FOR ALL
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Tutors can view assignments assigned to them"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update assignments assigned to them"
  ON assignments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = tutor_id);

-- Assignment files policies
CREATE POLICY "Users can view files for their assignments"
  ON assignment_files
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      WHERE a.id = assignment_id
      AND (a.student_id = auth.uid() OR a.tutor_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload files to their assignments"
  ON assignment_files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Sessions policies
CREATE POLICY "Students can view their sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Tutors can view their sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update their sessions"
  ON sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = tutor_id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status of received messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can create reviews for their sessions"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_id
      AND s.student_id = auth.uid()
      AND s.status = 'completed'
    )
  );

-- Payments policies
CREATE POLICY "Students can view their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Tutors can view their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = tutor_id);

-- Insert some initial subjects
INSERT INTO subjects (name, category)
VALUES
  ('Algebra', 'Mathematics'),
  ('Calculus', 'Mathematics'),
  ('Statistics', 'Mathematics'),
  ('Physics', 'Science'),
  ('Chemistry', 'Science'),
  ('Biology', 'Science'),
  ('Computer Science', 'Technology'),
  ('English Literature', 'Humanities'),
  ('History', 'Humanities'),
  ('Economics', 'Social Sciences'),
  ('Psychology', 'Social Sciences'),
  ('Spanish', 'Languages'),
  ('French', 'Languages')
ON CONFLICT (name) DO NOTHING;