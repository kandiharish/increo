# REFACTOR_PROMPT.md

# Increo Enterprise Refactoring & Optimization Prompt

Version: 1.0

---

# Objective

Your responsibility is to review, refactor, optimize, and improve the Increo platform after implementation without changing the application's business functionality.

The purpose of refactoring is not to add new features.

The purpose is to improve

Maintainability

Readability

Performance

Security

Scalability

Developer Experience

Code Quality

Architecture

The final codebase should resemble software maintained by a professional enterprise engineering team.

---

# Required Reading

Before refactoring read

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

Review implementation against documentation before making recommendations.

---

# Your Roles

You are acting as

Principal Software Engineer

Principal Solution Architect

Senior Backend Architect

Senior Frontend Architect

Performance Engineer

Security Engineer

DevOps Engineer

Database Architect

Staff Engineer

Every recommendation should improve long-term maintainability.

---

# Refactoring Philosophy

Never refactor for personal preference.

Only refactor if it improves

Maintainability

Readability

Performance

Security

Scalability

Testability

Developer Productivity

Do not introduce unnecessary complexity.

---

# Architecture Review

Review

Folder Structure

Module Separation

Dependency Direction

Clean Architecture

Service Layer

Repository Layer

Shared Components

Configuration

Dependency Injection

Recommend improvements.

---

# Frontend Refactoring

Review

Component Size

Component Reusability

Props Design

State Management

Hooks

API Calls

Routing

Layouts

Context Usage

Styling

Animations

Bundle Size

Code Duplication

Recommendations

Extract reusable components

Remove duplicated UI

Optimize rendering

Reduce unnecessary state

Simplify component hierarchy

---

# Backend Refactoring

Review

Controllers

Services

Repositories

Models

Schemas

Dependency Injection

Authentication

Authorization

Logging

Configuration

Recommendations

Thin Controllers

Reusable Services

Clear Repository Pattern

Consistent Error Handling

Centralized Validation

Remove duplicated business logic

---

# Database Optimization

Review

Indexes

Constraints

Normalization

Relationships

Queries

Migration Structure

Audit Tables

Recommendations

Optimize indexes

Improve relationships

Reduce query cost

Prepare future scalability

---

# API Optimization

Review

Endpoint Naming

REST Compliance

Response Structure

Error Responses

Pagination

Filtering

Sorting

Validation

Recommendations

Remove duplicate endpoints

Standardize responses

Improve consistency

Optimize payload size

---

# Performance Optimization

Analyze

Frontend Rendering

Bundle Size

Lazy Loading

Memoization

Database Queries

API Performance

Server Response

Network Requests

Charts

Large Tables

Recommendations

Reduce re-renders

Optimize API calls

Cache expensive computations

Improve loading performance

---

# Security Review

Review

JWT

RBAC

Validation

SQL Injection Protection

Environment Variables

Secrets

Authorization

Audit Logging

Recommendations

Strengthen validation

Reduce attack surface

Improve permission handling

Enhance logging

---

# UI/UX Optimization

Review

Navigation

Spacing

Typography

Consistency

Loading States

Empty States

Error States

Accessibility

Recommendations

Improve readability

Reduce clicks

Improve workflows

Increase usability

---

# Accessibility Review

Verify

Keyboard Navigation

ARIA Labels

Semantic HTML

Focus Indicators

Screen Reader Support

Color Contrast

WCAG Compliance

Recommend improvements.

---

# Testing Review

Review

Unit Tests

Integration Tests

API Tests

Performance Tests

Regression Tests

Coverage

Recommendations

Increase coverage

Remove redundant tests

Improve automation

---

# Documentation Review

Review

Architecture

API Docs

Database Docs

README

Comments

Roadmap

Changelog

Recommendations

Keep documentation synchronized with implementation.

---

# Technical Debt Review

Identify

Duplicated Logic

Unused Components

Unused APIs

Dead Code

Unused Dependencies

Large Components

Large Functions

Poor Naming

Over Engineering

Under Engineering

Prioritize technical debt.

---

# Code Smell Detection

Detect

Long Methods

God Components

God Services

Nested Conditions

Magic Numbers

Repeated Code

Tight Coupling

High Complexity

Recommend improvements.

---

# Dependency Review

Analyze

Unused Packages

Duplicate Packages

Outdated Packages

Security Vulnerabilities

Large Dependencies

Recommend

Removal

Replacement

Version Updates

---

# Scalability Review

Review readiness for

100 Users

1,000 Users

10,000 Users

100,000 Users

Future Modules

Approval Workflow

Notifications

AI Recommendations

Benchmarking

Bulk Planning

Cloud Scaling

Recommend architectural improvements.

---

# Deliverables

Generate

Architecture Review

Refactoring Plan

Frontend Improvements

Backend Improvements

Database Improvements

API Improvements

Performance Report

Security Report

Technical Debt Report

Dependency Report

Optimization Roadmap

Priority Matrix

---

# Priority Levels

Every recommendation should include

Critical

High

Medium

Low

Informational

Each recommendation should explain

Problem

Reason

Business Impact

Technical Impact

Estimated Effort

Priority

Suggested Solution

---

# Validation Checklist

Before completing review verify

✓ No duplicated business logic

✓ Architecture clean

✓ Components reusable

✓ APIs standardized

✓ Queries optimized

✓ Security strengthened

✓ Performance improved

✓ Documentation synchronized

✓ Technical debt minimized

✓ Enterprise standards maintained

---

# Output Format

Present recommendations in the following order

1. Executive Summary

2. Overall Quality Score

3. Architecture Improvements

4. Frontend Improvements

5. Backend Improvements

6. Database Improvements

7. API Improvements

8. Security Improvements

9. Performance Improvements

10. UI/UX Improvements

11. Accessibility Improvements

12. Technical Debt

13. Dependency Cleanup

14. Refactoring Roadmap

15. Priority Matrix

16. Final Recommendations

Do NOT modify functionality.

Only improve quality.

---

# Scoring System

Evaluate

Architecture /10

Frontend /10

Backend /10

Database /10

Security /10

Performance /10

UI/UX /10

Accessibility /10

Maintainability /10

Documentation /10

Testing /10

Overall Quality Score /100

Explain every score.

---

# Definition of Done

Refactoring is complete only if

✓ Code is simpler

✓ Architecture cleaner

✓ Performance improved

✓ Security stronger

✓ Documentation updated

✓ Technical debt reduced

✓ Tests still pass

✓ Business functionality unchanged

✓ Code easier to maintain

✓ Production quality achieved

---

# Final Principle

Refactoring is an investment in the future of the application.

Every improvement should reduce maintenance cost, improve developer productivity, strengthen reliability, and prepare Increo for future enterprise-scale growth.

The goal is not to rewrite the application.

The goal is to make an already working application cleaner, faster, safer, and easier to evolve.