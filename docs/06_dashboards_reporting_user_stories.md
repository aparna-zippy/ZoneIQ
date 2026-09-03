# Dashboards & Reporting User Stories

## Epic: Portfolio Dashboards & KPIs (HFP-11)

### User Story 11.1: View Portfolio Overview
**As a** Facilities Manager  
**I want to** see a portfolio-wide status summary  
**So that** I can understand overall portfolio health

**Acceptance Criteria:**
- [ ] Dashboard shows all buildings with zone counts
- [ ] Dashboard shows current comfort compliance % per building
- [ ] Dashboard shows open alarms by priority (critical/high/medium/low)
- [ ] Dashboard shows count of devices offline
- [ ] Data refreshes automatically or on-demand
- [ ] I can drill down to building details

**Related Requirements:** HFP-11  
**Priority:** High  
**Dependencies:** User Stories 1.1, 4.1, 6.4, 3.5

---

### User Story 11.2: View Zone Detail Dashboard
**As a** Facilities Manager  
**I want to** see detailed status for a single zone  
**So that** I can understand zone conditions

**Acceptance Criteria:**
- [ ] Dashboard shows live temperature with short trend
- [ ] Dashboard shows live RH with short trend
- [ ] Dashboard shows live CO₂ with short trend
- [ ] Dashboard shows live PM2.5 with short trend
- [ ] Dashboard shows current target vs actual
- [ ] Dashboard shows active alarms for the zone
- [ ] Dashboard shows recent commands sent to zone
- [ ] Trends cover meaningful time window (e.g., 24h)

**Related Requirements:** HFP-11  
**Priority:** High  
**Dependencies:** User Stories 3.3, 4.1, 4.2, 5.1, 6.1, 7.6

---

### User Story 11.3: Generate Comfort Compliance Report
**As an** Energy Analyst  
**I want to** measure ASHRAE 55 comfort compliance  
**So that** I can report on comfort performance

**Acceptance Criteria:**
- [ ] Report calculates comfort compliance % over period
- [ ] Report is scoped to zone, floor, building, or portfolio
- [ ] Report shows temperature compliance %
- [ ] Report shows RH compliance %
- [ ] Report shows combined comfort compliance %
- [ ] Report references ASHRAE 55 standard
- [ ] Report can be exported (CSV/PDF)

**Related Requirements:** HFP-11  
**Priority:** Medium  
**Dependencies:** User Stories 4.1, 8.1

---

### User Story 11.4: Generate Air Quality Report
**As a** Facilities Manager  
**I want to** measure air quality exceedance  
**So that** I can demonstrate IAQ performance

**Acceptance Criteria:**
- [ ] Report shows CO₂ exceedance hours over period
- [ ] Report shows PM2.5 exceedance hours over period
- [ ] Report calculates ventilation effectiveness metric
- [ ] Report is scoped to zone, floor, building, or portfolio
- [ ] Report shows trend over multiple periods
- [ ] Report can be exported (CSV/PDF)

**Related Requirements:** HFP-11  
**Priority:** Medium  
**Dependencies:** User Stories 4.2, 5.2, 8.1

---

### User Story 11.5: View Energy vs Comfort Indicator
**As an** Energy Analyst  
**I want to** see energy-vs-comfort tradeoff  
**So that** I can optimize both objectives

**Acceptance Criteria:**
- [ ] Indicator shows relative energy use (proxy or actual)
- [ ] Indicator shows comfort compliance %
- [ ] Indicator highlights zones with poor tradeoff
- [ ] I can view indicator over time
- [ ] I can compare buildings or zones
- [ ] Indicator methodology is documented

**Related Requirements:** HFP-11  
**Priority:** Low  
**Dependencies:** User Stories 5.2, 11.3

---

### User Story 11.6: View Alarm Performance Metrics
**As a** Facilities Manager  
**I want to** measure alarm response performance  
**So that** I can improve response times

**Acceptance Criteria:**
- [ ] Report shows Mean Time To Acknowledge (MTTA)
- [ ] Report shows alarm count by category and priority
- [ ] Report shows alarm rate trends
- [ ] Report identifies frequent-alarm zones
- [ ] Report is scoped to zone, building, or portfolio
- [ ] Report covers configurable time period

**Related Requirements:** HFP-11, HFP-06  
**Priority:** Medium  
**Dependencies:** User Stories 6.5, 6.8

---

### User Story 11.7: View Work Order Metrics
**As a** Facilities Manager  
**I want to** measure complaint and work order resolution  
**So that** I can improve tenant satisfaction

**Acceptance Criteria:**
- [ ] Report shows complaint resolution time
- [ ] Report shows work order count by status
- [ ] Report shows work order count by team
- [ ] Report shows average time to close
- [ ] Report identifies zones with frequent complaints
- [ ] Report covers configurable time period

**Related Requirements:** HFP-11, HFP-10  
**Priority:** Medium  
**Dependencies:** User Stories 9.1, 10.4, 10.7

---

### User Story 11.8: Customize Dashboard Views
**As a** Facilities Manager  
**I want to** customize which widgets I see  
**So that** I focus on what matters most

**Acceptance Criteria:**
- [ ] I can select which widgets appear on my dashboard
- [ ] I can arrange widget layout
- [ ] I can set default time ranges
- [ ] I can save custom dashboard configurations
- [ ] I can create multiple named dashboards
- [ ] Dashboard preferences persist across sessions

**Related Requirements:** HFP-11  
**Priority:** Low  
**Dependencies:** User Stories 11.1, 11.2

---

### User Story 11.9: Set Up Dashboard Alerts
**As a** Facilities Manager  
**I want to** set thresholds for dashboard metrics  
**So that** I'm notified of significant changes

**Acceptance Criteria:**
- [ ] I can set threshold for comfort compliance %
- [ ] I can set threshold for alarm count
- [ ] I can set threshold for devices offline
- [ ] I can set notification preferences (email/in-app)
- [ ] Thresholds are checked on metric update
- [ ] I can view history of threshold breaches

**Related Requirements:** HFP-11  
**Priority:** Low  
**Dependencies:** User Stories 11.1, 11.3

---

### User Story 11.10: Export Report Data
**As an** Energy Analyst  
**I want to** export report data  
**So that** I can perform further analysis

**Acceptance Criteria:**
- [ ] I can export reports as CSV
- [ ] I can export reports as PDF
- [ ] Export includes all data points and metadata
- [ ] Export includes report parameters (date range, scope)
- [ ] Export is formatted for easy processing
- [ ] I can schedule periodic exports (stretch)

**Related Requirements:** HFP-11  
**Priority:** Low  
**Dependencies:** User Stories 11.3-11.7

---
