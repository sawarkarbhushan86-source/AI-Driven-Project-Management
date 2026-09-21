import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure root and backend directory are in sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
from app.core.database import Base, engine, SessionLocal
from app.db.init_db import init_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_database(drop_all=False)
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def admin_token(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "admin@aipmp.io",
        "password": "password123"
    })
    assert res.status_code == 200
    return res.json()["access_token"]

@pytest.fixture
def pm_token(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "pm@aipmp.io",
        "password": "password123"
    })
    assert res.status_code == 200
    return res.json()["access_token"]

@pytest.fixture
def dev_token(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "dev@aipmp.io",
        "password": "password123"
    })
    assert res.status_code == 200
    return res.json()["access_token"]
