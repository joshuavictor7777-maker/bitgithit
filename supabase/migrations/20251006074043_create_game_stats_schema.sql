/*
  # 21 Training App Database Schema

  ## Overview
  Creates tables for tracking user progress, game statistics, learning modules, and quiz performance
  for a 21 training application.

  ## New Tables
  
  ### `user_profiles`
  - `id` (uuid, primary key) - User unique identifier
  - `name` (text) - User display name
  - `email` (text, unique) - User email address
  - `level` (integer) - Current user level
  - `experience` (integer) - Total XP earned
  - `member_since` (timestamptz) - Account creation date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `game_stats`
  - `id` (uuid, primary key) - Stat record identifier
  - `user_id` (uuid, foreign key) - References user_profiles
  - `games_played` (integer) - Total number of games
  - `hands_played` (integer) - Total number of hands
  - `hands_won` (integer) - Total hands won
  - `hands_lost` (integer) - Total hands lost
  - `hands_pushed` (integer) - Total hands pushed
  - `natural_21s` (integer) - Total natural 21s
  - `busts` (integer) - Total busted hands
  - `strategy_correct` (integer) - Correct strategy decisions
  - `strategy_total` (integer) - Total strategy decisions
  - `counting_correct` (integer) - Correct counting decisions
  - `counting_total` (integer) - Total counting decisions
  - `updated_at` (timestamptz) - Last update timestamp

  ### `game_sessions`
  - `id` (uuid, primary key) - Session identifier
  - `user_id` (uuid, foreign key) - References user_profiles
  - `session_date` (timestamptz) - Session date and time
  - `hands_played` (integer) - Hands in this session
  - `result` (text) - Session result (win/loss/push)
  - `net_result` (integer) - Net win/loss amount
  - `duration_minutes` (integer) - Session duration
  - `created_at` (timestamptz) - Record creation timestamp

  ### `learning_progress`
  - `id` (uuid, primary key) - Progress record identifier
  - `user_id` (uuid, foreign key) - References user_profiles
  - `module_id` (text) - Learning module identifier
  - `completed` (boolean) - Module completion status
  - `score` (integer) - Module score (0-100)
  - `xp_earned` (integer) - XP earned from module
  - `completed_at` (timestamptz) - Completion timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### `quiz_results`
  - `id` (uuid, primary key) - Quiz result identifier
  - `user_id` (uuid, foreign key) - References user_profiles
  - `quiz_type` (text) - Type of quiz (basic-strategy/card-counting)
  - `question_count` (integer) - Number of questions
  - `correct_answers` (integer) - Number correct
  - `score_percentage` (integer) - Score as percentage
  - `completed_at` (timestamptz) - Completion timestamp

  ### `achievements`
  - `id` (uuid, primary key) - Achievement identifier
  - `user_id` (uuid, foreign key) - References user_profiles
  - `achievement_id` (text) - Achievement type identifier
  - `title` (text) - Achievement title
  - `description` (text) - Achievement description
  - `unlocked_at` (timestamptz) - Unlock timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Restrict access so users can only view/modify their own records
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '21 Player',
  email text UNIQUE,
  level integer NOT NULL DEFAULT 1,
  experience integer NOT NULL DEFAULT 0,
  member_since timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_stats table
CREATE TABLE IF NOT EXISTS game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  games_played integer NOT NULL DEFAULT 0,
  hands_played integer NOT NULL DEFAULT 0,
  hands_won integer NOT NULL DEFAULT 0,
  hands_lost integer NOT NULL DEFAULT 0,
  hands_pushed integer NOT NULL DEFAULT 0,
  natural_21s integer NOT NULL DEFAULT 0,
  busts integer NOT NULL DEFAULT 0,
  strategy_correct integer NOT NULL DEFAULT 0,
  strategy_total integer NOT NULL DEFAULT 0,
  counting_correct integer NOT NULL DEFAULT 0,
  counting_total integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_date timestamptz DEFAULT now(),
  hands_played integer NOT NULL DEFAULT 0,
  result text NOT NULL DEFAULT 'push',
  net_result integer NOT NULL DEFAULT 0,
  duration_minutes integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create learning_progress table
CREATE TABLE IF NOT EXISTS learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  score integer DEFAULT 0,
  xp_earned integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  quiz_type text NOT NULL,
  question_count integer NOT NULL,
  correct_answers integer NOT NULL,
  score_percentage integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for game_stats
CREATE POLICY "Users can view own stats"
  ON game_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON game_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON game_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game_sessions
CREATE POLICY "Users can view own sessions"
  ON game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_progress
CREATE POLICY "Users can view own progress"
  ON learning_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON learning_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON learning_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quiz_results
CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_stats_user_id ON game_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_date ON game_sessions(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);