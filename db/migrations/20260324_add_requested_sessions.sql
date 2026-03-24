CREATE TABLE IF NOT EXISTS requested_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id INTEGER NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_requested_sessions_unique_slot
  ON requested_sessions(therapist_id, session_date, session_time);

CREATE INDEX IF NOT EXISTS idx_requested_sessions_user_id
  ON requested_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_requested_sessions_therapist_id
  ON requested_sessions(therapist_id);
