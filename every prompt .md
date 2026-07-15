The Vercel build is failing with the following TypeScript error:

src/features/employees/EmployeeProfilePage.tsx(248,64):
Property 'toFixed' does not exist on type 'string | number'.

Please fix this without changing application behavior.

Tasks:
1. Locate the failing line.
2. Determine whether historical_average_increment should be a number or string.
3. If the backend returns a number, update the TypeScript interfaces to use number.
4. If the value can be string, safely convert it using Number(...) before calling toFixed().
5. Ensure null values display "N/A".
6. Run TypeScript checks to confirm there are no remaining compilation errors.
7. Search the entire project for any other `.toFixed()` calls on values typed as `string | number` and fix them as well.

The project must build successfully on Vercel with zero TypeScript errors.