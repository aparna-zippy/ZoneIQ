# Security, Access Control & Audit User Stories

## Epic: Audit, Access Control & Traceability (HFP-12)

### User Story 12.1: Audit Safety-Relevant Actions
**As a** System  
**I want to** record all safety-relevant actions  
**So that** we have complete traceability

**Acceptance Criteria:**
- [ ] System creates AuditEvent for every Command state transition
- [ ] System creates AuditEvent for every Alarm state transition
- [ ] System creates AuditEvent for every shelve/unshelve action
- [ ] System creates AuditEvent for ComfortProfile changes
- [ ] System creates AuditEvent for SetpointSchedule changes
- [ ] System creates AuditEvent for OptimizationPolicy changes
- [ ] Each event is immutable once created
- [ ] Events are never deleted through API

**Related Requirements:** HFP-12  
**Priority:** Critical  
**Dependencies:** User Stories 5.5, 6.6, 7.1-7.5, 8.1, 8.2

---

### User Story 12.2: Capture Complete Audit Context
**As a** Compliance Officer  
**I want to** see complete context for each audit event  
**So that** I can understand what happened and why

**Acceptance Criteria:**
- [ ] AuditEvent records actor (user who performed action)
- [ ] AuditEvent records action type
- [ ] AuditEvent records entity type and ID
- [ ] AuditEvent captures before/after snapshot
- [ ] AuditEvent records timestamp (database-set)
- [ ] Snapshot includes all relevant changed fields
- [ ] Sensitive data is handled appropriately

**Related Requirements:** HFP-12  
**Priority:** High  
**Dependencies:** User Story 12.1

---

### User Story 12.3: Query Audit Trail
**As a** Facilities Manager  
**I want to** search the audit trail  
**So that** I can investigate issues and verify actions

**Acceptance Criteria:**
- [ ] I can query audit events by zone
- [ ] I can query by device
- [ ] I can query by alarm
- [ ] I can query by command
- [ ] I can query by user
- [ ] I can query by action type
- [ ] I can query by time range
- [ ] Results support pagination

**Related Requirements:** HFP-12  
**Priority:** High  
**Dependencies:** User Stories 12.1, 12.2

---

### User Story 12.4: Protect Audit Integrity
**As a** System  
**I want to** prevent modification of audit records  
**So that** audit trail is trustworthy

**Acceptance Criteria:**
- [ ] Audit events are write-only (append-only)
- [ ] API does not expose update or delete endpoints for audit
- [ ] Database constraints enforce immutability
- [ ] Attempt to modify audit event is logged and rejected
- [ ] Audit table has appropriate permissions
- [ ] Backup and retention policies preserve audit data

**Related Requirements:** HFP-12  
**Priority:** Critical  
**Dependencies:** User Story 12.1

---

### User Story 12.5: Define User Roles
**As a** System Administrator  
**I want to** assign roles to users  
**So that** access is controlled appropriately

**Acceptance Criteria:**
- [ ] System supports Facilities Manager role
- [ ] System supports Controls Engineer role
- [ ] System supports Field Technician role
- [ ] System supports Energy Analyst role
- [ ] System supports Tenant-Experience role
- [ ] System supports Viewer role (read-only)
- [ ] User can have exactly one role
- [ ] Role determines what actions are permitted

**Related Requirements:** HFP-12  
**Priority:** High  
**Dependencies:** User management foundation

---

### User Story 12.6: Enforce Role-Based Permissions
**As a** System  
**I want to** restrict actions based on user role  
**So that** only authorized users can perform risky actions

**Acceptance Criteria:**
- [ ] Viewer role is strictly read-only
- [ ] Command approval requires Controls Engineer or Facilities Manager
- [ ] Envelope override requires Supervisor (Facilities Manager) approval
- [ ] Profile/schedule edits require Controls Engineer or Facilities Manager
- [ ] Extended shelving requires Supervisor approval
- [ ] Work order assignment respects team/role boundaries
- [ ] Unauthorized actions return 403 Forbidden

**Related Requirements:** HFP-12  
**Priority:** Critical  
**Dependencies:** User Stories 7.3, 8.1, 8.2, 12.5

---

### User Story 12.7: Audit Access Denials
**As a** Security Officer  
**I want to** log all access denials  
**So that** I can detect unauthorized access attempts

**Acceptance Criteria:**
- [ ] System creates AuditEvent for denied actions
- [ ] Event records user, attempted action, and reason
- [ ] Event includes entity that was targeted
- [ ] Event distinguishes authorization vs authentication failures
- [ ] I can query denied actions by user
- [ ] I can query denied actions by resource
- [ ] Patterns of denials are detectable

**Related Requirements:** HFP-12  
**Priority:** Medium  
**Dependencies:** User Stories 12.1, 12.6

---

### User Story 12.8: Require Justification for Overrides
**As a** Facilities Manager  
**I want to** require justification for safety overrides  
**So that** exceptional actions are documented

**Acceptance Criteria:**
- [ ] Envelope override requires mandatory reason field
- [ ] Extended shelving requires mandatory reason field
- [ ] Emergency mode-override requires justification
- [ ] System rejects override without justification (422)
- [ ] Justification is captured in audit event
- [ ] I can review all overrides with justifications

**Related Requirements:** HFP-12  
**Priority:** High  
**Dependencies:** User Stories 6.6, 7.2, 12.1

---

### User Story 12.9: View User Activity Report
**As a** Facilities Manager  
**I want to** see what actions each user performed  
**So that** I can verify work and identify training needs

**Acceptance Criteria:**
- [ ] I can view audit events by user over time period
- [ ] Report shows action types and frequencies
- [ ] Report shows which entities were modified
- [ ] Report highlights safety-relevant actions
- [ ] Report shows denied actions
- [ ] Report can be exported for review

**Related Requirements:** HFP-12  
**Priority:** Low  
**Dependencies:** User Stories 12.1, 12.3

---

### User Story 12.10: Implement Audit Retention Policy
**As a** System Administrator  
**I want to** configure audit data retention  
**So that** we comply with regulatory requirements

**Acceptance Criteria:**
- [ ] Audit retention period is configurable
- [ ] System archives old audit data appropriately
- [ ] Archived data remains queryable (or access method documented)
- [ ] Retention policy is documented and justified
- [ ] Policy distinguishes critical vs routine events
- [ ] Retention complies with applicable regulations

**Related Requirements:** HFP-12  
**Priority:** Low  
**Dependencies:** User Story 12.1

---
