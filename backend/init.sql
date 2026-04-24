-- SnapLink URL Shortener Database Schema
-- This script creates the urls table for storing URL mappings and analytics

-- Create urls table if it doesn't exist
CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on short_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);

-- Create index on original_url for duplicate detection
CREATE INDEX IF NOT EXISTS idx_original_url ON urls(original_url);

-- Display table information
\d urls
