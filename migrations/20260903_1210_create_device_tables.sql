-- Migration: Create Device Tables
-- Version: 1.0
-- Date: 2026-09-03
-- Description: Creates devices table with protocol and state enumerations

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Table: devices
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zones(id) ON DELETE RESTRICT,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    protocol VARCHAR(20) NOT NULL CHECK (protocol IN ('modbus-rtu', 'modbus-tcp', 'bacnet')),
    firmware_version VARCHAR(50),
    device_profile VARCHAR(100) NOT NULL,
    commissioning_state VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (commissioning_state IN ('pending', 'commissioned', 'decommissioned')),
    health_status VARCHAR(20) DEFAULT 'unknown'
        CHECK (health_status IN ('healthy', 'degraded', 'offline', 'unknown')),
    last_seen_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT devices_serial_not_empty CHECK (LENGTH(TRIM(serial_number)) > 0),
    CONSTRAINT devices_model_not_empty CHECK (LENGTH(TRIM(model)) > 0),
    CONSTRAINT devices_profile_not_empty CHECK (LENGTH(TRIM(device_profile)) > 0)
);

COMMENT ON TABLE devices IS 'HVAC zone controllers and devices';
COMMENT ON COLUMN devices.serial_number IS 'Globally unique device serial number';
COMMENT ON COLUMN devices.protocol IS 'Communication protocol: modbus-rtu, modbus-tcp, or bacnet';
COMMENT ON COLUMN devices.device_profile IS 'Device profile name (references device_profiles table)';
COMMENT ON COLUMN devices.commissioning_state IS 'Device commissioning state: pending, commissioned, or decommissioned';
COMMENT ON COLUMN devices.health_status IS 'Device health status: healthy, degraded, offline, or unknown';
COMMENT ON COLUMN devices.last_seen_at IS 'Last telemetry timestamp from device';

-- Indexes for device queries
CREATE INDEX IF NOT EXISTS idx_devices_zone ON devices(zone_id);
CREATE INDEX IF NOT EXISTS idx_devices_serial ON devices(serial_number);
CREATE INDEX IF NOT EXISTS idx_devices_protocol ON devices(protocol);
CREATE INDEX IF NOT EXISTS idx_devices_commissioning_state ON devices(commissioning_state);
CREATE INDEX IF NOT EXISTS idx_devices_health_status ON devices(health_status);
CREATE INDEX IF NOT EXISTS idx_devices_profile ON devices(device_profile);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_devices_zone_protocol ON devices(zone_id, protocol);
CREATE INDEX IF NOT EXISTS idx_devices_state_health ON devices(commissioning_state, health_status);

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- Drop devices table
-- DROP TABLE IF EXISTS devices CASCADE;

-- Note: Uncomment the above DROP statement when rolling back this migration
