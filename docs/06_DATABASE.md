# DATABASE.md

# Increo Database Design

Version 1.0

---

# Purpose

This document defines the database architecture for Increo.

The objective is to create a normalized, scalable, secure, and enterprise-ready relational database that supports salary planning, reporting, and future product enhancements.

The database should become the Single Source of Truth (SSOT) for all employee, salary, and planning information.

The design should prioritize:

- Data Integrity
- Scalability
- Reporting Efficiency
- Security
- Maintainability

---

# Database Philosophy

The database should never mirror the Excel sheet directly.

Instead, the Excel file should act as the import source, while the database stores information in normalized tables.

This minimizes duplication, improves performance, and simplifies future development.

---

# High-Level Data Model

```text
Users
   │
   │
   ├──────────────┐
   │              │
Employees      Roles
   │
   │
Salary History
   │
Current Salary
   │
Increment Plans
   │
Projected Salary
```

---

# Core Tables

The application will initially contain the following tables.

1. Users
2. Roles
3. Employees
4. Departments
5. Salary History
6. Current Salary
7. Increment Plans
8. Projected Salary

Future tables

Audit Logs

Notifications

Approvals

Report Configurations

AI Recommendations

---

# Table 1

Users

Purpose

Stores application users.

Examples

Managers

HR

Directors

Columns

User ID

Full Name

Email

Password Hash

Role ID

Status

Created At

Updated At

Business Rules

Email must be unique.

Passwords are always hashed.

User belongs to one role.

---

# Table 2

Roles

Purpose

Defines user permissions.

Examples

Manager

HR

Director

Columns

Role ID

Role Name

Description

Business Rules

Roles are predefined.

Users cannot create new roles from UI.

---

# Table 3

Employees

Purpose

Stores employee master information.

Columns

Employee ID

Employee Name

Department ID

Manager ID

DOJ

Current Designation

Proposed Designation

Status

Business Rules

Employee ID must be unique.

Manager references another user.

Department references Department table.

Historical salary is NOT stored here.

---

# Table 4

Departments

Purpose

Stores organizational departments.

Columns

Department ID

Department Name

Description

Business Rules

Department names should remain unique.

Used by reports.

---

# Table 5

Salary History

Purpose

Stores historical CTC.

One employee can have multiple salary history records.

Columns

History ID

Employee ID

Financial Year

CTC

Created At

Relationship

Employee

1

↓

Many

Salary History

Benefits

Unlimited salary history.

Supports trend analysis.

Supports future reporting.

---

# Table 6

Current Salary

Purpose

Stores current salary breakup.

Columns

Salary ID

Employee ID

Fixed Pay

Variable Pay

Mediclaim

Gratuity

Retention Bonus

Current CTC

Financial Year

Business Rules

One active salary per employee.

Mediclaim

Read Only

Gratuity

Read Only

---

# Table 7

Increment Plans

Purpose

Stores manager decisions.

Columns

Plan ID

Employee ID

Manager ID

Fixed Increment %

Variable Increment %

Retention Increment %

Planning Date

Status

Business Rules

Only Managers can modify.

Status

Draft

Submitted

Approved

Future Ready

Although approval is not part of MVP,

Status field allows future enhancement.

---

# Table 8

Projected Salary

Purpose

Stores automatically calculated salary.

Columns

Projection ID

Employee ID

Financial Year

Future Fixed Pay

Future Variable Pay

Mediclaim

Gratuity

Retention Bonus

Projected CTC

Business Rules

Never manually edited.

Generated automatically.

---

# Relationships

Users

1

↓

Many

Employees

---

Departments

1

↓

Many

Employees

---

Employees

1

↓

Many

Salary History

---

Employees

1

↓

1

Current Salary

---

Employees

1

↓

Many

Increment Plans

---

Employees

1

↓

Many

Projected Salary

---

# Entity Relationship Summary

Users

↓

Employees

↓

Salary History

↓

Current Salary

↓

Increment Plan

↓

Projected Salary

This represents the complete salary lifecycle.

---

# Indexing Strategy

Index

Employee ID

Email

Department ID

Manager ID

Financial Year

Status

Purpose

Improve

Search

Reports

Filtering

Dashboard Performance

---

# Data Integrity Rules

Employee IDs are unique.

Department IDs are valid.

Manager IDs must exist.

Salary history cannot be deleted.

Projected salary depends on current salary.

Increment plan must exist before projection.

---

# Import Strategy

Source

Excel Dataset

↓

Validation

↓

Duplicate Check

↓

Required Field Check

↓

Database Import

↓

Dashboard Refresh

Never insert raw Excel data directly.

Always validate first.

---

# Future Expansion

The schema should support

Approval Workflow

Budget Planning

Multiple Financial Years

Audit History

Notification Service

AI Salary Recommendations

No redesign should be required.

---

# Database Design Principles

Normalize data.

Avoid duplicate information.

Never overwrite historical salary.

Store calculations separately.

Keep business entities independent.

Prefer foreign keys over duplicated text.

---

# Security

Passwords are hashed.

Salary information is protected through RBAC.

Sensitive fields are never exposed unnecessarily.

Database access is only through backend services.

---

# Performance Considerations

Use indexing.

Paginate employee lists.

Lazy load reports.

Aggregate analytics at query level.

Optimize joins.

Avoid N+1 queries.

---

# Final Principle

The database should represent the business, not the spreadsheet.

Every table should exist because it models a real business entity.

Every relationship should reflect an organizational relationship.

The database should remain flexible enough to support future enterprise requirements without structural redesign.