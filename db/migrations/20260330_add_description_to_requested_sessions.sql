-- Migration to add description column to requested_sessions
ALTER TABLE requested_sessions 
ADD COLUMN IF NOT EXISTS description TEXT;