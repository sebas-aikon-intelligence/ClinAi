-- Migration: Add title and notes columns to appointments table
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Date: 2026-01-28

-- Add title column (optional, for appointment description/motive)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS title TEXT;

-- Add notes column (optional, for additional appointment notes)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add comments to document the schema
COMMENT ON COLUMN appointments.title IS 'Optional appointment title/motive';
COMMENT ON COLUMN appointments.notes IS 'Optional additional notes for the appointment';
COMMENT ON COLUMN appointments.patient_id IS 'Optional patient reference - can be NULL for blocked time slots';
COMMENT ON COLUMN appointments.type IS 'Optional appointment type: consultation, follow_up, procedure, emergency';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND table_schema = 'public'
ORDER BY ordinal_position;
