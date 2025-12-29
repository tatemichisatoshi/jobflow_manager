import asyncio
import logging

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db(db: AsyncSession) -> None:
    # Check if admin exists
    result = await db.execute(select(User).filter(User.email == "admin@example.com"))
    user = result.scalars().first()
    if not user:
        user = User(
            email="admin@example.com",
            username="admin",
            hashed_password=get_password_hash("admin"),
            is_superuser=True,
            is_active=True,
        )
        db.add(user)
        await db.commit()
        logger.info("Admin user created")
    else:
        logger.info("Admin user already exists")

async def main() -> None:
    logger.info("Creating initial data")
    async with SessionLocal() as db:
        await init_db(db)
    logger.info("Initial data created")

if __name__ == "__main__":
    asyncio.run(main())
