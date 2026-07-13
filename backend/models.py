from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database import Base


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String, nullable=False)

    summary = Column(Text, nullable=False)

    word_count = Column(Integer)

    character_count = Column(Integer)

    page_count = Column(Integer)

    created_at = Column(DateTime, default=datetime.utcnow)