-- Migration: Create Device Profiles Table
-- Version: 1.0
-- Date: 2026-09-03
-- Description: Creates device_profiles table with JSONB for profile requirements

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Table: device_profiles
CREATE TABLE IF NOT EXISTS device_profiles (
    id SERIAL PRIMARY KEY,
    profile_name VARCHAR(100) NOT NULL UNIQUE,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    required_points JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT device_profiles_unique_name_version UNIQUE(profile_name, version),
    CONSTRAINT device_profiles_name_not_empty CHECK (LENGTH(TRIM(profile_name)) > 0),
    CONSTRAINT device_profiles_version_not_empty CHECK (LENGTH(TRIM(version)) > 0),
    CONSTRAINT device_profiles_json_not_empty CHECK (required_points IS NOT NULL AND required_points != '{}'::jsonb)
);

COMMENT ON TABLE device_profiles IS 'Device profile definitions with required point specifications';
COMMENT ON COLUMN device_profiles.profile_name IS 'Profile identifier (e.g., hvac-zone-controller-v1)';
COMMENT ON COLUMN device_profiles.version IS 'Profile version (e.g., 1.0, 2.0)';
COMMENT ON COLUMN device_profiles.required_points IS 'JSONB object defining required points with their specifications';

-- Index for profile name lookups
CREATE INDEX IF NOT EXISTS idx_device_profiles_name ON device_profiles(profile_name);

-- GIN index for JSONB queries (enables efficient querying of required_points)
CREATE INDEX IF NOT EXISTS idx_device_profiles_required_points ON device_profiles USING GIN (required_points);

-- ============================================================================
-- Example JSONB Structure for required_points:
-- ============================================================================
-- {
--   "zone_temp": {
--     "engineering_unit": "degC",
--     "data_type": "int16",
--     "scaling_factor": 0.1,
--     "direction": "telemetry"
--   },
--   "setpoint_heat": {
--     "engineering_unit": "degC",
--     "data_type": "int16",
--     "scaling_factor": 0.1,
--     "direction": "both"
--   }
-- }

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- Drop device_profiles table
-- DROP TABLE IF NOT EXISTS device_profiles CASCADE;

-- Note: Uncomment the above DROP statement when rolling back this migration
