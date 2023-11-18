
import psycopg2
from psycopg2 import sql
import requests
from datetime import datetime, timedelta


db_params = {
    'dbname': 'DB_NAME',
    'user': 'postgres',
    'password': 'admin',
    'host': 'localhost',
    'port': '5432'
}

lichess_api_url = "https://lichess.org/api/user"
lichess_api_token = "LICHESS_API_TOKEN"

def fetch_player_history(username):
    headers = {'Authorization': f'Bearer {lichess_api_token}'}
    response = requests.get(f"{lichess_api_url}/{username}/rating-history")

    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Error fetching player history from Lichess API: {response.status_code}")
        return None
    
def fetch_player_history(username):
    headers = {'Authorization': f'Bearer {lichess_api_token}'}
    response = requests.get(f"{lichess_api_url}/{username}/rating-history")

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching player history from Lichess API: {response.status_code}")
        return None

# Function to create player_history table if not exists
def create_player_history_table():
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        # Create a table if it doesn't exist
        create_table_query = """
        CREATE TABLE IF NOT EXISTS player_history (
            username VARCHAR,
            date DATE,
            rating INTEGER,
            PRIMARY KEY (username, date)
        );
        """
        cursor.execute(create_table_query)

        connection.commit()
        print("Table player_history successfully created")
    except Exception as e:
        print(f"Error creating table player_history: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

# Function to insert player rating history into the player_history table
def insert_player_history(username, history_data):
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        # Extract classical rating information
        classical_points = [
            entry['points'] for entry in history_data
            if entry['name'] == 'Classical'
        ]

        # Get today's date and the date 30 days ago
        today = datetime.utcnow().date()
        thirty_days_ago = today - timedelta(days=30)

        # Insert data into the table for the relevant dates
        for point in classical_points[0]:
            date = datetime(point[0], point[1]+1, point[2]).date()
            
            if thirty_days_ago <= date <= today:
                rating = point[3] if point[3] is not None else None
                insert_query = sql.SQL("""
                INSERT INTO player_history (username, date, rating)
                VALUES (%s, %s, %s)
                ON CONFLICT (username, date) DO NOTHING;
                """)
                cursor.execute(insert_query, (username, date, rating))

        connection.commit()
        print(f"Data for {username} successfully inserted into player_history")
    except Exception as e:
        print(f"Error inserting data for {username}: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    create_player_history_table()

    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        # Assume you have a 'player' table with columns 'id' and 'username'
        # cursor.execute("SELECT username FROM players")
        cursor.execute("SELECT username FROM top_players")
        player_usernames = [row[0] for row in cursor.fetchall()]

        for username in player_usernames:
            history_data = fetch_player_history(username)

            if history_data:
                insert_player_history(username, history_data)
            else:
                print(f"Skipping {username} due to API error")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()