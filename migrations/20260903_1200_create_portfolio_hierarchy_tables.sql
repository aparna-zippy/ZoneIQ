-- Migration: Create Portfolio Hierarchy Tables
-- Version: 1.0
-- Date: 2026-09-03
-- Description: Creates portfolios, buildings, floors, and zones tables with proper constraints

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Table: portfolios
CREATE TABLE IF NOT EXISTS portfolios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT portfolios_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT portfolios_code_not_empty CHECK (LENGTH(TRIM(code)) > 0)
);

COMMENT ON TABLE portfolios IS 'Top-level portfolio entities containing buildings';
COMMENT ON COLUMN portfolios.code IS 'Globally unique portfolio code';

-- Index for portfolio code lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_code ON portfolios(code);

-- ============================================================================

-- Table: buildings
CREATE TABLE IF NOT EXISTS buildings (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT buildings_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT buildings_code_not_empty CHECK (LENGTH(TRIM(code)) > 0),
    CONSTRAINT buildings_unique_code_per_portfolio UNIQUE(portfolio_id, code)
);

COMMENT ON TABLE buildings IS 'Buildings within a portfolio';
COMMENT ON COLUMN buildings.code IS 'Building code unique within portfolio';
COMMENT ON CONSTRAINT buildings_unique_code_per_portfolio ON buildings IS 'Building code must be unique within a portfolio';

-- Indexes for building queries
CREATE INDEX IF NOT EXISTS idx_buildings_portfolio ON buildings(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_buildings_code ON buildings(code);

-- ============================================================================

-- Table: floors
CREATE TABLE IF NOT EXISTS floors (
    id SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL REFERENCES buildings(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT floors_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT floors_code_not_empty CHECK (LENGTH(TRIM(code)) > 0),
    CONSTRAINT floors_unique_code_per_building UNIQUE(building_id, code)
);

COMMENT ON TABLE floors IS 'Floors within a building';
COMMENT ON COLUMN floors.code IS 'Floor code unique within building';

-- Indexes for floor queries
CREATE INDEX IF NOT EXISTS idx_floors_building ON floors(building_id);
CREATE INDEX IF NOT EXISTS idx_floors_code ON floors(code);

-- ============================================================================

-- Table: zones
CREATE TABLE IF NOT EXISTS zones (
    id SERIAL PRIMARY KEY,
    floor_id INTEGER NOT NULL REFERENCES floors(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    area_sqm DECIMAL(10, 2),
    max_occupancy INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT zones_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT zones_code_not_empty CHECK (LENGTH(TRIM(code)) > 0),
    CONSTRAINT zones_area_positive CHECK (area_sqm IS NULL OR area_sqm > 0),
    CONSTRAINT zones_occupancy_positive CHECK (max_occupancy IS NULL OR max_occupancy > 0),
    CONSTRAINT zones_unique_code_per_floor UNIQUE(floor_id, code)
);

COMMENT ON TABLE zones IS 'HVAC zones within a floor';
COMMENT ON COLUMN zones.area_sqm IS 'Zone area in square meters (optional)';
COMMENT ON COLUMN zones.max_occupancy IS 'Maximum occupancy count (optional)';

-- Indexes for zone queries
CREATE INDEX IF NOT EXISTS idx_zones_floor ON zones(floor_id);
CREATE INDEX IF NOT EXISTS idx_zones_code ON zones(code);

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- Drop tables in reverse order (respecting foreign key dependencies)
-- DROP TABLE IF EXISTS zones CASCADE;
-- DROP TABLE IF EXISTS floors CASCADE;
-- DROP TABLE IF EXISTS buildings CASCADE;
-- DROP TABLE IF EXISTS portfolios CASCADE;

-- Note: Uncomment the above DROP statements when rolling back this migration
