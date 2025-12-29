import pytest
from typing import AsyncGenerator
from httpx import AsyncClient
from app.main import app
from app.db.session import SessionLocal, engine
from app.core.config import settings

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture
async def db() -> AsyncGenerator:
    async with SessionLocal() as session:
        yield session

@pytest.fixture
async def client() -> AsyncGenerator:
    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c
