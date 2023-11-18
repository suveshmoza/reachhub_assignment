from fastapi import APIRouter, Depends
from fastapi.responses import Response,StreamingResponse
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


@rating_router.get("/top_players", response_model=list[TopPlayersSchema])
def get_top_players(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    top_50 = db.query(TopPlayers).order_by(
        TopPlayers.rating.desc()).limit(50).all()
    return top_50



@rating_router.get("/player/{username}/rating-history", response_model=list[PlayerHistorySchema])
def get_player_rating_history(username: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rating_history = db.query(PlayerHistory).filter(
        PlayerHistory.username == username).order_by(PlayerHistory.date).all()
    return rating_history


# return csv file of top 50 players with each day rating
@rating_router.get("/player/rating-history-csv")
def get_player_rating_history_csv(response: Response, db: Session = Depends(get_db),user:User=Depends(get_current_user)):
    # Get the usernames from the top_50 table
    top_50_usernames = db.query(TopPlayers.username).all()

    # Create a DataFrame to store the data
    df = pd.DataFrame(columns=["Date"] + [username for (username,) in top_50_usernames])

    # Get the ratings for each username for the last 30 days
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

        row_data = [date_str] + [ratings.get(username, None) for (username,) in top_50_usernames]
        df.loc[day] = row_data

    # Save the DataFrame to a CSV file
    csv_data = df.to_csv(index=False)
    formatted_csv_data = (
        csv_data.replace(",", " |")
        .replace("\n", " |\n")
        .replace("|", " | ")
        .replace(" ", "")
    )

    # Convert the formatted CSV data to bytes for streaming response
    csv_bytes = formatted_csv_data.encode()

    # Return a streaming response with the formatted CSV data
    return StreamingResponse(io.BytesIO(csv_bytes), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=rating_history.csv"})


