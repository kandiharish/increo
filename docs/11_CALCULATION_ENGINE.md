# CALCULATION_ENGINE.md

# Increo Salary Calculation Engine

Version: 1.0

---

# Purpose

This document defines the complete salary calculation engine used throughout the Increo platform.

The calculation engine is responsible for converting current employee compensation into projected compensation after increment planning.

This document acts as the single source of truth for every salary calculation performed in the application.

No frontend component, backend API, or report should implement its own salary calculation logic.

Every salary calculation must use the rules defined in this document.

---

# Business Objective

The objective of the calculation engine is to allow managers to simulate salary increments while maintaining consistency, transparency, and accuracy across the organization.

Managers should only decide the increment percentages.

The system is responsible for every mathematical calculation.

---

# Core Principles

The calculation engine must be

Accurate

Deterministic

Reusable

Maintainable

Auditable

Scalable

Consistent

Every calculation should produce identical results regardless of where it is executed.

Dashboard

Employee Profile

Reports

Export

Analytics

must always produce identical values.

---

# Planning Philosophy

Managers should never edit salary values directly.

Managers only decide

Fixed Increment %

Variable Increment %

Retention Bonus Increment %

Everything else must be calculated automatically.

---

# Editable Fields

Managers can edit ONLY

increment_pct_fixed

increment_pct_variable

increment_pct_retention

These are the only user-controlled inputs.

Everything else is calculated.

---

# Read Only Fields

Managers cannot modify

Employee Details

Current Salary

Current CTC

Salary History

Mediclaim

Gratuity

Projected Salary

CTC

Designation

Department

Manager

---

# Salary Components

Current Salary Structure

Fixed Pay

Variable Pay

Mediclaim

Gratuity

Retention Bonus

Current CTC

Future Salary Structure

Projected Fixed Pay

Projected Variable Pay

Mediclaim

Gratuity

Projected Retention Bonus

Projected CTC

---

# Calculation Workflow

Load Current Salary

↓

Validate Increment Percentages

↓

Calculate Fixed Pay

↓

Calculate Variable Pay

↓

Calculate Retention Bonus

↓

Keep Mediclaim Constant

↓

Keep Gratuity Constant

↓

Generate Future Salary

↓

Generate Future CTC

↓

Refresh Dashboard

↓

Refresh Reports

↓

Ready to Save

---

# Calculation Order

The engine must always execute calculations in the following order.

Step 1

Validate Inputs

↓

Step 2

Calculate Fixed Pay

↓

Step 3

Calculate Variable Pay

↓

Step 4

Calculate Retention Bonus

↓

Step 5

Apply Constant Components

↓

Step 6

Generate Projected Salary

↓

Step 7

Generate Projected CTC

↓

Step 8

Validate Final Output

↓

Step 9

Persist Data

---

# Validation Rules

Before any calculation

Verify

Employee exists

Current salary exists

Increment values are present

Increment values are numeric

Increment values are within company policy

No negative increments

No invalid salary values

If validation fails

No calculation should occur.

---

# Fixed Pay Formula

Current Fixed Pay

×

(1 + Fixed Increment %)

=

Projected Fixed Pay

Example

Current Fixed Pay

₹8,00,000

Increment

10%

Projected Fixed Pay

₹8,80,000

---

# Variable Pay Formula

Current Variable Pay

×

(1 + Variable Increment %)

=

Projected Variable Pay

Example

Current Variable Pay

₹1,20,000

Increment

8%

Projected Variable Pay

₹1,29,600

---

# Retention Bonus Formula

Current Retention Bonus

×

(1 + Retention Increment %)

=

Projected Retention Bonus

Example

Current Retention Bonus

₹50,000

Increment

5%

Projected Retention Bonus

₹52,500

---

# Mediclaim Rule

Mediclaim is NOT influenced by increment planning.

Projected Mediclaim

=

Current Mediclaim

Business Reason

Mediclaim is a company policy benefit.

Managers cannot modify it.

---

# Gratuity Rule

Gratuity remains unchanged.

Projected Gratuity

=

Current Gratuity

Business Reason

Gratuity depends on statutory policies rather than annual increment planning.

---

# Projected Salary Formula

Projected Salary

=

Projected Fixed Pay

+

Projected Variable Pay

+

Mediclaim

+

Gratuity

+

Projected Retention Bonus

This becomes the projected CTC.

---

# Calculation Example

Current Salary

Fixed Pay

₹8,00,000

Variable Pay

₹1,20,000

Mediclaim

₹25,000

Gratuity

₹40,000

Retention Bonus

₹50,000

Increment

Fixed

10%

Variable

8%

Retention

5%

Result

Projected Fixed

₹8,80,000

Projected Variable

₹1,29,600

Mediclaim

₹25,000

Gratuity

₹40,000

Retention Bonus

₹52,500

Projected CTC

₹11,27,100

---

# Business Rules

Managers cannot edit calculated values.

Every calculation is automatic.

Reports always use calculated values.

Dashboard always reflects latest calculations.

Future salary never overwrites historical salary.

Historical salary remains immutable.

---

# Recalculation Triggers

Recalculate whenever

Increment percentage changes

Employee salary changes

Dataset imported again

Salary correction performed

Financial year changes

---

# Edge Cases

Increment = 0%

No salary change

Very High Increment

Validate against company policy

Negative Increment

Reject

Missing Salary Component

Reject calculation

Null Values

Reject calculation

Duplicate Planning

Update existing draft

---

# Rounding Rules

All currency values

Round to nearest rupee.

Percentages

Maintain two decimal precision.

Reports

Always display formatted currency.

---

# Error Handling

If validation fails

Return validation error.

Do not save partial calculations.

Do not update reports.

Do not refresh dashboard.

---

# Performance

Single employee calculation

<100ms

Batch calculation

Support 10,000 employees

Reports

Use calculated values instead of recalculating repeatedly.

---

# Security

Only Managers

Can initiate calculations.

HR

View Only.

Director

View Only.

Calculation APIs must always validate authorization.

---

# Audit

Every calculation should record

Employee ID

Manager ID

Timestamp

Old Increment

New Increment

Old CTC

New CTC

This enables future audit capability.

---

# Future Enhancements

AI Increment Recommendation

Market Salary Benchmarking

Department Budget Simulation

Scenario Planning

"What If" Analysis

Compensation Prediction

Approval Workflow

---

# AI Instructions

Before implementing any salary logic

Read this document completely.

Never create your own formulas.

Never duplicate calculations.

Never perform salary calculations inside UI components.

All calculations belong inside the Calculation Engine service.

Dashboard

Reports

Exports

Employee Profile

must always consume calculation results instead of recalculating.

---

# Definition of Done

The Calculation Engine is complete only if

✓ Validation implemented

✓ Business rules followed

✓ Formulas implemented

✓ Edge cases handled

✓ Authorization enforced

✓ Audit supported

✓ Reports use calculated values

✓ Dashboard updates automatically

✓ Performance requirements met

✓ Unit tests written

---

# Final Principle

The Calculation Engine is the heart of Increo.

Every salary figure displayed anywhere in the application must originate from this engine.

There must be only one implementation of salary calculations throughout the system.

Any future changes to salary policy should require updating only this engine, ensuring consistency across the entire application.