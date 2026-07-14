# REQUIREMENTS.md

# Functional & Non-Functional Requirements

Project

Increo – Smart Compensation Planning & Analytics Platform

---

# Purpose

This document defines every functional and non-functional requirement of the application.

Nothing should be implemented outside this document unless explicitly approved.

Every implemented feature should satisfy these requirements.

---

# Functional Requirements

## FR-001 Authentication

Description

Users must authenticate before accessing the application.

Supported Roles

Manager

HR

Director

Acceptance Criteria

✓ Login succeeds with valid credentials

✓ Invalid credentials show proper error

✓ User session is maintained

✓ Logout clears session

---

## FR-002 Role Based Access

Description

Users should only access information allowed by their role.

Manager

View only employees reporting to them.

HR

View entire organization.

Director

View executive dashboards and reports.

Acceptance Criteria

Manager cannot access another manager's employees.

HR has complete visibility.

Director has complete visibility.

---

## FR-003 Dashboard

Description

Every user lands on a dashboard after login.

Dashboard should change according to role.

Manager Dashboard

Employee Count

Current Payroll

Future Payroll

Average Increment

Pending Reviews

HR Dashboard

Organization Summary

Department Summary

Salary Distribution

Average Salary

Payroll Growth

Director Dashboard

Executive KPIs

Payroll Impact

Department Comparison

Budget Summary

Acceptance Criteria

Dashboard loads under 2 seconds.

KPIs always match latest employee data.

---

## FR-004 Employee Workspace

Description

Managers should review complete employee information before planning salary increments.

Employee Profile

Employee Details

Current Designation

Proposed Designation

Salary History

Current Salary Structure

Increment Planning

Projected Salary

Acceptance Criteria

Employee information is read only except increment percentages.

---

## FR-005 Increment Planning

Description

Managers edit only

Fixed Increment %

Variable Increment %

Retention Increment %

Everything else is calculated automatically.

Acceptance Criteria

Only three fields editable.

Validation applied.

Future salary updates instantly.

---

## FR-006 Salary Projection

Description

Automatically calculate projected salary.

Calculation Rules

Future Fixed Pay

Current Fixed Pay × Increment %

Future Variable Pay

Current Variable Pay × Increment %

Retention Bonus

Apply Increment

Mediclaim

No Change

Gratuity

No Change

Acceptance Criteria

Every calculation is automatic.

Managers never manually edit projected salary.

---

## FR-007 Reports

Description

Reports provide business insights.

Required Reports

Department Salary Analysis

Designation Analysis

Salary Distribution

Salary Trend

Current Payroll

Future Payroll

Payroll Impact

Increment Analysis

Manager Summary

Department Budget

Salary Outlier

Acceptance Criteria

Reports always reflect latest data.

---

## FR-008 Filters

Every report should support

Department

Manager

Designation

Salary Bracket

Financial Year

Employee Name

Acceptance Criteria

Reports update instantly after filter changes.

---

## FR-009 Search

Application supports

Employee Search

Department Search

Manager Search

Acceptance Criteria

Search is case insensitive.

---

## FR-010 Export

Reports support

PDF

Excel

Acceptance Criteria

Exported report matches dashboard.

---

# Non Functional Requirements

---

## Performance

Dashboard

<2 sec

Employee Profile

<2 sec

Report

<5 sec

Salary Calculation

Instant

---

## Scalability

Support

100+

1000+

10000+

Employees

No architectural changes required.

---

## Security

JWT Authentication

RBAC

Protected APIs

Session Expiry

Encrypted Passwords

---

## Reliability

No calculation inconsistencies.

Reports always match database.

---

## Availability

Application should remain available during business hours.

---

## Maintainability

Modular Architecture

Clean Code

Independent Services

---

## Usability

Professional

Minimal

Easy to Learn

Consistent Navigation

---

## Accessibility

Readable Fonts

Keyboard Navigation

Responsive Layout

---

# Business Rules

Managers cannot edit

Employee Name

Department

Designation

Current Salary

Mediclaim

Gratuity

Managers CAN edit

Fixed Increment %

Variable Increment %

Retention Increment %

---

# Validation Rules

Increment %

Cannot be empty

Cannot be negative

Cannot exceed company policy

Employee ID

Unique

Department

Mandatory

Manager

Mandatory

---

# Success Criteria

Project succeeds if

✓ Manager completes salary planning without Excel

✓ Reports generate automatically

✓ Future salary calculated automatically

✓ Managers only access their team

✓ HR views organization

✓ Director views executive analytics

✓ Dashboard updates instantly

✓ Reports are accurate

---

# Out of Scope

Attendance

Leave

Payroll Processing

Recruitment

Employee Portal

Performance Review

Notifications

Approval Workflow

Tax

Payslip

---

# Product Quality Checklist

Before marking any feature complete verify

✓ Business Requirement satisfied

✓ UI Complete

✓ Validation Complete

✓ Security Complete

✓ Responsive

✓ Error Handling

✓ Loading State

✓ Empty State

✓ API Tested

✓ Code Reviewed

✓ Works on Desktop

✓ Reports Updated

---

This document is the implementation checklist.

No feature is complete until every requirement above is satisfied.