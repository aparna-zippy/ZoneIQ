# Data Ingestion & Processing User Stories

## Epic: Telemetry Ingestion (HFP-03)

### User Story 3.1: Accept Bulk Telemetry Readings
**As a** Zone Controller  
**I want to** send batches of sensor readings to the platform  
**So that** the platform has current zone status information

**Acceptance Criteria:**
- [ ] I can POST bulk readings to `/api/ingest/readings`
- [ ] Request includes deviceSerial and array of readings
- [ ] Each reading has pointKey, value, quality, timestamp
- [ ] System returns 202 Accepted with per-reading status
- [ ] System processes valid readings even if some are invalid
- [ ] Invalid readings include rejection reason in response

**Related Requirements:** HFP-03, Section 9.1  
**Priority:** Critical  
**Dependencies:** User Stories 1.2, 2.1

---

### User Story 3.2: Validate Incoming Readings
**As a** System  
**I want to** validate readings against known devices and points  
**So that** I only store valid, meaningful data

**Acceptance Criteria:**
- [ ] System returns 404 for unknown deviceSerial
- [ ] System rejects readings for unknown pointKey with reason
- [ ] System rejects readings older than staleness window
- [ ] System validates quality values (good, uncertain, bad)
- [ ] System returns 422 for malformed requests
- [ ] System handles empty readings array appropriately

**Related Requirements:** HFP-03  
**Priority:** High  
**Dependencies:** User Story 3.1

---

### User Story 3.3: Store Readings with Quality Indicators
**As a** System  
**I want to** store reading quality alongside values  
**So that** downstream processing knows which data to trust

**Acceptance Criteria:**
- [ ] System stores quality flag with each reading
- [ ] Only 'good' quality readings drive alarms
- [ ] Only 'good' quality readings drive optimization
- [ ] 'uncertain' and 'bad' readings are stored but not used
- [ ] I can query readings filtered by quality
- [ ] Quality status is visible in dashboard views

**Related Requirements:** HFP-03, HFP-04  
**Priority:** High  
**Dependencies:** User Story 3.1

---

### User Story 3.4: Manage Reading Retention
**As a** System  
**I want to** retain only recent readings per point  
**So that** I don't accumulate unbounded historical data

**Acceptance Criteria:**
- [ ] System retains readings within configured time window
- [ ] Older readings are automatically purged
- [ ] Retention window is configurable per point type
- [ ] Purge process doesn't impact ingestion performance
- [ ] I can query retention settings
- [ ] Critical points can have longer retention

**Related Requirements:** HFP-03  
**Priority:** Medium  
**Dependencies:** User Story 3.1

---

### User Story 3.5: Track Device Connectivity
**As a** Facilities Manager  
**I want to** know when devices stop reporting  
**So that** I can investigate communication issues

**Acceptance Criteria:**
- [ ] System updates device last-seen on each reading batch
- [ ] System raises comms alarm when no readings past threshold
- [ ] Threshold is configurable per device or device type
- [ ] I can view last-seen status on device list
- [ ] I can filter devices by connectivity status
- [ ] Comms alarm clears when readings resume

**Related Requirements:** HFP-03, HFP-06  
**Priority:** High  
**Dependencies:** User Story 3.1, alarm management

---

## Epic: Comfort & Air Quality Evaluation (HFP-04)

### User Story 4.1: Evaluate Zone Comfort Status
**As a** System  
**I want to** evaluate comfort status on each zone snapshot  
**So that** facilities teams know which zones are comfortable

**Acceptance Criteria:**
- [ ] System computes comfort status on fresh good snapshots
- [ ] Status evaluates temperature against ComfortProfile band
- [ ] Status evaluates RH against ComfortProfile band
- [ ] Status considers all parameters together
- [ ] Status result is queryable via API
- [ ] Status is visible on zone dashboard

**Related Requirements:** HFP-04  
**Priority:** High  
**Dependencies:** User Story 3.3, comfort profiles

---

### User Story 4.2: Evaluate Air Quality Status
**As a** Facilities Manager  
**I want to** see air quality as a first-class status indicator  
**So that** I can prioritize IAQ issues even when temperature is comfortable

**Acceptance Criteria:**
- [ ] System exposes distinct air_quality_status field
- [ ] Status evaluates CO₂ against threshold
- [ ] Status evaluates PM2.5 against threshold
- [ ] IAQ status is independent of temperature status
- [ ] IAQ status is visible on dashboards
- [ ] I can filter zones by IAQ status

**Related Requirements:** HFP-04  
**Priority:** High  
**Dependencies:** User Story 4.1

---

### User Story 4.3: Apply Deadband to Prevent Status Flapping
**As a** System  
**I want to** apply deadband and hysteresis to status transitions  
**So that** status doesn't oscillate when values hover near thresholds

**Acceptance Criteria:**
- [ ] System applies documented deadband values
- [ ] Status doesn't change on single reading near threshold
- [ ] Status requires sustained excursion to change
- [ ] Deadband values are justified and documented
- [ ] Deadband is configurable per parameter type
- [ ] Status history shows stable behavior at boundaries

**Related Requirements:** HFP-04  
**Priority:** Medium  
**Dependencies:** User Story 4.1

---

### User Story 4.4: Provide Status History
**As a** Tenant Experience Coordinator  
**I want to** view recent comfort and IAQ status trends  
**So that** I can understand patterns in complaints

**Acceptance Criteria:**
- [ ] I can query status history for a zone over time range
- [ ] History shows status transitions with timestamps
- [ ] History indicates which parameter triggered status change
- [ ] History is available via API and dashboard
- [ ] I can correlate status with complaint timestamps
- [ ] History respects data retention policies

**Related Requirements:** HFP-04, HFP-11  
**Priority:** Medium  
**Dependencies:** User Stories 4.1, 4.2

---
