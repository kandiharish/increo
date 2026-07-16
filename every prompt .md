# Fix Business Logic: Variable Pay and Retention Bonus Are Not Reflected in Compensation Breakdown

## Problem

Currently, the application allows managers to modify:

- Fixed Salary %
- Variable Pay %
- Retention Bonus %

However, only the Fixed Salary increment affects the calculations.

Example:

Input:
- Fixed Salary = 1.50%
- Variable Pay = 1.50%
- Retention Bonus = 1.00%

Current Output:

Fixed Pay
₹31,33,680 → ₹31,80,685 ✅

Variable Pay
₹0 → ₹0 ❌

Retention Bonus
₹0 → ₹0 ❌

Difference Amount
Calculated only from Fixed Pay

This creates a confusing user experience because the manager expects every editable field to influence the projected compensation.

---

# Required Behaviour

The system must implement one of the following business rules consistently.

## Case 1 (Preferred)

If Variable Pay and Retention Bonus are configurable compensation components, they must participate in the projected salary calculation.

When a manager updates:

- Fixed Salary %
- Variable Pay %
- Retention Bonus %

the following must update immediately:

- Projected Variable Pay
- Projected Retention Bonus
- Projected CTC
- Difference Amount
- Current Year Increment %
- Budget Variance
- Reports
- Dashboard
- Payroll calculations

The Compensation Breakdown should clearly display:

Current Variable Pay
↓

Projected Variable Pay

Current Retention Bonus
↓

Projected Retention Bonus

instead of remaining zero.

---

## Case 2

If an employee is NOT eligible for Variable Pay or Retention Bonus, the UI should NOT allow editing.

Instead:

- Disable the controls
- Show them as read-only
- Display an informational tooltip or badge such as

"Not applicable for this employee"

or

"Employee is not eligible for Variable Pay"

This prevents managers from entering values that have no effect.

---

# Backend Verification

Review the calculation service responsible for projected compensation.

Verify that:

Projected Variable Pay

is calculated from the configured percentage.

Verify that:

Projected Retention Bonus

is calculated from the configured percentage.

Ensure both values contribute to:

Projected CTC

Difference Amount

Current Year Increment

Budget Variance

Department Payroll

Reports

Dashboard Analytics

---

# Compensation Breakdown

Current

Current Variable Pay

₹0 → ₹0

Current Retention Bonus

₹0 → ₹0

Required

If applicable:

Variable Pay

₹50,000 → ₹57,500

Retention Bonus

₹25,000 → ₹27,500

If not applicable:

Display

Not Applicable

instead of editable inputs.

---

# Financial Impact

The Financial Impact card must include every editable compensation component.

Projected CTC should equal

Current Fixed
+ Incremented Fixed

+

Current Variable
+ Incremented Variable

+

Current Retention Bonus
+ Incremented Retention Bonus

+

Mediclaim

+

Gratuity (if business rule says fixed)

Difference Amount must equal

Projected CTC − Current CTC

Current Year Increment % must be derived from the final projected CTC.

---

# Acceptance Criteria

- Fixed Salary affects projected salary.
- Variable Pay affects projected salary.
- Retention Bonus affects projected salary.
- Compensation Breakdown reflects all updated values.
- Financial Impact updates correctly.
- Dashboard and Reports remain consistent.
- If an employee is not eligible for Variable Pay or Retention Bonus, those controls are disabled or clearly marked as "Not Applicable" instead of accepting input with no effect.

The application should never allow managers to enter editable values that do not influence the calculations without clearly explaining why.