import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_last_entries(client):
    resp = client.get("/api/last-entries")
    assert resp.status_code == 200
    assert isinstance(resp.json, list)

def test_new_entry_missing_fields(client):
    resp = client.post("/api/new-entry", json={})
    assert resp.status_code == 400
    assert resp.json["status"] == "error"