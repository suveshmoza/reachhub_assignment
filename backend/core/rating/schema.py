from pydantic import BaseModel
from datetime import datetime

class TopPlayersSchema(BaseModel):
    id:str
    username:str
    rating:int

class PlayerHistorySchema(BaseModel):

    username:str
    date:datetime
    rating:int