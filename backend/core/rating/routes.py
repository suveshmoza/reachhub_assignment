from fastapi import APIRouter, Depends, Path, HTTPException
from fastapi.responses import Response, StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from dependencies import get_db, get_current_user
from datetime import datetime, timedelta
from core.user.models import User
from .models import TopPlayers, PlayerHistory
from .schema import TopPlayersSchema, PlayerHistorySchema
import pandas as pd
import io

rating_router = APIRouter()


@rating_router.get("/top_players", response_model=list[TopPlayersSchema], tags=["Rating"])
def get_top_players(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """
    Get Top Players

    Returns the top 50 players based on their ratings.

    - **db**: Database session dependency.
    - **user**: Current user dependency for authentication.

    Returns:
    - List of top players with their id, username, and rating.
    """
    top_50 = db.query(TopPlayers).order_by(
        TopPlayers.rating.desc()).limit(50).all()
    return top_50


@rating_router.get("/player/{username}/rating-history", response_model=list[PlayerHistorySchema], tags=["Rating"])
def get_player_rating_history(username: str = Path(..., description="Enter the username for which history is retrieved."), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """
    Get Player Rating History

    Returns the rating history of a specific player.

    - **username**: Path parameter for the username of the player.
    - **db**: Database session dependency.
    - **user**: Current user dependency for authentication.

    Returns:
    - List of player's rating history with username, date, and rating.
    """
    rating_history = db.query(PlayerHistory).filter(
        PlayerHistory.username == username).order_by(PlayerHistory.date).all()

    if not rating_history:
        raise HTTPException(status_code=404, detail="Username not found")

    return rating_history


# return csv file of top 50 players with each day rating
@rating_router.get("/player/rating-history-csv", tags=["Rating"])
def get_player_rating_history_csv(response: Response, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """
    Get Player Rating History CSV

    Returns a CSV file containing the rating history of the top 50 players for the last 30 days.

    - **db**: Database session dependency.
    - **user**: Current user dependency for authentication.

    Returns:
    CSV file containing the rating history of the top 50 players for the last 30 days.
    """

    top_50_usernames = db.query(TopPlayers.username).all()

    df = pd.DataFrame(columns=["Date"] +
                      [username for (username,) in top_50_usernames])

    for day in range(30):
        date = (datetime.utcnow() - timedelta(days=day)).date()
        date_str = date.strftime("%Y-%m-%d")
        ratings = {}

        for username in top_50_usernames:
            rating = (
                db.query(PlayerHistory.rating)
                .filter(PlayerHistory.username == username[0], PlayerHistory.date == date_str)
                .scalar()
            )
            ratings[username[0]] = rating

        row_data = [date_str] + [ratings.get(username, None)
                                 for (username,) in top_50_usernames]
        df.loc[day] = row_data

    csv_data = df.to_csv(index=False)
    formatted_csv_data = (
        csv_data.replace(",", " |")
        .replace("\n", " |\n")
        .replace("|", " | ")
        .replace(" ", "")
    )

    csv_bytes = formatted_csv_data.encode()

    return StreamingResponse(io.BytesIO(csv_bytes), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=rating_history.csv"})
