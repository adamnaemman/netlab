-- NetLab User Progress Table
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Create the user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  xp INTEGER DEFAULT 0,
  hearts INTEGER DEFAULT 5,
  streak INTEGER DEFAULT 0,
  completed_levels TEXT[] DEFAULT '{}',
  unlocked_levels TEXT[] DEFAULT ARRAY['1-1'],
  level_progress JSONB DEFAULT '{}',
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- If the table already exists, add the new columns (run separately if needed)
-- ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS unlocked_levels TEXT[] DEFAULT ARRAY['1-1'];
-- ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS level_progress JSONB DEFAULT '{}';

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own progress
CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function on updates
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
