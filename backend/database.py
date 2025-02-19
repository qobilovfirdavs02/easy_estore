from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# DATABASE_URL muhit o‘zgaruvchisini olish
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ecom_user:eshop_ps@db:5432/ecom_db")

# SQLAlchemy engine yaratish
engine = create_engine(DATABASE_URL)

# Sessiyalarni boshqarish uchun sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ORM modellari uchun asosiy sinf
Base = declarative_base()

# DB sessiyasini olish uchun funksiya
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()