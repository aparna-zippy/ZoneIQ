# Asset Management & Point Catalogue Technical Specification

**Version:** 1.0  
**Date:** 2026-09-03  
**Epic:** Portfolio & Asset Model (HFP-01), Point Catalogue (HFP-02)  
**Feature Branch:** HVAC_FEATURE

---

## 1. Overview

This specification defines the technical implementation for Asset Management and Point Catalogue functionality in the ZoneIQ HVAC Fleet Platform. It covers portfolio hierarchy management, device inventory, point configuration, and data integrity constraints.

### 1.1 Scope

**In Scope:**
- Portfolio hierarchy (Portfolio → Building → Floor → Zone)
- Device registration and lifecycle management
- Point catalogue definition and validation
- Asset filtering and querying
- Referential integrity enforcement
- Device profile compliance

**Out of Scope:**
- Telemetry data storage and time-series management
- Alarm generation logic
- User authentication and authorization
- Real-time device communication protocols

---

## 2. Database Schema

### 2.1 Portfolio Hierarchy Tables

#### Table: `portfolios`
```sql
CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolios_code ON portfolios(code);
```

#### Table: `buildings`
```sql
CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER NOT NULL REFERENCES portfolios(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(portfolio_id, code)
);

CREATE INDEX idx_buildings_portfolio ON buildings(portfolio_id);
CREATE INDEX idx_buildings_code ON buildings(code);
```

#### Table: `floors`
```sql
CREATE TABLE floors (
    id SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL REFERENCES buildings(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(building_id, code)
);

CREATE INDEX idx_floors_building ON floors(building_id);
CREATE INDEX idx_floors_code ON floors(code);
```

#### Table: `zones`
```sql
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    floor_id INTEGER NOT NULL REFERENCES floors(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    area_sqm DECIMAL(10, 2),
    max_occupancy INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(floor_id, code)
);

CREATE INDEX idx_zones_floor ON zones(floor_id);
CREATE INDEX idx_zones_code ON zones(code);
```

### 2.2 Device Tables

#### Table: `devices`
```sql
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zones(id),
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
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_zone ON devices(zone_id);
CREATE INDEX idx_devices_serial ON devices(serial_number);
CREATE INDEX idx_devices_protocol ON devices(protocol);
CREATE INDEX idx_devices_commissioning_state ON devices(commissioning_state);
CREATE INDEX idx_devices_health_status ON devices(health_status);
CREATE INDEX idx_devices_profile ON devices(device_profile);
```

### 2.3 Point Catalogue Tables

#### Table: `points`
```sql
CREATE TABLE points (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES devices(id),
    point_key VARCHAR(100) NOT NULL,
    engineering_unit VARCHAR(20) NOT NULL,
    data_type VARCHAR(20) NOT NULL CHECK (data_type IN ('int16', 'uint16', 'int32', 'uint32', 'float32', 'bool')),
    scaling_factor DECIMAL(10, 6) DEFAULT 1.0,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('telemetry', 'command', 'both')),
    register_type VARCHAR(20) CHECK (register_type IN ('holding', 'input', 'coil', 'discrete')),
    register_address INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    UNIQUE(device_id, point_key)
);

CREATE INDEX idx_points_device ON points(device_id);
CREATE INDEX idx_points_key ON points(point_key);
CREATE INDEX idx_points_active ON points(is_active);
```

#### Table: `device_profiles`
```sql
CREATE TABLE device_profiles (
    id SERIAL PRIMARY KEY,
    profile_name VARCHAR(100) NOT NULL UNIQUE,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    required_points JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(profile_name, version)
);

CREATE INDEX idx_device_profiles_name ON device_profiles(profile_name);
```

**Example `required_points` JSONB structure:**
```json
{
  "zone_temp": {
    "engineering_unit": "degC",
    "data_type": "int16",
    "scaling_factor": 0.1,
    "direction": "telemetry"
  },
  "setpoint_heat": {
    "engineering_unit": "degC",
    "data_type": "int16",
    "scaling_factor": 0.1,
    "direction": "both"
  }
}
```

---

## 3. REST API Endpoints

### 3.1 Portfolio Hierarchy Endpoints

