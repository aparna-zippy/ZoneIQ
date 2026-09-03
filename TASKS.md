# Implementation Tasks: Asset Management & Point Catalogue

**Project:** ZoneIQ HVAC Fleet Platform  
**Specification:** spec.md v1.0  
**Implementation Plan:** PLAN.md  
**Feature Branch:** HVAC_FEATURE  
**Task Breakdown Date:** 2026-09-03

---

## Task Overview

**Total Tasks:** 127  
**Total Story Points:** 265  
**Estimated Duration:** 8 weeks  
**Sprint Structure:** 4 sprints × 2 weeks

### Tasks by Phase
- **Phase 1 - Database & Repository:** 42 tasks (85 points)
- **Phase 2 - API Layer:** 45 tasks (95 points)
- **Phase 3 - Business Logic:** 20 tasks (40 points)
- **Phase 4 - Testing & Performance:** 15 tasks (30 points)
- **Phase 5 - Deployment:** 5 tasks (15 points)

---

## Sprint 1: Database Foundation & Core Repositories (Week 1-2)

### Epic: Database Schema & Migrations
**Goal:** Create production-ready database schema with migrations

---

#### TASK-001: Set Up Migration Infrastructure
**Story:** Foundation  
**Priority:** Critical  
**Points:** 3  
**Dependencies:** None

**Description:**
Set up database migration tooling and establish migration conventions for the project.

**Acceptance Criteria:**
- [ ] Migration tool configured (TypeORM/Prisma/Knex selected and installed)
- [ ] Migration environments configured (dev, test, staging, prod)
- [ ] Migration naming convention documented (YYYYMMDD_HHMM_description.sql)
- [ ] Rollback procedures documented
- [ ] Migration template created
- [ ] Team can run migrations up/down successfully

**Technical Notes:**
- Consider TypeORM for TypeScript projects or Knex for flexibility
- Ensure migration tool supports PostgreSQL 14+ features
- Test rollback procedures on sample migration

---

#### TASK-002: Create Portfolio Hierarchy Tables Migration
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-001

**Description:**
Create database migration for portfolios, buildings, floors, and zones tables with proper constraints.

**Acceptance Criteria:**
- [ ] Migration file created: `20260903_1200_create_portfolio_hierarchy_tables.sql`
- [ ] `portfolios` table created with id, name, code, timestamps
- [ ] `buildings` table created with foreign key to portfolios
- [ ] `floors` table created with foreign key to buildings
- [ ] `zones` table created with foreign key to floors
- [ ] All unique constraints applied (portfolio code, building code per portfolio, etc.)
- [ ] All indexes created (idx_portfolios_code, idx_buildings_portfolio, etc.)
- [ ] Migration runs successfully both up and down
- [ ] Foreign key constraints enforce referential integrity

**SQL Schema Reference:**
```sql
-- portfolios: id, name, code (unique), created_at, updated_at
-- buildings: id, portfolio_id (FK), name, code, address, timestamps
-- floors: id, building_id (FK), name, code, timestamps
-- zones: id, floor_id (FK), name, code, area_sqm, max_occupancy, timestamps
```

---

#### TASK-003: Create Device Tables Migration
**Story:** User Story 1.2 (Manage Device Inventory)  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-002

**Description:**
Create database migration for devices table with protocol and state enumerations.

**Acceptance Criteria:**
- [ ] Migration file created: `20260903_1210_create_device_tables.sql`
- [ ] `devices` table created with all required fields
- [ ] CHECK constraint on protocol (modbus-rtu, modbus-tcp, bacnet)
- [ ] CHECK constraint on commissioning_state (pending, commissioned, decommissioned)
- [ ] CHECK constraint on health_status (healthy, degraded, offline, unknown)
- [ ] UNIQUE constraint on serial_number
- [ ] Foreign key to zones enforced
- [ ] Indexes created (zone_id, serial, protocol, states, profile)
- [ ] Migration tested with rollback

**Schema Fields:**
```
id, zone_id (FK), serial_number (unique), model, protocol, firmware_version,
device_profile, commissioning_state, health_status, last_seen_at, timestamps
```

---

#### TASK-004: Create Point Catalogue Tables Migration
**Story:** User Story 2.1 (Define Device Points)  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-003

**Description:**
Create database migration for points table with data type and direction constraints.

**Acceptance Criteria:**
- [ ] Migration file created: `20260903_1220_create_point_catalogue_tables.sql`
- [ ] `points` table created with all fields
- [ ] CHECK constraint on data_type (int16, uint16, int32, uint32, float32, bool)
- [ ] CHECK constraint on direction (telemetry, command, both)
- [ ] CHECK constraint on register_type (holding, input, coil, discrete)
- [ ] UNIQUE constraint on (device_id, point_key)
- [ ] Audit fields included (created_by, updated_by)
- [ ] Indexes created (device_id, point_key, is_active)
- [ ] Migration tested with rollback

---

#### TASK-005: Create Device Profiles Table Migration
**Story:** User Story 2.2 (Enforce Device Profile Consistency)  
**Priority:** High  
**Points:** 3  
**Dependencies:** TASK-004

**Description:**
Create device_profiles table with JSONB for profile requirements.

**Acceptance Criteria:**
- [ ] Migration file created: `20260903_1230_create_device_profiles_table.sql`
- [ ] `device_profiles` table created
- [ ] JSONB field for required_points configured
- [ ] UNIQUE constraint on (profile_name, version)
- [ ] Index on profile_name
- [ ] Sample JSONB structure validated
- [ ] Migration tested

---

#### TASK-006: Create Additional Indexes Migration
**Story:** Performance optimization  
**Priority:** Medium  
**Points:** 2  
**Dependencies:** TASK-005

