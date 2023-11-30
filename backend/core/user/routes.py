from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from .models import User
from dependencies import get_db
from .schema import UserCreate, UserLogin, Token

user_router = APIRouter()


@user_router.post("/signup",tags=["User"])
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Sign Up - Create a new user.

    Creates a new user account with the provided username, email, and password.

    - **user_data**: UserCreate model containing username, email, and password.
    - **db**: Database session dependency.

    Returns:
    - {"message": "User has been created"} if successful.

    Raises:
    - HTTPException with status 400 if a user with the same username or email already exists.
    """
    existing_user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with the same username or email already exists",
        )

    user = User(username=user_data.username, email=user_data.email)
    user.hash_password(user_data.password)
    db.add(user)
    db.commit()
    return {"message": "User has been created"}


@user_router.post("/login",tags=["User"])
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login - Authenticate a user and generate an access token.

    Authenticates a user by checking the provided username and password.
    If successful, generates an access token for the user.

    - **user_data**: UserLogin model containing username and password.
    - **db**: Database session dependency.

    Returns:
    - Token model containing the access token and token type if authentication is successful.

    Raises:
    - HTTPException with status 401 for invalid credentials.
    """
    user = db.query(User).filter(User.username == user_data.username).first()
    if user is None or not user.verify_password(user_data.password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    token = user.generate_token()
    return Token(access_token=token, token_type='bearer')