#### Create Portfolio
```
POST /api/v1/portfolios
Content-Type: application/json

{
  "name": "Corporate Campus",
  "code": "CORP-01"
}

Response 201:
{
  "id": 1,
  "name": "Corporate Campus",
  "code": "CORP-01",
  "created_at": "2026-09-03T10:00:00Z"
}

Response 422:
{
  "error": "Validation failed",
  "details": {
    "code": ["is required", "must be unique"]
  }
}
```

#### Create Building
```
POST /api/v1/buildings
Content-Type: application/json

{
  "portfolio_id": 1,
  "name": "Main Office",
  "code": "BLDG-A",
  "address": "123 Main St, City, State 12345"
}

Response 201:
{
  "id": 1,
  "portfolio_id": 1,
  "name": "Main Office",
  "code": "BLDG-A",
  "address": "123 Main St, City, State 12345",
  "created_at": "2026-09-03T10:05:00Z"
}
```

#### Create Floor
```
POST /api/v1/floors
Content-Type: application/json

{
  "building_id": 1,
  "name": "Second Floor",
  "code": "2F"
}

Response 201:
{
  "id": 1,
  "building_id": 1,
  "name": "Second Floor",
  "code": "2F",
  "created_at": "2026-09-03T10:10:00Z"
}
```

#### Create Zone
```
POST /api/v1/zones
Content-Type: application/json

{
  "floor_id": 1,
  "name": "Conference Room A",
  "code": "CONF-A",
  "area_sqm": 45.5,
  "max_occupancy": 12
}

Response 201:
{
  "id": 1,
  "floor_id": 1,
  "name": "Conference Room A",
  "code": "CONF-A",
  "area_sqm": 45.5,
  "max_occupancy": 12,
  "created_at": "2026-09-03T10:15:00Z"
}
```

#### List Zones with Filters
```
GET /api/v1/zones?building_id=1&floor_id=1&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": 1,
      "floor_id": 1,
      "name": "Conference Room A",
      "code": "CONF-A",
      "area_sqm": 45.5,
      "max_occupancy": 12,
      "floor": {
        "id": 1,
        "name": "Second Floor",
        "building": {
          "id": 1,
          "name": "Main Office"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

#### Delete Building (with Integrity Protection)
```
DELETE /api/v1/buildings/1

Response 422 (if has floors):
{
  "error": "Cannot delete building",
  "message": "Building has 3 floors. Remove all floors before deleting the building.",
  "constraints": {
    "floors_count": 3
  }
}

Response 204 (if no floors):
(No content)
```

### 3.2 Device Management Endpoints

#### Create Device
```
POST /api/v1/devices
Content-Type: application/json

{
  "zone_id": 1,
  "serial_number": "ZC-2024-001",
  "model": "ZoneController-Pro",
  "protocol": "modbus-tcp",
  "firmware_version": "2.1.5",
  "device_profile": "hvac-zone-controller-v1",
  "commissioning_state": "pending"
}

Response 201:
{
  "id": 1,
  "zone_id": 1,
  "serial_number": "ZC-2024-001",
  "model": "ZoneController-Pro",
  "protocol": "modbus-tcp",
  "firmware_version": "2.1.5",
  "device_profile": "hvac-zone-controller-v1",
  "commissioning_state": "pending",
  "health_status": "unknown",
  "last_seen_at": null,
  "created_at": "2026-09-03T11:00:00Z"
}

Response 422:
{
  "error": "Validation failed",
  "details": {
    "serial_number": ["must be unique"],
    "protocol": ["must be one of: modbus-rtu, modbus-tcp, bacnet"]
  }
}
```

#### Update Device
```
PUT /api/v1/devices/1
Content-Type: application/json

{
  "firmware_version": "2.2.0",
  "commissioning_state": "commissioned",
  "health_status": "healthy"
}

Response 200:
{
  "id": 1,
  "zone_id": 1,
  "serial_number": "ZC-2024-001",
  "firmware_version": "2.2.0",
  "commissioning_state": "commissioned",
  "health_status": "healthy",
  "updated_at": "2026-09-03T11:30:00Z"
}
```

#### List Devices with Filters
```
GET /api/v1/devices?zone_id=1&protocol=modbus-tcp&commissioning_state=commissioned&health_status=healthy&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": 1,
      "zone_id": 1,
      "serial_number": "ZC-2024-001",
      "model": "ZoneController-Pro",
      "protocol": "modbus-tcp",
      "commissioning_state": "commissioned",
      "health_status": "healthy",
      "zone": {
        "id": 1,
        "name": "Conference Room A",
        "code": "CONF-A"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "total_pages": 1
  }
}
```

### 3.3 Point Catalogue Endpoints

#### Create Point
```
POST /api/v1/devices/1/points
Content-Type: application/json