**Description:**
Add composite and covering indexes for common query patterns.

**Acceptance Criteria:**
- [ ] Migration file created: `20260903_1240_add_indexes.sql`
- [ ] Composite indexes for filtering (e.g., devices by zone + protocol)
- [ ] Indexes for pagination queries
- [ ] Index rationale documented
- [ ] Query performance benchmarked before/after
- [ ] Migration tested

---

#### TASK-007: Seed Device Profiles Migration
**Story:** User Story 2.2 (Enforce Device Profile Consistency)  
**Priority:** High  
**Points:** 2  
**Dependencies:** TASK-005

**Description:**
Create seed migration for hvac-zone-controller-v1 device profile.

**Acceptance Criteria:**
- [ ] Migration file created: `20260903_1250_seed_device_profiles.sql`
- [ ] hvac-zone-controller-v1 profile inserted
- [ ] Profile includes 12 required points (temp, humidity, CO2, setpoints, etc.)
- [ ] JSONB structure matches specification
- [ ] Rollback removes seed data
- [ ] Profile loadable by application

**Profile Points:**
```
zone_temp, zone_humidity, zone_co2, setpoint_heat, setpoint_cool,
damper_position, valve_position, fan_speed, occupancy_count,
occupancy_detected, alarm_status, system_mode
```

---

### Epic: Repository Layer Implementation
**Goal:** Build data access layer with full CRUD operations

---

#### TASK-008: Create Base Repository Infrastructure
**Story:** Foundation  
**Priority:** Critical  
**Points:** 3  
**Dependencies:** TASK-001

**Description:**
Set up base repository patterns and utilities.

**Acceptance Criteria:**
- [ ] Base repository interface/abstract class created
- [ ] Pagination utilities implemented (PaginationDto, PagedResult)
- [ ] DTO base classes created
- [ ] Database connection pool configured
- [ ] Transaction management utilities created
- [ ] Error handling patterns established

---

#### TASK-009: Implement PortfolioRepository
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-002, TASK-008

**Description:**
Implement PortfolioRepository with CRUD operations and integrity checks.

**Acceptance Criteria:**
- [ ] PortfolioRepository interface defined
- [ ] create(portfolio) implemented
- [ ] findById(id) implemented
- [ ] findByCode(code) implemented
- [ ] list(pagination) implemented
- [ ] update(id, portfolio) implemented
- [ ] delete(id) implemented
- [ ] hasBuildings(id) implemented for integrity check
- [ ] Unit tests written (8 minimum)
- [ ] All tests passing

**Test Cases:**
- Create portfolio with valid data
- Create portfolio with duplicate code fails
- Find by ID returns correct portfolio
- List with pagination works correctly
- Update portfolio succeeds
- Delete portfolio without buildings succeeds
- Delete portfolio with buildings fails
- hasBuildings returns correct boolean

---

#### TASK-010: Implement BuildingRepository
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-002, TASK-008

**Description:**
Implement BuildingRepository with portfolio relationship handling.

**Acceptance Criteria:**
- [ ] BuildingRepository interface defined
- [ ] create(building) implemented with portfolio FK validation
- [ ] findById(id) implemented
- [ ] findByPortfolioAndCode(portfolioId, code) implemented
- [ ] listByPortfolio(portfolioId, pagination) implemented
- [ ] update(id, building) implemented
- [ ] delete(id) implemented
- [ ] hasFloors(id) implemented
- [ ] Unit tests written (8 minimum)
- [ ] All tests passing

---

#### TASK-011: Implement FloorRepository
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** Critical  
**Points:** 4  
**Dependencies:** TASK-002, TASK-008

**Description:**
Implement FloorRepository with building relationship.

**Acceptance Criteria:**
- [ ] FloorRepository interface defined
- [ ] All CRUD operations implemented
- [ ] findByBuildingAndCode(buildingId, code) implemented
- [ ] listByBuilding(buildingId, pagination) implemented
- [ ] hasZones(id) implemented
- [ ] Unit tests written (8 minimum)
- [ ] All tests passing

---

#### TASK-012: Implement ZoneRepository
**Story:** User Story 1.3 (List and Filter Assets)  
**Priority:** Critical  
**Points:** 6  
**Dependencies:** TASK-002, TASK-008

**Description:**
Implement ZoneRepository with multi-filter support.

**Acceptance Criteria:**
- [ ] ZoneRepository interface defined with ZoneFilterDto
- [ ] create(zone) implemented
- [ ] findById(id) implemented
- [ ] list(filters, pagination) implemented
- [ ] Filter by buildingId works correctly
- [ ] Filter by floorId works correctly
- [ ] Multiple filters combined correctly
- [ ] update(id, zone) implemented
- [ ] delete(id) implemented
- [ ] hasDevices(id) implemented
- [ ] Unit tests written (10 minimum)
- [ ] All tests passing

**Filter Test Cases:**
- Filter by building only
- Filter by floor only
- Filter by building AND floor
- Pagination with filters
- Empty result sets

---

#### TASK-013: Implement DeviceRepository
**Story:** User Story 1.2, 1.3 (Manage Device Inventory, Filter Assets)  
**Priority:** Critical  
**Points:** 7  
**Dependencies:** TASK-003, TASK-008

**Description:**
Implement DeviceRepository with comprehensive filtering.

**Acceptance Criteria:**
- [ ] DeviceRepository interface defined with DeviceFilterDto
- [ ] create(device) implemented with zone FK validation
- [ ] findById(id) implemented
- [ ] findBySerial(serialNumber) implemented
- [ ] list(filters, pagination) implemented
- [ ] Filter by zone_id works
- [ ] Filter by protocol works
- [ ] Filter by commissioning_state works
- [ ] Filter by health_status works
- [ ] Filter by device_profile works
- [ ] Multiple filters combined correctly
- [ ] update(id, device) implemented
- [ ] delete(id) implemented
- [ ] updateLastSeen(id, timestamp) implemented
- [ ] Unit tests written (12 minimum)
- [ ] All tests passing

