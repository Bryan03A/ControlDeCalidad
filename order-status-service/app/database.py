from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from functools import lru_cache
import os

@lru_cache  # avoid recreating engine if imported multiple times
def get_engine():
    db_url = os.getenv(
        "DB_URL",
        "postgresql://admin:admin123@postgres-db:5432/mydb"
    )
    return create_engine(db_url, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
Base = declarative_base()