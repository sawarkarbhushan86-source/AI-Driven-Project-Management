# End-User Manual & Role-Based Guide

Welcome to the **AI-Driven Project Management and Progress Monitoring Platform (AI-PMP)**. This manual provides step-by-step guidance tailored to each of the 5 supported user personas.

---

## 🧭 Persona Quick Reference

| Persona | Primary Goal | Recommended Starting Screen |
| :--- | :--- | :--- |
| **Admin** | System health, governance, user administration | **Dashboard** & **Settings** |
| **Project Manager** | Planning milestones, assigning tasks, tracking budget & delay | **Projects** & **Reports** |
| **Team Lead** | Sprint backlog breakdown, unblocking developers | **Task Kanban** & **Analytics** |
| **Developer** | Executing tickets, logging daily standup progress & blockers | **Daily Standups** & **Tasks** |
| **Client / Teacher**| Evaluating milestone deliverables and observing health in real time | **Teacher Multi-Project Overview** |

---

## 1. Developer Guide: Daily Standup & Kanban Flow

### How to Log Your Daily Standup:
1. Navigate to **Daily Standups** (`/updates`) from the left sidebar.
2. Select your active ticket from the **Select Active Task** dropdown.
3. Update your **Current Progress (%)** and **Hours Logged Today**.
4. Enter:
   - **Yesterday's Work**: Specific code commits, PRs, or architecture designs completed.
   - **Today's Plan**: Immediate objectives for the day.
   - **Blockers & Impediments**: If unblocked, enter `None`. If blocked (e.g. CUDA driver crash, missing API key, pending code review), describe the impediment clearly.
5. Click **Submit Daily Standup**.
   - *The AI Monitoring Engine automatically flags the task, recalculates project health, and dispatches a notification to your Project Manager if an impediment is reported.*

### How to Transition Kanban Tasks:
1. Navigate to **Task Kanban** (`/tasks`).
2. View tasks categorized into **To Do**, **In Progress**, **In Review**, **Completed**, and **Blocked**.
3. Click the **Move &rarr;** button on any card to step it to the next sprint lane.
4. Tasks marked with an active red banner indicate AI-flagged risk factors.

---

## 2. Project Manager Guide: Creating Projects & Assigning Tasks

### Creating a New Project:
1. Navigate to **Projects & Health** (`/projects`).
2. Click **Create Project** in the upper right corner.
3. Fill in:
   - **Project Name** & **Description**
   - **Target Deadline** & **Budget**
4. Click **Create & Launch**. The project appears immediately with an initial Health Score of 100/100.

### Adding & Assigning Tasks:
1. Navigate to **Task Kanban** (`/tasks`).
2. Click **Create Task**.
3. Choose the target project, priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), target assignee, and estimated hours.
4. Save the task. The assignee will receive an immediate in-app alert.

### Generating Weekly / Monthly Reports:
1. Navigate to **Reports & Exports** (`/reports`).
2. Select your project and choose **Weekly Sprint Progress Audit** or **Monthly Executive Summary**.
3. Add any custom executive leadership notes.
4. Click **Generate & Compile Report**.
5. Once compiled, click **PDF Export** or **Excel Export** to download the deliverables.

---

## 3. Client / Teacher Guide: Real-Time Multi-Project Oversight

As a Teacher or Client evaluator, your dashboard features the **Teacher Multi-Project Oversight Table**:
1. Navigate to **Dashboard** (`/dashboard`).
2. Scroll to the **Teacher & Stakeholder Multi-Project Oversight** panel.
3. Inspect each team's:
   - **Health Score Badge** (Green: Optimal, Amber: Moderate Risk, Red: Critical Risk)
   - **Predicted Delay Days** (e.g. `+4.5d` calculated by the XGBoost model)
   - **Completion %** progress bar
   - **Active Blockers Count**
4. Click **Inspect &rarr;** next to any project to open its **Gantt Milestone Timeline**, view submitted standups, or chat with the team.

---

## 4. AI Copilot Guide: Asking Questions & Running Mitigations

1. Navigate to **AI Copilot & Risks** (`/ai-assistant`).
2. Click any of the pre-configured quick prompts:
   - *"Why is the Autonomous Drone Stack delayed?"*
   - *"Suggest corrective actions for the CUDA memory leak"*
   - *"Give me an executive summary of sprint health"*
3. The AI Copilot queries live database records, parses recent standup blockers, and provides a structured response with **action buttons** (e.g. `⚡ Rebalance Sprint Workload`).
4. Click any action button to execute the suggested intervention.

---

## 5. Analytics & Delay Simulator Sandbox Guide

1. Navigate to **Analytics & Burndown** (`/analytics`).
2. Scroll to the **AI Delay Simulation Sandbox**.
3. Adjust the sliders:
   - **Pending Tasks**: increase or decrease queued backlog items.
   - **Team Size**: simulate adding or removing engineers from the squad.
   - **Avg Task Duration**: test impact of task complexity.
   - **Active Blockers**: test the drag caused by technical blockers.
4. Click **Simulate Delay**. The trained machine learning model runs instant inference and displays the forecasted delay and resulting project health score.
