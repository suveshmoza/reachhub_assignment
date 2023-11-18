import psycopg2
from psycopg2 import sql

db_params = {
    'dbname': 'DB_NAME',
    'user': 'postgres',
    'password': 'admin',
    'host': 'localhost',
    'port': '5432'
}

# Function to create a new table 'top_50'
def create_top_50_table():
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        # Create a new table 'top_50'
        create_table_query = """
        CREATE TABLE IF NOT EXISTS top_players (
            id VARCHAR PRIMARY KEY,
            username VARCHAR,
            rating INTEGER
        );
        """
        cursor.execute(create_table_query)

        connection.commit()
        print("Table 'top_50' created successfully")
    except Exception as e:
        print(f"Error creating 'top_50' table: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

# Function to insert top 50 players into the 'top_50' table
def insert_top_50_players():
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        # Insert top 50 players into 'top_50' based on rating
        insert_query = """
        INSERT INTO top_players (id, username, rating)
        SELECT id, username, rating
        FROM players
        ORDER BY rating DESC
        LIMIT 50;
        """
        cursor.execute(insert_query)

        connection.commit()
        print("Top 50 players inserted into 'top_50' table successfully")
    except Exception as e:
        print(f"Error inserting top 50 players into 'top_50' table: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    create_top_50_table()
    insert_top_50_players()