# API_SPEC.md

# Increo REST API Specification

Version: 1.0

---

# Purpose

This document defines the REST API contract for the Increo platform.

The API acts as the communication layer between the frontend and backend.

Every API should be:

- RESTful
- Versioned
- Secure
- Consistent
- Predictable

All APIs must follow the same response format, validation rules, authorization rules, and error handling.

---

# API Standards

Base URL

/api/v1

Authentication

JWT Bearer Token

Content Type

application/json

Time Format

ISO 8601

Currency

INR

---

# Standard Response Format

Success

{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}

Failure

{
  "success": false,
  "message": "Validation failed",
  "errors": []
}

Never return different response formats.

---

# Authentication Module

## POST /auth/login

Purpose

Authenticate user.

Request

Email

Password

Response

JWT Token

User Profile

Role

Permissions

Validation

Email required.

Password required.

Role active.

---

## POST /auth/logout

Purpose

Logout current user.

Authentication

Required

Response

Success message.

---

## GET /auth/me

Purpose

Return logged in user.

Response

Profile

Role

Permissions

---

# Dashboard Module

## GET /dashboard

Purpose

Load dashboard based on role.

Manager

Team KPIs

HR

Organization KPIs

Director

Executive KPIs

Response

Cards

Charts

Quick Statistics

---

# Employee Module

## GET /employees

Purpose

List employees.

Manager

Own team only.

HR

All employees.

Director

All employees.

Supports

Pagination

Sorting

Filtering

Searching

Query Parameters

page

limit

search

department

manager

designation

salaryBracket

status

---

## GET /employees/{id}

Purpose

Employee profile.

Returns

Basic Information

Salary History

Current Salary

Increment Plan

Projected Salary

Charts

---

# Salary Planning Module

## GET /planning/{employeeId}

Purpose

Load planning screen.

Returns

Current Salary

Historical Salary

Increment %

Projected Salary

---

## PUT /planning/{employeeId}

Purpose

Update increment percentages.

Editable Fields

Fixed Increment %

Variable Increment %

Retention Increment %

Everything else read only.

Validation

No negative values.

No null values.

Must follow company policy.

After Update

Recalculate projected salary.

Refresh dashboard.

Refresh reports.

---

# Salary Projection

## GET /projection/{employeeId}

Purpose

Return projected salary.

Response

Projected Fixed Pay

Projected Variable Pay

Retention Bonus

Mediclaim

Gratuity

Projected CTC

Business Rule

Projection is always calculated.

Never manually edited.

---

# Reports Module

## GET /reports

Purpose

Return report catalogue.

Available Reports

Department

Designation

Payroll

Salary Trend

Salary Distribution

Manager Summary

Budget

Outliers

Increment Analysis

---

## GET /reports/{reportId}

Purpose

Generate report.

Query Parameters

department

manager

designation

salaryBracket

financialYear

employee

Response

KPIs

Charts

Table

Summary

---

# Export Module

## GET /reports/{id}/export

Purpose

Export report.

Formats

PDF

Excel

CSV

---

# Search Module

## GET /search

Purpose

Global search.

Searches

Employees

Managers

Departments

Supports

Instant Search

Pagination

---

# Filter API

## GET /filters

Purpose

Load filter values.

Returns

Departments

Managers

Designations

Salary Brackets

Financial Years

---

# User Module

## GET /users/profile

Purpose

Logged in profile.

---

## PUT /users/profile

Purpose

Update own profile.

Scope

Profile only.

No role changes.

---

# Settings Module

## GET /settings

Purpose

Application settings.

Role specific.

---

# Error Codes

200

Success

201

Created

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Error

500

Internal Server Error

---

# Authorization Matrix

Manager

Dashboard

✓

Employees

Own Team

Planning

✓

Reports

Team Reports

Export

✓

HR

Dashboard

✓

Employees

All

Planning

Optional

Reports

All

Director

Dashboard

Executive

Employees

All

Planning

Read Only

Reports

Executive

---

# Validation Rules

Employee ID

Must exist.

Increment %

Required.

Cannot be negative.

Cannot exceed policy.

Department

Must exist.

Manager

Must exist.

JWT

Required for every protected endpoint.

---

# Business Rules

Managers cannot edit salary values.

Managers edit only increment percentages.

Salary projections are always system generated.

Reports always use latest data.

Mediclaim remains constant.

Gratuity remains constant.

---

# Security

JWT Authentication

Role-Based Authorization

Input Validation

Rate Limiting

Request Logging

Secure Headers

Password Hashing

Never expose sensitive salary information.

---

# Versioning

All APIs must support versioning.

Current Version

v1

Future versions should remain backward compatible.

---

# API Design Principles

One endpoint = One responsibility.

Never mix multiple business operations.

Keep responses predictable.

Validate every request.

Return meaningful error messages.

Business logic belongs in services.

Routes should remain thin.

---

# Final Principle

The API layer is the contract between frontend and backend.

It should remain stable, predictable, and independent of UI changes.

Any modification to an endpoint should preserve backward compatibility whenever possible.