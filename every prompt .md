# Enhancement Request: Improve Employee Comparison Filters Architecture

## Objective

Enhance the existing **Employee Workspace Filters** by adding intelligent sorting and comparison capabilities while maintaining good backend architecture, scalability, and clean API design.

The feature should be implemented inside the existing **Filters** drawer. Do **not** create a separate page or comparison module.

---

# 1. Backend API Design

Instead of using generic parameters like:

```
sort=highest_increment
compare_filters=[]
```

implement a more scalable API.

Example

```
GET /employees

?department=Engineering
&designation=Software Engineer
&status=Completed
&search=Harsh
&sort_by=current_year_increment
&sort_order=desc
&highlight=above_department_average
```

This makes the API cleaner, extensible, and easier to maintain.

---

# 2. Backend Architecture

Currently, computed metrics such as

- Current Year Increment
- Historical Average
- Department Average
- Projected CTC

are calculated inside the service layer after fetching employee records.

Retain this approach for now since the dataset size is small, but improve the architecture by separating responsibilities.

Create three logical steps:

### Step 1

Fetch employees using SQL filters

- Department
- Designation
- Manager
- Search
- Status

### Step 2

Calculate employee metrics

- Current Year Increment
- Historical Average
- Department Average
- Current CTC
- Projected CTC

using a reusable calculation/helper service.

Avoid mixing business calculations with sorting logic.

### Step 3

Apply

- Sorting
- Highlight Filters
- Pagination

after calculations are completed.

This keeps the code modular and allows future migration of calculations into SQL without changing API behavior.

---

# 3. Filters UI

Enhance the existing Filters drawer.

Keep the current filters.

Below them add two new sections.

---

## Sort By

Allow only one active option.

Options

• Default

• Highest Current Year Increment

• Lowest Current Year Increment

• Highest Historical Average

• Lowest Historical Average

• Highest Department Average

• Lowest Department Average

• Highest Current CTC

• Lowest Current CTC

• Highest Projected CTC

• Lowest Projected CTC

• Employee Name (A–Z)

• Employee Name (Z–A)

---

## Highlight Employees

Instead of naming this "Comparison Filters", use a more business-friendly title.

Title

Highlight Employees

Options

☐ Above Department Average

☐ Below Department Average

☐ Above Historical Average

☐ Below Historical Average

☐ Completed Planning

☐ Pending Planning

☐ Submitted

These should work as filters, not just highlights.

---

# 4. Filter Combination Support

All filters must work together.

Example

Department

Engineering

+

Status

Completed

+

Highlight

Above Department Average

+

Sort

Highest Increment

The final employee table should display only employees matching all selected conditions.

---

# 5. Search Compatibility

Search should work together with every filter.

Example

Search

Harsh

+

Department

Engineering

+

Above Department Average

Only matching employees should appear.

---

# 6. Pagination

Pagination must occur **after**

- calculations
- sorting
- filtering

so the user always receives correctly ordered data.

---

# 7. Export

CSV

Excel

PDF

must export the currently visible employee list after all filters and sorting have been applied.

---

# 8. Performance

For the current project size, performing calculations in Python before pagination is acceptable.

However, design the calculation logic as an independent reusable module so that in the future it can be migrated into SQL or materialized views without changing the frontend or API contract.

Do not tightly couple calculations with sorting logic.

---

# 9. Acceptance Criteria

✅ New comparison functionality is integrated into the existing Filters drawer.

✅ No additional comparison page is created.

✅ Backend uses clean API parameters (sort_by, sort_order, highlight).

✅ Employee calculations remain centralized in one reusable service.

✅ Sorting and highlighting work together.

✅ Department, search, status, designation, and manager filters continue to work correctly.

✅ Pagination returns correctly sorted and filtered employees.

✅ CSV, Excel, and PDF exports match the filtered employee list.

✅ Architecture is modular and scalable for future growth.