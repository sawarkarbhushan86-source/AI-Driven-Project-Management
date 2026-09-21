# Installation & Operations Guide

This guide covers local developer setup (without Docker), production container orchestration (with Docker Compose), and cloud deployment.

---

## 1. System Requirements
- **Python**: Version 3.11 or higher
- **Node.js**: Version 18 or 20 LTS (with npm)
- **Database**: PostgreSQL 15+ (or built-in SQLite for local sandbox)
- **RAM**: Minimum 4 GB (8 GB recommended for ML training)
- **Disk**: 2 GB free space

---

## 2. Local Setup (Zero-Docker Developer Mode)

### Step 1: Clone Repository & Enter Directory
```bash
cd "AI-Driven Project Management and Progress Monitoring Platform"
```

### Step 2: Set Up Python Virtual Environment
```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install Backend Dependencies
```bash
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### Step 4: Initialize Database & Seed Records
```bash
python backend/app/db/init_db.py
```
*Creates all 11 database tables and injects seed accounts, tasks, standups, and projects.*

### Step 5: Train Machine Learning Delay Model
```bash
python ml_models/train_delay_model.py
python ml_models/evaluate_model.py
```
*Trains both Random Forest and XGBoost algorithms, verifies $R^2 \ge 0.95$, and outputs serialized artifacts into `ml_models/artifacts/`.*

### Step 6: Start FastAPI Backend Server
```bash
python backend/run.py
```
*Backend runs on `http://localhost:8000` with Swagger UI at `http://localhost:8000/docs`.*

### Step 7: Start React Frontend Dev Server
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 3. Production Docker Compose Setup

Run the entire multi-service stack with a single command:
```bash
docker compose up --build -d
```

### Container Endpoints:
- **Web Dashboard**: `http://localhost:3000`
- **FastAPI Backend**: `http://localhost:8000`
- **PostgreSQL Database**: `localhost:5432` (Username: `postgres`, Password: `postgrespassword`)

To view container logs:
```bash
docker compose logs -f backend
```

To stop the stack:
```bash
docker compose down -v
```

---

## 4. Environment Variables (`.env`)

Create a `.env` file in the root or `backend/` directory:
```ini
# Application Secrets
SECRET_KEY=production-secure-jwt-signing-key-ai-pmp-2026
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database Configuration (Defaults to local SQLite if omitted)
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/ai_pmp

# Optional: Google Gemini API Key for Generative AI Copilot
GEMINI_API_KEY=your-gemini-api-key-here

# Server Port
PORT=8000
HOST=0.0.0.0
```
*(Note: If `GEMINI_API_KEY` is omitted, the platform automatically utilizes its built-in heuristic reasoning engine so all chat, risk mitigation, and reporting features work 100% offline out-of-the-box).*
