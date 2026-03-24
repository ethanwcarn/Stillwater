-- Stillwaters Seed Data
-- Run after schema.sql: psql -d stillwaters -f db/seed.sql

-- Reset tables so seed is re-runnable
TRUNCATE TABLE
  user_post_bookmarks,
  post_comments,
  community_posts,
  therapist_specialties,
  therapists,
  users
RESTART IDENTITY CASCADE;

--------------------------------------------------
-- USERS
--------------------------------------------------
INSERT INTO users (id, email, password_hash, display_name, faith_tradition) VALUES
(1, 'sarah@example.com', NULL, 'Sarah', 'Christianity'),
(2, 'mike@example.com', NULL, 'Mike', 'Islam'),
(3, 'jordan@example.com', NULL, 'Jordan', NULL),
(4, 'ana@example.com', NULL, 'Ana', 'Judaism'),
(5, 'priya@example.com', NULL, 'Priya', 'Hinduism'),
(6, 'tenzin@example.com', NULL, 'Tenzin', 'Buddhism'),
(7, 'maria@example.com', NULL, 'Maria', 'Catholicism'),
(8, 'david@example.com', NULL, 'David', 'Latter-day Saint'),
(9, 'amina@example.com', NULL, 'Amina', 'Islam'),
(10, 'rachel@example.com', NULL, 'Rachel', 'Judaism'),
(11, 'noah@example.com', NULL, 'Noah', 'Christianity'),
(12, 'layla@example.com', NULL, 'Layla', 'Islam'),
(13, 'aaron@example.com', NULL, 'Aaron', 'Judaism'),
(14, 'isha@example.com', NULL, 'Isha', 'Hinduism'),
(15, 'ming@example.com', NULL, 'Ming', 'Buddhism');

--------------------------------------------------
-- THERAPISTS
--------------------------------------------------
INSERT INTO therapists (id, name, credentials, bio, faith_tradition) VALUES
(1, 'Dr. Elena Rivera', 'PhD, LPC', 'Faith-integrated therapist with 15 years of experience supporting anxiety, depression, and grief.', 'Christianity'),
(2, 'Ahmed Hassan', 'LCSW', 'Provides culturally sensitive mental health support with attention to faith and community.', 'Islam'),
(3, 'Rachel Cohen', 'LCSW', 'Works with individuals and families navigating grief and life transitions.', 'Judaism'),
(4, 'Priya Patel', 'LMFT', 'Supports couples and families with culturally aware and spiritually respectful care.', 'Hinduism'),
(5, 'Tenzin Dorje', 'PhD', 'Uses mindfulness-based approaches to help manage stress and anxiety.', 'Buddhism'),
(6, 'Maria Lopez', 'LCMHC', 'Provides trauma-informed therapy with a compassionate, faith-aware approach.', 'Catholicism'),
(7, 'James Walker', 'LPC', 'Helps clients with addiction recovery, depression, and purpose.', 'Latter-day Saint'),
(8, 'Noor Siddiqui', 'LMHC', 'Specializes in women’s mental health and culturally responsive counseling.', 'Islam'),
(9, 'Grace Kim', 'LCSW', 'Supports teens and adults dealing with stress and relationships.', 'Christianity'),
(10, 'Daniel Stein', 'PhD, LMFT', 'Focuses on marriage, family relationships, and healing.', 'Judaism'),

(11, 'Liam O''Connor', 'LMFT', 'Helps individuals navigate anxiety and life transitions.', 'Christianity'),
(12, 'Fatima Khan', 'LCSW', 'Focuses on trauma recovery and culturally sensitive counseling.', 'Islam'),
(13, 'Ethan Goldberg', 'PhD', 'Works with families and couples to strengthen relationships.', 'Judaism'),
(14, 'Sofia Martinez', 'LCMHC', 'Supports clients dealing with depression and identity challenges.', 'Catholicism'),
(15, 'Arjun Mehta', 'LMFT', 'Provides holistic therapy integrating cultural and spiritual values.', 'Hinduism'),
(16, 'Mei Lin', 'LPC', 'Uses mindfulness and compassion-based approaches to reduce stress.', 'Buddhism'),
(17, 'Hannah Brooks', 'LCSW', 'Specializes in grief counseling and emotional healing.', 'Christianity'),
(18, 'Yusuf Ali', 'LMHC', 'Helps clients manage anxiety and emotional resilience.', 'Islam'),
(19, 'Rebecca Stein', 'LMFT', 'Supports families through conflict and life transitions.', 'Judaism'),
(20, 'Daniel Park', 'LPC', 'Works with young adults navigating stress and burnout.', 'Christianity');

