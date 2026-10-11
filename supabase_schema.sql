-- ====================================================================
-- CreatorMatch AI - PostgreSQL & Supabase Relational Database Schema
-- Run this script in the Supabase Dashboard SQL Editor to initialize
-- all tables, constraints, indexes, and initial verified seed data.
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-initializing (safely in dependency order)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS collaboration_requests CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS creator_profiles CASCADE;
DROP TABLE IF EXISTS brand_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ====================================================================
-- 3. USERS TABLE
-- ====================================================================
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('brand', 'creator', 'admin')),
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 4. BRAND PROFILES TABLE
-- ====================================================================
CREATE TABLE brand_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  operating_duration TEXT,
  location TEXT,
  website TEXT,
  description TEXT,
  target_audience TEXT,
  logo TEXT,
  cover_image TEXT,
  products JSONB DEFAULT '[]'::jsonb,
  water_emission_liters NUMERIC DEFAULT 0,
  water_emission_saved_liters NUMERIC DEFAULT 0,
  diapers_distributed NUMERIC DEFAULT 0,
  eco_score NUMERIC DEFAULT 85,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. CREATOR PROFILES TABLE
-- ====================================================================
CREATE TABLE creator_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  handle TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  languages TEXT[] DEFAULT '{}',
  niche TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  highest_followers BIGINT DEFAULT 0,
  highest_followers_display TEXT,
  engagement_rate NUMERIC DEFAULT 0,
  engagement_display TEXT,
  social_urls JSONB DEFAULT '{}'::jsonb,
  portfolio JSONB DEFAULT '[]'::jsonb,
  past_brands TEXT[] DEFAULT '{}',
  water_saved_liters NUMERIC DEFAULT 0,
  eco_score NUMERIC DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 6. CAMPAIGNS TABLE
-- ====================================================================
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  brand_id TEXT REFERENCES brand_profiles(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  budget NUMERIC DEFAULT 0,
  budget_display TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'completed', 'paused')),
  product_image TEXT,
  guidelines TEXT[] DEFAULT '{}',
  deliverables JSONB DEFAULT '[]'::jsonb,
  target_audience JSONB DEFAULT '{}'::jsonb,
  creator_requirements JSONB DEFAULT '{}'::jsonb,
  invited_creator_ids TEXT[] DEFAULT '{}',
  applied_creator_ids TEXT[] DEFAULT '{}',
  accepted_creator_ids TEXT[] DEFAULT '{}',
  timeline JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 7. COLLABORATION REQUESTS & PITCHES TABLE
-- ====================================================================
CREATE TABLE collaboration_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('brand', 'creator')),
  receiver_id TEXT NOT NULL,
  receiver_role TEXT NOT NULL CHECK (receiver_role IN ('brand', 'creator')),
  brand_id TEXT,
  brand_name TEXT,
  brand_logo TEXT,
  creator_id TEXT,
  creator_name TEXT,
  creator_avatar TEXT,
  campaign_id TEXT,
  campaign_name TEXT,
  deliverable_type TEXT,
  pitch_video_url TEXT,
  pitch_video_title TEXT,
  concept_pitch TEXT,
  match_score NUMERIC DEFAULT 85,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'changes_requested')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. CONNECTIONS (NETWORKING) TABLE
