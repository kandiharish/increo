# PROJECT_STRUCTURE_PROMPT.md

# Increo Project Structure Design Prompt

Version: 1.0

---

# Objective

Your task is to design the complete software architecture and project structure for Increo.

Do NOT generate any application code.

Do NOT implement features.

Your responsibility is to design a scalable, maintainable, modular, enterprise-grade project structure.

The structure should support future expansion without requiring architectural redesign.

---

# Required Reading

Before beginning, carefully review the following documents.

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

Do not continue unless all documents have been understood.

---

# Goal

Design the project as if it will be maintained by a team of software engineers for the next five years.

Prioritize

Scalability

Maintainability

Modularity

Clean Architecture

Developer Experience

Testing

Future Expansion

---

# High Level Architecture

Design the complete architecture including

Frontend

Backend

Database

Shared Modules

Assets

Configuration

Deployment

Testing

Documentation

Explain how every layer communicates.

---

# Frontend Architecture

Design the folder structure for the Next.js application.

Include

App Router

Authentication

Dashboard

Employee Module

Salary Planning

Reports

Analytics

Settings

Shared Components

Reusable UI

Layouts

Providers

Hooks

Services

Utilities

Types

Constants

Contexts

Styles

Assets

Middleware

For every folder explain

Purpose

Responsibility

Dependencies

Future scalability

---

# Backend Architecture

Design the FastAPI project structure.

Include

API

Routers

Controllers

Services

Repositories

Schemas

Models

Authentication

Authorization

Permissions

Database

Configuration

Middleware

Exceptions

Utilities

Logging

Testing

Explain why every folder exists.

---

# Database Architecture

Organize

Database Models

Relationships

Migrations

Seeders

Repositories

Connection Layer

Audit Tables

Future Expansion

Explain the responsibility of every layer.

---

# Shared Layer

Design reusable shared modules.

Examples

Constants

Enums

Validators

Utilities

Helpers

Configuration

Types

Interfaces

Explain reuse strategy.

---

# Configuration Management

Design

Environment Variables

Development Configuration

Testing Configuration

Production Configuration

Secrets Management

Database Configuration

JWT Configuration

Logging Configuration

---

# Naming Standards

Recommend naming conventions for

Folders

Files

Components

Hooks

Services

API Routes

Database Tables

Columns

Enums

Types

Interfaces

Constants

Utilities

Environment Variables

---

# Dependency Rules

Define dependency flow.

Example

Pages

↓

Components

↓

Hooks

↓

Services

↓

API

↓

Repositories

↓

Database

No layer should bypass another layer.

---

# Module Isolation

Every feature should be independently maintainable.

Authentication

Dashboard

Employee Module

Salary Planning

Reports

Analytics

Settings

One module should never tightly depend on another.

---

# Reusable Components

Identify reusable UI components.

Examples

Buttons

Cards

Tables

Charts

Dialogs

Forms

Badges

Tags

Pagination

Search

Filters

Loading States

Empty States

Error Components

Explain reuse strategy.

---

# State Management

Recommend

Local State

Global State

Server State

Caching Strategy

Session Management

Theme Management

Role Management

Do not introduce unnecessary complexity.

---

# Error Handling Strategy

Frontend

Backend

API

Database

Validation

Authentication

Authorization

Logging

Provide a centralized error handling strategy.

---

# Security Architecture

Authentication

Authorization

RBAC

JWT

Input Validation

SQL Injection Prevention

Environment Variables

Secure API Design

Audit Logging

---

# Performance Strategy

Pagination

Code Splitting

Lazy Loading

Memoization

Optimized Database Queries

Caching

Bundle Optimization

API Optimization

Future Scaling

---

# Testing Architecture

Organize

Unit Tests

Integration Tests

API Tests

UI Tests

Security Tests

Performance Tests

Accessibility Tests

Explain folder organization.

---

# Deliverables

Produce

Complete frontend folder structure

Complete backend folder structure

Database folder structure

Shared folder structure

Configuration strategy

Dependency diagram

Folder responsibilities

Naming conventions

Architecture justification

Potential risks

Future scalability recommendations

---

# Validation Checklist

Before presenting the architecture verify

✓ Modular

✓ Scalable

✓ Secure

✓ Testable

✓ Maintainable

✓ Enterprise Ready

✓ Follows Clean Architecture

✓ Follows Coding Standards

✓ Supports Future Features

---

# Output Format

Present the response in the following order

1. High Level Architecture

2. Frontend Folder Structure

3. Backend Folder Structure

4. Database Structure

5. Shared Modules

6. Configuration

7. Dependency Flow

8. Naming Standards

9. Security Architecture

10. Performance Strategy

11. Testing Strategy

12. Risks & Recommendations

Do NOT generate implementation code.

Wait for approval before creating any files.

---

# Final Principle

The project structure is the foundation of the application.

A well-designed architecture minimizes technical debt, simplifies future development, improves onboarding for new developers, and ensures long-term maintainability.

Prioritize architecture over implementation.