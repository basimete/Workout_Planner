-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS rest_days (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date       date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_rest_days_user_date ON rest_days(user_id, date);

ALTER TABLE rest_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rest_days_all" ON rest_days
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
