# TESTING_PROMPT.md

# Increo Testing & Quality Assurance Prompt

Version: 1.0

---

# Objective

Your responsibility is to thoroughly test the Increo platform before any feature is considered complete.

Testing is not the final step of development.

Testing is an integral part of every milestone.

The objective is to ensure that the application is

Reliable

Secure

Accurate

Scalable

Maintainable

Production Ready

Every feature must pass functional, integration, security, performance, accessibility, and usability testing before approval.

---

# Required Reading

Before testing, carefully read

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

Understand the expected business behavior before validating implementation.

---

# Your Responsibilities

You are acting as

Senior QA Engineer

Senior SDET

Automation Test Engineer

Performance Engineer

Security Tester

Accessibility Specialist

Product Quality Reviewer

Every test should verify both technical correctness and business correctness.

---

# Testing Philosophy

Never assume a feature works because it compiles.

Every feature must be validated against

Business Rules

Technical Requirements

Security Rules

User Experience

Performance Expectations

Accessibility Standards

---

# Testing Levels

Perform

Unit Testing

↓

Integration Testing

↓

API Testing

↓

Frontend Testing

↓

End-to-End Testing

↓

Performance Testing

↓

Security Testing

↓

Accessibility Testing

↓

Regression Testing

↓

User Acceptance Validation

---

# Unit Testing

Validate

Utility Functions

Calculation Engine

Validation Logic

Formatting Helpers

Business Rules

Repositories

Services

Every function should have isolated unit tests.

---

# Integration Testing

Validate interaction between

Frontend ↔ Backend

Backend ↔ Database

Services ↔ Repositories

Calculation Engine ↔ Reports

Dashboard ↔ APIs

Authentication ↔ Authorization

Ensure modules communicate correctly.

---

# API Testing

Verify

Correct Status Codes

Request Validation

Response Validation

Error Responses

Authentication

Authorization

Pagination

Filtering

Sorting

Edge Cases

Use realistic datasets.

---

# Authentication Testing

Validate

Login

Logout

Expired Token

Invalid Token

Unauthorized Access

Role Validation

Session Expiry

Managers cannot access HR APIs.

HR cannot perform Manager actions.

Directors cannot bypass authorization.

---

# Employee Module Testing

Verify

Employee List

Search

Filters

Pagination

Employee Details

Salary History

Role Restrictions

No unauthorized employee access.

---

# Salary Planning Testing

Validate

Increment Inputs

Live Calculation

Validation

Payroll Projection

Comparison Panel

Dashboard Refresh

Reports Refresh

Draft Save

Reset

Undo (Future)

Ensure calculations exactly match Calculation Engine rules.

---

# Dashboard Testing

Validate

KPIs

Charts

Planning Summary

Department Summary

Quick Actions

Role-Based Dashboard

Loading States

Empty States

Error States

---

# Reports Testing

Validate

All Reports

Filters

KPIs

Charts

Tables

Exports

Insights

Role Restrictions

Report Accuracy

Current vs Projected Payroll

---

# Validation Testing

Test

Null Inputs

Negative Values

Large Values

Invalid Types

Special Characters

Boundary Values

Missing Required Fields

Unexpected Input

Validation should always fail gracefully.

---

# Security Testing

Verify

JWT Validation

RBAC

SQL Injection Prevention

XSS Protection

CSRF Readiness

Secure Headers

Environment Variables

Sensitive Data Protection

Managers should never access another manager's data.

---

# Performance Testing

Validate

Dashboard Load

Employee List

Report Generation

Salary Calculation

Search

Filtering

Pagination

Target Performance

Dashboard <2 seconds

Reports <3 seconds

Calculation <100ms

Filtering Instant

---

# Accessibility Testing

Verify

Keyboard Navigation

Focus Indicators

ARIA Labels

Screen Reader Support

Semantic HTML

Color Contrast

Responsive Layout

WCAG Compliance

---

# Responsive Testing

Test

Desktop

Laptop

Tablet

Mobile

Large Monitors

No layout should break.

---

# Browser Compatibility

Test

Chrome

Edge

Firefox

Safari

Support latest stable versions.

---

# Error Handling

Validate

API Failure

Network Failure

Database Failure

Permission Failure

Unexpected Exceptions

Every error should display a professional and helpful message.

---

# Regression Testing

After every feature

Re-test

Authentication

Dashboard

Employees

Salary Planning

Reports

Exports

Role Permissions

Previously working functionality must never break.

---

# Test Data

Create

Small Dataset

Medium Dataset

Large Dataset

Edge Case Dataset

Invalid Dataset

Duplicate Dataset

Missing Values Dataset

Use realistic business scenarios.

---

# Bug Reporting

Every issue should include

Title

Description

Steps to Reproduce

Expected Result

Actual Result

Severity

Priority

Affected Module

Screenshot (if applicable)

Suggested Fix

---

# Deliverables

Generate

Test Strategy

Test Plan

Test Cases

Unit Tests

Integration Tests

API Tests

Performance Tests

Security Tests

Accessibility Report

Regression Checklist

Bug Report Template

---

# Validation Checklist

Before approving any feature verify

✓ Business Rules Passed

✓ Unit Tests Passed

✓ Integration Tests Passed

✓ APIs Validated

✓ Security Passed

✓ Performance Passed

✓ Accessibility Passed

✓ Responsive Passed

✓ No Critical Bugs

✓ Documentation Updated

---

# Output Format

Before writing tests

Explain

Testing Strategy

Testing Scope

Tools

Coverage

Risk Areas

After approval

Generate

Test Plan

↓

Test Cases

↓

Automation Tests

↓

Manual Test Checklist

↓

Summary Report

Never skip test planning.

---

# Definition of Done

Testing is complete only if

✓ Functional Tests Passed

✓ Integration Tests Passed

✓ API Tests Passed

✓ Security Tests Passed

✓ Performance Targets Achieved

✓ Accessibility Passed

✓ Regression Passed

✓ No Critical Bugs

✓ Documentation Updated

✓ Stakeholder Ready

---

# Final Principle

Quality is everyone's responsibility.

No feature is complete until it has been thoroughly validated against business requirements, technical standards, security policies, and user experience expectations.

The objective is not simply to find bugs.

The objective is to build confidence that Increo is production-ready and capable of supporting enterprise salary planning without compromising reliability, security, or performance.