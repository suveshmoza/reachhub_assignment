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
    Apply Alembic migrations to set up the database:
    ```
    alembic upgrade head
    ```
6. Running the Application
    Ensure you have PostgreSQL running. You can also use a containarized PostgreSQL db using docker. Run the FastAPI application:
    ```
    python app.py
    ```
7. Once everything is set-up and running, we have to run some scripts that extracts data from Lichess API and store it inside our PostgreSQL
   For this there are some python scripts inside the scripts folder. But before running them you will have to configure the db params for each script and also create a Lichess API token for the scripts to retrieve data. After, this navigate to this repository and run these files in the following order:
   ```
   1. setup_db.py -> this creates a player table which has player username,id and classical rating of that user
   2. setup_top50 -> this creates a top_players  table which contains top 50 players from the classical category based on their rating
   3. setup_history.py -> this creates a player_history table which contains the rating for last 30 days for each user
   ```
  `setup_history.py` will take a lot of time to process the data of top 500 users, so it currently processes the top 50 classical player data
   but you can uncomment the line 111 and comment the line 112 of the setup_history.py file, then it will fetch history of all the users.

# Endpoints

1. `/top-players`: Retrieves a list of the top 50 classical chess players.
2. `/player/{username}/rating-history`: Retrieves the 30-day rating history for a specified player.
3. `/players/rating-history-csv`: Generates and provides a CSV file with the rating history for the top 50 players.

*All of the above routes require user authentication*
# Optimizations that can be made to improve performance 
  1. We can use caching mechanisms to store frequently accessed data temporarily. For example, caching the response of the /top-players endpoint can reduce the load on the server, because the top-players list is      updated after every 24 hours.
  2. Optimize database queries by selecting only the necessary columns and rows.
  3. We can also use pagination that can reduce the size of payload.
  4. Implement rate limiting to prevent abuse and ensure fair usage of API.

Visit http://localhost:8080/docs for the Swagger documentation.
