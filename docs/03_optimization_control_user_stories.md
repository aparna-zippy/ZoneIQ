# Optimization & Control User Stories

## Epic: Supervisory Optimization Policy (HFP-05)

### User Story 5.1: Compute Zone Targets
**As a** System  
**I want to** compute supervisory targets for each zone  
**So that** devices receive optimized setpoints and ventilation parameters

**Acceptance Criteria:**
- [ ] System computes zone target from snapshot + profile + schedule + policy
- [ ] Target includes temperature setpoint
- [ ] Target includes ventilation minimum
- [ ] Target includes mode recommendation
- [ ] Computation is pure and independently testable
- [ ] Target is logged for audit trail

**Related Requirements:** HFP-05  
**Priority:** Critical  
**Dependencies:** User Stories 4.1, 8.1, 8.2

---

### User Story 5.2: Implement Demand-Controlled Ventilation
**As an** Energy Analyst  
**I want to** automatically increase ventilation when air quality degrades  
**So that** occupants have healthy air even at energy cost

**Acceptance Criteria:**
- [ ] System raises ventilation minimum when CO₂ above threshold
- [ ] System raises ventilation minimum when PM2.5 above threshold
- [ ] DCV activates even when temperature is in-band
- [ ] Tradeoff between comfort and energy is documented
- [ ] DCV behavior is proven by unit test
- [ ] I can enable/disable DCV per zone or building

**Related Requirements:** HFP-05  
**Priority:** High  
**Dependencies:** User Stories 4.2, 5.1

---

### User Story 5.3: Implement Pre-Conditioning
**As a** Controls Engineer  
**I want to** pre-cool or pre-heat zones before occupancy  
**So that** zones are comfortable when people arrive

**Acceptance Criteria:**
- [ ] System shifts setpoints ahead of scheduled occupancy
- [ ] Lead time is configurable per zone or building
- [ ] Pre-conditioning respects safe envelope limits
- [ ] I can view pre-conditioning schedule
- [ ] Pre-conditioning is proven by unit test
- [ ] Energy impact is measurable in KPIs

**Related Requirements:** HFP-05  
**Priority:** Medium  
**Dependencies:** User Stories 5.1, 8.2

---

### User Story 5.4: Make Base Policy Independently Testable
**As a** Developer  
**I want to** test optimization policy without database or HTTP  
**So that** I can verify policy logic in isolation

**Acceptance Criteria:**
- [ ] Base policy is pure function (no side effects)
- [ ] Policy takes domain objects, returns target
- [ ] Policy has comprehensive unit test suite
- [ ] Policy doesn't depend on framework or infrastructure
- [ ] Any adaptive extensions are separately toggled
- [ ] Policy behavior is deterministic and reproducible

**Related Requirements:** HFP-05, Section 8 layering  
**Priority:** High  
**Dependencies:** User Story 5.1

---

### User Story 5.5: Configure Optimization Parameters
**As a** Controls Engineer  
**I want to** configure optimization policy parameters  
**So that** I can tune performance for different building types

**Acceptance Criteria:**
- [ ] I can set DCV enable flag and CO₂ target
- [ ] I can set pre-cool/pre-heat lead time
- [ ] I can set comfort-vs-energy weighting
- [ ] I can set deadband and hysteresis values
- [ ] Parameters apply at zone or building scope
- [ ] Changes are audited

**Related Requirements:** HFP-05, HFP-12  
**Priority:** Medium  
**Dependencies:** User Stories 5.1-5.3

---

## Epic: Command Dispatch (HFP-07)

### User Story 7.1: Create Draft Commands
**As a** Controls Engineer  
**I want to** create supervisory commands as drafts  
**So that** they can be reviewed before execution

**Acceptance Criteria:**
- [ ] I can create setpoint change command
- [ ] I can create mode override command
- [ ] I can create return-to-auto command
- [ ] I can create schedule push command
- [ ] Command starts in 'draft' state
- [ ] I can specify target zone or device

**Related Requirements:** HFP-07  
**Priority:** High  
**Dependencies:** User Stories 1.2, 1.3

---

### User Story 7.2: Validate Command Envelopes
**As a** System  
**I want to** validate commands against safe envelopes  
**So that** dangerous commands are prevented

**Acceptance Criteria:**
- [ ] System validates setpoints against documented envelope
- [ ] Out-of-envelope values are rejected with 422
- [ ] OR out-of-envelope values are clamped with audit
- [ ] Clamp decision is recorded on command
- [ ] Safe envelope is documented and versioned
- [ ] Validation is proven by boundary tests

**Related Requirements:** HFP-07, Section 10 acceptance  
**Priority:** Critical  
**Dependencies:** User Story 7.1

---

### User Story 7.3: Approve Commands
**As a** Facilities Manager  
**I want to** approve draft commands before execution  
**So that** I maintain control over supervisory actions

**Acceptance Criteria:**
- [ ] I can approve a draft command via `/approve` endpoint
- [ ] Only authorized roles can approve
- [ ] Command transitions from 'draft' to 'approved'
- [ ] Approval is recorded with user and timestamp
- [ ] Approved command can proceed to dispatch
- [ ] Approval transition is audited

