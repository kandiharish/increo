# CODING_STANDARDS.md

# Increo Coding Standards & Engineering Guidelines

Version: 1.0

---

# Purpose

This document defines the coding standards, engineering practices, architecture conventions, naming guidelines, and quality expectations for the Increo project.

Every developer and AI assistant contributing to this project must strictly follow these standards.

The objective is to maintain a clean, scalable, secure, readable, and production-ready codebase.

This document applies to

Frontend

Backend

Database

APIs

Testing

Documentation

DevOps

---

# Engineering Philosophy

The codebase should prioritize

Readability

Maintainability

Scalability

Reusability

Security

Performance

Consistency

Correctness

The application should feel like software developed by a professional enterprise engineering team rather than a personal project.

---

# Core Engineering Principles

Follow

Single Responsibility Principle (SRP)

Open/Closed Principle (OCP)

Liskov Substitution Principle (LSP)

Interface Segregation Principle (ISP)

Dependency Inversion Principle (DIP)

DRY (Don't Repeat Yourself)

KISS (Keep It Simple)

YAGNI (You Aren't Gonna Need It)

Composition over Inheritance

Convention over Configuration

---

# General Rules

Write self-explanatory code.

Avoid unnecessary comments.

Prefer meaningful names over clever code.

Keep functions focused on one responsibility.

Never duplicate business logic.

Never hardcode business values.

Never bypass architecture.

Never mix business logic with UI.

---

# Naming Conventions

## Files

React Components

PascalCase

Example

EmployeeCard.tsx

SalaryTable.tsx

DashboardLayout.tsx

---

Utilities

camelCase

Example

calculateSalary.ts

formatCurrency.ts

validateIncrement.ts

---

Folders

kebab-case

Example

employee-management

salary-engine

report-service

---

Database Tables

snake_case

Example

employees

salary_history

increment_plans

projected_salary

---

Database Columns

snake_case

Example

employee_id

current_ctc

fixed_pay

variable_pay

---

Variables

camelCase

Example

employeeName

currentSalary

futureSalary

---

Constants

UPPER_SNAKE_CASE

Example

MAX_INCREMENT

DEFAULT_PAGE_SIZE

JWT_EXPIRY

---

Interfaces

Prefix with I

Example

IEmployee

ISalary

IReport

---

Types

PascalCase

Example

EmployeeResponse

SalaryProjection

DashboardSummary

---

Enums

PascalCase

Example

UserRole

DepartmentType

SalaryBracket

---

Functions

Verb + Noun

Example

calculateSalary()

generateReport()

validateIncrement()

fetchEmployees()

---

React Hooks

Must begin with

use

Example

useEmployees()

useDashboard()

useReports()

---

API Endpoints

Plural resources

Examples

/api/employees

/api/reports

/api/dashboard

---

# Folder Structure Standards

Every module should contain

components

hooks

services

types

utils

constants

tests

Never place unrelated files together.

---

# Component Standards

Every component should have one responsibility.

Preferred maximum size

300 lines

Split components if they grow beyond this.

Avoid deeply nested JSX.

Extract repeated UI into reusable components.

---

# Service Standards

Business logic belongs only in services.

Services should

Validate

Calculate

Coordinate

Return Results

Services should never render UI.

---

# Repository Standards

Repositories only communicate with the database.

Repositories should

Read

Insert

Update

Delete

Repositories should never contain business logic.

---

# API Standards

Controllers should

Receive Request

Validate

Call Service

Return Response

Nothing more.

Never perform calculations inside controllers.

---

# Database Standards

Normalize tables.

Avoid duplicated data.

Use foreign keys.

Index searchable columns.

Never overwrite historical data.

Always preserve auditability.

---

# Error Handling

Frontend

Display friendly messages.

Backend

Return structured error responses.

Never expose internal exceptions.

Every error must include

Message

Code

Timestamp

Request ID (future)

---

# Validation Standards

Validate on

Frontend

Backend

Database

Never trust client-side validation alone.

---

# Logging Standards

Log

Authentication

Errors

Salary Updates

Report Generation

Do NOT log

Passwords

JWT Tokens

Sensitive Salary Details

Personal Identifiable Information

---

# Security Standards

JWT Authentication

Role-Based Access Control

Parameterized Queries

Input Validation

Environment Variables

HTTPS

Password Hashing

Secure Headers

Never expose secrets in source code.

---

# Performance Standards

Use Pagination

Lazy Loading

Memoization

Optimized Queries

Caching (future)

Avoid unnecessary API calls.

Avoid unnecessary re-renders.

---

# React Standards

Prefer Functional Components.

Use TypeScript everywhere.

Use React Hook Form for forms.

Use Zod for validation.

Use TanStack Query for server state.

Avoid unnecessary global state.

Prefer composition over prop drilling.

---

# FastAPI Standards

Use dependency injection.

Separate routers and services.

Use Pydantic schemas.

Keep routes thin.

Use SQLAlchemy ORM.

Document APIs.

---

# Database Standards

Use Alembic for migrations.

Never modify production schema manually.

Every schema change requires a migration.

---

# Git Standards

Branch Naming

feature/authentication

feature/dashboard

bugfix/report-filter

refactor/calculation-engine

hotfix/login

---

Commit Message Format

feat: add salary planning module

fix: resolve dashboard filter issue

refactor: optimize calculation engine

docs: update workflow documentation

test: add report generation tests

---

# Documentation Standards

Every public function should explain

Purpose

Parameters

Returns

Every module should include README if needed.

Keep documentation synchronized with implementation.

---

# Testing Standards

Every feature requires

Unit Tests

Integration Tests

Validation Tests

Authorization Tests

Edge Case Tests

Regression Tests

No feature is complete without testing.

---

# Accessibility Standards

Keyboard Navigation

Visible Focus States

ARIA Labels

Proper Form Labels

Color Contrast Compliance

Responsive Layout

---

# Code Review Checklist

Before merging any feature verify

✓ Requirements satisfied

✓ Architecture followed

✓ Naming conventions followed

✓ No duplicated logic

✓ Security validated

✓ Validation complete

✓ Performance acceptable

✓ Responsive

✓ Accessible

✓ Tests passing

✓ Documentation updated

---

# AI Instructions

Before generating code

Read this document completely.

Follow naming conventions exactly.

Follow architecture exactly.

Never invent new patterns.

Never ignore existing project structure.

If unsure

Ask for clarification.

Do not assume.

---

# Definition of Done

Code is complete only if

✓ Compiles successfully

✓ Passes tests

✓ Follows architecture

✓ Meets coding standards

✓ Secure

✓ Maintainable

✓ Reusable

✓ Documented

✓ Reviewed

✓ Approved

---

# Final Principle

Code should be written as if it will be maintained by another engineering team for the next five years.

Clarity is more valuable than cleverness.

Consistency is more valuable than personal preference.

Maintainability is more valuable than writing fewer lines of code.

Every line of code should contribute to building a reliable, scalable, and enterprise-ready Salary Increment Planning & Analytics Platform.