{
  "point_key": "zone_temp",
  "engineering_unit": "degC",
  "data_type": "int16",
  "scaling_factor": 0.1,
  "direction": "telemetry",
  "register_type": "input",
  "register_address": 40001
}

Response 201:
{
  "id": 1,
  "device_id": 1,
  "point_key": "zone_temp",
  "engineering_unit": "degC",
  "data_type": "int16",
  "scaling_factor": 0.1,
  "direction": "telemetry",
  "register_type": "input",
  "register_address": 40001,
  "is_active": true,
  "created_at": "2026-09-03T12:00:00Z"
}

Response 422:
{
  "error": "Validation failed",
  "details": {
    "point_key": ["must be from controlled vocabulary"],
    "data_type": ["must be one of: int16, uint16, int32, uint32, float32, bool"]
  }
}
```

#### Validate Device Profile Compliance
```
POST /api/v1/devices/1/validate-profile

Response 200 (compliant):
{
  "compliant": true,
  "profile": "hvac-zone-controller-v1",
  "required_points": 12,
  "configured_points": 12,
  "missing_points": []
}

Response 422 (non-compliant):
{
  "compliant": false,
  "profile": "hvac-zone-controller-v1",
  "required_points": 12,
  "configured_points": 10,
  "missing_points": [
    {
      "point_key": "setpoint_cool",
      "expected_unit": "degC",
      "expected_type": "int16"
    },
    {
      "point_key": "damper_position",
      "expected_unit": "percent",
      "expected_type": "uint16"
    }
  ],
  "scaling_mismatches": [
    {
      "point_key": "zone_temp",
      "expected_scaling": 0.1,
      "actual_scaling": 1.0
    }
  ]
}
```

#### Update Point
```
PUT /api/v1/points/1
Content-Type: application/json
X-User-ID: engineer@example.com

{
  "scaling_factor": 0.1,
  "register_address": 40002
}

Response 200:
{
  "id": 1,
  "device_id": 1,
  "point_key": "zone_temp",
  "scaling_factor": 0.1,
  "register_address": 40002,
  "updated_at": "2026-09-03T13:00:00Z",
  "updated_by": "engineer@example.com"
}
```

#### Deactivate Point
```
PATCH /api/v1/points/1/deactivate
X-User-ID: engineer@example.com

Response 200:
{
  "id": 1,
  "is_active": false,
  "updated_at": "2026-09-03T13:30:00Z",
  "updated_by": "engineer@example.com"
}
```

#### List Points for Device
```
GET /api/v1/devices/1/points?is_active=true

