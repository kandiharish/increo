# PROJECT CONTEXT
# Employee Salary Increment Management & Analytics Platform
Version: 1.0

---

# Project Name

Increo

Tagline

Smart Compensation Planning & Analytics Platform

---

# Overview

Increo is an enterprise web application designed to simplify and digitize the employee salary increment planning process.

The application is NOT a payroll system.

The application is NOT an HRMS.

The application is NOT an employee management system.

Its only responsibility is helping managers, HR, and directors plan salary increments and analyze compensation through reports and dashboards.

The application should act as a Decision Support System (DSS), where managers make business decisions while the system performs calculations and provides insights.

---

# Business Problem

Currently, salary increment planning is performed using Excel spreadsheets.

Managers manually:

- Review employee salary history
- Compare salaries
- Calculate future salaries
- Prepare reports
- Analyze payroll

This creates several problems.

• Manual calculations

• Spreadsheet errors

• Version conflicts

• No centralized reporting

• Difficult salary comparisons

• Difficult payroll forecasting

• Time-consuming appraisal planning

The objective of this application is to replace spreadsheet-based planning with a centralized intelligent web application.

---

# Project Goal

Build an enterprise salary increment planning platform that enables

Managers

HR

Directors

to

Review employee information

Plan salary increments

Automatically calculate future salary

Generate reports

Analyze payroll

Support better business decisions

---

# Scope

IN SCOPE

Authentication

Role Based Access

Dashboard

Employee Information

Salary History

Current Salary Structure

Increment Planning

Salary Projection

Reports

Analytics

Export Reports

Search

Filtering

Dashboard

OUT OF SCOPE

Attendance

Leave Management

Payroll Processing

Payslip

Recruitment

Employee Portal

Tax Calculation

Performance Review

Notification System

Approval Workflow

These may be future enhancements.

---

# Users

Manager

HR

Director

---

# User Responsibilities

Manager

View only employees reporting to them.

Review employee information.

Review salary history.

Update increment percentages.

View team reports.

HR

View organization data.

Generate reports.

Compare departments.

Analyze payroll.

Director

View dashboards.

Review payroll impact.

View executive reports.

Make strategic decisions.

---

# Role Based Access

Manager

Only their employees.

Cannot access another manager's employees.

HR

Entire organization.

Director

Entire organization.

---

# Dataset

Employee Information

employee_id

employee_name

manager_name

department

doj

Employment

current_designation

proposed_designation

Historical Salary

ctc_2022_23

ctc_2023_24

ctc_2024_25

Current Salary Structure

fixed_pay_2025_26

variable_pay_2025_26

vp+fp_2025_26

mediclaim_2025_26

gratuity_2025_26

ctc_excl_ret_2025_26

retention_bonus_2025_26

ctc_2025_26

Increment Planning

increment_pct_fixed

increment_pct_variable

increment_pct_retention

Future Salary Structure

fixed_pay_2026_27

variable_pay_2026_27

vp_fp_2026_27

mediclaim_2026_27

gratuity_2026_27

ctc_excl_ret_2026_27

retention_bonus_2026_27

ctc_2026_27

---

# Manager Clarifications

Manager provided the following clarifications.

Managers CANNOT change proposed designation.

Reports should update automatically whenever increment changes.

Reports are generated dynamically.

No predefined reports.

Developer should think and create meaningful reports.

Mediclaim remains constant.

Gratuity remains constant.

Only

Fixed Pay

Variable Pay

Retention Bonus

change according to increment.

Project scope for MVP

Planning

Reporting

Nothing else.

---

# Business Workflow

Login

↓

Authenticate

↓

Identify User Role

↓

Load Dashboard

↓

Load Authorized Employees

↓

Select Employee

↓

Review Employee Details

↓

Review Salary History

↓

Review Current Salary Structure

↓

Update Increment Percentages

↓

Automatic Salary Projection

↓

Dashboard Refresh

↓

Reports Refresh

↓

Save Changes

---

# Salary Planning

Manager can edit ONLY

Increment Percentage Fixed

Increment Percentage Variable

Increment Percentage Retention

Everything else is calculated automatically.

Managers never manually calculate salary.

Managers never edit salary components.

---

# Salary Calculation Rules

Fixed Pay

Apply Fixed Increment %

Variable Pay

Apply Variable Increment %

Retention Bonus

Apply Retention Increment %

Mediclaim

No Change

Gratuity

No Change

Current Salary

Read Only

Future Salary

Automatically Calculated

---

# Reports

Reports should answer business questions.

Recommended Reports

Department Salary Analysis

Designation Salary Analysis

Current Payroll

Projected Payroll

Current vs Future Payroll

Salary Distribution

Salary Trend

Increment Analysis

Department Budget

Salary Outlier Analysis

Manager Team Summary

Reports must support filters

Department

Manager

Designation

Salary Bracket

Financial Year

Employee

Reports update automatically after every increment.

---

# Dashboard

Dashboard should show

Employee Count

Department Count

Current Payroll

Future Payroll

Average Salary

Average Increment

Department Summary

Pending Reviews

Payroll Growth

Salary Distribution

---

# Product Design Principles

Enterprise Product

Minimal

Professional

Premium

Modern

No unnecessary animations.

No childish UI.

No colorful gradients.

Use white space effectively.

Focus on readability.

Everything should feel similar to

Workday

Rippling

SAP SuccessFactors

Oracle HCM

Microsoft

Stripe Dashboard

Linear

Notion

---

# UI Theme

Premium Enterprise

Rounded corners

Soft shadows

Minimal icons

Dark Sidebar

Light Workspace

Professional typography

Lots of whitespace

Card based layout

Interactive charts

Professional tables

Responsive

Desktop First

---

# Technical Stack

Frontend

React

Next.js

TypeScript

TailwindCSS

shadcn/ui

Backend

FastAPI

Python

Database

PostgreSQL

ORM

SQLAlchemy

Charts

Recharts

Authentication

JWT

---

# Development Principles

Never assume business rules.

Always ask if requirement is unclear.

Never generate placeholder code.

Never generate fake APIs.

Never skip validation.

Never mix business logic inside UI.

Follow enterprise architecture.

Write production-ready code.

Build feature by feature.

Review after every milestone.

---

# AI Instructions

You are a Senior Product Manager.

You are also a Senior Software Architect.

You are also a Senior UX Designer.

You have 20+ years of enterprise SaaS experience.

Before writing any code

Understand the problem.

Validate assumptions.

Ask questions.

Design architecture.

Design workflows.

Design UI.

Design database.

Design APIs.

Only after approval

start implementation.

Never skip planning.

Never make assumptions.

Always think like a product company building software for enterprise customers.

This document is the single source of truth for the project.
Every future implementation should follow this document.