-- ====================================================================
CREATE TABLE connections (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT,
  sender_avatar TEXT,
  sender_role TEXT,
  receiver_id TEXT NOT NULL,
  receiver_name TEXT,
  receiver_avatar TEXT,
  receiver_role TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 9. CONVERSATIONS & REALTIME MESSAGES
-- ====================================================================
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  brand_id TEXT NOT NULL,
  participant_id TEXT,
  participant_name TEXT,
  participant_avatar TEXT,
  participant_role TEXT,
  last_message TEXT,
  last_message_time TEXT,
  unread_count INT DEFAULT 0,
  campaign_context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT,
  sender_avatar TEXT,
  sender_role TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 10. NOTIFICATIONS TABLE
-- ====================================================================
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 11. INDEXES FOR HIGH-SPEED QUERYING
-- ====================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_brand_profiles_user ON brand_profiles(user_id);
CREATE INDEX idx_creator_profiles_user ON creator_profiles(user_id);
CREATE INDEX idx_campaigns_brand ON campaigns(brand_id);
CREATE INDEX idx_campaigns_category ON campaigns(category);
CREATE INDEX idx_collab_sender ON collaboration_requests(sender_id);
CREATE INDEX idx_collab_receiver ON collaboration_requests(receiver_id);
CREATE INDEX idx_collab_campaign ON collaboration_requests(campaign_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ====================================================================
-- 12. INITIAL SEED DATA
-- ====================================================================

-- Users
INSERT INTO users (id, email, password_hash, role, name, avatar) VALUES
('usr-calvin', 'calvin@creatormatch.ai', 'password123', 'brand', 'Calvin Klein Partnerships', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&auto=format&fit=crop&q=80'),
('usr-glowrush', 'glowrush@creatormatch.ai', 'password123', 'brand', 'GlowRush Cosmetics', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80'),
('usr-maya', 'maya@creatormatch.ai', 'password123', 'creator', 'Maya Patel', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'),
('usr-ananya', 'ananya@creatormatch.ai', 'password123', 'creator', 'Ananya Rao', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Brands
INSERT INTO brand_profiles (id, user_id, brand_name, industry, location, website, description, target_audience, logo, products) VALUES
('brand-calvin', 'usr-calvin', 'Calvin Fashion', 'Fashion & Apparel', 'Mumbai, India', 'https://calvinfashion.com', 'Contemporary luxury tailoring and minimalist seasonal streetwear.', 'Urban trendsetters aged 18-35', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&auto=format&fit=crop&q=80', '[{"name": "Autumn Tailored Wool Overcoat", "category": "Apparel", "description": "Italian double-faced wool coat", "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&auto=format&fit=crop&q=80"}]'::jsonb),
('brand-glowrush', 'usr-glowrush', 'GlowRush Cosmetics', 'Beauty & Skincare', 'Bengaluru, India', 'https://glowrush.in', 'Clean, science-backed skincare serums and glow hydrators.', 'Women aged 18-32', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80', '[{"name": "HydraDew Barrier Serum", "category": "Skincare", "description": "Ceramide-infused hydration elixir", "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Creators
INSERT INTO creator_profiles (id, user_id, creator_name, handle, avatar, bio, location, languages, niche, categories, highest_followers, highest_followers_display, engagement_rate, engagement_display, social_urls, portfolio, past_brands) VALUES
('creator-maya', 'usr-maya', 'Maya Patel', '@mayapatel', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', 'Architectural fashion transitions and minimalist luxury lookbooks.', 'Mumbai, India', '{"English", "Hindi"}', '{"Fashion", "Lifestyle"}', '{"Reels", "Lookbooks"}', 185000, '185K', 7.4, '7.4%', '{"instagram": "https://instagram.com/mayapatel"}'::jsonb, '[{"id": "p-1", "title": "Autumn Coat 3-Way Lookbook", "type": "reel", "url": "https://instagram.com/reel/1", "thumbnail": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&auto=format&fit=crop&q=80", "views": 240000, "engagement": 8.1}]'::jsonb, '{"Zara", "Calvin Fashion"}'),
('creator-ananya', 'usr-ananya', 'Ananya Rao', '@ananyarao', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', 'Clean skincare routines, glass skin hydration tests and morning vlog aesthetics.', 'Bengaluru, India', '{"English", "Hindi", "Kannada"}', '{"Beauty", "Skincare"}', '{"Routine Reels", "Product Reviews"}', 240000, '240K', 9.1, '9.1%', '{"instagram": "https://instagram.com/ananyarao"}'::jsonb, '[{"id": "p-2", "title": "7-Day Barrier Repair Test", "type": "reel", "url": "https://instagram.com/reel/2", "thumbnail": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80", "views": 310000, "engagement": 9.4}]'::jsonb, '{"GlowRush", "Laneige"}')
ON CONFLICT (id) DO NOTHING;

-- Campaigns
INSERT INTO campaigns (id, brand_id, brand_name, campaign_name, category, description, budget, budget_display, status, product_image, guidelines, deliverables, timeline) VALUES
('camp-calvin-autumn', 'brand-calvin', 'Calvin Fashion', 'Calvin Autumn Luxury Lookbook', 'Fashion & Apparel', 'Create a 30-second high-fashion transition reel showcasing the Autumn Tailored Overcoat in natural daylight.', 25000, '₹25,000', 'active', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop&q=80', '{"Vertical 9:16 format only", "Showcase coat movement in motion", "Include discount code in caption"}', '[{"id": "d-1", "type": "Instagram Reel", "quantity": 1, "reward": 20000}, {"id": "d-2", "type": "Story Set", "quantity": 2, "reward": 5000}]'::jsonb, '{"start": "2025-10-01", "end": "2025-10-31"}'::jsonb),
('camp-glowrush-hydra', 'brand-glowrush', 'GlowRush Cosmetics', 'HydraDew 7-Day Glow Challenge', 'Beauty & Skincare', '7-day honest skin hydration routine showing before-and-after texture improvement.', 18000, '₹18,000', 'active', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', '{"Natural lighting without filters", "Demonstrate dropper application", "Tag @glowrush in first line"}', '[{"id": "d-3", "type": "Instagram Reel", "quantity": 1, "reward": 18000}]'::jsonb, '{"start": "2025-10-05", "end": "2025-11-05"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