Response 200:
{
  "data": [
    {
      "id": 1,
      "point_key": "zone_temp",
      "engineering_unit": "degC",
      "data_type": "int16",
      "scaling_factor": 0.1,
      "direction": "telemetry",
      "is_active": true
    }
  ]
}
```

---

## 4. Business Logic & Validation Rules

### 4.1 Portfolio Hierarchy Rules

**Creation Rules:**
- All entities must have unique codes within their parent scope
- Portfolio code is globally unique
- Building code is unique within portfolio
- Floor code is unique within building
- Zone code is unique within floor
- Required fields: name, code (for all entities)
- Zone area and occupancy are optional but must be positive if provided

**Deletion Rules:**
- Portfolio: Cannot delete if it has buildings
- Building: Cannot delete if it has floors
- Floor: Cannot delete if it has zones
- Zone: Cannot delete if it has devices
- Return HTTP 422 with descriptive message listing child count

**Validation Error Response Format:**
```json
{
  "error": "Validation failed",
  "message": "One or more validation errors occurred",
  "details": {
    "field_name": ["error message 1", "error message 2"]
  }
}
```

### 4.2 Device Management Rules

**Device Registration:**
- Serial number must be globally unique
- Device must be assigned to exactly one zone
- Protocol must be one of: `modbus-rtu`, `modbus-tcp`, `bacnet`
- Commissioning state must be one of: `pending`, `commissioned`, `decommissioned`
- Health status must be one of: `healthy`, `degraded`, `offline`, `unknown`
- Device profile must reference an existing profile in `device_profiles` table
- Firmware version format is free-text but recommended: `major.minor.patch`

**Device Updates:**
- Cannot change zone_id if device has active telemetry readings (implement soft validation)
- Cannot change serial_number after creation
- Can update: model, firmware_version, commissioning_state, health_status
- `last_seen_at` is automatically updated by telemetry ingestion service

**Device Filtering:**
- All filters are optional and combinable
- Supported filters: `zone_id`, `protocol`, `commissioning_state`, `health_status`, `device_profile`
- Pagination: default `limit=20`, max `limit=100`

### 4.3 Point Catalogue Rules

**Point Creation:**
- Point key must be from controlled vocabulary (validate against enum or reference table)
- Point must be unique per (device_id, point_key)
- Required fields: `point_key`, `engineering_unit`, `data_type`, `direction`
- Scaling factor defaults to 1.0 if not provided
- Register type and address required for Modbus protocols, optional for BACnet

**Controlled Vocabulary (Point Keys):**
```
zone_temp, zone_humidity, zone_co2, zone_voc,
setpoint_heat, setpoint_cool, setpoint_ventilation,
damper_position, valve_position, fan_speed,
occupancy_count, occupancy_detected,
alarm_status, system_mode, override_active
```

**Point Profile Compliance:**
- Device must declare a `device_profile`
- Profile specifies required points with expected units, data types, and scaling
- Validation checks:
  1. All required points are configured
  2. Engineering units match profile specification
  3. Data types match profile specification
  4. Scaling factors match profile specification (within tolerance)
- Non-compliance returns HTTP 422 with detailed mismatch report

**Point Updates:**
- Can update: `engineering_unit`, `scaling_factor`, `register_type`, `register_address`
- Cannot update: `device_id`, `point_key`, `data_type`, `direction`
- Updates are audited: track `updated_by` and `updated_at`
- Cannot delete points; use `is_active=false` for soft deletion
- Prevent deactivation of points referenced by active readings (implement check against telemetry tables)

---

## 5. Error Handling

### 5.1 HTTP Status Codes

| Status | Usage |
|--------|-------|
| 200 OK | Successful GET, PUT, PATCH |
| 201 Created | Successful POST |
| 204 No Content | Successful DELETE |
| 400 Bad Request | Malformed JSON or invalid query parameters |
| 404 Not Found | Resource does not exist |
| 422 Unprocessable Entity | Validation failed, integrity constraint violated |
| 500 Internal Server Error | Unexpected server error |

### 5.2 Error Response Format

**Standard Error Response:**
```json
{
  "error": "Error category",
  "message": "Human-readable description",
  "details": {
    "field_or_constraint": ["error detail 1", "error detail 2"]
  },
  "timestamp": "2026-09-03T14:00:00Z",
  "path": "/api/v1/buildings/1"
}
```

**Examples:**

**Validation Error (422):**
```json
{
  "error": "Validation failed",
  "message": "Building creation failed due to validation errors",
  "details": {
    "code": ["is required", "must be alphanumeric"],
    "portfolio_id": ["must reference an existing portfolio"]
  }
}
```

**Integrity Constraint Error (422):**
```json
{
  "error": "Integrity constraint violation",
  "message": "Cannot delete building with existing floors",
  "details": {
    "floors_count": 3,
    "floor_ids": [1, 2, 3]
  }
}
```

**Profile Compliance Error (422):**
```json
{
  "error": "Profile validation failed",
  "message": "Device does not meet profile requirements",
  "details": {
    "profile": "hvac-zone-controller-v1",
    "missing_points": ["setpoint_cool", "damper_position"],
    "scaling_mismatches": [
      {
        "point_key": "zone_temp",
        "expected": 0.1,
        "actual": 1.0
      }
    ]
  }
}
```

---

## 6. Repository Layer

### 6.1 Repository Interface Design

**PortfolioRepository:**
```typescript
interface PortfolioRepository {
  create(portfolio: CreatePortfolioDto): Promise<Portfolio>;
  findById(id: number): Promise<Portfolio | null>;
  findByCode(code: string): Promise<Portfolio | null>;
  list(pagination: PaginationDto): Promise<PagedResult<Portfolio>>;
  update(id: number, portfolio: UpdatePortfolioDto): Promise<Portfolio>;
  delete(id: number): Promise<void>;
  hasBuildings(id: number): Promise<boolean>;
}
```

**BuildingRepository:**
```typescript
interface BuildingRepository {
  create(building: CreateBuildingDto): Promise<Building>;
  findById(id: number): Promise<Building | null>;
  findByPortfolioAndCode(portfolioId: number, code: string): Promise<Building | null>;
  listByPortfolio(portfolioId: number, pagination: PaginationDto): Promise<PagedResult<Building>>;
  update(id: number, building: UpdateBuildingDto): Promise<Building>;
  delete(id: number): Promise<void>;
  hasFloors(id: number): Promise<boolean>;
}
```

**ZoneRepository:**
```typescript
interface ZoneRepository {
  create(zone: CreateZoneDto): Promise<Zone>;
  findById(id: number): Promise<Zone | null>;
  list(filters: ZoneFilterDto, pagination: PaginationDto): Promise<PagedResult<Zone>>;
  update(id: number, zone: UpdateZoneDto): Promise<Zone>;
  delete(id: number): Promise<void>;
  hasDevices(id: number): Promise<boolean>;
}

