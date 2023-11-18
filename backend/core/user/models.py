from sqlalchemy import Column, String, Integer
from database import Base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime,timedelta
from config import get_settings
import uuid
import bcrypt
import jwt


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    def hash_password(self, password: str):
        self.hashed_password = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def verify_password(self,password:str):
        return bcrypt.checkpw(password.encode('utf-8'),self.hashed_password.encode('utf-8'))
    
    def generate_token(self):
        expiration=datetime.utcnow()+timedelta(hours=24)
        payload={
            "sub":str(self.id),
            "exp":expiration
        }
        return jwt.encode(payload,f'{get_settings().SECRET_KEY}',algorithm="HS256")