--------------------------------------------------
-- THERAPIST SPECIALTIES
--------------------------------------------------
INSERT INTO therapist_specialties (therapist_id, specialty) VALUES
(1, 'Anxiety'), (1, 'Depression'), (1, 'Grief'),
(2, 'Trauma'), (2, 'Anxiety'), (2, 'Cultural Adjustment'),
(3, 'Grief'), (3, 'Family Therapy'), (3, 'Identity'),
(4, 'Couples Counseling'), (4, 'Family Therapy'), (4, 'Life Transitions'),
(5, 'Mindfulness'), (5, 'Stress Management'), (5, 'Anxiety'),
(6, 'Trauma'), (6, 'Depression'), (6, 'Women''s Mental Health'),
(7, 'Addiction Recovery'), (7, 'Depression'), (7, 'Self-Worth'),
(8, 'Women''s Mental Health'), (8, 'Anxiety'), (8, 'Burnout'),
(9, 'Teen Mental Health'), (9, 'Relationships'), (9, 'Stress Management'),
(10, 'Marriage Counseling'), (10, 'Family Therapy'), (10, 'Grief'),

(11, 'Anxiety'), (11, 'Life Transitions'),
(12, 'Trauma'), (12, 'Depression'),
(13, 'Family Therapy'), (13, 'Marriage Counseling'),
(14, 'Depression'), (14, 'Identity'),
(15, 'Stress Management'), (15, 'Cultural Identity'),
(16, 'Mindfulness'), (16, 'Anxiety'),
(17, 'Grief'), (17, 'Depression'),
(18, 'Anxiety'), (18, 'Burnout'),
(19, 'Family Therapy'), (19, 'Relationships'),
(20, 'Stress Management'), (20, 'Young Adult Support');

--------------------------------------------------
-- COMMUNITY POSTS
--------------------------------------------------
INSERT INTO community_posts (id, author_id, title, content) VALUES
(1, 1, 'Finding peace in prayer', 'Daily prayer has helped my anxiety. Even a few minutes makes a difference.'),
(2, 2, 'Ramadan and mental wellness', 'How do others balance fasting with mental health routines?'),
(3, 3, 'Meditation + faith', 'Anyone combine meditation with faith practice?'),
(4, 1, 'Gratitude journaling', 'Gratitude journaling has shifted my perspective.'),

(5, 5, 'Finding calm through routine', 'Small daily rituals help me stay grounded.'),
(6, 6, 'Mindfulness practice', 'Breathing exercises have been really helpful lately.'),
(7, 4, 'Leaning on community', 'Talking with others who understand has helped so much.'),
(8, 8, 'Hope during hard seasons', 'Small habits and support systems make a big difference.'),
(9, 11, 'Struggling with burnout', 'Balancing life and mental health is hard lately.'),
(10, 12, 'Faith during anxiety', 'How do you stay grounded when anxious?'),
(11, 13, 'Family expectations', 'Balancing expectations and mental health is tough.'),
(12, 14, 'Small habits matter', 'Little habits have improved my mental health.');

--------------------------------------------------
-- POST COMMENTS
--------------------------------------------------
INSERT INTO post_comments (post_id, author_id, content) VALUES
(1, 2, 'Prayer has helped me too.'),
(1, 3, 'Morning routines are powerful.'),
(2, 1, 'Sleep adjustments helped me during Ramadan.'),
(3, 4, 'Breath prayers are grounding.'),
(5, 10, 'Routines really do help.'),
(6, 5, 'Breathing exercises are amazing.'),
(7, 9, 'Community support changes everything.'),
(8, 6, 'Hope is powerful.'),
(9, 2, 'Burnout is real, you are not alone.'),
(10, 3, 'Staying grounded is hard but possible.');

--------------------------------------------------
-- BOOKMARKS
--------------------------------------------------
INSERT INTO user_post_bookmarks (user_id, post_id) VALUES
(1, 1),
(1, 4),
(2, 2),
(5, 6),
(6, 5),
(7, 7);