---

#### TASK-014: Implement PointRepository
**Story:** User Story 2.1, 2.3 (Define Device Points, Manage Point Catalogue)  
**Priority:** Critical  
**Points:** 6  
**Dependencies:** TASK-004, TASK-008

**Description:**
Implement PointRepository with audit trail support.

**Acceptance Criteria:**
- [ ] PointRepository interface defined
- [ ] create(point) implemented with unique constraint check
- [ ] findById(id) implemented
- [ ] findByDeviceAndKey(deviceId, pointKey) implemented
- [ ] listByDevice(deviceId, activeOnly) implemented
- [ ] update(id, point, userId) implemented with audit
- [ ] deactivate(id, userId) implemented with audit
- [ ] hasActiveReadings(id) implemented (stub for now)
- [ ] Audit fields (created_by, updated_by) populated correctly
- [ ] Unit tests written (10 minimum)
- [ ] All tests passing

---

#### TASK-015: Implement DeviceProfileRepository
**Story:** User Story 2.2 (Enforce Device Profile Consistency)  
**Priority:** High  
**Points:** 8  
**Dependencies:** TASK-005, TASK-008

**Description:**
Implement DeviceProfileRepository with profile validation logic.

**Acceptance Criteria:**
- [ ] DeviceProfileRepository interface defined
- [ ] findByName(profileName) implemented
- [ ] validateDevicePoints(deviceId) implemented
- [ ] Missing points detection works correctly
- [ ] Engineering unit mismatch detection works
- [ ] Data type mismatch detection works
- [ ] Scaling factor mismatch detection works (within tolerance)
- [ ] ProfileValidationResult properly structured
- [ ] Unit tests written (8 minimum)
- [ ] All tests passing

**Validation Logic:**
- Load profile from database
- Load all points for device
- Check all required points present
- Validate each point's unit, type, scaling
- Return comprehensive validation result

---

#### TASK-016: Write Integration Tests for Full Hierarchy
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** High  
**Points:** 5  
**Dependencies:** TASK-009, TASK-010, TASK-011, TASK-012

**Description:**
Create integration tests for complete portfolio hierarchy creation.

**Acceptance Criteria:**
- [ ] Test: Create Portfolio → Building → Floor → Zone succeeds
- [ ] Test: Full hierarchy retrieval with joins works
- [ ] Test: Cascade query from zone to portfolio works
- [ ] Test: Transaction rollback on hierarchy creation failure
- [ ] Test: Concurrent hierarchy creation handles conflicts
- [ ] All integration tests passing

---

#### TASK-017: Write Integrity Constraint Integration Tests
**Story:** User Story 1.4 (Protect Hierarchy Integrity)  
**Priority:** High  
**Points:** 4  
**Dependencies:** TASK-009, TASK-010, TASK-011, TASK-012

**Description:**
Test deletion protection at all hierarchy levels.

**Acceptance Criteria:**
- [ ] Test: Cannot delete portfolio with buildings
- [ ] Test: Cannot delete building with floors
- [ ] Test: Cannot delete floor with zones
- [ ] Test: Cannot delete zone with devices
- [ ] Test: Can delete empty entities
- [ ] Test: hasChildren methods return correct counts
- [ ] All integration tests passing

---

## Sprint 2: API Layer - Portfolio & Devices (Week 3-4)

### Epic: Portfolio Hierarchy API Endpoints
**Goal:** Expose portfolio hierarchy management via REST API

---

#### TASK-018: Set Up API Framework
**Story:** Foundation  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** None

**Description:**
Configure Express.js/NestJS API framework with middleware.

**Acceptance Criteria:**
- [ ] API framework installed and configured
- [ ] CORS middleware configured
- [ ] Body parser middleware configured
- [ ] Request logging middleware added
- [ ] Error handling middleware created
- [ ] Routing structure established (/api/v1)
- [ ] Environment variable configuration
- [ ] Health check endpoint (/health) working

---

#### TASK-019: Create API Base Infrastructure
**Story:** Foundation  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-018

**Description:**
Build reusable API components and utilities.

**Acceptance Criteria:**
- [ ] Base controller class created
- [ ] Standardized response format implemented
- [ ] Validation utilities created
- [ ] DTO validation decorators configured
- [ ] Pagination helpers created
- [ ] HTTP status code constants defined
- [ ] Request/response logging standardized

---

#### TASK-020: Implement Portfolio Endpoints
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-009, TASK-019

**Description:**
Create RESTful CRUD endpoints for portfolios.

**Acceptance Criteria:**
- [ ] POST /api/v1/portfolios implemented
- [ ] GET /api/v1/portfolios/:id implemented
- [ ] GET /api/v1/portfolios implemented with pagination
- [ ] PUT /api/v1/portfolios/:id implemented
- [ ] DELETE /api/v1/portfolios/:id implemented with integrity check
- [ ] Request DTO validation working
- [ ] Response serialization working
- [ ] Integration tests written (6 minimum)
- [ ] All tests passing

**Test Cases:**
- Create portfolio with valid data returns 201
- Create portfolio with invalid data returns 422
- Get by ID returns 200 with correct data
- List returns paginated results
- Update portfolio returns 200
- Delete portfolio with buildings returns 422

---

#### TASK-021: Implement Building Endpoints
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-010, TASK-019

**Description:**
Create RESTful CRUD endpoints for buildings.

