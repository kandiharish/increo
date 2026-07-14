# SALARY_ENGINE_PROMPT.md

# Increo Salary Planning Engine Implementation Prompt

Version: 1.0

---

# Objective

Your responsibility is to design and implement the complete Salary Planning Engine for the Increo platform.

This is the primary business module of the application.

The purpose of this module is to allow managers to plan salary increments by modifying only approved increment percentages while the system automatically calculates projected compensation, payroll impact, and reporting data.

Managers should never manually calculate salary.

Managers should only make business decisions.

The system performs every calculation automatically.

---

# Required Reading

Before implementation read

PROJECT_CONTEXT.md

REQUIREMENTS.md

WORKFLOW.md

DATABASE.md

REPORTS.md

CALCULATION_ENGINE.md

SYSTEM_ARCHITECTURE.md

API_SPEC.md

CODING_STANDARDS.md

MASTER_AI_INSTRUCTIONS.md

Never assume business rules.

Never duplicate calculation logic.

---

# Your Responsibilities

You are acting as

Senior Compensation Planning Consultant

Senior Product Manager

Enterprise HR Solution Architect

Senior Backend Engineer

Senior Frontend Engineer

Business Analyst

Every implementation should optimize

Decision Making

Accuracy

Performance

Scalability

User Experience

---

# Module Purpose

The Salary Planning Engine enables managers to

Review current salary

Plan increments

View projected salary

Understand payroll impact

Compare current vs projected salary

Save planning

Generate reports

The module should eliminate spreadsheet calculations.

---

# Planning Workflow

Manager opens employee

↓

Review employee profile

↓

Review salary history

↓

Review current salary structure

↓

Edit increment percentages

↓

Automatic validation

↓

Automatic salary calculation

↓

Automatic payroll projection

↓

Automatic dashboard refresh

↓

Automatic report refresh

↓

Save Planning

No manual calculations.

No page refresh.

---

# Editable Fields

Managers can edit ONLY

increment_pct_fixed

increment_pct_variable

increment_pct_retention

Everything else is read-only.

---

# Read Only Fields

Employee Details

Salary History

Current Salary

Current CTC

Mediclaim

Gratuity

Current Payroll

Historical Salary

Department

Manager

Designation

---

# Live Calculation

Whenever a manager changes any increment value

Immediately calculate

Projected Fixed Pay

Projected Variable Pay

Projected Retention Bonus

Projected Salary

Projected Payroll

Payroll Difference

Salary Growth %

No Save button required for calculations.

Calculations happen instantly.

---

# Validation

Validate

Empty values

Negative values

Invalid numbers

Percentage limits

Business policy limits

Decimals

Null values

Prevent invalid planning.

---

# Salary Comparison

Display

Current Salary

↓

Projected Salary

Show

Difference

Increase %

Additional Payroll

Visual comparison

Green

Increase

Red

Decrease (future)

---

# Payroll Impact

Show

Current Payroll

Projected Payroll

Difference

Growth %

Department Payroll

Organization Payroll (HR & Director)

Managers only see their team's payroll impact.

---

# Planning Summary

Display

Employee Count

Planned Employees

Pending Employees

Average Increment

Average Salary Growth

Budget Increase

Completion %

---

# Draft Management

Managers should be able to

Save Draft

Continue Later

Reset Planning

Discard Changes

Future-ready for approval workflow.

---

# Synchronization

Whenever planning changes

Automatically update

Dashboard

Reports

Analytics

Department Summary

Manager Summary

No manual refresh.

---

# Calculation Integration

Always use

Calculation Engine

Never calculate

Frontend

Reports

Dashboard

API Controllers

Only Calculation Engine performs calculations.

---

# Business Rules

Mediclaim remains unchanged.

Gratuity remains unchanged.

Only

Fixed Pay

Variable Pay

Retention Bonus

change based on increment.

Historical salary never changes.

Projected salary never overwrites history.

---

# Planning Status

Display

Not Started

In Progress

Completed

Future

Submitted

Approved

Rejected

MVP

Only

Not Started

In Progress

Completed

---

# User Experience

Planning should feel

Fast

Interactive

Professional

Spreadsheet-like

Minimal clicks

Immediate feedback

Managers should immediately understand

What changed

Why it changed

Its payroll impact

---

# Undo / Reset

Allow

Undo Last Change

Reset Employee Planning

Reset All Planning (confirmation)

Future

Planning History

---

# API Integration

Consume

Employee API

Salary API

Calculation API

Dashboard API

Reports API

Planning API

Never duplicate business logic.

---

# Error Handling

Handle

Calculation failure

Validation failure

Permission denied

Network failure

API failure

Database failure

Provide

Clear messages

Retry actions

Recovery guidance

---

# Performance

Single calculation

<100ms

Live update

Instant

Batch planning

Support

10,000+ employees

No unnecessary recalculation.

---

# Security

Managers

Own team only

HR

Read only

Director

Read only

Planning changes should always record

User

Timestamp

Employee

Old Value

New Value

---

# Audit

Record

Planning ID

Employee ID

Manager ID

Previous Increment

New Increment

Previous Salary

Projected Salary

Timestamp

Reason (future)

Support future audit reports.

---

# Deliverables

Generate

Planning Workspace

Live Projection

Comparison Panel

Payroll Impact

Planning Summary

Draft Support

Validation

Synchronization

Audit Integration

Responsive Design

---

# Validation Checklist

Before completion verify

✓ Only increment fields editable

✓ Live calculations working

✓ Projection accurate

✓ Validation complete

✓ Payroll updated

✓ Dashboard refreshed

✓ Reports refreshed

✓ Draft support

✓ Role restrictions

✓ Audit logging

✓ Enterprise UI

---

# Output Format

Before implementation explain

Planning Architecture

Calculation Flow

API Dependencies

Validation Strategy

Synchronization Strategy

Testing Strategy

Wait for approval.

After approval

Generate

Database

Backend

Frontend

Module by module.

Never generate the complete planning engine in one response.

---

# Definition of Done

Salary Planning Engine is complete only if

✓ Increment planning implemented

✓ Live calculations working

✓ Comparison panel implemented

✓ Payroll impact visible

✓ Validation complete

✓ Dashboard synchronized

✓ Reports synchronized

✓ Draft support implemented

✓ Audit supported

✓ Responsive

✓ Accessible

✓ Tested

---

# Future Enhancements

Approval Workflow

Multi-level Approval

Budget Limits

AI Salary Recommendation

Scenario Comparison

What-if Planning

Market Benchmark

Bulk Planning

Version History

Planning Timeline

---

# Final Principle

The Salary Planning Engine is the core value proposition of Increo.

Managers should never think about formulas.

Managers should only think about compensation decisions.

Every calculation, projection, validation, synchronization, and payroll impact analysis should happen automatically.

The module should provide an enterprise-grade planning experience comparable to Workday Compensation Planning, SAP SuccessFactors Compensation, and Oracle HCM Compensation Management.