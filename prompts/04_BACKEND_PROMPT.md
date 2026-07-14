# BACKEND_PROMPT.md

# Increo Backend Implementation Prompt

Version: 1.0

---

# Objective

Your responsibility is to design and implement the complete backend architecture for the Increo platform.

This is NOT a CRUD application.

This is an enterprise Salary Increment Planning & Analytics Platform.

Every backend component should follow enterprise architecture, clean code principles, modular design, and production-ready engineering standards.

The backend should be scalable, maintainable, secure, and easy to extend.

---

# Required Reading

Before implementation, read

PROJECT_CONTEXT.md

REQUIREMENTS.md

WORKFLOW.md

DATABASE.md

API_SPEC.md

SYSTEM_ARCHITECTURE.md

REPORTS.md

CALCULATION_ENGINE.md

CODING_STANDARDS.md

ROADMAP.md

MASTER_AI_INSTRUCTIONS.md

Never skip documentation.

Never assume business rules.

---

# Your Responsibilities

You are acting as

Senior Backend Architect

Senior Python Engineer

FastAPI Expert

Security Engineer

Database Architect

Performance Engineer

Software Architect

Every implementation must consider

Business Value

Performance

Security

Maintainability

Scalability

Testing

---

# Backend Technology Stack

Framework

FastAPI

Language

Python 3.12+

ORM

SQLAlchemy

Migration

Alembic

Validation

Pydantic

Authentication

JWT

Database

PostgreSQL

Dependency Injection

FastAPI Depends

Environment

python-dotenv

Testing

Pytest

---

# Backend Architecture

Follow Clean Architecture

API Layer

↓

Controller Layer

↓

Service Layer

↓

Repository Layer

↓

Database Layer

Business logic belongs ONLY in Service Layer.

Repositories only communicate with database.

Controllers never contain business logic.

---

# Folder Structure

Create

backend/

app/

api/

controllers/

services/

repositories/

models/

schemas/

core/

config/

middleware/

auth/

permissions/

database/

utils/

exceptions/

tests/

logs/

Each folder must contain only its assigned responsibility.

---

# Project Initialization

Configure

Virtual Environment

Dependencies

Environment Variables

Configuration

Logging

Database Connection

Alembic

Pytest

Code Formatting

Linting

Ensure backend starts successfully.

---

# Authentication

Implement

Login

JWT Generation

JWT Validation

Password Hashing

Protected Routes

Role Validation

Session Handling

Unauthorized Responses

Token Expiration

Future-ready Refresh Token Support

---

# Authorization

Implement Role-Based Access Control

Roles

Manager

HR

Director

Rules

Managers

Only access employees assigned to them.

HR

Organization-wide access.

Director

Executive-level access.

Authorization should exist in middleware/dependencies.

Never inside controllers.

---

# Employee Module

Implement

Employee Repository

Employee Service

Employee APIs

Employee Validation

Search

Filtering

Pagination

Sorting

Employee Details

Salary History

Current Salary

Future Salary

Managers must never access another manager's employees.

---

# Salary Planning Module

Implement

Increment Validation

Salary Planning Service

Planning Repository

Draft Saving

Projection Calculation

Automatic Refresh

Integration with Calculation Engine

Managers only edit

Fixed Increment %

Variable Increment %

Retention Bonus %

Everything else is calculated automatically.

---

# Calculation Engine Integration

Do NOT duplicate formulas.

Always use the centralized Calculation Engine.

Dashboard

Reports

Employee APIs

must consume calculation results.

---

# Dashboard APIs

Generate APIs for

Summary KPIs

Department Summary

Payroll Summary

Average Salary

Average Increment

Employee Count

Charts

Manager Summary

Return optimized responses.

---

# Reports APIs

Generate APIs for

Department Reports

Designation Reports

Payroll Reports

Increment Reports

Salary Distribution

Manager Summary

Budget Analysis

Current vs Future Payroll

Support

Filtering

Sorting

Pagination

Export

---

# Validation

Validate

Input

Business Rules

Authorization

Data Types

Required Fields

Increment Ranges

Salary Components

Validation exists in

Pydantic

Services

Database

Never trust frontend.

---

# Error Handling

Implement centralized exception handling.

Return

Status Code

Error Code

Message

Timestamp

Path

Never expose internal exceptions.

---

# Logging

Log

Authentication

Planning Changes

Errors

Report Generation

Database Errors

Performance Warnings

Never log

Passwords

JWT Tokens

Sensitive salary details

---

# Security

Implement

JWT

RBAC

Parameterized Queries

Input Sanitization

Environment Variables

CORS

Rate Limiting (Future Ready)

Secure Headers

SQL Injection Prevention

---

# Performance

Implement

Pagination

Optimized Queries

Indexes

Connection Pooling

Lazy Loading

Batch Processing

Avoid N+1 queries.

---

# API Standards

Every API must include

Purpose

Authentication

Authorization

Validation

Response Model

Error Responses

HTTP Status Codes

Documentation

Follow REST principles.

---

# Testing

Generate

Unit Tests

Service Tests

Repository Tests

API Tests

Authorization Tests

Validation Tests

Edge Case Tests

---

# Deliverables

Generate

Backend Folder Structure

FastAPI Configuration

Authentication Module

RBAC Module

Employee Module

Salary Planning Module

Calculation Integration

Dashboard APIs

Reports APIs

Validation

Logging

Testing

Documentation

---

# Validation Checklist

Before completing backend verify

✓ Clean Architecture

✓ Authentication Works

✓ Authorization Works

✓ Services Isolated

✓ Repositories Isolated

✓ Validation Complete

✓ Error Handling Complete

✓ Logging Configured

✓ Tests Generated

✓ Documentation Updated

---

# Output Format

Before writing code

Explain

Architecture

Files

Dependencies

Flow

Business Rules

Risks

Testing Strategy

Wait for approval.

After approval

Generate code module by module.

Never generate the complete backend at once.

---

# Definition of Done

Backend implementation is complete only if

✓ All APIs implemented

✓ Authentication complete

✓ RBAC enforced

✓ Business rules followed

✓ Validation complete

✓ Logging implemented

✓ Tests passing

✓ Documentation updated

✓ Production-ready architecture

---

# Final Principle

The backend is the business engine of Increo.

Every API should be secure.

Every service should encapsulate business logic.

Every repository should only access data.

Every module should be independently testable, reusable, and scalable.

Prioritize correctness, maintainability, and enterprise architecture over speed of implementation.