interface ZoneFilterDto {
  buildingId?: number;
  floorId?: number;
}
```

**DeviceRepository:**
```typescript
interface DeviceRepository {
  create(device: CreateDeviceDto): Promise<Device>;
  findById(id: number): Promise<Device | null>;
  findBySerial(serialNumber: string): Promise<Device | null>;
  list(filters: DeviceFilterDto, pagination: PaginationDto): Promise<PagedResult<Device>>;
  update(id: number, device: UpdateDeviceDto): Promise<Device>;
  delete(id: number): Promise<void>;
  updateLastSeen(id: number, timestamp: Date): Promise<void>;
}

interface DeviceFilterDto {
  zoneId?: number;
  protocol?: Protocol;
  commissioningState?: CommissioningState;
  healthStatus?: HealthStatus;
  deviceProfile?: string;
}
```

**PointRepository:**
```typescript
interface PointRepository {
  create(point: CreatePointDto): Promise<Point>;
  findById(id: number): Promise<Point | null>;
  findByDeviceAndKey(deviceId: number, pointKey: string): Promise<Point | null>;
  listByDevice(deviceId: number, activeOnly: boolean): Promise<Point[]>;
  update(id: number, point: UpdatePointDto, userId: string): Promise<Point>;
  deactivate(id: number, userId: string): Promise<Point>;
  hasActiveReadings(id: number): Promise<boolean>;
}
```

**DeviceProfileRepository:**
```typescript
interface DeviceProfileRepository {
  findByName(profileName: string): Promise<DeviceProfile | null>;
  validateDevicePoints(deviceId: number): Promise<ProfileValidationResult>;
}

interface ProfileValidationResult {
  compliant: boolean;
  missingPoints: MissingPoint[];
  scalingMismatches: ScalingMismatch[];
}
```

### 6.2 Data Transfer Objects (DTOs)

**CreatePortfolioDto:**
```typescript
interface CreatePortfolioDto {
  name: string;        // required, max 255 chars
  code: string;        // required, max 50 chars, unique
}
```

**CreateBuildingDto:**
```typescript
interface CreateBuildingDto {
  portfolioId: number; // required, must exist
  name: string;        // required, max 255 chars
  code: string;        // required, max 50 chars
  address?: string;    // optional
}
```

**CreateZoneDto:**
```typescript
interface CreateZoneDto {
  floorId: number;     // required, must exist
  name: string;        // required, max 255 chars
  code: string;        // required, max 50 chars
  areaSqm?: number;    // optional, must be positive
  maxOccupancy?: number; // optional, must be positive integer
}
```

**CreateDeviceDto:**
```typescript
interface CreateDeviceDto {
  zoneId: number;              // required, must exist
  serialNumber: string;         // required, unique, max 100 chars
  model: string;                // required, max 100 chars
  protocol: Protocol;           // required: 'modbus-rtu' | 'modbus-tcp' | 'bacnet'
  firmwareVersion?: string;     // optional, max 50 chars
  deviceProfile: string;        // required, must exist in device_profiles
  commissioningState?: CommissioningState; // optional, default 'pending'
}

