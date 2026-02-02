-- Migration: Fix mensajes_n8n constraints and add handoff support
-- Date: 2026-02-01
-- Description:
--   1. Drop the channel CHECK constraint to allow n8n Postgres Chat Memory to work
--   2. Add assigned_to_human field for human handoff
--   3. Add media_type and media_url fields for multimedia messages
--   4. Add title column to appointments if missing

-- ============================================
-- 1. FIX mensajes_n8n table constraints
-- ============================================

-- Drop the CHECK constraint that's blocking n8n
ALTER TABLE mensajes_n8n DROP CONSTRAINT IF EXISTS mensajes_n8n_channel_check;

-- Add default value for channel (n8n memory doesn't set it)
ALTER TABLE mensajes_n8n ALTER COLUMN channel SET DEFAULT 'telegram';

-- Make channel nullable for backward compatibility with n8n
ALTER TABLE mensajes_n8n ALTER COLUMN channel DROP NOT NULL;

-- ============================================
-- 2. ADD human handoff support
-- ============================================

-- Add assigned_to_human flag to track conversations that need human attention
ALTER TABLE mensajes_n8n ADD COLUMN IF NOT EXISTS assigned_to_human BOOLEAN DEFAULT FALSE;
ALTER TABLE mensajes_n8n ADD COLUMN IF NOT EXISTS handoff_reason TEXT;
ALTER TABLE mensajes_n8n ADD COLUMN IF NOT EXISTS handoff_at TIMESTAMPTZ;

-- Add index for efficient filtering of human-assigned conversations
CREATE INDEX IF NOT EXISTS idx_mensajes_n8n_assigned_to_human
ON mensajes_n8n(session_id)
WHERE assigned_to_human = TRUE;

-- ============================================
-- 3. ADD multimedia support
-- ============================================

-- Add media fields to support images, audio, and files
ALTER TABLE mensajes_n8n ADD COLUMN IF NOT EXISTS media_type TEXT; -- 'image', 'audio', 'file', 'video'
ALTER TABLE mensajes_n8n ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE mensajes_n8n ADD COLUMN IF NOT EXISTS media_filename TEXT;
ALTER TABLE mensajes_n8n ADD COLUMN IF NOT EXISTS media_size INTEGER;

-- ============================================
-- 4. FIX appointments table (ensure title and notes exist)
-- ============================================

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- 5. ADD ai_enabled to patients if missing
-- ============================================

ALTER TABLE patients ADD COLUMN IF NOT EXISTS ai_enabled BOOLEAN DEFAULT TRUE;

-- ============================================
-- 6. CREATE conversation_settings table for per-conversation settings
-- ============================================

CREATE TABLE IF NOT EXISTS conversation_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL UNIQUE,
    ai_enabled BOOLEAN DEFAULT TRUE,
    assigned_to_human BOOLEAN DEFAULT FALSE,
    handoff_reason TEXT,
    handoff_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_conversation_settings_session_id
ON conversation_settings(session_id);

-- ============================================
-- 7. UPDATE RLS policies
-- ============================================

-- Enable RLS on conversation_settings
ALTER TABLE conversation_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read and update conversation settings
CREATE POLICY IF NOT EXISTS "Allow authenticated read conversation_settings"
ON conversation_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated update conversation_settings"
ON conversation_settings FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated insert conversation_settings"
ON conversation_settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Grant permissions
GRANT ALL ON conversation_settings TO authenticated;
GRANT ALL ON conversation_settings TO service_role;
