-- Stillwaters Database Schema
-- Preferred run command: psql -d postgres -f db/schema.sql
--
-- Why run against "postgres" first?
-- This script creates the "stillwaters" database if it does not exist,
-- then switches into it before creating tables.

-- Create database if missing (PostgreSQL does not support CREATE DATABASE IF NOT EXISTS)
SELECT 'CREATE DATABASE stillwaters'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'stillwaters')\gexec

-- Ensure subsequent table creation runs inside the app database
\connect stillwaters

-- Drop existing tables (order matters for foreign keys)
DROP TABLE IF EXISTS user_post_bookmarks;
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS community_posts;
DROP TABLE IF EXISTS therapist_specialties;
DROP TABLE IF EXISTS therapists;
DROP TABLE IF EXISTS users;

-- 1. Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  display_name VARCHAR(255),
  faith_tradition VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Therapists
CREATE TABLE therapists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  credentials VARCHAR(255),
  bio TEXT,
  faith_tradition VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Therapist Specialties (many-to-many: therapist <-> specialty)
CREATE TABLE therapist_specialties (
  id SERIAL PRIMARY KEY,
  therapist_id INTEGER NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  specialty VARCHAR(100) NOT NULL,
  UNIQUE(therapist_id, specialty)
);

-- 4. Community Posts
CREATE TABLE community_posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Post Comments
CREATE TABLE post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Post Bookmarks (junction table)
CREATE TABLE user_post_bookmarks (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Indexes for common queries
CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_user_post_bookmarks_user ON user_post_bookmarks(user_id);
