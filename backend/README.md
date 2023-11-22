# ReachHub Assignment Backend

This repository contains the backend implementation of the Reachhub Assignment, a full-stack application designed to efficiently process and display data from the Lichess.org API, focusing on the top 500 classical chess players. The backend is built using FastAPI and PostgreSQL.

# Setup
1. Clone the repository:
   
    ```
    git clone https://github.com/suveshmoza/reachhub_assignment.git
    ```
2. Navigate to project directory:
   
    ```
    cd reachhub_assignment
    cd backend
    ```
3. Create a virtual environment and install dependencies:
  
    ```
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r app/requirements.txt
    ```
4. Setup environment variables

    At the root directory create a .env file. The env file will contain the following variables
    ```
    DB_NAME=THE NAME OF THE DB
    DB_USERNAME=USERNAME FOR DB
    DB_PASSWORD=PASSWORD FOR DB
    SECRET_KEY="SECRET KEY FOR JWT"
    ```
5. Database Migrations

    Create a new database in your PostgreSQL and use this new database in the .env file for `DB_NAME` and also for running the scripts in Step. 8.
    After that, apply Alembic migrations to set up the database:
    ```
    alembic upgrade head
    ```
7. Running the Application
    Ensure you have PostgreSQL running. You can also use a containarized PostgreSQL db using docker. Run the FastAPI application:
    ```
    python app.py
    ```
8. Once everything is set-up and running, we have to run some scripts that extracts data from Lichess API and store it inside our PostgreSQL
   For this there are some python scripts inside the scripts folder. But before running them you will have to configure the db params for each script and also create a Lichess API token for the scripts to retrieve data. After, this navigate to this repository and run these files in the following order:
   ```
   1. setup_db.py -> this creates a player table which has player username,id and classical rating of that user
   2. setup_top50 -> this creates a top_players  table which contains top 50 players from the classical category based on their rating
   3. setup_history.py -> this creates a player_history table which contains the rating for last 30 days for each user
   ```
  `setup_history.py` will take a lot of time to process the data of top 500 users, so it currently processes the top 50 classical player data
   but you can uncomment the line 111 and comment the line 112 of the setup_history.py file, then it will fetch history of all the users.

# Endpoints
| Endpoint               | Type     | Parameter | Description                                       | Response                                                                                                   |
|------------------------|----------|-----------|---------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `/top_players`         | `GET`    | None      | Retrieves the top 50 players based on their ratings. | ```[{ "id": "player1", "username": Apodex64, "rating": 2351 }, // ... (up to 50 players) ]``` |
| `/player/{username}/rating-history` | `GET` | `username` | Retrieves the rating history of a specific player. | ```[{ "username": "string", "date": "2023-11-22T11:44:27.956Z", "rating": 0 }], // ... (history entries) ]```           |
| `/player/rating-history-csv` | `GET`    | None      | Generates and returns a CSV file containing the rating history of the top 50 players for the last 30 days. | A CSV file containing the rating history of the top 50 players for the last 30 days. |

*All of the above routes require user authentication*
| Endpoint               | Type  | Parameter     | Description                                      | Response                                                                |
|------------------------|-------|---------------|--------------------------------------------------|-------------------------------------------------------------------------|
| `/signup`              | `POST`| `user_data`   | User creation data including username, email, and password. | `{"message": "User has been created"}`|                                                                    |
| `/login`               | `POST`| `user_data`   | User login data including username and password. | Token including `access_token` and `token_type`.|

# Optimizations that can be made to improve performance 
  1. We can use caching mechanisms to store frequently accessed data temporarily. For example, caching the response of the /top-players endpoint can reduce the load on the server, because the top-players list is      updated after every 24 hours.
  2. Optimize database queries by selecting only the necessary columns and rows.
  3. We can also use pagination that can reduce the size of payload.
  4. Implement rate limiting to prevent abuse and ensure fair usage of API.

Visit http://localhost:8080/docs for the Swagger documentation.
