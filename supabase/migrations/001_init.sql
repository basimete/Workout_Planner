-- ============================================================
-- Workout Planner — Full Database Schema + Seed Data
-- Run this in the Supabase SQL editor after creating your project
-- ============================================================

-- ===================== TABLES =====================

CREATE TABLE IF NOT EXISTS categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  color      text NOT NULL DEFAULT '#84cc16',
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name        text NOT NULL,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hidden_activities (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, activity_id)
);

CREATE TABLE IF NOT EXISTS planned_sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id    uuid REFERENCES activities(id) ON DELETE SET NULL,
  activity_name  text NOT NULL,
  category_name  text NOT NULL,
  category_color text NOT NULL DEFAULT '#84cc16',
  date           date NOT NULL,
  time_slot      text NOT NULL CHECK (time_slot IN ('Morning','Lunchtime','AfterWork','Evening')),
  status         text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','completed')),
  display_order  int NOT NULL DEFAULT 0,
  notes          text,
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  start_date date NOT NULL,
  end_date   date,
  notes      text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  visible_time_slots  text[] NOT NULL DEFAULT ARRAY['Lunchtime','Evening'],
  theme               text NOT NULL DEFAULT 'system' CHECK (theme IN ('light','dark','system')),
  updated_at          timestamptz DEFAULT now()
);

-- ===================== INDEXES =====================

CREATE INDEX IF NOT EXISTS idx_planned_sessions_user_date ON planned_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_events_user_dates ON events(user_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category_id);

-- ===================== ROW LEVEL SECURITY =====================

ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE hidden_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings    ENABLE ROW LEVEL SECURITY;

-- Categories: read system (user_id IS NULL) + own; write own only
CREATE POLICY "categories_select" ON categories
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "categories_insert" ON categories
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "categories_update" ON categories
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "categories_delete" ON categories
  FOR DELETE USING (user_id = auth.uid());

-- Activities: read system + own; write own only
CREATE POLICY "activities_select" ON activities
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "activities_insert" ON activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "activities_update" ON activities
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "activities_delete" ON activities
  FOR DELETE USING (user_id = auth.uid());

-- Hidden activities: own only
CREATE POLICY "hidden_activities_all" ON hidden_activities
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Planned sessions: own only
CREATE POLICY "planned_sessions_all" ON planned_sessions
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Events: own only
CREATE POLICY "events_all" ON events
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- User settings: own only
CREATE POLICY "user_settings_all" ON user_settings
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ===================== STARTER LIBRARY SEED =====================
-- System items have user_id = NULL and are readable by all authenticated users

-- Running
INSERT INTO categories (id, name, color, user_id) VALUES
  ('00000001-0000-0000-0000-000000000001', 'Running',  '#f97316', NULL),
  ('00000001-0000-0000-0000-000000000002', 'Gym',      '#6366f1', NULL),
  ('00000001-0000-0000-0000-000000000003', 'Cycling',  '#3b82f6', NULL),
  ('00000001-0000-0000-0000-000000000004', 'Swimming', '#06b6d4', NULL),
  ('00000001-0000-0000-0000-000000000005', 'Frisbee',  '#84cc16', NULL),
  ('00000001-0000-0000-0000-000000000006', 'Yoga',     '#a855f7', NULL),
  ('00000001-0000-0000-0000-000000000007', 'Climbing', '#ef4444', NULL),
  ('00000001-0000-0000-0000-000000000008', 'HIIT',     '#f59e0b', NULL)
ON CONFLICT (id) DO NOTHING;

-- Running activities
INSERT INTO activities (id, category_id, name, user_id) VALUES
  ('10000001-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', 'Intervals',  NULL),
  ('10000001-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000001', 'Easy Run',   NULL),
  ('10000001-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000001', 'Long Run',   NULL),
  ('10000001-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000001', 'Tempo Run',  NULL),
  -- Gym activities
  ('10000001-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000002', 'Upper Body', NULL),
  ('10000001-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000002', 'Lower Body', NULL),
  ('10000001-0000-0000-0000-000000000007', '00000001-0000-0000-0000-000000000002', 'Full Body',  NULL),
  ('10000001-0000-0000-0000-000000000008', '00000001-0000-0000-0000-000000000002', 'Core',       NULL),
  -- Cycling activities
  ('10000001-0000-0000-0000-000000000009', '00000001-0000-0000-0000-000000000003', 'Road Ride',       NULL),
  ('10000001-0000-0000-0000-000000000010', '00000001-0000-0000-0000-000000000003', 'Indoor Trainer',  NULL),
  ('10000001-0000-0000-0000-000000000011', '00000001-0000-0000-0000-000000000003', 'Hill Climb',      NULL),
  -- Swimming activities
  ('10000001-0000-0000-0000-000000000012', '00000001-0000-0000-0000-000000000004', 'Technique',   NULL),
  ('10000001-0000-0000-0000-000000000013', '00000001-0000-0000-0000-000000000004', 'Endurance',   NULL),
  ('10000001-0000-0000-0000-000000000014', '00000001-0000-0000-0000-000000000004', 'Open Water',  NULL),
  -- Frisbee activities
  ('10000001-0000-0000-0000-000000000015', '00000001-0000-0000-0000-000000000005', 'Training',    NULL),
  ('10000001-0000-0000-0000-000000000016', '00000001-0000-0000-0000-000000000005', 'Tournament',  NULL),
  ('10000001-0000-0000-0000-000000000017', '00000001-0000-0000-0000-000000000005', 'Casual',      NULL),
  -- Yoga activities
  ('10000001-0000-0000-0000-000000000018', '00000001-0000-0000-0000-000000000006', 'Vinyasa',     NULL),
  ('10000001-0000-0000-0000-000000000019', '00000001-0000-0000-0000-000000000006', 'Yin',         NULL),
  ('10000001-0000-0000-0000-000000000020', '00000001-0000-0000-0000-000000000006', 'Restorative', NULL),
  -- Climbing activities
  ('10000001-0000-0000-0000-000000000021', '00000001-0000-0000-0000-000000000007', 'Bouldering',  NULL),
  ('10000001-0000-0000-0000-000000000022', '00000001-0000-0000-0000-000000000007', 'Routes',      NULL),
  ('10000001-0000-0000-0000-000000000023', '00000001-0000-0000-0000-000000000007', 'Outdoor',     NULL),
  -- HIIT activities
  ('10000001-0000-0000-0000-000000000024', '00000001-0000-0000-0000-000000000008', 'Tabata',      NULL),
  ('10000001-0000-0000-0000-000000000025', '00000001-0000-0000-0000-000000000008', 'Circuit',     NULL),
  ('10000001-0000-0000-0000-000000000026', '00000001-0000-0000-0000-000000000008', 'Bootcamp',    NULL)
ON CONFLICT (id) DO NOTHING;
