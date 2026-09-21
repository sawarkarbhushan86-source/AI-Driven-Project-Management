# Platform Workflow Sequences

This document illustrates the operational lifecycles for daily standups, AI delay predictions, and evaluator oversight.

---

## 1. Daily Developer Standup & Progress Synchronization Flow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant UI as React Frontend
    participant API as FastAPI Backend
    participant AI as AI Monitoring Engine
    participant DB as Relational Database
    actor PM as Project Manager

    Dev->>UI: Submit Daily Standup (Yesterday, Today, Blockers, %)
    UI->>API: POST /api/v1/updates/
    API->>DB: Insert task_update record
    API->>DB: Update task.progress_percentage & actual_hours
    
    alt Blocker Reported
        API->>DB: Set task.status = 'BLOCKED' & task.is_at_risk = true
        API->>DB: Insert Notification for PM
        API-->>PM: Dispatch Real-time Blocker Alert
    end

    API->>AI: Trigger Project Health & Delay Evaluation
    AI->>DB: Query Task Counts, Completion %, Velocity
    AI->>AI: Execute XGBoost Prediction Pipeline
    AI->>DB: Update project.health_score & predicted_delay_days
    API-->>UI: Return updated Task and Health state
```

---

## 2. Real-Time Teacher / Client Oversight Flow

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Teacher / Client Evaluator
    participant UI as React Frontend
    participant API as FastAPI Backend
    participant DB as Relational Database

    Teacher->>UI: Open Executive Dashboard
    UI->>API: GET /api/v1/dashboard/teacher/overview
    API->>DB: Aggregate all student projects with health scores
    API-->>UI: Return Multi-Project KPI Matrix
    Teacher->>UI: Select At-Risk Project
    UI->>API: GET /api/v1/projects/{id}
    API-->>UI: Return Gantt Timeline & Risk Mitigations
    Teacher->>UI: Click "Generate Status Audit"
    UI->>API: POST /api/v1/reports/generate
    API-->>UI: Provide Downloadable PDF & Excel Files
```

---

## 3. GenAI Copilot Interaction Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Project Manager / Lead
    participant UI as AI Copilot Interface
    participant API as AI Service
    participant Gemini as Google Gemini 2.5 API
    participant DB as Project Database

    User->>UI: "Why is the Autonomous Drone Stack delayed?"
    UI->>API: POST /api/v1/ai/chat
    API->>DB: Fetch project metrics, blocked tasks, recent standup notes
    API->>Gemini: Generate prompt with live grounded context
    Gemini-->>API: Stream diagnostic analysis & suggested interventions
    API-->>UI: Render markdown response + action buttons
    User->>UI: Click "⚡ Rebalance Sprint Workload"
    UI->>API: Trigger recommended workflow
```
