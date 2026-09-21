# API Documentation: AI-Driven Project Management Platform

Interactive Swagger documentation is available at `http://localhost:8000/docs` when the backend is active.

All endpoints under `/api/v1` except `/auth/login` and `/auth/register` require a standard HTTP Authorization header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
Authenticates a user and issues a signed JWT access token.

**Request Body:**
```json
{
  "email": "pm@aipmp.io",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "email": "pm@aipmp.io",
    "full_name": "Marcus Sterling",
    "role": "PROJECT_MANAGER",
    "department": "Product Management",
    "is_active": true,
    "created_at": "2026-09-21T07:47:58.375253Z"
  }
}
```

---

## 2. Project Management Endpoints

### `POST /api/v1/projects/`
Creates a new project. Requires `ADMIN` or `PROJECT_MANAGER` role.

**Request Body:**
```json
{
  "name": "Autonomous Drone Navigation Stack",
  "description": "Vision-based obstacle avoidance and SLAM localization.",
  "status": "IN_PROGRESS",
  "start_date": "2026-08-01",
  "deadline": "2026-10-30",
  "budget": 85000.0,
  "member_ids": [4, 5]
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Autonomous Drone Navigation Stack",
  "description": "Vision-based obstacle avoidance and SLAM localization.",
  "status": "IN_PROGRESS",
  "health_score": 100.0,
  "predicted_delay_days": 0.0,
  "delay_risk_level": "LOW",
  "start_date": "2026-08-01",
  "deadline": "2026-10-30",
  "budget": 85000.0,
  "created_by_id": 2,
  "archived": false,
  "created_at": "2026-09-21T07:47:58.375253Z",
  "updated_at": "2026-09-21T07:47:58.375253Z"
}
```

---

## 3. Daily Progress & Standup Endpoints

### `POST /api/v1/updates/`
Submits a daily standup log and automatically synchronizes task progress and blockers.

**Request Body:**
```json
{
  "task_id": 2,
  "yesterday_work": "Profiled CUDA memory allocations with Nsight Compute.",
  "today_plan": "Investigate buffer leak in frame descriptors before Jetson execution.",
  "blockers": "Blocked by Jetpack 6.0 driver crash when batch size > 8.",
  "progress_percentage": 45,
  "hours_spent": 8.0
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "task_id": 2,
  "user_id": 4,
  "yesterday_work": "Profiled CUDA memory allocations with Nsight Compute.",
  "today_plan": "Investigate buffer leak in frame descriptors before Jetson execution.",
  "blockers": "Blocked by Jetpack 6.0 driver crash when batch size > 8.",
  "progress_percentage": 45,
  "hours_spent": 8.0,
  "created_at": "2026-09-21T07:48:00.000000Z"
}
```

---

## 4. AI Inference & Copilot Endpoints

### `POST /api/v1/ai/predict-delay`
Runs real-time machine learning inference using the pre-trained XGBoost / Random Forest pipeline.

**Request Body:**
```json
{
  "task_count": 60,
  "completed_tasks": 20,
  "pending_tasks": 40,
  "team_size": 6,
  "average_completion_time": 18.0,
  "resource_allocation": 1.66,
  "historical_delays": 2.0,
  "blocker_count": 2
}
```

**Response (200 OK):**
```json
{
  "predicted_delay_days": 8.4,
  "risk_level": "HIGH",
  "health_score": 60.6,
  "engine": "ML_MODEL",
  "confidence_interval": "+/- 1.2 days",
  "risk_factors": [
    "2 active blockers impeding velocity.",
    "Engineers overloaded at 1.66x capacity index."
  ]
}
```

### `POST /api/v1/ai/chat`
Conversational project copilot grounded in live workspace telemetry.

**Request Body:**
```json
{
  "project_id": 1,
  "prompt": "Why is the project delayed and what can we do?",
  "chat_history": []
}
```

**Response (200 OK):**
```json
{
  "response": "📊 Schedule & Delay Analysis:\nBased on current burndown velocity and task completion ratios in Autonomous Drone Navigation Stack:\n- Critical path task #2 (SLAM Edge Feature Extractor) is blocked by Jetpack CUDA driver memory leaks.\n- Delay forecast is currently +4.5 days.\n\nRecommended Interventions:\n1. Reassign Sarah Jenkins to pair-debug the CUDA buffer allocations with Alex Chen.\n2. Pin frame descriptors into zero-copy host memory to bypass the Jetpack memory crash.",
  "suggested_actions": [
    "View At-Risk Tasks",
    "Trigger Sprint Rebalancing",
    "Send Notification to Team Lead"
  ],
  "referenced_tasks": [2]
}
```

---

## 5. Report Generation & Exports

### `POST /api/v1/reports/generate`
Compiles an executive progress audit and generates both `.pdf` and `.xlsx` artifacts.

**Request Body:**
```json
{
  "project_id": 1,
  "report_type": "WEEKLY",
  "custom_notes": "Edge hardware testing is scheduled for next Monday."
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "project_id": 1,
  "generated_by_id": 2,
  "report_type": "WEEKLY",
  "title": "Weekly Progress & AI Health Audit - Autonomous Drone Navigation Stack",
  "summary": "AI Executive Status Summary for Autonomous Drone Navigation Stack...",
  "recommendations": "1. Focus developer resources on clearing active blockers...",
  "metrics_json": {
    "total_tasks": 4,
    "completed_tasks": 1,
    "blocked_tasks": 1,
    "completion_percentage": 25.0,
    "health_score": 72.5,
    "predicted_delay_days": 4.5,
    "risk_level": "MEDIUM"
  },
  "pdf_url": "/api/v1/reports/download/pdf/report_proj_1_weekly_20260921_131528.pdf",
  "excel_url": "/api/v1/reports/download/excel/report_proj_1_weekly_20260921_131528.xlsx",
  "created_at": "2026-09-21T07:48:15.000000Z"
}
```
