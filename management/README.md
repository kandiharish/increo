# Increo – Smart Compensation Planning & Analytics Platform

Increo is an enterprise web application designed to simplify and digitize the employee salary increment planning process. 

It is designed as a Decision Support System (DSS) to replace spreadsheet-based appraisal planning, allowing managers, HR representatives, and directors to securely review compensation histories, execute automated projections, and analyze organizational payroll impact through interactive dashboards and custom reports.

## Key Features
- **Role-Based Access Control:** Distinct workflows for Managers (team planning), HR (organization-wide reporting), and Directors (executive analytics).
- **Automated Calculations:** Immediate projections for Fixed Pay, Variable Pay, and Retention Bonuses based on customizable increment percentages.
- **Reporting Engine:** Dynamic reports including department/designation analyses, budget consumption, distribution curves, and manager summaries.
- **Modern UI Theme:** A clean, professional, SAP/Stripe-like dashboard style that prioritizes readability and whitespace.

## Directory Structure

```text
increo/
├── docs/                             # Project specifications & reference manuals
│   ├── 01_PROJECT_CONTEXT.md          # Business goals, stakeholders, and scoping
│   ├── 02_REQUIREMENTS.md             # Functional and non-functional requirements
│   ├── 03_UI_GUIDELINES.md            # Themes, styles, typography, and UX guidelines
│   ├── 04_AI_ENGINEERING_RULES.md     # Development standards and constitution
│   ├── 05_WORKFLOW.md                 # Business process diagram and navigation flows
│   ├── 06_DATABASE.md                 # Entity Relationship Diagrams and schema designs
│   ├── 07_API_SPEC.md                 # REST API endpoints, schemas, and specs
│   ├── 08_SYSTEM_ARCHITECTURE.md      # Clean architecture layers & deployment layout
│   ├── 09_MASTER_AI_INSTRUCTIONS.md   # System engineering team roles and operations manual
│   └── 13_ROADMAP.md                  # Future updates, phases, and release milestones
│
├── prompts/                          # Initialization prompts for LLMs/AI developers
│   └── 01_SETUP_PROMPT.md             # Project initialization instruction prompt
│
├── frontend/                         # Next.js, React, TailwindCSS & TypeScript frontend client
├── backend/                          # FastAPI, SQLAlchemy, & PostgreSQL backend service
├── database/                         # Relational schemas, seed scripts, & Alembic migrations
├── assets/                           # Static assets, logos, styles, and other media
└── README.md                         # Main repository entry point (this file)
```

## Technical Stack
- **Frontend:** React, Next.js, TypeScript, TailwindCSS, shadcn/ui, Recharts
- **Backend:** FastAPI, Python, JWT Authentication
- **Database:** PostgreSQL, SQLAlchemy (ORM)