enum Protocol {
  ModbusRTU = 'modbus-rtu',
  ModbusTCP = 'modbus-tcp',
  BACnet = 'bacnet'
}

enum CommissioningState {
  Pending = 'pending',
  Commissioned = 'commissioned',
  Decommissioned = 'decommissioned'
}

enum HealthStatus {
  Healthy = 'healthy',
  Degraded = 'degraded',
  Offline = 'offline',
  Unknown = 'unknown'
}
```

**CreatePointDto:**
```typescript
interface CreatePointDto {
  deviceId: number;           // required, must exist
  pointKey: string;           // required, from controlled vocabulary
  engineeringUnit: string;    // required, max 20 chars
  dataType: DataType;         // required
  scalingFactor?: number;     // optional, default 1.0
  direction: Direction;       // required
  registerType?: RegisterType; // optional
  registerAddress?: number;   // optional
}

enum DataType {
  Int16 = 'int16',
  UInt16 = 'uint16',
  Int32 = 'int32',
  UInt32 = 'uint32',
  Float32 = 'float32',
  Bool = 'bool'
}

enum Direction {
  Telemetry = 'telemetry',
  Command = 'command',
  Both = 'both'
}

enum RegisterType {
  Holding = 'holding',
  Input = 'input',
  Coil = 'coil',
  Discrete = 'discrete'
}
```

---

## 7. Testing Requirements

### 7.1 Unit Tests

**Portfolio Hierarchy:**
- ✅ Create portfolio with valid data succeeds
- ✅ Create portfolio with duplicate code fails
- ✅ Create building under non-existent portfolio fails
- ✅ Delete building with floors returns 422
- ✅ Delete empty building succeeds
- ✅ Zone filtering by building returns correct zones
- ✅ Zone filtering by floor returns correct zones

**Device Management:**
- ✅ Create device with valid data succeeds
- ✅ Create device with duplicate serial number fails
- ✅ Create device with invalid protocol fails
- ✅ Update device commissioning state succeeds
- ✅ Device filtering by multiple criteria works correctly
- ✅ Pagination returns correct page and total count

**Point Catalogue:**
- ✅ Create point with valid data succeeds
- ✅ Create point with invalid point key fails
- ✅ Create duplicate point (device_id, point_key) fails
- ✅ Update point scaling factor succeeds and audits user
- ✅ Deactivate point succeeds
- ✅ Deactivate point with active readings fails
- ✅ Profile validation detects missing points
- ✅ Profile validation detects scaling mismatches

### 7.2 Integration Tests

- ✅ Create full hierarchy: Portfolio → Building → Floor → Zone → Device → Points
- ✅ Attempt to delete entities with children at each level (expect 422)
- ✅ Filter zones across multiple buildings and floors
- ✅ Validate device profile compliance with all points configured
- ✅ Validate device profile compliance with missing points (expect 422)
- ✅ Update point configuration and verify audit trail

### 7.3 API Contract Tests

- ✅ All endpoints return correct HTTP status codes
- ✅ Error responses match defined error format
- ✅ Pagination response includes all required fields
- ✅ Created resources return complete entity with timestamps
- ✅ 422 responses include detailed validation errors

---

## 8. Database Migrations

### 8.1 Migration Strategy

**Migration Naming Convention:**
```
YYYYMMDD_HHMM_description.sql

