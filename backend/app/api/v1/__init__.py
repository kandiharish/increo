from fastapi import APIRouter
from app.api.v1 import health, auth, employees, planning, dashboard, reports, analytics, departments

api_router = APIRouter()

# Register sub-routers
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(employees.router)
api_router.include_router(planning.router)
api_router.include_router(dashboard.router)
api_router.include_router(reports.router)
api_router.include_router(analytics.router)
api_router.include_router(departments.router)
