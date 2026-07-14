# WORKFLOW.md

# Increo Business & System Workflow

Version 1.0

---

# Purpose

This document defines how every user interacts with the system.

It explains

• Business Workflow

• User Journey

• Screen Navigation

• Backend Processing

• Data Flow

• Decision Points

This document should be treated as the application's business blueprint.

No implementation should violate these workflows.

---

# Application Overview

The application is designed around one business objective.

Help managers plan salary increments while giving HR and Directors complete visibility through reports and analytics.

The application is NOT a payroll system.

The application is NOT an HRMS.

The application focuses only on

Salary Planning

Salary Projection

Business Reporting

---

# Overall Business Workflow

```text
User Login
      │
      ▼
Authentication
      │
      ▼
Role Validation
      │
      ▼
Load Dashboard
      │
      ▼
Load Authorized Employees
      │
      ▼
Select Employee
      │
      ▼
Review Employee Information
      │
      ▼
Review Salary History
      │
      ▼
Review Current Salary Structure
      │
      ▼
Update Increment %
      │
      ▼
Automatic Salary Projection
      │
      ▼
Refresh Reports
      │
      ▼
Save Changes
```

---

# User Journey

There are three primary users.

Manager

HR

Director

Each user follows a different workflow.

---

# Manager Workflow

Step 1

Login

↓

System authenticates manager.

↓

Manager Dashboard loads.

---

Dashboard contains

Employee Count

Current Payroll

Future Payroll

Average Increment

Pending Reviews

Quick Actions

---

Step 2

Manager opens Employee List.

Only employees assigned to that manager are displayed.

Manager must never see employees from another reporting manager.

---

Step 3

Manager selects an employee.

Employee Profile opens.

---

Employee Profile

Employee Details

Department

Manager

Current Designation

Proposed Designation

Salary History

Current Salary Structure

Increment Planning

Future Salary Projection

---

Step 4

Manager reviews salary history.

Questions answered

How has salary changed?

Was previous increment reasonable?

Is current salary aligned?

---

Step 5

Manager enters

Fixed Increment %

Variable Increment %

Retention Increment %

Only these three fields are editable.

Everything else remains read only.

---

Step 6

Application automatically

Calculates Future Salary

Updates Dashboard

Updates Reports

Displays New CTC

No manual calculation.

---

Step 7

Manager reviews impact.

Current Payroll

Future Payroll

Increment %

Budget Impact

Salary Comparison

---

Step 8

Manager saves changes.

Workflow completed.

---

# HR Workflow

HR logs in.

↓

HR Dashboard.

↓

Organization Summary.

↓

View All Employees.

↓

Generate Reports.

↓

Analyze Departments.

↓

Compare Designations.

↓

Export Reports.

HR does not perform payroll.

HR focuses on analysis.

---

# Director Workflow

Director logs in.

↓

Executive Dashboard.

↓

Payroll Summary.

↓

Department Comparison.

↓

Salary Distribution.

↓

Future Payroll.

↓

Budget Analysis.

↓

Strategic Reports.

Director mainly consumes insights.

---

# Employee Workspace Workflow

Open Employee

↓

Basic Details

↓

Employment Information

↓

Salary History

↓

Current Salary

↓

Increment Planning

↓

Future Salary

↓

Save

Every section should follow this order.

Information first.

Decision second.

Action last.

---

# Salary Planning Workflow

Manager enters

Fixed Increment %

↓

Validate

↓

Calculate Fixed Pay

↓

Manager enters

Variable Increment %

↓

Validate

↓

Calculate Variable Pay

↓

Manager enters

Retention %

↓

Validate

↓

Calculate Retention Bonus

↓

Mediclaim

No Change

↓

Gratuity

No Change

↓

Generate Future CTC

↓

Refresh Dashboard

↓

Refresh Reports

↓

Ready for Save

---

# Report Workflow

User opens Reports.

↓

Select Report.

↓

Apply Filters.

↓

Retrieve Latest Data.

↓

Business Calculations.

↓

Generate KPIs.

↓

Generate Charts.

↓

Generate Table.

↓

Display Report.

↓

Export if required.

Reports should never be pre-generated.

Always calculate from latest data.

---

# Dashboard Workflow

Login

↓

Load KPIs

↓

Load Charts

↓

Load Recent Activity

↓

Load Quick Actions

↓

Ready

Dashboard should answer

What is happening today?

---

# Search Workflow

User enters keyword.

↓

Search Employee

↓

Search Department

↓

Search Manager

↓

Return matching records.

Search should be instant.

---

# Filter Workflow

User selects

Department

Manager

Designation

Salary Bracket

↓

Apply Filters

↓

Refresh

Tables

Charts

KPIs

Reports

All components should update together.

---

# Authentication Workflow

Login

↓

Validate Credentials

↓

Generate JWT

↓

Determine Role

↓

Load Permissions

↓

Open Dashboard

↓

Session Active

---

# Role Validation Workflow

Manager

↓

Own Employees

HR

↓

Entire Organization

Director

↓

Executive Analytics

Never bypass authorization.

---

# Data Flow

Excel Dataset

↓

Database

↓

Backend Services

↓

Business Logic

↓

Frontend

↓

User Actions

↓

Updated Database

↓

Reports

↓

Dashboard

Single Source of Truth

Database.

---

# Navigation Structure

Login

↓

Dashboard

├── Employees

├── Planning

├── Reports

├── Analytics

└── Settings

Every page should be reachable within two clicks.

---

# Decision Points

Manager edits increment?

↓

Yes

↓

Recalculate

↓

Update Reports

↓

Save

↓

Done

No

↓

Return to Dashboard

---

# Error Handling Workflow

Invalid Increment

↓

Validation Message

↓

Prevent Save

↓

User Correction

↓

Continue

---

# Empty State Workflow

No Employees

↓

Show Friendly Message

↓

Explain Reason

↓

Provide Refresh Button

---

# Product Principles

Every workflow should follow

Review

↓

Understand

↓

Decide

↓

Analyze

↓

Save

Never ask users to make decisions before providing enough information.

The system exists to support decision making, not data entry.

---

# Final Workflow Principle

Every user action must answer one business question.

If a screen does not help a user make a better salary planning decision, it should be redesigned or removed.

The workflow should always prioritize clarity, efficiency, and business value over visual complexity.