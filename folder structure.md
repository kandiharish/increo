## Project Workspace Organization

You have access to my current project workspace.

My project already contains documentation files and may contain folders that are not organized according to the desired architecture.

Your task is NOT to generate application code.

Your task is to reorganize the project into the structure below while preserving all existing content.

Rules:

- Do NOT delete any existing files unless they are exact duplicates.
- Do NOT overwrite existing documentation.
- Move files into the correct folders.
- Rename files to follow the naming convention if necessary.
- Create any missing folders.
- Create placeholder README.md files inside empty folders if needed.
- Update internal references if file names change.
- Preserve Git history whenever possible (prefer moving/renaming over deleting and recreating).

Target structure:

increo/
├── docs/
│   ├── 01_PROJECT_CONTEXT.md
│   ├── 02_REQUIREMENTS.md
│   ├── 03_UI_GUIDELINES.md
│   ├── 04_AI_ENGINEERING_RULES.md
│   ├── 05_WORKFLOW.md
│   ├── 06_DATABASE.md
│   ├── 07_API_SPEC.md
│   ├── 08_SYSTEM_ARCHITECTURE.md
│   ├── 09_MASTER_AI_INSTRUCTIONS.md
│   ├── 10_REPORTS.md
│   ├── 11_CALCULATION_ENGINE.md
│   ├── 12_CODING_STANDARDS.md
│   ├── 13_ROADMAP.md
│   └── 14_CHANGELOG.md
│
├── prompts/
│   ├── 01_SETUP_PROMPT.md
│   ├── 02_PROJECT_STRUCTURE_PROMPT.md
│   ├── 03_DATABASE_PROMPT.md
│   ├── 04_BACKEND_PROMPT.md
│   ├── 05_FRONTEND_PROMPT.md
│   ├── 06_AUTH_PROMPT.md
│   ├── 07_DASHBOARD_PROMPT.md
│   ├── 08_EMPLOYEE_PROMPT.md
│   ├── 09_SALARY_ENGINE_PROMPT.md
│   ├── 10_REPORTS_PROMPT.md
│   ├── 11_TESTING_PROMPT.md
│   ├── 12_REVIEW_PROMPT.md
│   ├── 13_DEPLOYMENT_PROMPT.md
│   └── 14_REFACTOR_PROMPT.md
│
├── frontend/
├── backend/
├── database/
├── assets/
├── README.md

After organizing:

1. Show me the final directory tree.
2. List every file that was moved.
3. List every file that was renamed.
4. List every new folder created.
5. Report any duplicate or unused files.
6. Do not generate any application code yet.