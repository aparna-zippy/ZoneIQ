# AI Assistants User Stories

## Epic: Assistant Agents (HFP-13)

### User Story 13.1: IAQ Triage Assistant - Analyze Air Quality Alarms
**As a** Facilities Manager  
**I want to** get AI assistance analyzing air quality alarms  
**So that** I can understand cause and urgency quickly

**Acceptance Criteria:**
- [ ] Assistant pulls point's short trend when given IAQ alarm
- [ ] Assistant checks zone's ComfortProfile thresholds
- [ ] Assistant reviews recent commands sent to zone
- [ ] Assistant checks outdoor conditions via weather MCP
- [ ] Assistant provides summary of likely cause
- [ ] Assistant indicates urgency level
- [ ] Summary is grounded in real platform data

**Related Requirements:** HFP-13, Module 07 MCP  
**Priority:** Medium  
**Dependencies:** User Stories 4.2, 6.1, 7.6, 8.1

---

### User Story 13.2: IAQ Triage Assistant - Draft Remediation Actions
**As a** Facilities Manager  
**I want to** get AI-drafted remediation suggestions  
**So that** I can respond to IAQ issues faster

**Acceptance Criteria:**
- [ ] Assistant drafts WorkOrder with problem summary
- [ ] OR assistant drafts ventilation-override Command
- [ ] Drafts are marked clearly as AI-generated
- [ ] Drafts require human approval before execution
- [ ] Assistant never auto-approves or dispatches
- [ ] Assistant cites sources (points, alarms, documents)

**Related Requirements:** HFP-13  
**Priority:** Medium  
**Dependencies:** User Stories 7.1, 10.1, 13.1

---

### User Story 13.3: IAQ Triage Assistant - Respect Tool Permissions
**As a** System  
**I want to** limit IAQ assistant's tool permissions  
**So that** it cannot take unauthorized actions

**Acceptance Criteria:**
- [ ] Assistant can read alarms, points, readings
- [ ] Assistant can read profiles, schedules, policies
- [ ] Assistant can draft commands (but not approve or dispatch)
- [ ] Assistant can draft work orders (but not close)
- [ ] Assistant cannot acknowledge or shelve alarms
- [ ] Assistant cannot modify profiles or schedules
- [ ] Permission boundaries are documented and enforced

**Related Requirements:** HFP-13, Module 07 governance  
**Priority:** High  
**Dependencies:** User Stories 13.1, 13.2

---

### User Story 13.4: Complaint Triage Assistant - Correlate with Zone History
**As a** Tenant Experience Coordinator  
**I want to** get AI assistance correlating complaints with zone data  
**So that** I can validate and prioritize complaints

**Acceptance Criteria:**
- [ ] Assistant analyzes zone's comfort history around complaint time
- [ ] Assistant analyzes zone's IAQ history around complaint time
- [ ] Assistant identifies open alarms for the zone
- [ ] Assistant compares complaint description with sensor data
- [ ] Assistant indicates if complaint matches detected issues
- [ ] Analysis is grounded in real platform data

**Related Requirements:** HFP-13  
**Priority:** Medium  
**Dependencies:** User Stories 4.1, 4.2, 6.1, 9.1

---

### User Story 13.5: Complaint Triage Assistant - Draft Triage Summary
**As a** Tenant Experience Coordinator  
**I want to** get AI-drafted triage summaries  
**So that** I can route complaints efficiently

**Acceptance Criteria:**
- [ ] Assistant drafts triage summary with findings
- [ ] Assistant drafts WorkOrder pre-filled with context
- [ ] Summary indicates whether issue is confirmed by sensors
- [ ] Summary suggests priority level
- [ ] Drafts require human review before action
- [ ] Assistant cites specific data points used

**Related Requirements:** HFP-13  
**Priority:** Medium  
**Dependencies:** User Stories 9.3, 10.1, 13.4

---

### User Story 13.6: Complaint Triage Assistant - Stay Within Permissions
**As a** System  
**I want to** limit complaint assistant's tool permissions  
**So that** it operates within governance boundaries

