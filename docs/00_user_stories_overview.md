# ZoneIQ User Stories Overview

## Introduction

This document provides an overview of all user stories derived from the HVAC Fleet Optimization & Air-Quality Platform ("ZoneIQ") requirements. The user stories are organized by functional area and mapped to the original functional requirements (HFP-01 through HFP-13).

## Purpose

User stories break down the high-level capstone requirements into implementable, testable units of work. Each story follows the standard format:

- **As a** [role]
- **I want to** [capability]
- **So that** [business value]

Along with:
- **Acceptance Criteria** (testable conditions)
- **Related Requirements** (traceability to HFP-xx)
- **Priority** (Critical/High/Medium/Low)
- **Dependencies** (prerequisite stories)

## User Story Organization

### 1. Asset Management (26 stories)
**Files:** `01_asset_management_user_stories.md`

Covers portfolio hierarchy, device inventory, and point catalogue management.

**Epics:**
- **HFP-01: Portfolio & Asset Model** (4 stories)
  - Create portfolio hierarchy
  - Manage device inventory
  - List and filter assets
  - Protect hierarchy integrity

- **HFP-02: Point Catalogue** (3 stories)
  - Define device points
  - Enforce device profile consistency
  - Manage point catalogue

**Key Roles:** Facilities Manager, Controls Engineer, System Administrator

### 2. Data Ingestion & Processing (8 stories)
**Files:** `02_data_ingestion_user_stories.md`

Covers telemetry ingestion, validation, and comfort/IAQ evaluation.

**Epics:**
- **HFP-03: Telemetry Ingestion** (5 stories)
  - Accept bulk telemetry readings
  - Validate incoming readings
  - Store readings with quality indicators
  - Manage reading retention
  - Track device connectivity

- **HFP-04: Comfort & Air Quality Evaluation** (4 stories)
  - Evaluate zone comfort status
  - Evaluate air quality status
  - Apply deadband to prevent flapping
  - Provide status history

**Key Roles:** System (automated), Facilities Manager, Tenant Experience Coordinator

### 3. Optimization & Control (17 stories)
**Files:** `03_optimization_control_user_stories.md`

Covers supervisory optimization, command dispatch, and schedule management.

**Epics:**
- **HFP-05: Supervisory Optimization Policy** (5 stories)
  - Compute zone targets
  - Implement demand-controlled ventilation
  - Implement pre-conditioning
  - Make base policy testable
  - Configure optimization parameters

- **HFP-07: Command Dispatch** (6 stories)
  - Create draft commands
  - Validate command envelopes
  - Approve commands
  - Dispatch commands to devices
  - Confirm or fail command execution
  - View command history

- **HFP-08: Setpoint Schedules & Comfort Profiles** (5 stories)
  - Define comfort profiles
  - Define setpoint schedules
  - Apply building defaults
  - Enforce safety bounds
  - Audit profile and schedule changes

**Key Roles:** Controls Engineer, Facilities Manager, Energy Analyst, System (automated)

### 4. Alarm Management (10 stories)
**Files:** `04_alarm_management_user_stories.md`

Covers fleet alarm detection, management, and analytics.

**Epic:**
- **HFP-06: Fleet Alarm & Event Management** (10 stories)
  - Raise alarms on excursions
  - Apply on-delay and off-delay
  - Prevent duplicate alarms
  - List and filter alarms
  - Acknowledge alarms
  - Shelve alarms with reason
  - Require supervisor approval for extended shelving
  - Analyze alarm patterns
  - Track alarm state transitions
  - Clear alarms automatically

**Key Roles:** System (automated), Facilities Manager, Field Technician, Energy Analyst

### 5. Work Order & Complaint Management (11 stories)
**Files:** `05_work_order_complaint_user_stories.md`

Covers complaint intake, work order lifecycle, and tracking.

