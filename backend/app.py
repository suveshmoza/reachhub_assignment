import uvicorn
from fastapi import FastAPI
from core.user.routes import user_router
from core.rating.routes import rating_router
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(title="ReachHub Assignment")

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router,prefix="/user")
app.include_router(rating_router)


if __name__=="__main__":
    uvicorn.run('app:app',host="0.0.0.0",port=8080,reload=True)