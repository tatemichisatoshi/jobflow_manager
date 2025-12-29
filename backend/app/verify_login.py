import asyncio
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.user import User
from app.core import security

async def main():
    async with SessionLocal() as db:
        result = await db.execute(select(User).filter(User.username == "admin"))
        user = result.scalars().first()
        if user:
            print(f"User found: ID={user.id}, Username={user.username}, Email={user.email}")
            print(f"Hashed Password: {user.hashed_password}")
            
            try:
                is_valid = security.verify_password("admin", user.hashed_password)
                print(f"Password verification result for 'admin': {is_valid}")
            except Exception as e:
                print(f"Error during verification: {e}")
        else:
            print("User 'admin' NOT FOUND in database.")

if __name__ == "__main__":
    asyncio.run(main())
