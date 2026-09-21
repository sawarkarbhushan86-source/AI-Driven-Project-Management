-- ============================================================================
-- AI-Driven Project Management & Progress Monitoring Platform
-- PostgreSQL Database Schema (Production-Ready)
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean-up if needed (for fresh setup)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS team_performance CASCADE;
DROP TABLE IF EXISTS project_risks CASCADE;
DROP TABLE IF EXISTS task_updates CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'TEAM_LEAD', 'DEVELOPER', 'CLIENT_TEACHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_type AS ENUM ('SCHEDULE', 'RESOURCE', 'TECHNICAL', 'BUDGET', 'EXTERNAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_type AS ENUM ('WEEKLY', 'MONTHLY', 'SPRINT', 'AI_SUMMARY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('EMAIL', 'DUE_DATE', 'RISK', 'UPDATE', 'SYSTEM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'DEVELOPER',
    avatar_url VARCHAR(500),
    department VARCHAR(100) DEFAULT 'Engineering',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    health_score NUMERIC(5, 2) DEFAULT 100.00 CHECK (health_score >= 0 AND health_score <= 100),
    predicted_delay_days NUMERIC(5, 2) DEFAULT 0.00,
    delay_risk_level VARCHAR(50) DEFAULT 'LOW',
    start_date DATE NOT NULL,
    deadline DATE NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 0.00,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by_id);
CREATE INDEX idx_projects_deadline ON projects(deadline);

-- ----------------------------------------------------------------------------
-- 3. PROJECT MEMBERS (ManyToMany)
-- ----------------------------------------------------------------------------
CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_project VARCHAR(50) DEFAULT 'MEMBER',
    allocated_hours_per_week INTEGER DEFAULT 40,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_proj ON project_members(project_id);

-- ----------------------------------------------------------------------------
-- 4. TASKS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    description TEXT,
    assigned_to_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'TODO',
    estimated_hours NUMERIC(6, 2) DEFAULT 8.00,
    actual_hours NUMERIC(6, 2) DEFAULT 0.00,
    deadline DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    is_at_risk BOOLEAN DEFAULT FALSE,
    risk_reason TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- ----------------------------------------------------------------------------
-- 5. TASK UPDATES TABLE (Daily Standup Progress)
-- ----------------------------------------------------------------------------
CREATE TABLE task_updates (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    yesterday_work TEXT NOT NULL,
    today_plan TEXT NOT NULL,
    blockers TEXT,
    progress_percentage INTEGER NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    hours_spent NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_updates_task ON task_updates(task_id);
CREATE INDEX idx_task_updates_user ON task_updates(user_id);
CREATE INDEX idx_task_updates_created_at ON task_updates(created_at);

-- ----------------------------------------------------------------------------
-- 6. PROJECT RISKS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE project_risks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    risk_type VARCHAR(50) NOT NULL DEFAULT 'SCHEDULE',
    severity VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    title VARCHAR(250) NOT NULL,
    description TEXT NOT NULL,
    suggested_mitigation TEXT,
    detected_by_ai BOOLEAN DEFAULT TRUE,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_risks_project ON project_risks(project_id);
CREATE INDEX idx_project_risks_severity ON project_risks(severity);

-- ----------------------------------------------------------------------------
-- 7. TEAM PERFORMANCE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE team_performance (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tasks_completed INTEGER DEFAULT 0,
    average_completion_time_hrs NUMERIC(6, 2) DEFAULT 0.00,
    productivity_score NUMERIC(5, 2) DEFAULT 85.00,
    on_time_delivery_rate NUMERIC(5, 2) DEFAULT 90.00,
    recorded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id, recorded_date)
);

CREATE INDEX idx_team_perf_user ON team_performance(user_id);
CREATE INDEX idx_team_perf_proj ON team_performance(project_id);

-- ----------------------------------------------------------------------------
-- 8. REPORTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    generated_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    report_type VARCHAR(50) NOT NULL DEFAULT 'WEEKLY',
    title VARCHAR(250) NOT NULL,
    summary TEXT NOT NULL,
    metrics_json JSONB,
    recommendations TEXT,
    pdf_filename VARCHAR(255),
    excel_filename VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_project ON reports(project_id);

-- ----------------------------------------------------------------------------
-- 9. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'UPDATE',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ----------------------------------------------------------------------------
-- 10. FILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    uploaded_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_project ON files(project_id);
CREATE INDEX idx_files_task ON files(task_id);

-- ----------------------------------------------------------------------------
-- 11. CHAT MESSAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_file_id INTEGER REFERENCES files(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_project ON chat_messages(project_id);
CREATE INDEX idx_chat_created_at ON chat_messages(created_at);