**Acceptance Criteria:**
- [ ] POST /api/v1/buildings implemented
- [ ] GET /api/v1/buildings/:id implemented
- [ ] GET /api/v1/buildings implemented with portfolio filter
- [ ] PUT /api/v1/buildings/:id implemented
- [ ] DELETE /api/v1/buildings/:id implemented with integrity check
- [ ] Portfolio FK validation working
- [ ] Integration tests written (6 minimum)
- [ ] All tests passing

---

#### TASK-022: Implement Floor Endpoints
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** Critical  
**Points:** 4  
**Dependencies:** TASK-011, TASK-019

**Description:**
Create RESTful CRUD endpoints for floors.

**Acceptance Criteria:**
- [ ] POST /api/v1/floors implemented
- [ ] GET /api/v1/floors/:id implemented
- [ ] GET /api/v1/floors implemented with building filter
- [ ] PUT /api/v1/floors/:id implemented
- [ ] DELETE /api/v1/floors/:id implemented with integrity check
- [ ] Integration tests written (6 minimum)
- [ ] All tests passing

---

#### TASK-023: Implement Zone Endpoints
**Story:** User Story 1.1, 1.3 (Create Portfolio Hierarchy, Filter Assets)  
**Priority:** Critical  
**Points:** 6  
**Dependencies:** TASK-012, TASK-019

**Description:**
Create RESTful CRUD endpoints for zones with filtering.

**Acceptance Criteria:**
- [ ] POST /api/v1/zones implemented
- [ ] GET /api/v1/zones/:id implemented
- [ ] GET /api/v1/zones implemented with filters (building_id, floor_id)
- [ ] PUT /api/v1/zones/:id implemented
- [ ] DELETE /api/v1/zones/:id implemented with integrity check
- [ ] Query parameters for filters validated
- [ ] Pagination working correctly
- [ ] Integration tests written (8 minimum)
- [ ] All tests passing

**Filter Tests:**
- Filter by building_id only
- Filter by floor_id only
- Filter by both building_id and floor_id
- Invalid filter parameters return 400
- Pagination with filters

---

#### TASK-024: Implement Device Endpoints
**Story:** User Story 1.2, 1.3 (Manage Device Inventory, Filter Assets)  
**Priority:** Critical  
**Points:** 7  
**Dependencies:** TASK-013, TASK-019

**Description:**
Create RESTful CRUD endpoints for devices with comprehensive filtering.

**Acceptance Criteria:**
- [ ] POST /api/v1/devices implemented
- [ ] GET /api/v1/devices/:id implemented
- [ ] GET /api/v1/devices implemented with filters
- [ ] PUT /api/v1/devices/:id implemented
- [ ] DELETE /api/v1/devices/:id implemented
- [ ] Filter by zone_id working
- [ ] Filter by protocol working
- [ ] Filter by commissioning_state working
- [ ] Filter by health_status working
- [ ] Filter by device_profile working
- [ ] Multiple filters combined correctly
- [ ] Pagination with limit=20 default, max=100
- [ ] Serial number uniqueness enforced
- [ ] Protocol enumeration validated
- [ ] Integration tests written (10 minimum)
- [ ] All tests passing

---

#### TASK-025: Implement Point Endpoints
**Story:** User Story 2.1, 2.3 (Define Device Points, Manage Point Catalogue)  
**Priority:** Critical  
**Points:** 6  
**Dependencies:** TASK-014, TASK-019

**Description:**
Create RESTful endpoints for point management with audit trail.

**Acceptance Criteria:**
- [ ] POST /api/v1/devices/:deviceId/points implemented
- [ ] GET /api/v1/devices/:deviceId/points implemented
- [ ] GET /api/v1/points/:id implemented
- [ ] PUT /api/v1/points/:id implemented with X-User-ID header
- [ ] PATCH /api/v1/points/:id/deactivate implemented
- [ ] Controlled vocabulary validation working
- [ ] Unique (device_id, point_key) enforced
- [ ] Audit trail (created_by, updated_by) populated
- [ ] Integration tests written (8 minimum)
- [ ] All tests passing

---

#### TASK-026: Implement Device Profile Validation Endpoint
**Story:** User Story 2.2 (Enforce Device Profile Consistency)  
**Priority:** High  
**Points:** 5  
**Dependencies:** TASK-015, TASK-019

**Description:**
Create endpoint for device profile compliance validation.

**Acceptance Criteria:**
- [ ] POST /api/v1/devices/:id/validate-profile implemented
- [ ] Returns 200 with compliant=true when all points configured correctly
- [ ] Returns 422 with compliant=false when points missing/incorrect
- [ ] Missing points listed in response
- [ ] Scaling mismatches listed in response
- [ ] Unit mismatches listed in response
- [ ] Data type mismatches listed in response
- [ ] Integration tests written (6 minimum)
- [ ] All tests passing

**Test Cases:**
- Fully compliant device returns 200
- Device missing required points returns 422
- Device with scaling mismatch returns 422
- Device with unit mismatch returns 422
- Device with data type mismatch returns 422
- Non-existent device returns 404

---

#### TASK-027: Standardize Error Response Format
**Story:** Error Handling  
**Priority:** High  
**Points:** 3  
**Dependencies:** TASK-019

**Description:**
Implement consistent error response format across all endpoints.

**Acceptance Criteria:**
- [ ] Error response format matches specification
- [ ] Error responses include: error, message, details, timestamp, path
- [ ] Validation errors (422) formatted correctly
- [ ] Not found errors (404) formatted correctly
- [ ] Integrity constraint errors (422) formatted correctly
- [ ] Server errors (500) formatted correctly
- [ ] Error response builder utility created
- [ ] All endpoints using standardized format

---

