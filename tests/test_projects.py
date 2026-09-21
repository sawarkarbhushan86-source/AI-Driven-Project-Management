from datetime import date, timedelta

def test_list_projects(client, dev_token):
    res = client.get(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 200
    projects = res.json()
    assert len(projects) >= 1
    assert "health_score" in projects[0]

def test_create_project_as_pm(client, pm_token):
    today = date.today()
    payload = {
        "name": "Cloud Native Observability Suite",
        "description": "Distributed tracing and telemetry platform.",
        "status": "IN_PROGRESS",
        "start_date": str(today),
        "deadline": str(today + timedelta(days=60)),
        "budget": 75000.0,
        "member_ids": [4, 5]
    }
    res = client.post(
        "/api/v1/projects/",
        json=payload,
        headers={"Authorization": f"Bearer {pm_token}"}
    )
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Cloud Native Observability Suite"
    assert data["health_score"] == 100.0

def test_get_project_detail(client, dev_token):
    res = client.get(
        "/api/v1/projects/1",
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == 1
    assert "total_tasks" in data
    assert "progress_percentage" in data