**Related Requirements:** HFP-07, HFP-12  
**Priority:** High  
**Dependencies:** User Stories 7.1, 12.2

---

### User Story 7.4: Dispatch Commands to Devices
**As a** System  
**I want to** send approved commands through device adapter  
**So that** supervisory intent reaches the controllers

**Acceptance Criteria:**
- [ ] System dispatches only approved commands
- [ ] Unapproved commands are never dispatched (proven by test)
- [ ] Command transitions to 'dispatched' state
- [ ] Dispatch time is recorded
- [ ] Adapter encodes command per register map
- [ ] Dispatch is audited

**Related Requirements:** HFP-07, Section 9.2  
**Priority:** Critical  
**Dependencies:** User Stories 7.2, 7.3

---

### User Story 7.5: Confirm or Fail Command Execution
**As a** System  
**I want to** track whether commands succeeded  
**So that** failures can be escalated

**Acceptance Criteria:**
- [ ] System marks command 'confirmed' on device echo
- [ ] System marks command 'failed' on timeout or error
- [ ] Failed dispatch raises device-health alarm
- [ ] Zone remains on last-known-good target on failure
- [ ] Failure reason is captured
- [ ] State transitions are audited

**Related Requirements:** HFP-07, HFP-06  
**Priority:** High  
**Dependencies:** User Stories 7.4, 6.1

---

### User Story 7.6: View Command History
**As a** Controls Engineer  
**I want to** view command history for a zone  
**So that** I can understand what has been changed

**Acceptance Criteria:**
- [ ] I can query commands by zone
- [ ] I can query commands by time range
- [ ] I can filter by command type
- [ ] I can filter by state (draft/approved/dispatched/confirmed/failed)
- [ ] History shows who requested and who approved
- [ ] History includes payload and outcome

**Related Requirements:** HFP-07, HFP-12  
**Priority:** Medium  
**Dependencies:** User Story 7.1

---

## Epic: Setpoint Schedules & Comfort Profiles (HFP-08)

### User Story 8.1: Define Comfort Profiles
**As a** Controls Engineer  
**I want to** define comfort targets for zones  
**So that** optimization knows what conditions to maintain

**Acceptance Criteria:**
- [ ] I can create ComfortProfile with temp band
- [ ] I can set RH band
- [ ] I can set CO₂ threshold
- [ ] I can set PM2.5 threshold
- [ ] I can set occupied hours
- [ ] Profile applies per zone or building default
- [ ] Profile references ASHRAE standards

**Related Requirements:** HFP-08  
**Priority:** High  
**Dependencies:** User Story 1.1

---

### User Story 8.2: Define Setpoint Schedules
**As a** Controls Engineer  
**I want to** create daily schedules with time blocks  
**So that** setpoints adapt to occupancy patterns

**Acceptance Criteria:**
- [ ] I can create SetpointSchedule per zone
- [ ] I can define day-type (weekday/weekend/holiday)
- [ ] I can define time blocks with start/end
- [ ] Each block specifies temp setpoint and ventilation minimum
- [ ] System rejects overlapping blocks with 422
- [ ] System validates setpoints within safe envelope

**Related Requirements:** HFP-08  
**Priority:** High  
**Dependencies:** User Stories 1.3, 8.1

---

### User Story 8.3: Apply Building Defaults
**As a** Facilities Manager  
**I want to** set building-wide default profiles  
**So that** I don't configure each zone individually

**Acceptance Criteria:**
- [ ] I can set default ComfortProfile at building level
- [ ] Zones inherit building default if not overridden
- [ ] Zone-specific profile overrides building default
- [ ] I can view which zones use defaults vs overrides
- [ ] Changes to defaults affect inheriting zones
- [ ] Override relationships are queryable

**Related Requirements:** HFP-08  
**Priority:** Medium  
**Dependencies:** User Story 8.1

---

### User Story 8.4: Enforce Safety Bounds
**As a** System  
**I want to** validate profiles and schedules against safety bounds  
**So that** dangerous configurations are prevented

**Acceptance Criteria:**
- [ ] System rejects setpoints outside safe envelope
- [ ] System rejects ventilation minimum < 0
- [ ] System rejects contradictory schedule blocks
- [ ] System returns 422 with clear error message
- [ ] Bounds are documented and versioned
- [ ] Validation is proven by boundary tests

**Related Requirements:** HFP-08  
**Priority:** Critical  
**Dependencies:** User Stories 8.1, 8.2

---

### User Story 8.5: Audit Profile and Schedule Changes
**As a** Facilities Manager  
**I want to** track all changes to profiles and schedules  
**So that** I can understand what caused behavior changes

**Acceptance Criteria:**
- [ ] Profile changes create audit events
- [ ] Schedule changes create audit events
- [ ] Audit captures before/after snapshot
- [ ] Audit records user and timestamp
- [ ] Changes take effect on next optimization cycle
- [ ] Changes are not retroactive

**Related Requirements:** HFP-08, HFP-12  
**Priority:** Medium  
**Dependencies:** User Stories 8.1, 8.2, 12.1

---
