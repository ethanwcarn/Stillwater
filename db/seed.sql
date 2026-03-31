-- Stillwaters Seed Data
-- Run after schema.sql: psql -d stillwaters -f db/seed.sql

-- Make seed re-runnable without duplicate key errors
TRUNCATE TABLE
  user_post_bookmarks,
  post_comments,
  community_posts,
  therapist_specialties,
  therapists,
  users
RESTART IDENTITY CASCADE;

-- Users (id 1 = Sarah, test user)
INSERT INTO users (id, email, password_hash, display_name, faith_tradition) VALUES
(1, 'sarah@example.com', '$2b$10$.jaBnLU/oR4OdWtxjMUR6OiCsf7WwLzacDHNkU7HzFN9YPbJq14p6', 'Sarah', 'Christianity'),
(2, 'mike@example.com', NULL, 'Mike', 'Islam'),
(3, 'jordan@example.com', NULL, 'Jordan', NULL),
(4, 'ana@example.com', NULL, 'Ana', 'Judaism');

-- Therapists
INSERT INTO therapists (id, name, credentials, bio, faith_tradition) VALUES
(1, 'Dr. Elena Rivera', 'PhD, LPC', 'Faith-integrated therapist with 15 years experience.', 'Christianity'),
(2, 'Ahmed Hassan', 'LCSW', 'Provides culturally-sensitive mental health support.', 'Islam');

-- Therapist Specialties
INSERT INTO therapist_specialties (therapist_id, specialty) VALUES
(1, 'Anxiety'),
(1, 'Depression'),
(1, 'Grief'),
(2, 'Trauma'),
(2, 'Anxiety');

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
