import pytest

def test_root_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "/docs" in data["documentation"]

def test_health_endpoint(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_login_success(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "pm@aipmp.io",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "PROJECT_MANAGER"
    assert data["user"]["email"] == "pm@aipmp.io"

def test_login_invalid_password(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "pm@aipmp.io",
        "password": "wrongpassword"
    })
    assert res.status_code == 401

def test_read_current_user(client, dev_token):
    res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 200
    assert res.json()["email"] == "dev@aipmp.io"
    assert res.json()["role"] == "DEVELOPER"
