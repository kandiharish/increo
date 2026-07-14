# DASHBOARD_PROMPT.md

# Increo Dashboard Module Implementation Prompt

Version: 1.0

---

# Objective

Your responsibility is to design and implement the Dashboard module for the Increo platform.

The Dashboard is the application's command center.

Its purpose is to provide Managers, HR, and Directors with an immediate understanding of employee compensation, payroll impact, salary planning progress, and organizational insights.

The Dashboard should answer business questions before the user needs to search for information.

It should be professional, information-rich, interactive, and enterprise-grade.

---

# Required Reading

Before implementation, read

PROJECT_CONTEXT.md

REQUIREMENTS.md

WORKFLOW.md

REPORTS.md

CALCULATION_ENGINE.md

SYSTEM_ARCHITECTURE.md

UI_GUIDELINES.md

CODING_STANDARDS.md

MASTER_AI_INSTRUCTIONS.md

Never assume dashboard behavior.

Always derive KPIs from business requirements.

---

# Your Responsibilities

You are acting as

Senior Product Manager

Senior UX Designer

Senior Frontend Engineer

Senior Backend Engineer

Business Intelligence Analyst

Enterprise Dashboard Architect

Every widget should have business value.

Never add widgets only for aesthetics.

---

# Dashboard Objectives

The dashboard should help users

Understand payroll impact

Monitor increment planning

Review employee distribution

Analyze salary trends

Track department summaries

Quickly identify anomalies

Navigate efficiently

Make informed business decisions

---

# Dashboard Principles

Minimal

Professional

Fast

Interactive

Role-aware

Responsive

Action-oriented

Consistent

Readable

Enterprise-ready

---

# Role-Based Dashboard

Managers

Show only their team.

HR

Show organization-wide data.

Director

Show executive-level KPIs and analytics.

The dashboard must adapt automatically based on user role.

---

# Dashboard Layout

Top Navigation

↓

Page Header

↓

Quick Summary Cards

↓

Charts Section

↓

Department Summary

↓

Planning Progress

↓

Recent Activity

↓

Quick Actions

↓

Footer (optional)

---

# KPI Cards

Display

Total Employees

Departments

Current Payroll

Projected Payroll

Payroll Growth

Average Salary

Average Increment

Pending Planning

Completed Planning

Trend Indicators

Each KPI should include

Title

Value

Change Indicator

Tooltip

Icon

---

# Charts

Implement

Current vs Projected Payroll

Salary Distribution

Department Payroll

Average Salary by Department

Increment Distribution

Salary Trend

Employee Distribution

Payroll Growth

Charts should be interactive.

Hover tooltips.

Legend.

Responsive.

---

# Planning Progress

Show

Total Employees Planned

Pending Reviews

Completed Reviews

Planning Percentage

Visual Progress Bar

Managers should immediately know planning status.

---

# Department Summary

Display

Department

Employee Count

Current Payroll

Projected Payroll

Average Salary

Average Increment

Expandable details (future-ready)

---

# Quick Actions

Managers

Review Employees

Plan Salary

View Reports

Export Summary

HR

Reports

Analytics

Departments

Exports

Director

Executive Dashboard

Payroll Summary

Budget Analysis

Reports

---

# Recent Activity

Show

Recent salary planning changes

Recent report generation

Recent imports (future)

Recent user actions

Include

Timestamp

User

Action

Status

---

# Dashboard Filters

Global filters

Department

Manager

Designation

Salary Bracket

Financial Year

Search

Changing filters should refresh

KPIs

Charts

Tables

Widgets

Automatically.

---

# Insights Panel

Generate business insights

Examples

Payroll projected to increase by 12%.

Engineering has the highest average salary.

Sales has the largest planned increment.

HR planning completion is 85%.

Salary outliers detected in Finance.

Insights should be concise and actionable.

---

# Widget Behavior

Every widget should support

Loading State

Empty State

Error State

Refresh

Responsive Layout

Accessibility

Never display blank widgets.

---

# Performance Requirements

Dashboard load time

<2 seconds

Chart rendering

<500ms

Filter updates

Instant

Support future scaling to

100,000+ employees

---

# Security

Managers

Only team data.

HR

Organization-wide.

Director

Executive view.

Never expose unauthorized data.

---

# API Integration

Dashboard consumes

Summary API

Department API

Payroll API

Reports API

Calculation Engine

Never calculate values inside the frontend.

---

# Deliverables

Generate

Dashboard Layout

KPI Cards

Charts

Department Summary

Planning Progress

Recent Activity

Quick Actions

Insights Panel

Loading States

Error States

Responsive Design

Role-based Views

---

# Validation Checklist

Before completion verify

✓ KPIs accurate

✓ Charts interactive

✓ Responsive

✓ Accessible

✓ Role-based

✓ Fast loading

✓ API integrated

✓ Error handling

✓ Loading states

✓ Enterprise design

---

# Output Format

Before implementation explain

Dashboard Information Architecture

Widget Layout

API Dependencies

Chart Strategy

Performance Strategy

Testing Strategy

Wait for approval.

After approval

Generate the dashboard feature module by module.

Never generate the complete dashboard in one response.

---

# Definition of Done

Dashboard is complete only if

✓ All KPI cards implemented

✓ Charts connected to APIs

✓ Role-based visibility enforced

✓ Filters working

✓ Responsive layout

✓ Accessibility implemented

✓ Loading & error states added

✓ Business insights available

✓ Enterprise UI followed

✓ Tested

---

# Final Principle

The Dashboard is the executive control center of Increo.

A user should understand the organization's salary planning status within the first 10 seconds of opening the application.

Every widget should help answer a business question, reduce manual analysis, and support faster decision-making.

The dashboard should feel comparable to enterprise products such as Stripe Dashboard, Workday, SAP SuccessFactors, and Rippling.

