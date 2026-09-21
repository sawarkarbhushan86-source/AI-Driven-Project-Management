from datetime import date, timedelta

def test_list_tasks(client, dev_token):
    res = client.get(
        "/api/v1/tasks/",
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 200
    tasks = res.json()
    assert len(tasks) >= 1
    assert "priority" in tasks[0]

def test_create_task_and_status_update(client, pm_token):
    today = date.today()
    task_payload = {
        "project_id": 1,
        "title": "Automate Canary Deployment Verification",
        "description": "Evaluate error rates after traffic routing shift.",
        "assigned_to_id": 4,
        "priority": "HIGH",
        "status": "TODO",
        "estimated_hours": 16.0,
        "deadline": str(today + timedelta(days=5))
    }
    res = client.post(
        "/api/v1/tasks/",
        json=task_payload,
        headers={"Authorization": f"Bearer {pm_token}"}
    )
    assert res.status_code == 201
    task = res.json()
    task_id = task["id"]

    # Update status to IN_PROGRESS
    status_res = client.patch(
        f"/api/v1/tasks/{task_id}/status",
        json={"status": "IN_PROGRESS"},
        headers={"Authorization": f"Bearer {pm_token}"}
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "IN_PROGRESS"

def test_daily_standup_update_sync(client, dev_token):
    # Submit update for task 1
    update_payload = {
        "task_id": 1,
        "yesterday_work": "Finished mock data generators and test suites.",
        "today_plan": "Integration testing on staging server.",
        "blockers": "None",
        "progress_percentage": 90,
        "hours_spent": 5.0
    }
    res = client.post(
        "/api/v1/updates/",
        json=update_payload,
        headers={"Authorization": f"Bearer {dev_token}"}
    )
    assert res.status_code == 201
    data = res.json()
    assert data["progress_percentage"] == 90
