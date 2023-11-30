import pytest
from fastapi.testclient import TestClient
from faker import Faker
from app import app

fake = Faker()
client = TestClient(app)


@pytest.fixture
def new_user():
    return {
        "username": fake.user_name(),
        "email": fake.email(),
        "password": "password1s"
    }


def test_signup_success(new_user):
    response = client.post("/user/signup", json=new_user)
    assert response.status_code == 200
    assert response.json() == {"message": "User has been created"}


def test_signup_duplicate_username(new_user):
    response = client.post("/user/signup", json=new_user)
    assert response.status_code == 200

    response_duplicate = client.post("/user/signup", json=new_user)
    assert response_duplicate.status_code == 400
    assert response_duplicate.json(
    )["detail"] == "User with the same username or email already exists"


def test_signup_duplicate_email(new_user):
    response = client.post("/user/signup", json=new_user)
    assert response.status_code == 200

    new_user["username"] = fake.user_name()
    response_duplicate = client.post("/user/signup", json=new_user)
    assert response_duplicate.status_code == 400
    assert response_duplicate.json(
    )["detail"] == "User with the same username or email already exists"


def test_login_success(new_user):
    client.post("/user/signup", json=new_user)

    login_data = {
        "username": new_user["username"],
        "password": new_user["password"]
    }
    response = client.post("/user/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_invalid_credentials(new_user):
    client.post("/user/signup", json=new_user)

    login_data = {
        "username": new_user["username"],
        "password": "wrong_password"
    }
    response = client.post("/user/login", json=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid Credentials"


def test_login_nonexistent_user():
    login_data = {
        "username": "nonexistent_user",
        "password": "password123"
    }
    response = client.post("/user/login", json=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid Credentials"
