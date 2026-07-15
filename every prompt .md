The Vercel production build is failing due to strict TypeScript compilation errors.

Please fix ONLY the build errors without changing any application logic or UI.

Current errors:

1.
src/features/dashboard/DashboardPage.tsx
TS6133:
'AlertCircle' is declared but its value is never read.

Remove the unused AlertCircle import if it is not referenced anywhere.

2.
src/features/planning/PlanningPage.tsx
TS6133:
'useMemo' is declared but its value is never read.

Remove the unused useMemo import if it is not referenced anywhere.

Requirements:
- Do not modify business logic.
- Do not modify UI.
- Do not modify calculations.
- Do not modify API calls.
- Only remove unused imports or unused variables causing TS6133 errors.
- After fixing, ensure `npm run build` completes successfully with zero TypeScript errors.