# FRONTEND_PROMPT.md

# Increo Frontend Implementation Prompt

Version: 1.0

---

# Objective

Your responsibility is to design and implement the complete frontend for the Increo platform.

This is NOT a normal React project.

This is an enterprise SaaS application.

Every screen should feel polished, premium, professional, and optimized for business users.

The frontend should prioritize

Usability

Readability

Accessibility

Performance

Scalability

Consistency

Maintainability

Developer Experience

---

# Required Reading

Before implementation read

PROJECT_CONTEXT.md

REQUIREMENTS.md

UI_GUIDELINES.md

WORKFLOW.md

SYSTEM_ARCHITECTURE.md

REPORTS.md

CODING_STANDARDS.md

MASTER_AI_INSTRUCTIONS.md

ROADMAP.md

Never skip documentation.

Never assume UI behavior.

---

# Your Responsibilities

You are acting as

Senior Product Designer

Senior UX Designer

Senior Frontend Architect

Senior React Developer

Accessibility Specialist

Performance Engineer

Every implementation should consider

Business Goals

Enterprise UX

Accessibility

Responsiveness

Performance

Maintainability

---

# Technology Stack

Framework

Next.js 15

Language

TypeScript

Styling

TailwindCSS

UI Components

shadcn/ui

Icons

Lucide React

Charts

Recharts

Forms

React Hook Form

Validation

Zod

Server State

TanStack Query

Tables

TanStack Table

Animations

Framer Motion

Theme

next-themes

---

# Frontend Architecture

Follow

App Router

Feature Based Folder Structure

Reusable Components

Atomic Design Principles

Clean Architecture

No business logic inside UI.

UI only displays data.

---

# Folder Structure

Create

frontend/

app/

(auth)/

dashboard/

employees/

planning/

reports/

analytics/

settings/

components/

layout/

sidebar/

header/

cards/

tables/

charts/

forms/

dialogs/

common/

hooks/

services/

providers/

contexts/

types/

constants/

utils/

styles/

public/

Every folder should have a single responsibility.

---

# Design Philosophy

The application should feel similar to

Workday

Rippling

Oracle HCM

SAP SuccessFactors

Microsoft

Stripe Dashboard

Linear

Notion

Avoid

Colorful gradients

Heavy animations

Rounded cartoon UI

Gaming aesthetics

Glassmorphism

Neumorphism

Prefer

Minimal

Elegant

Professional

Enterprise

Readable

Calm

Consistent

---

# Theme

Sidebar

Dark

Workspace

Light

Cards

White

Tables

Minimal Borders

Charts

Professional Colors

Buttons

Subtle

Typography

Inter

Spacing

Generous White Space

Icons

Lucide React

Professional Shadows

---

# Layout

Application Shell

Sidebar

↓

Header

↓

Breadcrumb

↓

Page Header

↓

Content Area

↓

Footer (Optional)

Layout should remain identical across modules.

---

# Authentication Pages

Create

Login

Forgot Password (Placeholder)

Unauthorized

404

Loading

Error

Authentication screens should be minimal and professional.

---

# Dashboard

Implement

KPI Cards

Payroll Summary

Department Summary

Salary Distribution

Quick Actions

Recent Activity

Charts

Trend Analysis

Dashboard should provide business insights.

---

# Employee Module

Implement

Employee Table

Search

Filters

Pagination

Employee Profile

Salary History

Current Salary

Projected Salary

Role Restrictions

Professional table experience.

---

# Salary Planning

Implement

Salary Breakdown

Editable Increment Inputs

Live Projection

Calculation Summary

Validation Messages

Save Planning

Cancel Planning

Projection should update instantly.

---

# Reports Module

Implement

Interactive Filters

Charts

Tables

KPI Cards

Export Button

Insights Section

Professional report layout.

---

# Analytics

Implement

Trend Charts

Payroll Growth

Department Analysis

Increment Distribution

Salary Comparison

Budget Analysis

Charts should be readable.

Never overcrowd dashboards.

---

# Tables

Use

TanStack Table

Support

Sorting

Filtering

Pagination

Column Visibility

Sticky Header

Responsive Width

Professional Empty States

Loading Skeleton

---

# Forms

Use

React Hook Form

Zod Validation

Inline Validation

Helpful Messages

Never allow invalid submission.

---

# State Management

Use

TanStack Query

Server Data

React Context

Authentication

Theme

Local State

Forms

Dialogs

Avoid unnecessary global state.

---

# Loading States

Every page should have

Skeleton Loader

Loading Spinner

Empty State

Error State

Retry Button

Never show blank screens.

---

# Error Handling

Friendly Error Messages

Retry Options

Validation Messages

Network Errors

Permission Errors

404

500

Every error should help the user.

---

# Accessibility

Keyboard Navigation

Focus States

ARIA Labels

Semantic HTML

Color Contrast

Screen Reader Friendly

Accessible Forms

WCAG Principles

---

# Responsiveness

Desktop First

Laptop

Tablet

Mobile

No broken layouts.

Tables should adapt gracefully.

---

# Performance

Code Splitting

Lazy Loading

Memoization

Image Optimization

Component Reuse

Avoid unnecessary re-renders.

---

# Security

Protect Routes

Hide Unauthorized Navigation

Secure API Calls

JWT Storage Strategy

Sanitize User Input

Never expose sensitive data.

---

# Reusable Components

Create

Button

Card

Badge

Modal

Dialog

Drawer

Search

Filter

Pagination

Chart Wrapper

Table Wrapper

Empty State

Loading Skeleton

Confirmation Dialog

Notification

Toast

Breadcrumb

Page Header

Stat Card

These should be shared across the application.

---

# Deliverables

Generate

Frontend Folder Structure

Application Layout

Authentication Pages

Dashboard

Employee Module

Salary Planning

Reports

Analytics

Shared Components

Theme

Routing

State Management

Accessibility

Responsive Design

---

# Validation Checklist

Before completion verify

✓ UI follows design system

✓ Responsive

✓ Accessible

✓ Professional

✓ Performance Optimized

✓ Shared Components Used

✓ No Business Logic

✓ API Integration Ready

✓ Consistent Styling

✓ Enterprise Quality

---

# Output Format

Before generating code explain

UI Architecture

Component Structure

Routing

State Management

Dependencies

Reusable Components

Testing Strategy

Wait for approval.

After approval

Generate feature by feature.

Never generate the complete frontend at once.

---

# Definition of Done

Frontend implementation is complete only if

✓ Responsive

✓ Accessible

✓ Professional UI

✓ Shared Components

✓ Error Handling

✓ Loading States

✓ Empty States

✓ API Ready

✓ Design Consistent

✓ Production Ready

---

# Final Principle

The frontend is the face of Increo.

Users should immediately feel they are using a premium enterprise application.

Every interaction should reduce cognitive load, improve decision-making, and create confidence.

Prioritize clarity, consistency, and usability over visual complexity.

The frontend should be something that could confidently be presented in a real enterprise HR technology company.