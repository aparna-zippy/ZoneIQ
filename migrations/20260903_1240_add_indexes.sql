-- Migration: Add Additional Indexes for Performance
-- Version: 1.0
-- Date: 2026-09-03
-- Description: Adds composite and covering indexes for common query patterns

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Composite index for zone filtering by building (through floor)
-- This helps with queries that filter zones by building_id
CREATE INDEX IF NOT EXISTS idx_floors_building_id_include_zones 
    ON floors(building_id) 
    INCLUDE (id);

-- Composite index for hierarchical queries (zone -> floor -> building -> portfolio)
CREATE INDEX IF NOT EXISTS idx_zones_floor_include_id 
    ON zones(floor_id) 
    INCLUDE (id, name, code);

-- Partial index for active points (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_points_device_active_only 
    ON points(device_id) 
    WHERE is_active = TRUE;

-- Index for device last_seen_at queries (finding offline devices)
CREATE INDEX IF NOT EXISTS idx_devices_last_seen 
    ON devices(last_seen_at) 
    WHERE last_seen_at IS NOT NULL;

-- Partial index for commissioned devices (most common operational state)
CREATE INDEX IF NOT EXISTS idx_devices_commissioned 
    ON devices(zone_id, protocol) 
    WHERE commissioning_state = 'commissioned';

-- Index for audit trail queries on points
CREATE INDEX IF NOT EXISTS idx_points_updated_at 
    ON points(updated_at DESC);

-- Index for device profile lookups with version
CREATE INDEX IF NOT EXISTS idx_device_profiles_name_version 
    ON device_profiles(profile_name, version);

-- ============================================================================
-- Performance Notes:
-- ============================================================================
-- 1. INCLUDE indexes (PostgreSQL 11+) avoid heap lookups for covered columns
-- 2. Partial indexes reduce index size and improve write performance
-- 3. DESC indexes optimize ORDER BY ... DESC queries
-- 4. Composite indexes should match common WHERE clause patterns

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- Drop performance indexes
-- DROP INDEX IF EXISTS idx_floors_building_id_include_zones;
-- DROP INDEX IF EXISTS idx_zones_floor_include_id;
-- DROP INDEX IF EXISTS idx_points_device_active_only;
-- DROP INDEX IF EXISTS idx_devices_last_seen;
-- DROP INDEX IF EXISTS idx_devices_commissioned;
-- DROP INDEX IF EXISTS idx_points_updated_at;
-- DROP INDEX IF EXISTS idx_device_profiles_name_version;

-- Note: Uncomment the above DROP statements when rolling back this migration
