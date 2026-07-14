# DATABASE_PROMPT.md

# Increo Database Design & Implementation Prompt

Version: 1.0

---

# Objective

Your responsibility is to design, validate, optimize, and implement the complete PostgreSQL database for the Increo platform.

You are NOT simply creating tables.

You are designing an enterprise-grade database architecture that will serve as the single source of truth for the application.

The database should support scalability, maintainability, auditability, performance, and future expansion.

---

# Required Reading

Before performing any task, carefully read

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

# Responsibilities

You are acting as

Senior Database Architect

Senior Backend Engineer

Data Engineer

Security Engineer

Performance Engineer

Every decision should consider

Business Rules

Performance

Scalability

Maintainability

Future Expansion

---

# Step 1

Validate Existing Database Design

Review the existing schema.

Identify

Missing Tables

Missing Relationships

Normalization Issues

Duplicate Data

Missing Constraints

Missing Indexes

Missing Audit Fields

Naming Problems

Performance Risks

Security Risks

Do NOT generate SQL yet.

Provide recommendations first.

---

# Step 2

Database Design

Design the complete relational database.

Include

Users

Roles

Permissions

Employees

Departments

Salary History

Current Salary

Salary Planning

Projected Salary

Reports

Audit Logs

Configuration

Future Expansion Tables

Explain why every table exists.

---

# Step 3

Relationships

Define

Primary Keys

Foreign Keys

One-to-One

One-to-Many

Many-to-Many

Cascade Rules

Delete Rules

Update Rules

Relationship Naming

Explain every relationship.

---

# Step 4

Column Design

For every table define

Column Name

Data Type

Nullable

Default Value

Constraints

Business Purpose

Validation Rules

Future Considerations

Never use generic columns.

---

# Step 5

Normalization

Ensure

First Normal Form

Second Normal Form

Third Normal Form

Avoid duplicated data.

Avoid storing calculated values unless justified.

Explain denormalization decisions.

---

# Step 6

Indexes

Recommend indexes for

Employee Search

Department Filter

Manager Filter

Designation

Salary Range

Reports

Dashboard

Authentication

Explain why each index exists.

Avoid unnecessary indexing.

---

# Step 7

Audit Strategy

Every important table should support auditing.

Include

Created By

Created At

Updated By

Updated At

Version

Soft Delete

Change Reason

Explain audit strategy.

---

# Step 8

Migration Strategy

Generate

Initial Migration

Future Migration Strategy

Rollback Strategy

Version Control

Alembic Configuration

Migration Naming Convention

Never modify schema manually.

---

# Step 9

SQLAlchemy Models

Generate

ORM Models

Relationships

Constraints

Indexes

Enums

Validation

Keep models clean.

Business logic must never exist inside models.

---

# Step 10

Seed Data

Generate

Roles

Permissions

Departments

Demo Employees

Configuration Data

The seed data should allow immediate testing.

---

# Step 11

Performance Optimization

Recommend

Indexes

Query Optimization

Pagination Strategy

Connection Pooling

Batch Processing

Future Partitioning

Caching Readiness

---

# Step 12

Security

Validate

Sensitive Data

RBAC

SQL Injection Prevention

Parameterized Queries

Least Privilege Principle

Data Isolation

Managers should never query employees outside their scope.

---

# Step 13

Future Scalability

Design the schema so future modules can be added without redesign.

Future modules may include

Approval Workflow

Notifications

AI Recommendations

Market Salary Benchmarking

Budget Planning

Power BI Integration

Audit Trail

Version History

---

# Deliverables

Produce

Database Architecture

ER Diagram (Mermaid)

Complete Table Definitions

Relationships

Indexes

Constraints

SQLAlchemy Models

Alembic Migrations

Seed Strategy

Optimization Strategy

Security Strategy

Future Expansion Strategy

---

# Validation Checklist

Before implementation verify

✓ Tables normalized

✓ Relationships valid

✓ Constraints defined

✓ Indexes optimized

✓ Audit supported

✓ RBAC supported

✓ Performance optimized

✓ Future-ready

✓ Naming standards followed

✓ Business rules satisfied

---

# Output Format

Respond in the following order

1. Database Review

2. Recommended Improvements

3. ER Diagram

4. Table Structure

5. Relationships

6. Constraints

7. Index Strategy

8. SQLAlchemy Models

9. Migration Plan

10. Seed Plan

11. Performance Review

12. Security Review

13. Future Recommendations

Do NOT implement APIs.

Do NOT generate backend services.

Complete the database layer first.

Wait for approval before proceeding.

---

# Final Principle

The database is the foundation of the Increo platform.

Every business feature depends on a reliable, secure, normalized, and scalable database.

Design for the next five years, not only for the current MVP.

The database should require minimal structural changes as new enterprise features are introduced.