#### TASK-028: Implement Global Error Handler Middleware
**Story:** Error Handling  
**Priority:** High  
**Points:** 4  
**Dependencies:** TASK-027

**Description:**
Create centralized error handling middleware.

**Acceptance Criteria:**
- [ ] Global error handler middleware created
- [ ] Catches validation errors and returns 422
- [ ] Catches not found errors and returns 404
- [ ] Catches database errors and returns appropriate status
- [ ] Catches unique constraint violations and returns 422
- [ ] Logs errors with stack traces
- [ ] Sanitizes error messages for production
- [ ] Error handler tested with all error types

---

#### TASK-029: Create DTO Validation Schemas
**Story:** Validation  
**Priority:** High  
**Points:** 5  
**Dependencies:** TASK-019

**Description:**
Define validation schemas for all request DTOs.

**Acceptance Criteria:**
- [ ] CreatePortfolioDto schema defined
- [ ] CreateBuildingDto schema defined
- [ ] CreateFloorDto schema defined
- [ ] CreateZoneDto schema defined
- [ ] CreateDeviceDto schema defined
- [ ] CreatePointDto schema defined
- [ ] All required fields validated
- [ ] Field length constraints enforced
- [ ] Enumeration values validated
- [ ] Positive number constraints validated
- [ ] Clear validation error messages

---

#### TASK-030: Create Controlled Vocabulary Validation
**Story:** User Story 2.1 (Define Device Points)  
**Priority:** High  
**Points:** 3  
**Dependencies:** TASK-025

**Description:**
Implement point key and engineering unit vocabulary validation.

**Acceptance Criteria:**
- [ ] Point key vocabulary defined (enum or table)
- [ ] Engineering unit vocabulary defined
- [ ] Validation checks point_key against vocabulary
- [ ] Validation checks engineering_unit against vocabulary
- [ ] Clear error message when vocabulary violated
- [ ] Vocabulary documented and accessible
- [ ] Tests for valid and invalid vocabulary values

**Vocabularies:**
```
Point Keys: zone_temp, zone_humidity, zone_co2, zone_voc, setpoint_heat,
           setpoint_cool, damper_position, valve_position, fan_speed, etc.
Units: degC, degF, percent, ppm, ppb, rpm, bool, enum, count, kW, kWh, etc.
```

---

## Sprint 3: Business Logic & Validation (Week 5-6)

### Epic: Business Rules Implementation
**Goal:** Enforce all business rules and data integrity constraints

---

#### TASK-031: Implement Portfolio Deletion Protection
**Story:** User Story 1.4 (Protect Hierarchy Integrity)  
**Priority:** High  
**Points:** 2  
**Dependencies:** TASK-009, TASK-020

**Description:**
Prevent deletion of portfolios with buildings.

**Acceptance Criteria:**
- [ ] DELETE portfolio checks hasBuildings() before deletion
- [ ] Returns 422 status when buildings exist
- [ ] Error response includes building count
- [ ] Error response includes building IDs
- [ ] Error message is clear and actionable
- [ ] Integration test verifies protection
- [ ] Deletion succeeds when no buildings

---

#### TASK-032: Implement Building Deletion Protection
**Story:** User Story 1.4 (Protect Hierarchy Integrity)  
**Priority:** High  
**Points:** 2  
**Dependencies:** TASK-010, TASK-021

**Description:**
Prevent deletion of buildings with floors.

**Acceptance Criteria:**
- [ ] DELETE building checks hasFloors() before deletion
- [ ] Returns 422 status when floors exist
- [ ] Error response includes floor count and IDs
- [ ] Error message clear
- [ ] Integration test verifies protection
- [ ] Deletion succeeds when no floors

---

#### TASK-033: Implement Floor Deletion Protection
**Story:** User Story 1.4 (Protect Hierarchy Integrity)  
**Priority:** High  
**Points:** 2  
**Dependencies:** TASK-011, TASK-022

**Description:**
Prevent deletion of floors with zones.

**Acceptance Criteria:**
- [ ] DELETE floor checks hasZones() before deletion
- [ ] Returns 422 status when zones exist
- [ ] Error response includes zone count and IDs
- [ ] Integration test verifies protection

---

#### TASK-034: Implement Zone Deletion Protection
**Story:** User Story 1.4 (Protect Hierarchy Integrity)  
**Priority:** High  
**Points:** 2  
**Dependencies:** TASK-012, TASK-023

**Description:**
Prevent deletion of zones with devices.

**Acceptance Criteria:**
- [ ] DELETE zone checks hasDevices() before deletion
- [ ] Returns 422 status when devices exist
- [ ] Error response includes device count and IDs
- [ ] Integration test verifies protection

---

#### TASK-035: Implement Device Profile Loading and Caching
**Story:** User Story 2.2 (Enforce Device Profile Consistency)  
**Priority:** Medium  
**Points:** 3  
**Dependencies:** TASK-015

**Description:**
Load device profiles from database with caching for performance.

**Acceptance Criteria:**
- [ ] Profile loaded from database on first request
- [ ] Profile cached in memory
- [ ] Cache invalidation strategy implemented
- [ ] Cache miss loads from database
- [ ] Profile version handling implemented
- [ ] Multiple profile versions supported

---

#### TASK-036: Implement Point Audit Trail
**Story:** User Story 2.3 (Manage Point Catalogue)  
**Priority:** Medium  
**Points:** 3  
**Dependencies:** TASK-014, TASK-025

**Description:**
Capture user ID and timestamp for point changes.

**Acceptance Criteria:**
- [ ] created_by populated from X-User-ID header on creation
- [ ] updated_by populated from X-User-ID header on update
- [ ] created_at timestamp set automatically
- [ ] updated_at timestamp updated on changes
- [ ] Audit fields returned in API responses
- [ ] Missing X-User-ID header handled gracefully
- [ ] Integration tests verify audit trail

