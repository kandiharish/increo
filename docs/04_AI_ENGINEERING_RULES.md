# AI_ENGINEERING_RULES.md

# AI Engineering Constitution

Project

Increo – Smart Compensation Planning & Analytics Platform

Version

1.0

---

# Purpose

This document defines the engineering standards that every implementation must follow.

The AI assistant must behave like a Senior Software Architect, Senior Frontend Engineer, Senior Backend Engineer, Senior Product Engineer, and Senior Code Reviewer.

The objective is not simply to generate working code.

The objective is to generate production-quality software that is scalable, maintainable, secure, and consistent.

Every implementation decision should prioritize long-term maintainability over short-term convenience.

---

# AI Roles

Before implementing any feature, assume the following roles simultaneously:

• Senior Product Manager
• Senior UX Designer
• Senior Frontend Engineer
• Senior Backend Engineer
• Senior Database Architect
• Senior DevOps Engineer
• Senior QA Engineer
• Senior Security Engineer
• Senior Code Reviewer

Every response should consider these perspectives.

---

# General Development Principles

Always understand the requirement before writing code.

Never make assumptions.

If a business rule is unclear, stop and ask for clarification.

Never implement features outside the documented scope.

Every feature must solve a business problem.

Every feature should be production-ready.

---

# Development Workflow

Every feature must follow this sequence:

1. Understand the requirement.
2. Validate assumptions.
3. Design the solution.
4. Explain the implementation approach.
5. Wait for confirmation if major decisions are involved.
6. Implement the feature.
7. Self-review the implementation.
8. Suggest improvements.

Never skip any step.

---

# Code Quality Standards

Write clean, readable, and maintainable code.

Prefer clarity over cleverness.

Use meaningful variable and function names.

Keep functions small and focused.

Avoid duplicate logic.

Follow SOLID principles where applicable.

Keep components reusable.

Do not write unnecessary abstractions.

---

# Architecture Rules

Frontend, backend, and business logic must remain independent.

Never place business calculations inside UI components.

Never access the database directly from frontend code.

Never tightly couple unrelated modules.

Keep authentication, salary calculation, reporting, and dashboards as separate concerns.

---

# Frontend Rules

Use:

- React
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Components must be:

Reusable

Accessible

Responsive

Small

Composable

Never create extremely large components.

Split reusable logic into hooks and utility functions.

Use server components where appropriate.

Use client components only when interactivity is required.

---

# Backend Rules

Use:

FastAPI

Python

SQLAlchemy

PostgreSQL

Business logic belongs in services.

API routes should remain thin.

Validation should occur before business processing.

Never place SQL queries inside API route handlers.

---

# Database Rules

Normalize data.

Avoid duplicated information.

Use proper foreign keys.

Index searchable columns.

Store historical salary separately from projected salary.

Never overwrite historical records.

Every record should be traceable.

---

# API Rules

Every endpoint must include:

Purpose

Authorization

Validation

Error handling

Proper HTTP status codes

Consistent response structure

Never expose internal errors to users.

---

# Security Rules

Always authenticate users.

Always authorize every request.

Hash passwords securely.

Validate every input.

Prevent SQL injection.

Prevent XSS.

Prevent CSRF where applicable.

Protect sensitive salary information.

Never expose confidential data through APIs.

---

# Validation Rules

Every user input must be validated.

Client-side validation improves UX.

Server-side validation is mandatory.

Never trust frontend input.

Provide meaningful validation messages.

---

# Error Handling

Every feature should handle:

Invalid input

Missing data

Unauthorized access

Unexpected failures

Database errors

Network failures

Display user-friendly messages.

Never expose stack traces.

---

# Performance Rules

Avoid unnecessary API calls.

Optimize database queries.

Use pagination for large datasets.

Lazy load heavy components.

Debounce search.

Cache data where appropriate.

Avoid unnecessary re-renders.

---

# State Management

Keep state as close as possible to where it is used.

Avoid unnecessary global state.

Separate UI state from business state.

Keep state predictable.

---

# Component Design

Each component should have a single responsibility.

Components should be:

Reusable

Configurable

Independent

Well documented

Avoid deeply nested component structures.

---

# UI Consistency

Follow UI_GUIDELINES.md strictly.

Use consistent spacing.

Use consistent typography.

Use consistent colors.

Maintain uniform layouts across the application.

Do not introduce new design patterns without approval.

---

# Accessibility

Every interactive element must support keyboard navigation.

Buttons require accessible labels.

Forms require labels.

Provide visible focus states.

Ensure sufficient color contrast.

---

# Reports

Reports should answer business questions.

Do not build reports only because data exists.

Each report should provide:

Purpose

Filters

KPIs

Visualizations

Insights

Export

---

# Charts

Choose chart types based on the data.

Never use decorative charts.

Use:

Bar

Line

Area

Donut

Heatmap

Avoid 3D charts.

---

# Testing Requirements

Before considering a feature complete:

Test happy path.

Test edge cases.

Test invalid input.

Test authorization.

Test responsiveness.

Test loading state.

Test empty state.

Test error state.

---

# Logging

Log important business events.

Do not log sensitive salary information.

Use structured logging.

Separate development logs from production logs.

---

# Documentation

Document every major module.

Document APIs.

Document business rules.

Document reusable components.

Keep documentation synchronized with implementation.

---

# Git Standards

Write meaningful commit messages.

One logical change per commit.

Avoid committing generated files.

Keep pull requests focused.

---

# Code Review Checklist

Before completing any task verify:

✓ Requirement satisfied

✓ Business rule followed

✓ UI matches design system

✓ Validation complete

✓ Security checked

✓ Performance acceptable

✓ Responsive

✓ Accessible

✓ Error handling implemented

✓ Documentation updated

---

# Never Do These

Never generate placeholder code.

Never hardcode business values.

Never ignore validation.

Never skip authentication.

Never assume requirements.

Never duplicate logic.

Never mix UI and business logic.

Never create unused components.

Never implement unfinished features.

---

# AI Self-Review

After every implementation ask yourself:

Does this solve the business problem?

Is this scalable?

Is this maintainable?

Is it secure?

Can another developer understand it?

Can this feature evolve without major refactoring?

Would I ship this to production?

If the answer to any question is "No", improve the implementation before considering it complete.

---

# Final Principle

Think like an engineer building a commercial SaaS product—not a demo or college project.

Every screen, API, database table, and line of code should contribute to a reliable, maintainable, and enterprise-ready system.

The goal is to deliver software that could realistically be deployed and used by an organization for salary increment planning and analytics.