Example: 20260903_1200_create_portfolio_hierarchy_tables.sql
```

**Migration Order:**
1. `20260903_1200_create_portfolio_hierarchy_tables.sql`
2. `20260903_1210_create_device_tables.sql`
3. `20260903_1220_create_point_catalogue_tables.sql`
4. `20260903_1230_create_device_profiles_table.sql`
5. `20260903_1240_add_indexes.sql`
6. `20260903_1250_seed_device_profiles.sql`

### 8.2 Sample Seed Data

**Seed Device Profile:**
```sql
INSERT INTO device_profiles (profile_name, version, description, required_points)
VALUES (
  'hvac-zone-controller-v1',
  '1.0',
  'Standard HVAC zone controller with temperature, humidity, CO2, and control points',
  '{
    "zone_temp": {"engineering_unit": "degC", "data_type": "int16", "scaling_factor": 0.1, "direction": "telemetry"},
    "zone_humidity": {"engineering_unit": "percent", "data_type": "uint16", "scaling_factor": 0.1, "direction": "telemetry"},
    "zone_co2": {"engineering_unit": "ppm", "data_type": "uint16", "scaling_factor": 1.0, "direction": "telemetry"},
    "setpoint_heat": {"engineering_unit": "degC", "data_type": "int16", "scaling_factor": 0.1, "direction": "both"},
    "setpoint_cool": {"engineering_unit": "degC", "data_type": "int16", "scaling_factor": 0.1, "direction": "both"},
    "damper_position": {"engineering_unit": "percent", "data_type": "uint16", "scaling_factor": 0.1, "direction": "both"},
    "valve_position": {"engineering_unit": "percent", "data_type": "uint16", "scaling_factor": 0.1, "direction": "both"},
    "fan_speed": {"engineering_unit": "rpm", "data_type": "uint16", "scaling_factor": 1.0, "direction": "both"},
    "occupancy_count": {"engineering_unit": "count", "data_type": "uint16", "scaling_factor": 1.0, "direction": "telemetry"},
    "occupancy_detected": {"engineering_unit": "bool", "data_type": "bool", "scaling_factor": 1.0, "direction": "telemetry"},
    "alarm_status": {"engineering_unit": "bool", "data_type": "bool", "scaling_factor": 1.0, "direction": "telemetry"},
    "system_mode": {"engineering_unit": "enum", "data_type": "uint16", "scaling_factor": 1.0, "direction": "both"}
  }'
);
```

---

## 9. Implementation Checklist

### Phase 1: Database & Repository Layer
- [ ] Create database migration scripts
- [ ] Implement Portfolio, Building, Floor, Zone repositories
- [ ] Implement Device repository
- [ ] Implement Point repository
- [ ] Implement DeviceProfile repository
- [ ] Write unit tests for all repositories

### Phase 2: API Layer
- [ ] Implement Portfolio CRUD endpoints
- [ ] Implement Building CRUD endpoints
- [ ] Implement Floor CRUD endpoints
- [ ] Implement Zone CRUD endpoints with filtering
- [ ] Implement Device CRUD endpoints with filtering
- [ ] Implement Point CRUD endpoints
- [ ] Implement device profile validation endpoint
- [ ] Write API integration tests

### Phase 3: Business Logic & Validation
- [ ] Implement hierarchy integrity checks
- [ ] Implement device serial uniqueness validation
- [ ] Implement point controlled vocabulary validation
- [ ] Implement device profile compliance validation
- [ ] Implement audit logging for point updates
- [ ] Write business logic unit tests

### Phase 4: Error Handling & Documentation
- [ ] Standardize error response format
- [ ] Implement proper HTTP status codes
- [ ] Generate OpenAPI/Swagger documentation
- [ ] Write API usage examples
- [ ] Document controlled vocabularies

---

## 10. Dependencies & Assumptions

### Dependencies
- PostgreSQL 14+ database
- REST API framework (Express.js, NestJS, or similar)
- TypeScript for type safety
- ORM or query builder (TypeORM, Prisma, or Knex)
- Migration tool (compatible with chosen framework)

### Assumptions
- Single-tenant deployment (multi-tenancy not required in Phase 1)
- Authentication/authorization handled by separate middleware
- Point controlled vocabulary is predefined and stable
- Device profiles are seeded during deployment
- Telemetry readings table exists separately (not defined in this spec)
- User management system provides user IDs for audit logging

### Future Considerations
- Multi-tenant support with portfolio-level isolation
- Bulk import/export functionality for hierarchy and devices
- Device firmware update tracking and history
- Point configuration templates for common device types
- Geospatial indexing for building locations
- Time-series optimizations for point readings query

---

## Appendix A: Controlled Vocabularies

### Point Keys
```
zone_temp
zone_humidity
zone_co2
zone_voc
zone_pm25
zone_pm10
setpoint_heat
setpoint_cool
setpoint_ventilation
damper_position
valve_position
fan_speed
fan_status
occupancy_count
occupancy_detected
window_status
door_status
alarm_status
system_mode
override_active
filter_status
maintenance_required
```

### Engineering Units
```
degC, degF, percent, ppm, ppb, 
ug/m3, rpm, bool, enum, count,
kW, kWh, L/s, CFM, Pa
```

---

**End of Specification**
