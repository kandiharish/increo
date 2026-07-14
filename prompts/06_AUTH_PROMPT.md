# AUTH_PROMPT.md

# Increo Authentication & Authorization Implementation Prompt

Version: 1.0

---

# Objective

Your responsibility is to design and implement a secure, scalable, and enterprise-grade authentication and authorization system for the Increo platform.

Authentication should not only verify user identity but also enforce strict role-based access control (RBAC) throughout the application.

The system must ensure that every authenticated user only accesses data and functionality permitted by their role.

This authentication module is the foundation of the entire application.

---

# Required Reading

Before implementation, carefully read

PROJECT_CONTEXT.md

REQUIREMENTS.md

WORKFLOW.md

DATABASE.md

API_SPEC.md

SYSTEM_ARCHITECTURE.md

CODING_STANDARDS.md

MASTER_AI_INSTRUCTIONS.md

ROADMAP.md

Never assume authentication behavior.

Never skip security considerations.

---

# Roles

You are acting as

Senior Security Engineer

Senior Backend Engineer

Senior Frontend Engineer

Identity & Access Management Architect

Enterprise Software Architect

Every decision should prioritize

Security

Scalability

Maintainability

Performance

Developer Experience

Enterprise Standards

---

# Authentication Objectives

The system should

Authenticate users securely

Issue JWT tokens

Maintain user sessions

Protect application routes

Validate permissions

Restrict unauthorized access

Support future enterprise authentication mechanisms

---

# User Roles

The application currently supports

Manager

HR

Director

Future roles should be easily added without redesign.

---

# Role Responsibilities

Manager

Access only employees assigned to them

Plan salary increments

View team reports

View dashboard

Cannot access other managers' employees

Cannot modify employee details

Cannot modify salary components

Only increment percentages

---

HR

Access all employees

View reports

Generate exports

Analyze payroll

Cannot edit increment planning

---

Director

Access organization-wide dashboards

Executive reports

Payroll analytics

Strategic decision-making

Read-only access

---

# Authentication Flow

User opens application

↓

Login page

↓

Enter credentials

↓

Validate credentials

↓

Generate JWT

↓

Fetch user profile

↓

Determine role

↓

Load permissions

↓

Redirect to dashboard

↓

Authorize every request

↓

Logout

---

# Authorization Flow

Request

↓

Validate JWT

↓

Identify user

↓

Identify role

↓

Check permission

↓

Check employee scope

↓

Allow or deny request

Every request must pass through authorization.

---

# JWT Requirements

JWT should contain

User ID

Role

Permissions

Issued At

Expiration

JWT must never contain sensitive salary information.

---

# Password Security

Passwords must

Be hashed

Never stored in plain text

Never logged

Never returned through APIs

Support future password policies.

---

# Login Module

Implement

Login form

Validation

Authentication API

JWT storage

Redirect

Error handling

Remember session

---

# Logout Module

Implement

Logout

Clear JWT

Clear user state

Redirect to login

Invalidate session (future-ready)

---

# Protected Routes

Protect

Dashboard

Employees

Salary Planning

Reports

Analytics

Settings

Only authenticated users should access protected routes.

---

# Permission Matrix

Manager

Dashboard

Employees

Salary Planning

Reports

Analytics

Settings

Limited by assigned employees

---

HR

Dashboard

Employees

Reports

Analytics

Organization-wide

Read-only

---

Director

Dashboard

Reports

Analytics

Executive Insights

Organization-wide

Read-only

---

# Unauthorized Access

If a user attempts unauthorized access

Return

403 Forbidden

Display professional error page

Log security event

Do not expose sensitive information.

---

# Frontend Responsibilities

Create

Login Screen

Session Provider

Protected Routes

Role-based Navigation

Unauthorized Screen

Session Expiry Handling

Logout Confirmation

Loading Screen

---

# Backend Responsibilities

Create

Authentication APIs

JWT Service

Password Hashing

Permission Middleware

Role Middleware

Authorization Dependencies

User Repository

Authentication Service

Session Validation

---

# Security Principles

Use JWT

Use HTTPS

Validate every request

Use environment variables

Never expose secrets

Never trust client-side validation

Implement parameterized queries

Prevent brute force attacks (future-ready)

---

# Session Management

Support

Persistent login

Session timeout

Manual logout

Automatic logout on token expiry

Future refresh token implementation

---

# Error Handling

Handle

Invalid credentials

Expired token

Invalid token

Unauthorized access

Missing token

Session expired

Network failure

Provide user-friendly messages.

---

# Logging

Log

Successful login

Failed login

Logout

Unauthorized access

Permission violations

Do not log

Passwords

JWT

Sensitive employee information

---

# Testing

Generate

Authentication tests

Authorization tests

Protected route tests

JWT validation tests

Role permission tests

Session expiry tests

Edge case tests

---

# Deliverables

Generate

Authentication Architecture

JWT Strategy

Permission Model

Login Module

Logout Module

Protected Routes

Authorization Middleware

Session Management

Error Handling

Security Strategy

Testing Strategy

---

# Validation Checklist

Before completion verify

✓ Secure JWT implementation

✓ Password hashing

✓ Protected routes

✓ RBAC implemented

✓ Session management

✓ Error handling

✓ Logging

✓ Testing

✓ Enterprise-ready security

---

# Output Format

Before generating code explain

Authentication Architecture

Authorization Strategy

JWT Flow

Role Flow

Dependencies

Security Considerations

Testing Strategy

Wait for approval.

After approval

Implement module by module.

Never generate the complete authentication system at once.

---

# Definition of Done

Authentication is complete only if

✓ Login works

✓ Logout works

✓ JWT validated

✓ Roles enforced

✓ Protected routes implemented

✓ Unauthorized access blocked

✓ Sessions managed

✓ Security validated

✓ Tests passing

✓ Documentation updated

---

# Final Principle

Authentication is the security gateway of Increo.

Every request must verify identity.

Every action must verify permissions.

Every user must only access information they are explicitly authorized to view.

The authentication system should be secure, scalable, maintainable, and ready for future enterprise identity providers such as Azure AD, Google Workspace, or SSO without major architectural changes.