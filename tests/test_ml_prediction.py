def test_ml_delay_prediction_endpoint(client, dev_token):
    payload = {
        "task_count": 60,
        "completed_tasks": 20,
        "pending_tasks": 40,
        "team_size": 6,
        "average_completion_time": 18.0,
        "resource_allocation": 1.33,
        "historical_delays": 2.0,
        "blocker_count": 1
    }
    res = client.post(
        "/api/v1/ai/predict-delay",
        json=payload,
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "predicted_delay_days" in data
    assert "risk_level" in data
    assert data["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
    assert "health_score" in data
    assert 0 <= data["health_score"] <= 100

def test_ai_copilot_chat(client, dev_token):
    payload = {
        "project_id": 1,
        "prompt": "Why is the project delayed and what can we do?",
        "chat_history": []
    }
    res = client.post(
        "/api/v1/ai/chat",
        json=payload,
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "response" in data
    assert len(data["suggested_actions"]) >= 1

def test_dashboard_summary_metrics(client, dev_token):
    res = client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "total_projects" in data
    assert "average_health_score" in data
    assert "burndown_series" in data
    assert len(data["burndown_series"]) >= 5

def test_teacher_overview(client, dev_token):
    res = client.get(
        "/api/v1/dashboard/teacher/overview",
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "health_score" in data[0]
