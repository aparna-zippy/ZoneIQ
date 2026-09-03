# Asset Management User Stories

## Epic: Portfolio & Asset Model (HFP-01)

### User Story 1.1: Create Portfolio Hierarchy
**As a** Facilities Manager  
**I want to** create a portfolio structure with buildings, floors, and zones  
**So that** I can organize and manage HVAC assets across my entire portfolio

**Acceptance Criteria:**
- [ ] I can create a new Portfolio with a name and code
- [ ] I can create Buildings under a Portfolio with name, code, and address
- [ ] I can create Floors under a Building with name and code
- [ ] I can create Zones under a Floor with name, code, area, and occupancy
- [ ] Each entity belongs to exactly one parent in the hierarchy
- [ ] System validates required fields and rejects incomplete data with 422 status

**Related Requirements:** HFP-01  
**Priority:** High  
**Dependencies:** Database schema, Repository layer

---

### User Story 1.2: Manage Device Inventory
**As a** Controls Engineer  
**I want to** register and manage zone controllers in the system  
**So that** I can track all HVAC devices across the portfolio

**Acceptance Criteria:**
- [ ] I can create a Device with serial, model, protocol, firmware version
- [ ] I can assign a Device to exactly one Zone
- [ ] I can set commissioning state for a device
- [ ] System tracks last-seen timestamp for each device
- [ ] I can update device properties (model, firmware, commissioning state)
- [ ] I can view all devices assigned to a zone

**Related Requirements:** HFP-01  
**Priority:** High  
**Dependencies:** User Story 1.1, Zone entity

---

### User Story 1.3: List and Filter Assets
**As a** Facilities Manager  
**I want to** list and filter zones and devices by various criteria  
**So that** I can quickly find assets that need attention

**Acceptance Criteria:**
- [ ] I can filter zones by building
- [ ] I can filter zones by floor
- [ ] I can filter devices by protocol (modbus-rtu, modbus-tcp, bacnet)
- [ ] I can filter devices by commissioning state
- [ ] I can filter devices by health status
- [ ] Filter combinations work correctly (e.g., building + floor)
- [ ] Results are paginated for large datasets

**Related Requirements:** HFP-01  
**Priority:** Medium  
**Dependencies:** User Stories 1.1, 1.2

---

### User Story 1.4: Protect Hierarchy Integrity
**As a** System Administrator  
**I want to** prevent deletion of entities with children  
**So that** I don't accidentally create orphaned data

**Acceptance Criteria:**
- [ ] System refuses to delete a Building that has Floors
- [ ] System refuses to delete a Floor that has Zones
- [ ] System returns 422 status with clear error message
- [ ] I can view what would prevent deletion before attempting it
- [ ] Deletion works correctly for leaf nodes (no children)

**Related Requirements:** HFP-01  
**Priority:** Medium  
**Dependencies:** User Story 1.1

---

## Epic: Point Catalogue (HFP-02)

### User Story 2.1: Define Device Points
**As a** Controls Engineer  
**I want to** define the telemetry and command points for each device  
**So that** the platform knows how to interpret device data

**Acceptance Criteria:**
- [ ] I can create a Point under a Device with key, engineering unit, data type
- [ ] I can specify scaling factor (e.g., ×0.1 for temperature)
- [ ] I can set direction (telemetry, command, or both)
- [ ] I can map point to register (type and address)
- [ ] Point key must be from controlled vocabulary
- [ ] Point is unique per (device, key) combination
- [ ] System validates all required fields

**Related Requirements:** HFP-02  
**Priority:** High  
**Dependencies:** User Story 1.2, controlled vocabulary definition

---

### User Story 2.2: Enforce Device Profile Consistency
**As a** Controls Engineer  
**I want to** ensure device points match a declared device profile  
**So that** the platform correctly interprets device data

**Acceptance Criteria:**
- [ ] Device must declare a profile (e.g., hvac-zone-controller-v1)
- [ ] System validates point set against profile requirements
- [ ] System rejects missing required points with clear error
- [ ] System rejects scaling that contradicts profile specification
- [ ] I can view profile requirements before configuring points
- [ ] Profile version is tracked for traceability

**Related Requirements:** HFP-02, Section 9.2 register map  
**Priority:** High  
**Dependencies:** User Story 2.1, device profile definitions

---

### User Story 2.3: Manage Point Catalogue
**As a** Controls Engineer  
**I want to** update and maintain point configurations  
**So that** I can adapt to device firmware updates and corrections

**Acceptance Criteria:**
- [ ] I can update point properties (unit, scaling, register mapping)
- [ ] I can deactivate points that are no longer used
- [ ] I can view complete point catalogue for a device
- [ ] I can view point catalogue across multiple devices of same profile
- [ ] Changes are audited with timestamp and user
- [ ] System prevents deletion of points referenced by active readings

**Related Requirements:** HFP-02, HFP-12  
**Priority:** Medium  
**Dependencies:** User Stories 2.1, 2.2

---
