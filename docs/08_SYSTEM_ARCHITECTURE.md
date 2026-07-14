# SYSTEM_ARCHITECTURE.md

# Increo — System Architecture

Version: 1.0

---

# Purpose

This document defines the complete technical architecture of Increo.

It explains how every part of the application communicates, where business logic belongs, how modules interact, and how the project should be structured.

This architecture is the single source of truth for implementation.

No implementation should violate this architecture.

---

# Architecture Philosophy

The application follows a modular layered architecture.

Each layer has a single responsibility.

Presentation Layer
↓

Application Layer
↓

Business Layer
↓

Data Access Layer
↓

Database

Each layer must remain independent.

Business logic must never exist inside UI components.

Database queries must never exist inside UI or API routes.

---

# High Level Architecture

```text
                    Browser
                        │
                        ▼
          Next.js + React + TypeScript
                        │
                        ▼
              REST API (FastAPI)
                        │
     ┌──────────────────┼──────────────────┐
     ▼                  ▼                  ▼
 Authentication   Salary Engine     Report Engine
     │                  │                  │
     └──────────────────┼──────────────────┘
                        ▼
              Business Service Layer
                        │
                        ▼
             Repository / ORM Layer
                        │
                        ▼
                 PostgreSQL Database
```

---

# Technology Stack

## Frontend

Next.js 15

React 19

TypeScript

TailwindCSS

shadcn/ui

TanStack Query

TanStack Table

React Hook Form

Zod

Recharts

Lucide React

Framer Motion (minimal)

---

## Backend

FastAPI

Python

SQLAlchemy

Alembic

Pydantic

JWT Authentication

---

## Database

PostgreSQL

---

## Deployment

Frontend

Vercel

Backend

Railway / Render

Database

Supabase PostgreSQL

---

# System Modules

The application consists of independent modules.

Authentication

Dashboard

Employees

Salary Planning

Calculation Engine

Reports

Analytics

Settings

Each module should be independently maintainable.

---

# Frontend Architecture

```
src/

app/

(auth)

dashboard/

employees/

planning/

reports/

analytics/

settings/

components/

layout/

ui/

cards/

charts/

tables/

forms/

dialogs/

common/

hooks/

services/

lib/

types/

utils/

styles/

constants/
```

Rules

Every component should have one responsibility.

Business calculations are forbidden inside components.

API calls must go through service layer.

Pages must never directly call APIs.

---

# Backend Architecture

```
backend/

app/

api/

core/

config/

middleware/

models/

schemas/

services/

repositories/

utils/

database/

tests/
```

Rules

API Routes

↓

Service Layer

↓

Repository Layer

↓

Database

Business logic belongs only in Services.

Repositories handle database operations.

API routes only receive and return requests.

---

# Database Architecture

Master Data

Users

Roles

Departments

Employees

↓

Transactional Data

Salary History

Current Salary

Increment Plans

↓

Derived Data

Projected Salary

↓

Analytics

Reports

KPIs

Dashboard

Historical data must never be overwritten.

---

# Authentication Flow

```
Login

↓

Validate Credentials

↓

Generate JWT

↓

Load User Role

↓

Load Permissions

↓

Redirect Dashboard
```

Every request validates JWT.

---

# Authorization Flow

```
User

↓

Role

↓

Permission

↓

Employee Scope

↓

Requested Resource

↓

Allow / Deny
```

Managers only access their employees.

HR accesses organization.

Director accesses executive data.

---

# Employee Module Flow

```
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

Save
```

---

# Salary Planning Flow

```
Current Salary

↓

Manager edits Increment %

↓

Validation

↓

Salary Calculation Engine

↓

Projected Salary

↓

Dashboard Refresh

↓

Report Refresh

↓

Save
```

Only three fields are editable.

Fixed Increment %

Variable Increment %

Retention Bonus %

Everything else is read only.

---

# Report Generation Flow

```
Database

↓

Business Services

↓

Aggregation

↓

KPIs

↓

Charts

↓

Tables

↓

Frontend
```

Reports are always generated dynamically.

Never store generated reports.

---

# Dashboard Flow

```
Load User

↓

Load KPIs

↓

Load Charts

↓

Load Tables

↓

Ready
```

Dashboard never performs calculations.

It only displays processed data.

---

# Search Flow

```
Search Input

↓

Debounce

↓

API

↓

Database

↓

Results
```

---

# Filter Flow

```
Apply Filters

↓

Backend Query

↓

Business Calculations

↓

Refresh

Charts

Tables

KPIs
```

---

# Data Flow

```
Excel Dataset

↓

Import Validation

↓

PostgreSQL

↓

FastAPI

↓

Business Services

↓

REST APIs

↓

Next.js

↓

User
```

Database is the single source of truth.

---

# Folder Responsibility

## app/

Routing only.

## components/

Reusable UI.

## services/

API communication.

## hooks/

Reusable logic.

## utils/

Helper functions.

## types/

TypeScript types.

## backend/services/

Business logic.

## backend/repositories/

Database operations.

## backend/models/

ORM models.

---

# State Management

Global State

Authentication

Theme

User

Permissions

Local State

Forms

Dialogs

Pagination

Filters

Search

Never use global state unnecessarily.

---

# Security

JWT Authentication

RBAC

Password Hashing

Input Validation

Parameterized Queries

HTTPS

Environment Variables

CORS

Rate Limiting

Audit Ready

---

# Performance

Pagination

Lazy Loading

Code Splitting

Image Optimization

Memoization

Optimized Queries

Database Indexing

Caching Ready

---

# Error Handling

Frontend

Toast Notifications

Validation Messages

Fallback UI

Skeleton Loaders

Backend

HTTP Status Codes

Structured Errors

Logging

Database

Rollback Transactions

---

# Logging

Log

Authentication

Errors

Increment Updates

Report Generation

Do not log passwords or sensitive salary data.

---

# Scalability

Designed for

100 Employees

↓

1,000 Employees

↓

10,000 Employees

↓

100,000 Employees

No architectural redesign should be required.

---

# Future Extensions

Approval Workflow

AI Salary Recommendation Engine

Budget Planning

Notification Service

Audit Logs

Excel Upload

Power BI Integration

Azure AD / Google SSO

Cloud Storage

No existing module should require rewriting.

---

# Design Principles

Single Responsibility Principle

Separation of Concerns

DRY

KISS

Open/Closed Principle

Reusable Components

Clean Architecture

API First

Database First

Security by Design

---

# Definition of Done

A feature is complete only when:

✓ Business requirement implemented

✓ UI completed

✓ Validation implemented

✓ API integrated

✓ Security verified

✓ Responsive

✓ Loading state

✓ Empty state

✓ Error state

✓ Tested

✓ Documented

✓ Reviewed

---

# Final Engineering Principle

Every module should be independently replaceable.

Every business rule should exist in one place only.

Every screen should consume APIs instead of implementing business logic.

Every API should communicate through services.

The database should remain the single source of truth.

The application should always prioritize maintainability, scalability, security, and clarity over shortcuts or rapid implementation.