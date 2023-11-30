from pydantic import BaseModel,constr

class UserCreate(BaseModel):
    username:constr(min_length=3, max_length=50)
    email:str
    password:constr(min_length=4)

class UserLogin(BaseModel):
    username:str
    password:constr(min_length=4)

class Token(BaseModel):
    access_token:str
    token_type:str