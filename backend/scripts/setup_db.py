
import psycopg2
from psycopg2 import sql
import berserk

API_TOKEN = "LICHESS_API_TOKEN"

db_params = {
    'dbname': 'DB_NAME',
    'user': 'postgres',
    'password': 'admin',
    'host': 'localhost',
    'port': '5432'
}

session = berserk.TokenSession(API_TOKEN)
client = berserk.Client(session=session)


def store_data_in_postgres(data):
    try:
        connection = psycopg2.connect(**db_params)
        cursor = connection.cursor()

        create_table_query = """
        CREATE TABLE IF NOT EXISTS players (
            id VARCHAR PRIMARY KEY,
            username VARCHAR,
            rating INTEGER
        );
        """
        cursor.execute(create_table_query)

        for user_data in data:
            insert_query = sql.SQL("""
            INSERT INTO players (id,username,rating)
            VALUES (%s,%s,%s);
            """)
            cursor.execute(insert_query, (
                user_data['id'],
                user_data['username'],
                user_data['perfs']['classical']['rating'],
            ))

        connection.commit()
        print("Data successfully stored in Postgresql")
    except Exception as e:
        print("Error storing data")
    finally:
        if connection:
            cursor.close()
            connection.close()


lichess_data = client.users.get_leaderboard("classical", 500)
if lichess_data:
    store_data_in_postgres(lichess_data)
