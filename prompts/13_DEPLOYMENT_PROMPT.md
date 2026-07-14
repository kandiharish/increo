# DEPLOYMENT_PROMPT.md

# Increo Production Deployment Prompt

Version: 1.0

---

# Objective

Your responsibility is to prepare, validate, and deploy the Increo platform to a production-ready environment.

Deployment is not simply hosting the application.

Deployment includes

Application Build

Environment Configuration

Database Migration

Security

Monitoring

Logging

Performance

Backup

Recovery

Production Validation

The final deployment should follow enterprise SaaS deployment practices.

---

# Required Reading

Before deployment read

PROJECT_CONTEXT.md

SYSTEM_ARCHITECTURE.md

DATABASE.md

API_SPEC.md

CODING_STANDARDS.md

ROADMAP.md

CHANGELOG.md

MASTER_AI_INSTRUCTIONS.md

Never deploy without validating documentation.

---

# Your Roles

You are acting as

Senior DevOps Engineer

Cloud Architect

Site Reliability Engineer (SRE)

Infrastructure Engineer

Security Engineer

Release Manager

Every deployment decision should prioritize

Reliability

Availability

Security

Performance

Scalability

Maintainability

---

# Deployment Objectives

Prepare the application for production.

Validate production readiness.

Deploy frontend.

Deploy backend.

Deploy database.

Configure security.

Configure monitoring.

Configure backups.

Verify deployment.

---

# Technology Stack

Frontend

Next.js

Backend

FastAPI

Database

PostgreSQL

Containerization

Docker

Reverse Proxy

Nginx

Cloud Platform

Vercel (Frontend)

Railway / Render / VPS (Backend)

Neon / Supabase PostgreSQL

CI/CD

GitHub Actions

Monitoring

Sentry

Logging

Structured Logging

---

# Production Architecture

User

↓

HTTPS

↓

Frontend (Next.js)

↓

Backend API (FastAPI)

↓

PostgreSQL

↓

Monitoring

↓

Logs

↓

Backup

Every request should be secure.

---

# Environment Configuration

Create

Development Environment

Testing Environment

Staging Environment

Production Environment

Every environment should have

Independent configuration

Independent database

Independent secrets

Independent logging

---

# Environment Variables

Configure

Database URL

JWT Secret

JWT Expiry

API Base URL

Frontend URL

Allowed Origins

Environment

Log Level

Secret Keys

Never hardcode secrets.

---

# Build Validation

Verify

Dependencies

Type Checking

Linting

Formatting

Build Success

Bundle Size

Unused Packages

Broken Imports

No deployment if build fails.

---

# Database Deployment

Perform

Migration Validation

Backup Existing Database

Run Alembic Migrations

Verify Tables

Verify Constraints

Verify Indexes

Verify Seed Data

Rollback Strategy

Never modify schema manually.

---

# Backend Deployment

Deploy

FastAPI

Environment Variables

Database Connection

Authentication

Logging

API Documentation

Health Endpoint

Error Handling

Verify startup before release.

---

# Frontend Deployment

Deploy

Next.js

Environment Variables

API Integration

Responsive Layout

Authentication

Protected Routes

Static Assets

Verify production build.

---

# Security Checklist

Verify

HTTPS

JWT

RBAC

Environment Variables

SQL Injection Protection

CORS

Secure Headers

No Debug Mode

No Sensitive Logs

Dependency Vulnerabilities

---

# Performance Validation

Measure

Frontend Load Time

Backend Response Time

API Latency

Dashboard Rendering

Report Generation

Database Query Time

Bundle Size

Memory Usage

CPU Usage

Target

Dashboard <2 sec

Reports <3 sec

API <300 ms

---

# Monitoring

Configure

Application Monitoring

Error Monitoring

Performance Monitoring

Health Checks

API Monitoring

Database Monitoring

System Metrics

Future Alerting

---

# Logging

Enable

Application Logs

Authentication Logs

Error Logs

Request Logs

Performance Logs

Audit Logs

Never log

Passwords

JWT Tokens

Sensitive salary information

---

# Backup Strategy

Configure

Daily Database Backup

Weekly Full Backup

Monthly Archive

Retention Policy

Restore Procedure

Verify backups periodically.

---

# CI/CD Pipeline

Implement

Code Checkout

Install Dependencies

Run Tests

Run Linting

Build Frontend

Build Backend

Run Database Migration

Deploy

Smoke Tests

Deployment Notification

Deployment should stop if any stage fails.

---

# Smoke Testing

Verify

Login

Dashboard

Employee Module

Salary Planning

Reports

Authentication

Role Permissions

API Connectivity

Database Connectivity

Critical paths must work.

---

# Rollback Strategy

Prepare

Previous Version

Database Rollback

Application Rollback

Configuration Rollback

Rollback Documentation

Deployment should be reversible.

---

# Disaster Recovery

Document

Recovery Process

Database Restore

Application Restore

Environment Recovery

Expected Recovery Time

Recovery Point Objective (Future)

---

# Deliverables

Generate

Deployment Architecture

Docker Configuration

Production Environment Files

CI/CD Pipeline

Monitoring Configuration

Logging Strategy

Backup Strategy

Deployment Checklist

Rollback Plan

Production Validation Report

---

# Validation Checklist

Before deployment verify

✓ Build Successful

✓ Tests Passing

✓ Database Migrated

✓ Environment Variables Configured

✓ Authentication Working

✓ Reports Working

✓ Dashboard Working

✓ Performance Acceptable

✓ Security Verified

✓ Monitoring Enabled

✓ Backup Configured

---

# Output Format

Before deployment explain

Deployment Architecture

Infrastructure

Environment Strategy

Security Strategy

Monitoring Plan

Rollback Plan

Testing Plan

Wait for approval.

After approval

Generate deployment configuration step by step.

Never deploy automatically.

---

# Definition of Done

Deployment is complete only if

✓ Application Accessible

✓ APIs Functional

✓ Database Connected

✓ Authentication Working

✓ Reports Functional

✓ Dashboard Functional

✓ Monitoring Active

✓ Backups Configured

✓ Rollback Verified

✓ Production Ready

---

# Future Enhancements

Kubernetes Deployment

Auto Scaling

Redis Cache

CDN

Load Balancer

Blue-Green Deployment

Canary Deployment

Multi-region Deployment

High Availability

Infrastructure as Code (Terraform)

---

# Final Principle

Deployment is not the end of development.

Deployment is the beginning of production operations.

Every production deployment should be secure, reliable, observable, recoverable, and scalable.

The objective is to ensure that Increo can confidently support enterprise users with minimal downtime, predictable performance, and strong operational practices.