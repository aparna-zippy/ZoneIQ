# Work Order & Complaint Management User Stories

## Epic: Occupant Complaint Intake (HFP-09)

### User Story 9.1: Capture Occupant Complaints
**As a** Tenant Experience Coordinator  
**I want to** record comfort complaints from occupants  
**So that** we can track and address comfort issues

**Acceptance Criteria:**
- [ ] I can create a Complaint against a specific zone
- [ ] I can capture reporter name
- [ ] I can capture free-text description
- [ ] System records received-at timestamp automatically
- [ ] Complaint starts in 'open' status
- [ ] I can view list of all complaints

**Related Requirements:** HFP-09  
**Priority:** High  
**Dependencies:** User Story 1.3 (zones)

---

### User Story 9.2: View Zone Context for Complaints
**As a** Tenant Experience Coordinator  
**I want to** see zone comfort/IAQ status alongside complaints  
**So that** I can triage effectively

**Acceptance Criteria:**
- [ ] Complaint view shows zone's recent comfort status
- [ ] Complaint view shows zone's recent IAQ status
- [ ] Complaint view shows active alarms for the zone
- [ ] Context includes timestamp range relevant to complaint
- [ ] I can see if issue was detected automatically
- [ ] I can see current vs historical status

**Related Requirements:** HFP-09  
**Priority:** Medium  
**Dependencies:** User Stories 4.1, 4.2, 6.1, 9.1

---

### User Story 9.3: Convert Complaint to Work Order
**As a** Tenant Experience Coordinator  
**I want to** create work orders from complaints  
**So that** maintenance teams can address issues

**Acceptance Criteria:**
- [ ] I can convert a Complaint to a WorkOrder
- [ ] WorkOrder is pre-filled with zone
- [ ] WorkOrder includes status summary from complaint context
- [ ] Link between Complaint and WorkOrder is maintained
- [ ] Original complaint is marked as linked
- [ ] I can view WorkOrder from Complaint and vice versa

**Related Requirements:** HFP-09  
**Priority:** High  
**Dependencies:** User Stories 9.1, 9.2, 10.1

---

### User Story 9.4: Filter and Search Complaints
**As a** Tenant Experience Coordinator  
**I want to** filter and search complaints  
**So that** I can find related issues and patterns

**Acceptance Criteria:**
- [ ] I can filter complaints by zone
- [ ] I can filter by building
- [ ] I can filter by status (open/linked/closed)
- [ ] I can filter by date range
- [ ] I can search free-text descriptions
- [ ] I can view complaints without linked work orders

**Related Requirements:** HFP-09  
**Priority:** Medium  
**Dependencies:** User Story 9.1

---

## Epic: Work Order Management (HFP-10)

### User Story 10.1: Create Work Orders
**As a** Field Technician  
**I want to** create work orders from various sources  
**So that** maintenance work is tracked

**Acceptance Criteria:**
- [ ] I can create WorkOrder from an Alarm
- [ ] I can create WorkOrder from a Complaint
- [ ] I can create WorkOrder from a Device directly
- [ ] WorkOrder carries linked zone
- [ ] WorkOrder carries linked alarm (if applicable)
- [ ] WorkOrder carries linked complaint (if applicable)
- [ ] Source links are maintained and queryable

**Related Requirements:** HFP-10  
**Priority:** High  
**Dependencies:** User Stories 1.2, 6.1, 9.1

---

### User Story 10.2: Populate Work Order Details
**As a** Facilities Manager  
**I want to** specify work order details  
**So that** technicians know what to do

**Acceptance Criteria:**
- [ ] I can set title (required)
- [ ] I can set description (required)
- [ ] I can set priority (critical/high/medium/low)
- [ ] I can assign to team
- [ ] WorkOrder starts in 'open' status
- [ ] System validates required fields
- [ ] I can include attachments/references

**Related Requirements:** HFP-10  
**Priority:** High  
**Dependencies:** User Story 10.1

---

### User Story 10.3: Manage Work Order Lifecycle
**As a** Field Technician  
**I want to** update work order status  
**So that** everyone knows work progress

**Acceptance Criteria:**
- [ ] I can transition status: open → in-progress
- [ ] I can transition status: in-progress → done
- [ ] I can transition status: any → cancelled
- [ ] System records who made each transition
- [ ] System records when transition occurred
- [ ] Status history is queryable
- [ ] Only assigned team can update (base) or role-based (enhanced)

**Related Requirements:** HFP-10  
**Priority:** High  
**Dependencies:** User Story 10.2

---

### User Story 10.4: Record Work Order Completion
**As a** Field Technician  
**I want to** record when work is complete  
**So that** we can track resolution time

**Acceptance Criteria:**
- [ ] I can mark WorkOrder as 'done'
- [ ] System records closed-at timestamp automatically
- [ ] System records who closed it
- [ ] I can add completion notes
- [ ] Closed work orders can be reopened with justification
- [ ] Completion data feeds KPI calculations

**Related Requirements:** HFP-10, HFP-11  
**Priority:** High  
**Dependencies:** User Story 10.3

---

### User Story 10.5: List and Filter Work Orders
**As a** Facilities Manager  
**I want to** view and filter work orders  
**So that** I can monitor maintenance workload

**Acceptance Criteria:**
- [ ] I can filter work orders by building
- [ ] I can filter by zone
- [ ] I can filter by assigned team
- [ ] I can filter by status (open/in-progress/done/cancelled)
- [ ] I can filter by priority
- [ ] I can sort by created date, priority, or status
- [ ] I can view only my team's work orders

**Related Requirements:** HFP-10  
**Priority:** Medium  
**Dependencies:** User Story 10.1

---

### User Story 10.6: View Work Order Details
**As a** Field Technician  
**I want to** view complete work order details  
**So that** I understand the full context

**Acceptance Criteria:**
- [ ] I can view all work order fields
- [ ] I can view linked zone with current status
- [ ] I can view linked alarm (if applicable)
- [ ] I can view linked complaint (if applicable)
- [ ] I can view status history
- [ ] I can view related device information
- [ ] I can view recent readings for the zone

**Related Requirements:** HFP-10  
**Priority:** Medium  
**Dependencies:** User Stories 10.1, 10.2

---

### User Story 10.7: Track Work Order Metrics
**As a** Facilities Manager  
**I want to** measure work order performance  
**So that** I can improve response times

**Acceptance Criteria:**
- [ ] I can view open work order count by priority
- [ ] I can view average time to close by team
- [ ] I can view work orders per zone/building
- [ ] I can track complaint resolution time
- [ ] Metrics are available via API and dashboard
- [ ] Metrics can be filtered by date range

**Related Requirements:** HFP-10, HFP-11  
**Priority:** Low  
**Dependencies:** User Stories 10.3, 10.4

---
