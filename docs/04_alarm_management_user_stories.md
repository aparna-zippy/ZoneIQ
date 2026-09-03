# Alarm Management User Stories

## Epic: Fleet Alarm & Event Management (HFP-06)

### User Story 6.1: Raise Alarms on Excursions
**As a** System  
**I want to** raise alarms when conditions exceed thresholds  
**So that** facilities teams are notified of problems

**Acceptance Criteria:**
- [ ] System raises comfort excursion alarms (temp/RH out of band)
- [ ] System raises air-quality alarms (CO₂/PM2.5 above threshold)
- [ ] System raises device-health alarms (fault codes)
- [ ] System raises comms alarms (no telemetry)
- [ ] Each category has distinct priority rules
- [ ] Alarm includes zone, device, rule, and current value

**Related Requirements:** HFP-06  
**Priority:** Critical  
**Dependencies:** User Stories 4.1, 4.2, 3.5

---

### User Story 6.2: Apply On-Delay and Off-Delay
**As a** System  
**I want to** delay alarm raise/clear based on persistence  
**So that** transient spikes don't create nuisance alarms

**Acceptance Criteria:**
- [ ] System raises alarm only after excursion persists past on-delay
- [ ] System clears alarm only after return in-band past off-delay
- [ ] Delay values are configurable per alarm type
- [ ] Behavior is proven by unit tests
- [ ] I can query configured delay values
- [ ] Delays are documented and justified

**Related Requirements:** HFP-06  
**Priority:** High  
**Dependencies:** User Story 6.1

---

### User Story 6.3: Prevent Duplicate Alarms
**As a** System  
**I want to** prevent duplicate active alarms  
**So that** alarm list stays clean and actionable

**Acceptance Criteria:**
- [ ] Only one active alarm per (zone, rule) combination
- [ ] New excursion updates existing active alarm
- [ ] Cleared alarms don't prevent new alarms on re-excursion
- [ ] Duplicate prevention is proven by tests
- [ ] I can view alarm history including cleared alarms
- [ ] Alarm count metrics are accurate

**Related Requirements:** HFP-06  
**Priority:** Medium  
**Dependencies:** User Story 6.1

---

### User Story 6.4: List and Filter Alarms
**As a** Facilities Manager  
**I want to** view and filter active alarms  
**So that** I can prioritize response

**Acceptance Criteria:**
- [ ] I can list all active alarms
- [ ] I can filter by building
- [ ] I can filter by zone
- [ ] I can filter by category (comfort/IAQ/device/comms)
- [ ] I can filter by priority (critical/high/medium/low)
- [ ] I can filter by state (active/acked/shelved/cleared)
- [ ] I can sort by raised-at or priority

**Related Requirements:** HFP-06  
**Priority:** High  
**Dependencies:** User Story 6.1

---

### User Story 6.5: Acknowledge Alarms
**As a** Field Technician  
**I want to** acknowledge alarms I'm working on  
**So that** others know they're being handled

**Acceptance Criteria:**
- [ ] I can acknowledge a single alarm
- [ ] I can acknowledge multiple alarms in batch
- [ ] Acknowledgment records user and timestamp
- [ ] Acknowledged alarms remain visible but marked
- [ ] I can filter for unacknowledged alarms
- [ ] Acknowledgment is audited

**Related Requirements:** HFP-06, HFP-12  
**Priority:** High  
**Dependencies:** User Stories 6.1, 6.4

---

### User Story 6.6: Shelve Alarms with Reason
**As a** Facilities Manager  
**I want to** temporarily suppress known alarms  
**So that** I can focus on actionable items

**Acceptance Criteria:**
- [ ] I can shelve an alarm with mandatory reason
- [ ] I must specify expiry time
- [ ] Shelved alarms are hidden from active list
- [ ] System auto-unshelves on expiry
- [ ] I can view currently-shelved alarms
- [ ] Shelving is audited

**Related Requirements:** HFP-06  
**Priority:** Medium  
**Dependencies:** User Stories 6.1, 6.5

---

### User Story 6.7: Require Supervisor Approval for Extended Shelving
**As a** System  
**I want to** require supervisor approval for long shelving  
**So that** alarms aren't permanently hidden

**Acceptance Criteria:**
- [ ] System defines max shelving duration
- [ ] Shelving beyond max requires Supervisor (Facilities Manager) approval
- [ ] Approval requirement is enforced before shelving
- [ ] Approval is recorded in audit trail
- [ ] I can query max shelving duration
- [ ] Extended shelving is separately reportable

**Related Requirements:** HFP-06, HFP-12  
**Priority:** Medium  
**Dependencies:** User Stories 6.6, 12.2

---

### User Story 6.8: Analyze Alarm Patterns
**As an** Energy Analyst  
**I want to** view alarm analytics  
**So that** I can identify systemic issues

**Acceptance Criteria:**
- [ ] I can view alarm rate per 10-minute window
- [ ] I can view rate per building and fleet-wide
- [ ] I can view "bad actors" (top zones/points by alarm count)
- [ ] I can view standing alarms (long-duration active)
- [ ] I can view currently-shelved list
- [ ] I can view Mean Time To Acknowledge (MTTA)

**Related Requirements:** HFP-06, HFP-11  
**Priority:** Medium  
**Dependencies:** User Stories 6.1, 6.5, 6.6

---

### User Story 6.9: Track Alarm State Transitions
**As a** System  
**I want to** track alarm state machine transitions  
**So that** alarm history is complete and auditable

**Acceptance Criteria:**
- [ ] System models alarm states: ACTIVE/UNACKED, ACTIVE/ACKED, SHELVED, CLEARED
- [ ] State transitions follow documented state machine
- [ ] Every transition is audited with timestamp
- [ ] I can query alarm by current state
- [ ] I can view state history for an alarm
- [ ] State machine is proven by unit tests

**Related Requirements:** HFP-06, HFP-12, Section 6 domain model  
**Priority:** High  
**Dependencies:** User Stories 6.1, 6.5, 6.6

---

### User Story 6.10: Clear Alarms Automatically
**As a** System  
**I want to** clear alarms when conditions return to normal  
**So that** alarm list stays current

**Acceptance Criteria:**
- [ ] System clears alarm when condition returns in-band
- [ ] Clear respects off-delay (sustained return)
- [ ] Clear transition is audited
- [ ] Cleared alarms remain in history
- [ ] I can view recently-cleared alarms
- [ ] Clear behavior is proven by tests

**Related Requirements:** HFP-06  
**Priority:** High  
**Dependencies:** User Stories 6.1, 6.2

---
