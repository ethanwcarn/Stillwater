-- Stillwaters Seed Data
-- Run after schema.sql: psql -d stillwaters -f db/seed.sql

-- Make seed re-runnable without duplicate key errors
-- Truncating users with CASCADE also clears dependent auth/session,
-- therapist, and requested-session tables before reseeding demo data.
TRUNCATE TABLE
  user_post_bookmarks,
  post_comments,
  community_posts,
  requested_sessions,
  therapist_specialties, 
  therapists,
  users
RESTART IDENTITY CASCADE;

--------------------------------------------------
-- USERS
-- All seeded users share the demo password: Password123!
--------------------------------------------------
INSERT INTO users (id, email, password_hash, display_name, faith_tradition) VALUES
(1, 'sarah@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Sarah', 'Christianity'),
(2, 'mike@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Mike', 'Islam'),
(3, 'jordan@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Jordan', NULL),
(4, 'ana@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Ana', 'Judaism'),
(5, 'priya@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Priya', 'Hinduism'),
(6, 'tenzin@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Tenzin', 'Buddhism'),
(7, 'maria@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Maria', 'Catholicism'),
(8, 'david@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'David', 'Latter-day Saint'),
(9, 'amina@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Amina', 'Islam'),
(10, 'rachel@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Rachel', 'Judaism'),
(11, 'noah@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Noah', 'Christianity'),
(12, 'layla@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Layla', 'Islam'),
(13, 'aaron@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Aaron', 'Judaism'),
(14, 'isha@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Isha', 'Hinduism'),
(15, 'ming@example.com', '$2b$12$F6dLq31meG51ts8TNKTT9.PODOpvyOhw344FXg0dop3P1Nwt4p.Ve', 'Ming', 'Buddhism');

--------------------------------------------------
-- THERAPISTS
-- Uses upsert so the insert stays idempotent if this file is adapted
-- or re-run against a partially seeded database.
-- photo_url is provided for the first 5 therapists.
--------------------------------------------------
INSERT INTO therapists (id, name, credentials, bio, faith_tradition, photo_url) VALUES
(1,  'Dr. Elena Rivera',  'PhD, LPC',    'Faith-integrated therapist with 15 years of experience supporting anxiety, depression, and grief.',   'Christianity',   '/therapists/amanda.jpg'),
(2,  'Ahmed Hassan',      'LCSW',        'Provides culturally sensitive mental health support with attention to faith and community.',             'Islam',          '/therapists/marcus.jpg'),
(3,  'Rachel Cohen',      'LCSW',        'Works with individuals and families navigating grief and life transitions.',                            'Judaism',        '/therapists/jeanine.jpg'),
(4,  'Priya Patel',       'LMFT',        'Supports couples and families with culturally aware and spiritually respectful care.',                  'Hinduism',       '/therapists/priya.jpg'),
(5,  'Tenzin Dorje',      'PhD',         'Uses mindfulness-based approaches to help manage stress and anxiety.',                                  'Buddhism',       '/therapists/sophia.jpg'),
(6,  'Maria Lopez',       'LCMHC',       'Provides trauma-informed therapy with a compassionate, faith-aware approach.',                         'Catholicism',    NULL),
(7,  'James Walker',      'LPC',         'Helps clients with addiction recovery, depression, and purpose.',                                       'Latter-day Saint', NULL),
(8,  'Noor Siddiqui',     'LMHC',        'Specializes in women''s mental health and culturally responsive counseling.',                          'Islam',          NULL),
(9,  'Grace Kim',         'LCSW',        'Supports teens and adults dealing with stress and relationships.',                                      'Christianity',   NULL),
(10, 'Daniel Stein',      'PhD, LMFT',   'Focuses on marriage, family relationships, and healing.',                                              'Judaism',        NULL),
(11, 'Liam O''Connor',    'LMFT',        'Helps individuals navigate anxiety and life transitions.',                                              'Christianity',   NULL),
(12, 'Fatima Khan',       'LCSW',        'Focuses on trauma recovery and culturally sensitive counseling.',                                       'Islam',          NULL),
(13, 'Ethan Goldberg',    'PhD',         'Works with families and couples to strengthen relationships.',                                          'Judaism',        NULL),
(14, 'Sofia Martinez',    'LCMHC',       'Supports clients dealing with depression and identity challenges.',                                     'Catholicism',    NULL),
(15, 'Arjun Mehta',       'LMFT',        'Provides holistic therapy integrating cultural and spiritual values.',                                  'Hinduism',       NULL),
(16, 'Mei Lin',           'LPC',         'Uses mindfulness and compassion-based approaches to reduce stress.',                                    'Buddhism',       NULL),
(17, 'Hannah Brooks',     'LCSW',        'Specializes in grief counseling and emotional healing.',                                                'Christianity',   NULL),
(18, 'Yusuf Ali',         'LMHC',        'Helps clients manage anxiety and emotional resilience.',                                                'Islam',          NULL),
(19, 'Rebecca Stein',     'LMFT',        'Supports families through conflict and life transitions.',                                              'Judaism',        NULL),
(20, 'Daniel Park',       'LPC',         'Works with young adults navigating stress and burnout.',                                                'Christianity',   NULL),

-- Sikhism (2)
(21, 'Gurpreet Kaur',     'LCSW',        'Integrates Sikh values of seva and simran into compassionate, community-focused therapy.',                 'Sikhism',        NULL),
(22, 'Harjinder Singh',   'PhD, LPC',    'Draws on Gurbani teachings to support clients through grief, identity, and life transitions.',             'Sikhism',        NULL),

-- Interfaith (2)
(23, 'Dr. Anika Patel',   'PhD, LMFT',   'Works across faith traditions to help clients find meaning and healing through shared spiritual values.',  'Interfaith',     NULL),
(24, 'Omar Khalil',       'LCSW',        'Bridges diverse spiritual backgrounds to offer inclusive, faith-sensitive mental health support.',          'Interfaith',     NULL),

-- Secular / No preference (2)
(25, 'Dr. Claire Hughes', 'PhD, LPC',    'Evidence-based therapist offering a non-religious, judgment-free space for growth and healing.',           'Secular / No preference', NULL),
(26, 'Marcus Webb',       'LMHC',        'Specializes in CBT and mindfulness for clients who prefer a secular therapeutic approach.',                'Secular / No preference', NULL),

-- Other (2)
(27, 'Leila Nasser',      'LCSW',        'Supports clients whose spiritual lives fall outside mainstream traditions with warmth and openness.',      'Other',          NULL),
(28, 'Dr. Sam Flores',    'PhD',         'Works with clients from emerging and indigenous spiritual traditions to promote holistic well-being.',      'Other',          NULL)
ON CONFLICT (id) DO UPDATE SET
  photo_url       = EXCLUDED.photo_url,
  name            = EXCLUDED.name,
  credentials     = EXCLUDED.credentials,
  bio             = EXCLUDED.bio,
  faith_tradition = EXCLUDED.faith_tradition;

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
(20, 'Stress Management'), (20, 'Young Adult Support'),
(21, 'Grief'), (21, 'Identity'), (21, 'Cultural Adjustment'),
(22, 'Grief'), (22, 'Life Transitions'), (22, 'Spiritual Growth'),
(23, 'Interfaith Counseling'), (23, 'Anxiety'), (23, 'Life Transitions'),
(24, 'Interfaith Counseling'), (24, 'Trauma'), (24, 'Depression'),
(25, 'Anxiety'), (25, 'CBT'), (25, 'Depression'),
(26, 'Mindfulness'), (26, 'Stress Management'), (26, 'Burnout'),
(27, 'Identity'), (27, 'Anxiety'), (27, 'Spiritual Growth'),
(28, 'Cultural Identity'), (28, 'Grief'), (28, 'Self-Discovery')
ON CONFLICT (therapist_id, specialty) DO NOTHING;

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

-- Reset sequences after inserting explicit IDs
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);
SELECT setval('therapists_id_seq', (SELECT MAX(id) FROM therapists), true);
SELECT setval('community_posts_id_seq', (SELECT MAX(id) FROM community_posts), true);


--------------------------------------------------
-- REQUESTED SESSIONS 
--------------------------------------------------
INSERT INTO requested_sessions (user_id, therapist_id, session_date, session_time, description) VALUES
(1, 1, '2026-04-10', '10:00', 'Initial consultation to discuss faith-integrated anxiety support.'),
(1, 2, '2026-04-15', '14:30', 'Follow-up on mindfulness techniques within a religious context.'),
(1, 3, '2026-05-01', '09:00', 'Exploring grief and life transitions.'),
(2, 2, '2026-04-12', '11:00', 'Discussion on community and faith-based wellness.');

-- Reset sequence for this table
SELECT setval('requested_sessions_id_seq', (SELECT MAX(id) FROM requested_sessions), true);