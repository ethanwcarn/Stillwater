-- Stillwaters Seed Data
-- Run after schema.sql: psql -d stillwaters -f db/seed.sql

-- Make seed re-runnable without duplicate key errors
-- Note: therapists and therapist_specialties are intentionally excluded from
-- the truncate so that therapists added by teammates are never wiped.
TRUNCATE TABLE
  user_post_bookmarks,
  post_comments,
  community_posts,
  users
RESTART IDENTITY CASCADE;

-- Users (id 1 = Sarah, test user)
INSERT INTO users (id, email, password_hash, display_name, faith_tradition) VALUES
(1, 'sarah@example.com', NULL, 'Sarah', 'Christianity'),
(2, 'mike@example.com', NULL, 'Mike', 'Islam'),
(3, 'jordan@example.com', NULL, 'Jordan', NULL),
(4, 'ana@example.com', NULL, 'Ana', 'Judaism');

-- Therapists
-- Uses upsert so re-running the seed never wipes therapists added by teammates.
-- Only photo_url and core fields are updated if the row already exists.
INSERT INTO therapists (id, name, credentials, bio, faith_tradition, photo_url) VALUES
(1, 'Dr. Amanda Chen',       'Ph.D. Clinical Psychology',               'Mindfulness-centered therapist integrating Buddhist philosophy with evidence-based practices.',     'Buddhism',     '/therapists/amanda.jpg'),
(2, 'Sophia Williams, LCSW', 'MSW, Licensed Clinical Social Worker',    'Faith-forward counselor specializing in family dynamics and spiritual growth.',                    'Christianity', '/therapists/sophia.jpg'),
(3, 'Marcus Johnson, Ph.D.', 'Ph.D. Counseling Psychology',             'Culturally sensitive therapist blending Islamic values with modern psychology.',                   'Islam',        '/therapists/marcus.jpg'),
(4, 'Jeanine Torres, LPC',   'M.A. Clinical Mental Health Counseling',  'Warm, empathetic counselor drawing on Jewish wisdom traditions for healing.',                      'Judaism',      '/therapists/jeanine.jpg'),
(5, 'Priya Sharma, Psy.D.',  'Psy.D., Licensed Psychologist',           'Holistic therapist combining Hindu philosophy with psychodynamic therapy.',                        'Hinduism',     '/therapists/priya.jpg')
ON CONFLICT (id) DO UPDATE SET
  photo_url       = EXCLUDED.photo_url,
  name            = EXCLUDED.name,
  credentials     = EXCLUDED.credentials,
  bio             = EXCLUDED.bio,
  faith_tradition = EXCLUDED.faith_tradition;

-- Therapist Specialties
-- Uses upsert so duplicate specialties are silently skipped.
INSERT INTO therapist_specialties (therapist_id, specialty) VALUES
(1, 'Anxiety'),
(1, 'Mindfulness'),
(1, 'Grief'),
(1, 'Stress Management'),
(2, 'Relationships'),
(2, 'Family'),
(2, 'Depression'),
(2, 'Spiritual Growth'),
(3, 'Depression'),
(3, 'Identity'),
(3, 'Anxiety'),
(3, 'Cultural Adjustment'),
(4, 'Grief'),
(4, 'Anxiety'),
(4, 'Life Transitions'),
(4, 'Relationships'),
(5, 'Stress Management'),
(5, 'Self-Discovery'),
(5, 'Anxiety'),
(5, 'Mindfulness')
ON CONFLICT (therapist_id, specialty) DO NOTHING;

-- Community Posts
INSERT INTO community_posts (id, author_id, title, content) VALUES
(1, 1, 'Finding peace in prayer', 'I wanted to share how daily prayer has helped my anxiety. Even five minutes of quiet reflection makes a difference.'),
(2, 2, 'Ramadan and mental wellness', 'How do others balance fasting with their mental health routine? Looking for tips.'),
(3, 3, 'Meditation + faith', 'Anyone here combine meditation with their faith practice? Would love to hear your approach.'),
(4, 1, 'Gratitude journaling', 'Started a gratitude journal last month. Noticing small blessings has shifted my perspective.');

-- Post Comments
INSERT INTO post_comments (post_id, author_id, content) VALUES
(1, 2, 'Thank you for sharing. Prayer has been central to my own journey.'),
(1, 3, 'Same here! Morning prayer before the day starts really helps.'),
(2, 1, 'I found that adjusting my sleep schedule during Ramadan helped a lot.'),
(3, 4, 'I use breath prayers - short phrases with each breath. Very grounding.');

-- Sample bookmark: Sarah (user 1) has bookmarked post 1
INSERT INTO user_post_bookmarks (user_id, post_id) VALUES
(1, 1);
