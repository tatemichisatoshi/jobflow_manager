from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")
# CORS
origins = settings.BACKEND_CORS_ORIGINS
if not origins:
    origins = ["http://localhost:3000", "http://localhost:8000"]

print(f"DEBUG: Active CORS Origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Jobflow Manager API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

from app.api.api_v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

from fastapi.staticfiles import StaticFiles
import os

static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")
