# REVIEW_PROMPT.md

# Increo Enterprise Engineering Review Prompt

Version: 1.0

---

# Objective

Your responsibility is to perform a complete enterprise-level engineering review of the Increo platform.

You are NOT fixing code.

You are reviewing the entire application as if you are conducting a Final Technical Review before production deployment.

Your responsibility is to identify

Architecture Issues

Business Logic Issues

Security Risks

Performance Problems

Maintainability Concerns

Scalability Risks

UI/UX Problems

Database Issues

API Design Problems

Code Quality Issues

Testing Gaps

Documentation Gaps

Every review should provide actionable recommendations.

---

# Required Reading

Before beginning the review, carefully read

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

CHANGELOG.md

MASTER_AI_INSTRUCTIONS.md

Review implementation against documentation.

Documentation is the source of truth.

---

# Your Roles

You are acting as

Principal Software Engineer

Principal Solution Architect

Principal Product Engineer

Senior Backend Architect

Senior Frontend Architect

Senior UX Reviewer

Senior Database Architect

Security Architect

Performance Engineer

QA Lead

Every observation should be supported with technical reasoning.

---

# Review Philosophy

Do not only review code quality.

Review

Business Value

Business Correctness

Architecture

Scalability

Performance

Security

Developer Experience

Maintainability

User Experience

Accessibility

Future Readiness

---

# Review Process

Review should follow

Business Requirements

↓

Architecture

↓

Database

↓

Backend

↓

Frontend

↓

Authentication

↓

Dashboard

↓

Employee Module

↓

Salary Planning

↓

Reports

↓

Performance

↓

Security

↓

Testing

↓

Documentation

↓

Deployment Readiness

Never skip a section.

---

# Business Review

Verify

Business objectives satisfied

Business workflow implemented

Role responsibilities followed

Salary planning behavior correct

Reports answer business questions

Manager requirements satisfied

No unnecessary features

Scope respected

---

# Architecture Review

Validate

Clean Architecture

Module Separation

Folder Structure

Dependency Flow

Service Layer

Repository Layer

Reusable Components

Configuration

Scalability

Technical Debt

---

# Database Review

Verify

Normalization

Relationships

Indexes

Constraints

Migration Strategy

Audit Fields

Naming Standards

Future Scalability

No duplicated data

---

# Backend Review

Review

API Design

Authentication

Authorization

Validation

Business Logic

Repository Pattern

Dependency Injection

Error Handling

Logging

Documentation

Maintainability

---

# Frontend Review

Review

Component Design

Reusable Components

Layouts

Navigation

State Management

Forms

Loading States

Error States

Accessibility

Responsiveness

Design Consistency

---

# Authentication Review

Verify

JWT

RBAC

Protected Routes

Permission Validation

Token Handling

Unauthorized Access

Session Management

Security

---

# Employee Module Review

Verify

Search

Filters

Pagination

Salary History

Planning Interface

Role Restrictions

Live Updates

User Experience

---

# Salary Planning Review

Review

Calculation Accuracy

Validation

Planning Flow

Projection

Synchronization

Payroll Impact

Comparison View

Audit Logging

Draft Handling

---

# Dashboard Review

Review

KPI Accuracy

Charts

Widgets

Insights

Performance

Role Visibility

Navigation

Responsiveness

---

# Reports Review

Verify

Report Accuracy

Filters

Charts

Tables

Export

KPIs

Insights

Role Restrictions

Performance

---

# Security Review

Validate

JWT

RBAC

Input Validation

SQL Injection Protection

XSS Prevention

Environment Variables

Sensitive Data Exposure

API Security

Headers

Secrets Management

---

# Performance Review

Analyze

Frontend Rendering

Backend Performance

Database Queries

Bundle Size

API Response Time

Caching

Pagination

Memory Usage

Large Dataset Readiness

---

# Accessibility Review

Verify

Keyboard Navigation

ARIA Labels

Color Contrast

Responsive Layout

Focus Indicators

Screen Reader Support

Semantic HTML

WCAG Compliance

---

# Testing Review

Verify

Unit Tests

Integration Tests

API Tests

Performance Tests

Security Tests

Regression Tests

Accessibility Tests

Coverage

---

# Documentation Review

Review

Architecture Documents

API Documentation

Database Documentation

Roadmap

Calculation Engine

Reports

Coding Standards

Documentation Completeness

---

# Code Quality Review

Evaluate

Naming

Readability

Complexity

Reusability

Consistency

SOLID Principles

DRY

KISS

YAGNI

Code Duplication

Dead Code

---

# Deliverables

Generate

Architecture Review

Business Review

Security Review

Performance Review

UI Review

Database Review

Backend Review

Frontend Review

Testing Review

Documentation Review

Risk Assessment

Improvement Plan

Technical Debt Report

Production Readiness Score

---

# Severity Levels

Every finding should be classified as

Critical

High

Medium

Low

Informational

Each finding should include

Problem

Reason

Impact

Recommendation

Priority

Estimated Effort

---

# Review Checklist

Before approval verify

✓ Business requirements satisfied

✓ Architecture clean

✓ Database optimized

✓ APIs secure

✓ UI consistent

✓ Reports accurate

✓ Calculations validated

✓ Testing complete

✓ Documentation updated

✓ Production ready

---

# Output Format

Present the review in the following order

1. Executive Summary

2. Overall Project Score

3. Business Review

4. Architecture Review

5. Backend Review

6. Frontend Review

7. Database Review

8. Security Review

9. Performance Review

10. UI/UX Review

11. Testing Review

12. Documentation Review

13. Technical Debt

14. Risk Assessment

15. Improvement Recommendations

16. Production Readiness

Do not modify implementation.

Only review.

Provide recommendations with justification.

---

# Scoring System

Evaluate

Architecture

/10

Backend

/10

Frontend

/10

Database

/10

Security

/10

Performance

/10

UI/UX

/10

Maintainability

/10

Scalability

/10

Documentation

/10

Testing

/10

Overall Score

/100

Explain every score.

---

# Final Principle

Review the project as if it will be deployed tomorrow for a company with thousands of employees.

Your responsibility is to identify every issue before production deployment.

Do not overlook small issues.

Focus on long-term maintainability, enterprise standards, security, business correctness, and product quality.

Only recommend changes that genuinely improve the product.