---

#### TASK-037: Implement Point Deactivation Protection
**Story:** User Story 2.3 (Manage Point Catalogue)  
**Priority:** Medium  
**Points:** 2  
**Dependencies:** TASK-014, TASK-025

**Description:**
Prevent deactivation of points with active telemetry readings.

**Acceptance Criteria:**
- [ ] hasActiveReadings() checks telemetry table (or stub)
- [ ] Deactivation blocked if active readings exist
- [ ] Returns 422 with clear error message
- [ ] Error response indicates readings count
- [ ] Integration test verifies protection
- [ ] Deactivation succeeds when no active readings

---

#### TASK-038: Implement Device Serial Uniqueness Validation
**Story:** User Story 1.2 (Manage Device Inventory)  
**Priority:** High  
**Points:** 2  
**Dependencies:** TASK-013, TASK-024

**Description:**
Enforce global serial number uniqueness for devices.

**Acceptance Criteria:**
- [ ] Serial number uniqueness checked on device creation
- [ ] Duplicate serial number returns 422
- [ ] Error message indicates duplicate constraint
- [ ] Database unique constraint enforces at DB level
- [ ] Application layer validation provides early feedback
- [ ] Integration test verifies enforcement

---

#### TASK-039: Implement Protocol Enumeration Validation
**Story:** User Story 1.2 (Manage Device Inventory)  
**Priority:** High  
**Points:** 1  
**Dependencies:** TASK-024

**Description:**
Validate device protocol against allowed values.

**Acceptance Criteria:**
- [ ] Protocol validated against enum (modbus-rtu, modbus-tcp, bacnet)
- [ ] Invalid protocol returns 422
- [ ] Error message lists valid protocols
- [ ] Database CHECK constraint enforces
- [ ] Application validation provides early feedback

---

#### TASK-040: Implement Commissioning State Validation
**Story:** User Story 1.2 (Manage Device Inventory)  
**Priority:** Medium  
**Points:** 1  
**Dependencies:** TASK-024

**Description:**
Validate commissioning state against allowed values.

**Acceptance Criteria:**
- [ ] State validated (pending, commissioned, decommissioned)
- [ ] Invalid state returns 422
- [ ] Error message lists valid states
- [ ] Database CHECK constraint enforces

---

#### TASK-041: Implement Zone Area and Occupancy Validation
**Story:** User Story 1.1 (Create Portfolio Hierarchy)  
**Priority:** Low  
**Points:** 1  
**Dependencies:** TASK-023

**Description:**
Validate zone area and occupancy are positive values.

**Acceptance Criteria:**
- [ ] Area must be positive if provided
- [ ] Occupancy must be positive integer if provided
- [ ] Negative values return 422
- [ ] Zero values return 422
- [ ] Null/undefined values allowed (optional fields)

---

#### TASK-042: Write Business Logic Unit Tests
**Story:** Testing  
**Priority:** High  
**Points:** 5  
**Dependencies:** TASK-031 through TASK-041

**Description:**
Comprehensive unit tests for all business logic.

**Acceptance Criteria:**
- [ ] Deletion protection tests (4 entities)
- [ ] Profile validation logic tests
- [ ] Audit trail tests
- [ ] Uniqueness constraint tests
- [ ] Enumeration validation tests
- [ ] Positive number validation tests
- [ ] >90% code coverage for business logic
- [ ] All tests passing

---

## Sprint 4: Testing, Performance & Deployment (Week 7-8)

### Epic: Quality Assurance & Performance
**Goal:** Achieve production readiness through comprehensive testing

---

#### TASK-043: Achieve Repository Layer Test Coverage >90%
**Story:** Testing  
**Priority:** High  
**Points:** 3  
**Dependencies:** TASK-009 through TASK-015

**Description:**
Ensure comprehensive test coverage for all repositories.

**Acceptance Criteria:**
- [ ] PortfolioRepository >90% coverage
- [ ] BuildingRepository >90% coverage
- [ ] FloorRepository >90% coverage
- [ ] ZoneRepository >90% coverage
- [ ] DeviceRepository >90% coverage
- [ ] PointRepository >90% coverage
- [ ] DeviceProfileRepository >90% coverage
- [ ] Coverage report generated
- [ ] All edge cases tested

---

#### TASK-044: Achieve API Layer Test Coverage >80%
**Story:** Testing  
**Priority:** High  
**Points:** 4  
**Dependencies:** TASK-020 through TASK-026

**Description:**
Ensure comprehensive integration test coverage for API endpoints.

**Acceptance Criteria:**
- [ ] All endpoints have happy path tests
- [ ] All endpoints have error case tests
- [ ] Validation tests for all DTOs
- [ ] Filter combination tests
- [ ] Pagination tests
- [ ] >80% API controller coverage
- [ ] Coverage report generated

---

#### TASK-045: Create End-to-End Test Suite
**Story:** Testing  
**Priority:** High  
**Points:** 5  
**Dependencies:** TASK-043, TASK-044

**Description:**
Create realistic end-to-end user workflow tests.

**Acceptance Criteria:**
- [ ] Test: Full hierarchy creation (Portfolio → Device → Points)
- [ ] Test: Device profile validation workflow
- [ ] Test: Point management with audit trail
- [ ] Test: Filter and pagination workflows
- [ ] Test: Deletion protection workflows
- [ ] Test: Error handling workflows
- [ ] All E2E tests passing
- [ ] E2E tests run in CI/CD

---

#### TASK-046: Database Query Performance Optimization
**Story:** Performance  
**Priority:** High  
**Points:** 5  
**Dependencies:** TASK-002 through TASK-006

