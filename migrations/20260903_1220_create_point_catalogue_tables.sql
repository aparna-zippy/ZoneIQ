-- Migration: Create Point Catalogue Tables
-- Version: 1.0
-- Date: 2026-09-03
-- Description: Creates points table for device telemetry and command points

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Table: points
CREATE TABLE IF NOT EXISTS points (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
    point_key VARCHAR(100) NOT NULL,
    engineering_unit VARCHAR(20) NOT NULL,
    data_type VARCHAR(20) NOT NULL 
        CHECK (data_type IN ('int16', 'uint16', 'int32', 'uint32', 'float32', 'bool')),
    scaling_factor DECIMAL(10, 6) DEFAULT 1.0,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('telemetry', 'command', 'both')),
    register_type VARCHAR(20) CHECK (register_type IN ('holding', 'input', 'coil', 'discrete')),
    register_address INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT points_unique_per_device UNIQUE(device_id, point_key),
    CONSTRAINT points_key_not_empty CHECK (LENGTH(TRIM(point_key)) > 0),
    CONSTRAINT points_unit_not_empty CHECK (LENGTH(TRIM(engineering_unit)) > 0),
    CONSTRAINT points_scaling_nonzero CHECK (scaling_factor != 0),
    CONSTRAINT points_register_address_positive CHECK (register_address IS NULL OR register_address >= 0)
);

COMMENT ON TABLE points IS 'Telemetry and command points for devices';
COMMENT ON COLUMN points.point_key IS 'Point identifier from controlled vocabulary (e.g., zone_temp, setpoint_heat)';
COMMENT ON COLUMN points.engineering_unit IS 'Engineering unit (e.g., degC, percent, ppm)';
COMMENT ON COLUMN points.data_type IS 'Data type for value interpretation';
COMMENT ON COLUMN points.scaling_factor IS 'Scaling factor applied to raw value (e.g., 0.1 for temperature)';
COMMENT ON COLUMN points.direction IS 'Point direction: telemetry (read-only), command (write-only), or both';
COMMENT ON COLUMN points.register_type IS 'Modbus register type (optional for BACnet)';
COMMENT ON COLUMN points.register_address IS 'Modbus register address (optional for BACnet)';
COMMENT ON COLUMN points.is_active IS 'Point active status (soft delete)';
COMMENT ON COLUMN points.created_by IS 'User who created the point (audit trail)';
COMMENT ON COLUMN points.updated_by IS 'User who last updated the point (audit trail)';

-- Indexes for point queries
CREATE INDEX IF NOT EXISTS idx_points_device ON points(device_id);
CREATE INDEX IF NOT EXISTS idx_points_key ON points(point_key);
CREATE INDEX IF NOT EXISTS idx_points_active ON points(is_active);
CREATE INDEX IF NOT EXISTS idx_points_device_active ON points(device_id, is_active);

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- Drop points table
-- DROP TABLE IF EXISTS points CASCADE;

-- Note: Uncomment the above DROP statement when rolling back this migration
