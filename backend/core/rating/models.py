from sqlalchemy import Column, String, Integer,DateTime
from database import Base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

class TopPlayers(Base):
    __tablename__ = "top_players"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, index=True)
    rating = Column(Integer)

class PlayerHistory(Base):
    __tablename__="player_history"

    username = Column(String, primary_key=True, index=True)
    date = Column(DateTime, primary_key=True, default=datetime.utcnow)
    rating = Column(Integer)