**Description:**
Optimize database queries and indexes for performance.

**Acceptance Criteria:**
- [ ] Slow query log analyzed
- [ ] N+1 query problems identified and fixed
- [ ] Missing indexes added
- [ ] Query execution plans reviewed
- [ ] Pagination queries optimized
- [ ] Filter queries optimized
- [ ] Join queries optimized
- [ ] Performance benchmarks met

**Benchmarks:**
- Create portfolio: < 50ms
- List zones with filters: < 150ms
- Device profile validation: < 200ms
- List devices with pagination: < 100ms

---

#### TASK-047: API Performance Load Testing
**Story:** Performance  
**Priority:** Medium  
**Points:** 4  
**Dependencies:** TASK-020 through TASK-026

**Description:**
Load test all API endpoints to ensure performance targets met.

**Acceptance Criteria:**
- [ ] Load testing tool configured (k6, JMeter, etc.)
- [ ] All endpoints load tested at 100 req/sec
- [ ] Response time benchmarks met (<200ms for simple queries)
- [ ] Pagination performance tested with large datasets
- [ ] Filter performance tested with multiple criteria
- [ ] Bottlenecks identified and documented
- [ ] Performance report generated

---

#### TASK-048: Implement Query Result Caching
**Story:** Performance  
**Priority:** Low  
**Points:** 3  
**Dependencies:** TASK-046

**Description:**
Add caching layer for frequently accessed data.

**Acceptance Criteria:**
- [ ] Cache layer configured (Redis, in-memory, etc.)
- [ ] Device profiles cached
- [ ] Portfolio hierarchy cached (optional)
- [ ] Cache invalidation strategy implemented
- [ ] Cache hit/miss metrics tracked
- [ ] Performance improvement measured

---

#### TASK-049: SQL Injection Security Review
**Story:** Security  
**Priority:** Critical  
**Points:** 2  
**Dependencies:** All repository tasks

**Description:**
Verify protection against SQL injection attacks.

**Acceptance Criteria:**
- [ ] All queries use parameterized statements
- [ ] No raw SQL string concatenation found
- [ ] ORM/query builder usage reviewed
- [ ] SQL injection tests performed
- [ ] All tests passing (no vulnerabilities)
- [ ] Security checklist completed

---

#### TASK-050: Input Validation Security Review
**Story:** Security  
**Priority:** High  
**Points:** 2  
**Dependencies:** TASK-029, TASK-030

**Description:**
Review input validation for security vulnerabilities.

**Acceptance Criteria:**
- [ ] XSS prevention in text fields verified
- [ ] All numeric inputs validated
- [ ] String length limits enforced
- [ ] Regex patterns reviewed for ReDoS
- [ ] File upload disabled (not in scope)
- [ ] Security test cases passing

---

#### TASK-051: Complete OpenAPI Specification
**Story:** Documentation  
**Priority:** High  
**Points:** 5  
**Dependencies:** TASK-020 through TASK-026

**Description:**
Generate comprehensive OpenAPI 3.0 documentation.

**Acceptance Criteria:**
- [ ] OpenAPI spec generated for all endpoints
- [ ] Request/response schemas documented
- [ ] Example requests included for all endpoints
- [ ] Example responses included (success and error)
- [ ] Error codes documented
- [ ] Authentication placeholder documented
- [ ] Swagger UI accessible
- [ ] Postman collection generated

---

#### TASK-052: Write Developer Documentation
**Story:** Documentation  
**Priority:** Medium  
**Points:** 3  
**Dependencies:** All implementation tasks

**Description:**
Create comprehensive developer onboarding documentation.

**Acceptance Criteria:**
- [ ] Setup and installation guide written
- [ ] Database migration guide written
- [ ] Repository pattern documentation
- [ ] API endpoint documentation
- [ ] Testing procedures documented
- [ ] Troubleshooting guide created
- [ ] Code examples included

---

#### TASK-053: Write Operational Documentation
**Story:** Documentation  
**Priority:** Medium  
**Points:** 2  
**Dependencies:** All implementation tasks

**Description:**
Create operational runbook and deployment guides.

**Acceptance Criteria:**
- [ ] Deployment guide written
- [ ] Environment variable documentation
- [ ] Database backup procedures documented
- [ ] Monitoring requirements documented
- [ ] Common issues runbook created
- [ ] Rollback procedures documented

---

#### TASK-054: Create User Stories Traceability Matrix
**Story:** Documentation  
**Priority:** Low  
**Points:** 2  
**Dependencies:** All implementation tasks

**Description:**
Map all API endpoints and features to user stories.

**Acceptance Criteria:**
- [ ] Each endpoint mapped to user story
- [ ] All acceptance criteria verified
- [ ] Deviations documented
- [ ] Clarifications documented
- [ ] Traceability matrix complete
- [ ] Product owner approval obtained

---

### Epic: Deployment Preparation
**Goal:** Prepare for production deployment

---

#### TASK-055: Set Up CI/CD Pipeline
**Story:** DevOps  
**Priority:** High  
**Points:** 5  
**Dependencies:** TASK-018, TASK-043

**Description:**
Configure automated testing and deployment pipeline.

**Acceptance Criteria:**
- [ ] CI/CD tool configured (GitHub Actions, Jenkins, etc.)
- [ ] Automated tests run on every commit
- [ ] Code coverage reports generated
- [ ] Linting and formatting checks
- [ ] Build artifacts created
- [ ] Deployment automation configured
- [ ] Pipeline documentation written

---

#### TASK-056: Configure Staging Environment
**Story:** DevOps  
**Priority:** High  
**Points:** 3  
**Dependencies:** TASK-001 through TASK-007

**Description:**
Set up staging environment for pre-production testing.

