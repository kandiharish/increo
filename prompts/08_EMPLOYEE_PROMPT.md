# EMPLOYEE_PROMPT.md

# Increo Employee Module Implementation Prompt

Version: 1.0

---

# Objective

Your responsibility is to design and implement the Employee Module for the Increo platform.

This module is NOT an employee management system.

It is an Employee Salary Planning Workspace where Managers, HR, and Directors review employee information, salary history, current compensation, projected compensation, and salary planning details.

The module should provide complete employee visibility while strictly enforcing Role-Based Access Control.

The module should feel similar to enterprise HR products like

Workday

SAP SuccessFactors

Oracle HCM

Rippling

BambooHR

---

# Required Reading

Before implementation read

PROJECT_CONTEXT.md

REQUIREMENTS.md

WORKFLOW.md

DATABASE.md

API_SPEC.md

REPORTS.md

CALCULATION_ENGINE.md

SYSTEM_ARCHITECTURE.md

UI_GUIDELINES.md

CODING_STANDARDS.md

MASTER_AI_INSTRUCTIONS.md

Never assume business rules.

---

# Your Responsibilities

You are acting as

Senior Product Manager

Senior HR Product Designer

Senior UX Designer

Senior Frontend Engineer

Senior Backend Engineer

Enterprise Software Architect

Every screen should prioritize

Readability

Decision Making

Fast Navigation

Minimal Clicks

Enterprise Experience

---

# Module Objective

The Employee Module should help users

Locate employees quickly

Review salary history

Understand current compensation

Plan future increments

Review projected salary

Compare employee compensation

Navigate easily

Support business decisions

---

# Module Structure

Employee List

↓

Employee Details

↓

Salary History

↓

Current Salary

↓

Increment Planning

↓

Projected Salary

↓

Reports Shortcut

---

# User Access

Manager

Only employees reporting to them

HR

Entire organization

Director

Entire organization

No user should ever see unauthorized employee data.

---

# Employee List

Display

Employee ID

Employee Name

Department

Manager

Current Designation

Proposed Designation

Current CTC

Projected CTC

Planning Status

Last Updated

Actions

The table should support

Sorting

Filtering

Searching

Pagination

Column Visibility

Export

Sticky Header

---

# Global Search

Search by

Employee ID

Employee Name

Department

Designation

Manager

Search should be instant.

Debounced.

Case insensitive.

---

# Filters

Department

Manager

Designation

Salary Bracket

Planning Status

Financial Year

Multiple filters should work together.

---

# Employee Details

Display

Employee Information

Department

Manager

Joining Date

Current Designation

Proposed Designation

Salary Bracket

Planning Status

Employee details are read-only.

---

# Salary History

Display

CTC 2022-23

CTC 2023-24

CTC 2024-25

Trend

Growth %

Annual Increment

Visualization

Line Chart

Salary Growth Timeline

Salary history should never be editable.

---

# Current Salary Structure

Display

Fixed Pay

Variable Pay

Mediclaim

Gratuity

Retention Bonus

Current CTC

All values are read-only.

---

# Salary Planning Section

Editable Fields

Increment %

Fixed Pay

Increment %

Variable Pay

Increment %

Retention Bonus

Only these three inputs are editable.

All remaining values are calculated automatically.

---

# Live Projection

As the manager changes increment percentages

Automatically update

Projected Fixed Pay

Projected Variable Pay

Projected Retention Bonus

Projected CTC

Dashboard

Reports

No page refresh required.

---

# Validation

Validate

Negative increments

Maximum increment

Missing values

Invalid numbers

Decimals

Business rules

Show inline validation.

Prevent invalid submission.

---

# Employee Actions

View Details

Plan Increment

Reset Changes

Save Draft

View Reports

Compare Salary (Future)

No delete operation.

No edit employee details.

---

# Planning Status

Display

Not Started

In Progress

Completed

Future

Approved

Rejected

Only first three are used in MVP.

---

# Comparison Panel

Allow users to compare

Current Salary

↓

Projected Salary

Display

Difference

Increase

Percentage Growth

Visual Indicators

---

# Navigation

Employee List

↓

Employee Profile

↓

Salary Planning

↓

Save

↓

Return to List

Maintain navigation history.

---

# Empty State

Show

No Employees Found

No Search Results

No Assigned Employees

No Planning Available

Professional illustrations.

Helpful guidance.

---

# Error Handling

Handle

API Errors

Permission Errors

Network Errors

Validation Errors

Unexpected Errors

Provide retry actions.

---

# Performance

Support

Pagination

Lazy Loading

Virtual Scrolling (Future)

Optimized API Calls

Instant Filtering

Avoid unnecessary rendering.

---

# Security

Managers

Only assigned employees.

HR

Organization-wide.

Director

Organization-wide.

Never expose employee information through frontend filtering.

Authorization must be enforced by backend.

---

# API Integration

Employee List API

Employee Details API

Salary History API

Salary Planning API

Calculation Engine API

Dashboard Refresh API

Reports Refresh API

Frontend never performs business calculations.

---

# Deliverables

Generate

Employee List

Employee Profile

Salary History

Current Salary Card

Planning Workspace

Live Projection

Search

Filters

Pagination

Validation

Role Restrictions

Loading States

Error States

Responsive Design

---

# Validation Checklist

Before completion verify

✓ Search working

✓ Filters working

✓ Pagination working

✓ Role-based access enforced

✓ Salary history correct

✓ Planning editable

✓ Projection automatic

✓ Validation complete

✓ Responsive

✓ Enterprise UI

---

# Output Format

Before implementation explain

Module Architecture

Page Flow

Component Structure

API Dependencies

State Management

Validation Strategy

Testing Strategy

Wait for approval.

After approval

Generate the Employee Module incrementally.

Never generate the complete module in one response.

---

# Definition of Done

Employee Module is complete only if

✓ Employee list implemented

✓ Employee profile implemented

✓ Salary history displayed

✓ Current salary displayed

✓ Increment planning working

✓ Projection updates live

✓ Search implemented

✓ Filters implemented

✓ Role restrictions enforced

✓ API integrated

✓ Loading & error states complete

✓ Responsive

✓ Accessible

✓ Tested

---

# Final Principle

The Employee Module is the primary workspace of Increo.

Managers should spend most of their time in this module.

The experience should be intuitive, information-rich, and optimized for salary planning.

Every screen should reduce manual effort, eliminate spreadsheet dependency, and support confident compensation decisions.