**Epics:**
- **HFP-09: Occupant Complaint Intake** (4 stories)
  - Capture occupant complaints
  - View zone context for complaints
  - Convert complaint to work order
  - Filter and search complaints

- **HFP-10: Work Order Management** (7 stories)
  - Create work orders
  - Populate work order details
  - Manage work order lifecycle
  - Record work order completion
  - List and filter work orders
  - View work order details
  - Track work order metrics

**Key Roles:** Tenant Experience Coordinator, Field Technician, Facilities Manager

### 6. Dashboards & Reporting (10 stories)
**Files:** `06_dashboards_reporting_user_stories.md`

Covers portfolio dashboards, KPIs, and reporting.

**Epic:**
- **HFP-11: Portfolio Dashboards & KPIs** (10 stories)
  - View portfolio overview
  - View zone detail dashboard
  - Generate comfort compliance report
  - Generate air quality report
  - View energy vs comfort indicator
  - View alarm performance metrics
  - View work order metrics
  - Customize dashboard views
  - Set up dashboard alerts
  - Export report data

**Key Roles:** Facilities Manager, Energy Analyst

### 7. Security, Access Control & Audit (10 stories)
**Files:** `07_security_audit_user_stories.md`

Covers audit trail, access control, and compliance.

**Epic:**
- **HFP-12: Audit, Access Control & Traceability** (10 stories)
  - Audit safety-relevant actions
  - Capture complete audit context
  - Query audit trail
  - Protect audit integrity
  - Define user roles
  - Enforce role-based permissions
  - Audit access denials
  - Require justification for overrides
  - View user activity report
  - Implement audit retention policy

**Key Roles:** System (automated), Facilities Manager, Controls Engineer, Compliance Officer, Security Officer

### 8. AI Assistants (12 stories)
**Files:** `08_ai_assistants_user_stories.md`

Covers AI-assisted triage, monitoring, and governance.

**Epic:**
- **HFP-13: Assistant Agents** (12 stories)
  - IAQ triage assistant - analyze air quality alarms
  - IAQ triage assistant - draft remediation actions
  - IAQ triage assistant - respect tool permissions
  - Complaint triage assistant - correlate with zone history
  - Complaint triage assistant - draft triage summary
  - Complaint triage assistant - stay within permissions
  - Monitor assistant behavior
  - Track assistant token usage
  - Detect assistant drift
  - Ensure assistant groundedness
  - Configure assistant context boundaries
  - Hand state changes to humans

**Key Roles:** Facilities Manager, Tenant Experience Coordinator, Product Manager, System Administrator

## Story Count Summary

| Epic Area | Story Count | Priority Distribution |
|-----------|-------------|----------------------|
| Asset Management | 7 | Critical: 0, High: 4, Medium: 3, Low: 0 |
| Data Ingestion & Processing | 9 | Critical: 1, High: 6, Medium: 2, Low: 0 |
| Optimization & Control | 16 | Critical: 3, High: 9, Medium: 4, Low: 0 |
| Alarm Management | 10 | Critical: 1, High: 5, Medium: 3, Low: 1 |
| Work Order & Complaint | 11 | Critical: 0, High: 5, Medium: 5, Low: 1 |
| Dashboards & Reporting | 10 | Critical: 0, High: 2, Medium: 5, Low: 3 |
| Security & Audit | 10 | Critical: 2, High: 4, Medium: 3, Low: 1 |
| AI Assistants | 12 | Critical: 1, High: 2, Medium: 7, Low: 2 |
| **Total** | **85** | **Critical: 8, High: 37, Medium: 32, Low: 8** |

## Implementation Approach

### Phase 1: Foundation (Critical & High Priority)
Focus on core platform capabilities:
1. Asset Management foundation (stories 1.1, 1.2, 2.1, 2.2)
2. Data Ingestion pipeline (stories 3.1-3.3, 3.5)
3. Comfort/IAQ Evaluation (stories 4.1, 4.2)
4. Security foundation (stories 12.1, 12.4, 12.5, 12.6)