**Acceptance Criteria:**
- [ ] Staging database provisioned
- [ ] Application deployed to staging
- [ ] All migrations run successfully
- [ ] Device profiles seeded
- [ ] Environment variables configured
- [ ] Monitoring configured
- [ ] Logging configured

---

#### TASK-057: Configure Production Environment
**Story:** DevOps  
**Priority:** Critical  
**Points:** 3  
**Dependencies:** TASK-056

**Description:**
Set up production environment infrastructure.

**Acceptance Criteria:**
- [ ] Production database provisioned
- [ ] Database backups configured (daily)
- [ ] Application infrastructure provisioned
- [ ] Environment variables configured
- [ ] SSL certificates configured
- [ ] Monitoring configured
- [ ] Alerting configured
- [ ] Logging configured

---

#### TASK-058: Production Deployment
**Story:** DevOps  
**Priority:** Critical  
**Points:** 5  
**Dependencies:** TASK-057, TASK-045

**Description:**
Deploy application to production environment.

**Acceptance Criteria:**
- [ ] Pre-deployment checklist completed
- [ ] Production database backed up
- [ ] Application deployed
- [ ] Database migrations run successfully
- [ ] Device profiles seeded
- [ ] Smoke tests passing
- [ ] Health checks passing
- [ ] Monitoring operational
- [ ] Post-deployment validation complete
- [ ] Stakeholders notified

---

#### TASK-059: Post-Deployment Monitoring
**Story:** DevOps  
**Priority:** High  
**Points:** 2  
**Dependencies:** TASK-058

**Description:**
Monitor production deployment and address issues.

**Acceptance Criteria:**
- [ ] 24-hour monitoring period completed
- [ ] Error logs reviewed (no critical errors)
- [ ] Performance metrics normal
- [ ] API endpoints responding correctly
- [ ] Database queries performing well
- [ ] No security alerts
- [ ] Post-deployment report created

---

## Task Summary by User Story

### User Story 1.1: Create Portfolio Hierarchy
**Tasks:** TASK-002, TASK-009, TASK-010, TASK-011, TASK-012, TASK-016, TASK-020, TASK-021, TASK-022, TASK-023, TASK-041  
**Total Points:** 48  
**Completion Criteria:** Full CRUD operations for all hierarchy levels

### User Story 1.2: Manage Device Inventory
**Tasks:** TASK-003, TASK-013, TASK-024, TASK-038, TASK-039, TASK-040  
**Total Points:** 20  
**Completion Criteria:** Device CRUD with validation

### User Story 1.3: List and Filter Assets
**Tasks:** TASK-012, TASK-013, TASK-023, TASK-024  
**Total Points:** 20  
**Completion Criteria:** Multi-filter support for zones and devices

### User Story 1.4: Protect Hierarchy Integrity
**Tasks:** TASK-017, TASK-031, TASK-032, TASK-033, TASK-034  
**Total Points:** 12  
**Completion Criteria:** Deletion protection at all levels

### User Story 2.1: Define Device Points
**Tasks:** TASK-004, TASK-014, TASK-025, TASK-030  
**Total Points:** 17  
**Completion Criteria:** Point CRUD with vocabulary validation

### User Story 2.2: Enforce Device Profile Consistency
**Tasks:** TASK-005, TASK-007, TASK-015, TASK-026, TASK-035  
**Total Points:** 21  
**Completion Criteria:** Profile validation working

### User Story 2.3: Manage Point Catalogue
**Tasks:** TASK-014, TASK-025, TASK-036, TASK-037  
**Total Points:** 10  
**Completion Criteria:** Point updates with audit trail

---

## Task Dependency Graph

```
TASK-001 (Migrations)
  ├─→ TASK-002 (Portfolio Tables)
  │     ├─→ TASK-003 (Device Tables)
  │     │     ├─→ TASK-004 (Point Tables)
  │     │     │     ├─→ TASK-005 (Profile Table)
  │     │     │     │     ├─→ TASK-006 (Indexes)
  │     │     │     │     └─→ TASK-007 (Seed Data)
  │     ├─→ TASK-009 (Portfolio Repo) → TASK-020 (Portfolio API) → TASK-031 (Deletion Protection)
  │     ├─→ TASK-010 (Building Repo) → TASK-021 (Building API) → TASK-032 (Deletion Protection)
  │     ├─→ TASK-011 (Floor Repo) → TASK-022 (Floor API) → TASK-033 (Deletion Protection)
  │     └─→ TASK-012 (Zone Repo) → TASK-023 (Zone API) → TASK-034 (Deletion Protection)
  │
  └─→ TASK-008 (Base Repo Infrastructure)
        ├─→ All Repository Tasks
        └─→ TASK-019 (API Base Infrastructure)
              └─→ All API Tasks

TASK-018 (API Framework) → TASK-019 → All API Endpoints

Testing & Deployment in Parallel after Core Implementation
```

---

## Appendix: Task Templates

### Task Template for JIRA/Linear/Asana
```
Title: [TASK-XXX] Task Name
Epic: Epic Name
Story: User Story X.X
Type: Task / Bug / Sub-task
Priority: Critical / High / Medium / Low
Points: X
Sprint: Sprint X
Assignee: [Unassigned]

Description:
[Detailed description]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2

Dependencies:
- TASK-XXX
- TASK-YYY

Definition of Done:
- [ ] Code implemented
- [ ] Unit tests written and passing
- [ ] Integration tests written (if applicable)
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Merged to feature branch
```

---

**Task Breakdown Complete**  
**Ready for Sprint Planning**  
**Estimated Team Velocity:** 65-70 points/sprint  
**Recommended Sprint Allocation:** 4 sprints × 2 weeks

