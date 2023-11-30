import pytest
from fastapi.testclient import TestClient
from app import app
from faker import Faker

client = TestClient(app)
fake = Faker()


@pytest.fixture
def auth_token():
    # Create a user using the signup endpoint
    signup_data = {
        "username": fake.user_name(),
        "email": fake.email(),
        "password": "password1s"
    }
    signup_response = client.post("/user/signup", json=signup_data)
    assert signup_response.status_code == 200

    # Log in the user and obtain the JWT token
    login_data = {
        "username": signup_data["username"],
        "password": signup_data["password"]
    }
    login_response = client.post("/user/login", json=login_data)
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

    # Return the token for further testing
    return login_response.json()["access_token"]


def test_get_top_players(auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}

    # Test getting top players
    response = client.get("/top_players", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 50
    assert all(item in response.json()[0].keys()
               for item in ["id", "username", "rating"])


def test_get_player_rating_history(auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}

    # Get top players
    top_players_response = client.get("/top_players", headers=headers)
    assert top_players_response.status_code == 200
    top_player_username = top_players_response.json()[0]["username"]

    # Test getting player rating history for a top player
    response = client.get(
        f"/player/{top_player_username}/rating-history", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) >= 0


def test_get_player_rating_history_csv(auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}

    # Test getting player rating history CSV
    response = client.get("/player/rating-history-csv", headers=headers)
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "text/csv; charset=utf-8"

# Add more test cases as needed