### Phase 2: Core Operations (High Priority)
Build operational capabilities:
1. Alarm Management (stories 6.1-6.5, 6.9, 6.10)
2. Command Dispatch (stories 7.1-7.5)
3. Optimization Policy (stories 5.1, 5.2, 5.4)
4. Profiles & Schedules (stories 8.1, 8.2, 8.4)

### Phase 3: User Experience (Medium Priority)
Enhance usability and visibility:
1. Dashboards (stories 11.1, 11.2)
2. Work Order Management (stories 9.1-9.3, 10.1-10.3)
3. Alarm Analytics (stories 6.6-6.8)
4. Audit & Reporting (stories 12.3, 12.7-12.9)

### Phase 4: Advanced Features (Medium/Low Priority)
Add sophisticated capabilities:
1. AI Assistants (stories 13.1-13.12)
2. Advanced Analytics (stories 11.3-11.7)
3. Customization (stories 11.8-11.10)

## Traceability Matrix

| Requirement ID | Description | User Story IDs |
|----------------|-------------|----------------|
| HFP-01 | Portfolio & Asset Model | 1.1, 1.2, 1.3, 1.4 |
| HFP-02 | Point Catalogue | 2.1, 2.2, 2.3 |
| HFP-03 | Telemetry Ingestion | 3.1, 3.2, 3.3, 3.4, 3.5 |
| HFP-04 | Comfort & Air-Quality Evaluation | 4.1, 4.2, 4.3, 4.4 |
| HFP-05 | Supervisory Optimization Policy | 5.1, 5.2, 5.3, 5.4, 5.5 |
| HFP-06 | Fleet Alarm & Event Management | 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10 |
| HFP-07 | Command Dispatch | 7.1, 7.2, 7.3, 7.4, 7.5, 7.6 |
| HFP-08 | Setpoint Schedules & Comfort Profiles | 8.1, 8.2, 8.3, 8.4, 8.5 |
| HFP-09 | Occupant Complaint Intake | 9.1, 9.2, 9.3, 9.4 |
| HFP-10 | Work Order Management | 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7 |
| HFP-11 | Portfolio Dashboards & KPIs | 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10 |
| HFP-12 | Audit, Access Control & Traceability | 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10 |
| HFP-13 | Assistant Agents | 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10, 13.11, 13.12 |

## Role Summary

The user stories identify these key roles:

**Operational Roles:**
- **Facilities Manager** - Overall portfolio oversight and high-level decisions
- **Controls Engineer** - Technical configuration and optimization
- **Field Technician** - On-site maintenance and work execution
- **Energy Analyst** - Performance analysis and optimization
- **Tenant Experience Coordinator** - Occupant comfort and complaint management

**Administrative Roles:**
- **System Administrator** - Platform configuration and user management
- **Compliance Officer** - Audit and regulatory compliance
- **Security Officer** - Access control and security monitoring
- **Product Manager** - AI assistant monitoring and governance

**System Role:**
- **System** - Automated platform behaviors and background processes

## Next Steps

1. **Prioritize** stories within each phase based on dependencies
2. **Create** detailed `spec.md` for each story before implementation
3. **Develop** `plan.md` and `tasks.md` following spec-driven approach
4. **Implement** following TDD: write tests first, then code
5. **Track** progress against traceability matrix
6. **Measure** implementation metrics (cycle time, quality, token usage)

## Notes

- All user stories include explicit acceptance criteria for testability
- Dependencies between stories are documented
- Priority reflects business value and technical dependencies
- Each story maps to original functional requirements (HFP-xx)
- Stories are sized for iterative implementation within spec-driven workflow
- AI assistant stories align with Module 07 (MCP) and Module 10 (observability) requirements

---

**Document Version:** 1.0  
**Created:** 2026-09-03  
**Based on:** HVAC_Fleet_Platform_Requirements.md v1.0
