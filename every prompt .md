# Bug Fix: Planning Page Should Always Stay in Sync with Saved Employee Data

## Problem

The Planning page currently displays unsaved local edits after switching employees.

Example

Employee Workspace

Current Year
14.16%

Planning Page

Initially
14.16%

User changes Fixed Pay and Variable Pay to 0%

Planning Preview

0%

User switches employee.

Returns to the same employee.

Planning page still shows

0%

Employee Workspace still shows

14.16%

This creates inconsistent data across the application.

---

## Required Behaviour

The application must distinguish between

1. Saved data
2. Unsaved preview

Only the preview should change while editing.

The saved values must remain unchanged until the manager explicitly saves.

---

## Rules

### Initial Load

When an employee is selected,

always load

- current increment
- projected salary
- difference amount
- projected CTC

from the backend.

Do not initialize from stale React state.

---

### Editing

Changing

- Fixed Pay
- Variable Pay
- Retention Bonus

should only update the preview panel.

This is temporary.

Do not overwrite the saved employee data.

---

### Switching Employee

If unsaved edits exist,

show the confirmation dialog.

If the manager chooses

Discard Changes

then

1. Clear all temporary planning state.
2. Reload the selected employee from the backend.
3. Recalculate analytics from saved values.

The Planning page must exactly match the Employee Workspace.

---

### Save Draft

After Save Draft

Persist values.

Reload employee.

Employee Workspace

Planning

Dashboard

Reports

must all show identical numbers.

---

### Submit Final

After Submit Final

Persist values.

Reload employee.

Refresh all derived calculations.

Every screen must show the same values.

---

## Source of Truth

Never keep projection values only in React state.

Always reload after

- Save Draft
- Submit Final
- Employee Switch
- Refresh

using backend data.

---

## Acceptance Criteria

For every employee,

Current Year %

must always be identical across

- Employee Workspace
- Planning Page
- Reports
- Dashboard
- Backend API

Changing sliders must only affect the temporary preview.

Actual values should change only after Save Draft or Submit Final.

No stale local state should survive employee switches.