**Acceptance Criteria:**
- [ ] Assistant can read complaints
- [ ] Assistant can read zone status and history
- [ ] Assistant can read alarms
- [ ] Assistant can draft work orders (but not close)
- [ ] Assistant cannot modify complaint status
- [ ] Assistant cannot approve or execute actions
- [ ] Permission boundaries are documented

**Related Requirements:** HFP-13, Module 07 governance  
**Priority:** High  
**Dependencies:** User Stories 13.4, 13.5

---

### User Story 13.7: Monitor Assistant Behavior
**As a** Product Manager  
**I want to** observe assistant agent behavior  
**So that** I can ensure quality and detect issues

**Acceptance Criteria:**
- [ ] Agent Prism traces capture tool calls
- [ ] Traces capture assistant inputs and outputs
- [ ] Traces capture data sources cited
- [ ] I can view trace timeline for each interaction
- [ ] I can identify failure patterns
- [ ] I can detect when assistant goes off-track

**Related Requirements:** HFP-13, Module 10 observability  
**Priority:** Medium  
**Dependencies:** User Stories 13.1-13.6

---

### User Story 13.8: Track Assistant Token Usage
**As a** Product Manager  
**I want to** measure assistant token usage and cost  
**So that** I can manage AI spending

**Acceptance Criteria:**
- [ ] Agent Prism tracks tokens per interaction
- [ ] Cost is calculated from token usage
- [ ] I can view cost per assistant type
- [ ] I can view cost trends over time
- [ ] I can correlate cost with product KPIs
- [ ] I can set cost budgets or alerts

**Related Requirements:** HFP-13, Module 10, Module 11 token economics  
**Priority:** Medium  
**Dependencies:** User Story 13.7

---

### User Story 13.9: Detect Assistant Drift
**As a** Product Manager  
**I want to** detect when assistant behavior drifts  
**So that** I can maintain quality over time

**Acceptance Criteria:**
- [ ] System captures baseline assistant behavior
- [ ] System compares recent behavior to baseline
- [ ] System detects changes in tool usage patterns
- [ ] System detects changes in output quality
- [ ] System detects changes in citation accuracy
- [ ] I'm alerted when significant drift occurs

**Related Requirements:** HFP-13, Module 10 observability  
**Priority:** Low  
**Dependencies:** User Story 13.7

---

### User Story 13.10: Ensure Assistant Groundedness
**As a** Facilities Manager  
**I want to** verify assistant outputs are grounded in facts  
**So that** I can trust recommendations

**Acceptance Criteria:**
- [ ] Assistant outputs cite specific data points
- [ ] Citations include point key, timestamp, value
- [ ] Citations include alarm ID and details
- [ ] Citations include document references (if applicable)
- [ ] I can verify cited data independently
- [ ] Ungrounded statements are flagged or prevented

**Related Requirements:** HFP-13, good behavior definition  
**Priority:** High  
**Dependencies:** User Stories 13.1, 13.2, 13.4, 13.5

---

### User Story 13.11: Configure Assistant Context Boundaries
**As a** System Administrator  
**I want to** control what data assistants can access  
**So that** privacy and security are maintained

**Acceptance Criteria:**
- [ ] I can configure which zones/buildings assistant can read
- [ ] I can configure time window for historical data access
- [ ] I can configure which external MCPs are accessible
- [ ] I can disable specific tool permissions
- [ ] Context boundaries are enforced at runtime
- [ ] Boundary violations are logged

**Related Requirements:** HFP-13, Module 07 context boundaries  
**Priority:** Medium  
**Dependencies:** User Stories 13.3, 13.6

---

### User Story 13.12: Hand State Changes to Humans
**As a** System  
**I want to** ensure assistants never auto-execute state changes  
**So that** humans remain in control

**Acceptance Criteria:**
- [ ] Assistants cannot acknowledge alarms
- [ ] Assistants cannot shelve alarms
- [ ] Assistants cannot approve commands
- [ ] Assistants cannot dispatch commands
- [ ] Assistants cannot close work orders
- [ ] All state-changing actions require human confirmation
- [ ] This principle is enforced by permission system

**Related Requirements:** HFP-13, good behavior definition  
**Priority:** Critical  
**Dependencies:** User Stories 13.3, 13.6

---
