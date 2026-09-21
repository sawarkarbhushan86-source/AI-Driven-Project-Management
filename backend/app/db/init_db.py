import os
import sys
from datetime import date, datetime, timedelta, timezone

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models import (
    User,
    Project,
    ProjectMember,
    Task,
    TaskUpdate,
    ProjectRisk,
    TeamPerformance,
    Report,
    Notification,
    ChatMessage
)

def init_database(drop_all: bool = False):
    print("=" * 60)
    print("Initializing Database & Seeding Industry-Level Demo Records")
    print("=" * 60)

    if drop_all:
        print("Dropping existing tables...")
        Base.metadata.drop_all(bind=engine)

    print("Creating tables according to SQLAlchemy Declarative Schema...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if already seeded
        existing_user = db.query(User).filter(User.email == "admin@aipmp.io").first()
        if existing_user:
            print("Database already contains seed users. Skipping seed injection.")
            return

        print("Seeding Users for 5 User Roles...")
        default_pwd_hash = get_password_hash("password123")

        users = [
            User(
                id=1,
                email="admin@aipmp.io",
                hashed_password=default_pwd_hash,
                full_name="Dr. Alistair Vance",
                role="ADMIN",
                avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                department="Executive Leadership",
                is_active=True
            ),
            User(
                id=2,
                email="pm@aipmp.io",
                hashed_password=default_pwd_hash,
                full_name="Marcus Sterling",
                role="PROJECT_MANAGER",
                avatar_url="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
                department="Product Management",
                is_active=True
            ),
            User(
                id=3,
                email="lead@aipmp.io",
                hashed_password=default_pwd_hash,
                full_name="Elena Rostova",
                role="TEAM_LEAD",
                avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
                department="Architecture & AI",
                is_active=True
            ),
            User(
                id=4,
                email="dev@aipmp.io",
                hashed_password=default_pwd_hash,
                full_name="Alex Chen",
                role="DEVELOPER",
                avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                department="Core Engineering",
                is_active=True
            ),
            User(
                id=5,
                email="sarah.dev@aipmp.io",
                hashed_password=default_pwd_hash,
                full_name="Sarah Jenkins",
                role="DEVELOPER",
                avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
                department="Frontend & UX",
                is_active=True
            ),
            User(
                id=6,
                email="teacher@aipmp.io",
                hashed_password=default_pwd_hash,
                full_name="Prof. Katherine Hayes",
                role="CLIENT_TEACHER",
                avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
                department="Academic Oversight",
                is_active=True
            ),
        ]
        db.add_all(users)
        db.commit()

        print("Seeding Projects...")
        today = date.today()
        projects = [
            Project(
                id=1,
                name="Autonomous Drone Navigation Stack",
                description="Vision-based obstacle avoidance, SLAM localization, and real-time path planning pipeline for autonomous aerial robotics.",
                status="IN_PROGRESS",
                health_score=72.5,
                predicted_delay_days=4.5,
                delay_risk_level="MEDIUM",
                start_date=today - timedelta(days=30),
                deadline=today + timedelta(days=35),
                budget=85000.0,
                created_by_id=2
            ),
            Project(
                id=2,
                name="Healthcare AI Diagnostic Portal",
                description="HIPAA-compliant medical imaging inference system with automated radiology reporting and clinician triage queues.",
                status="IN_PROGRESS",
                health_score=94.0,
                predicted_delay_days=0.5,
                delay_risk_level="LOW",
                start_date=today - timedelta(days=45),
                deadline=today + timedelta(days=50),
                budget=120000.0,
                created_by_id=2
            ),
            Project(
                id=3,
                name="FinTech Real-Time Fraud Engine",
                description="Sub-millisecond graph neural network transaction risk evaluation and anti-money laundering anomaly screener.",
                status="IN_PROGRESS",
                health_score=61.0,
                predicted_delay_days=7.2,
                delay_risk_level="HIGH",
                start_date=today - timedelta(days=20),
                deadline=today + timedelta(days=25),
                budget=95000.0,
                created_by_id=2
            ),
            Project(
                id=4,
                name="Next-Gen Microservices Migration",
                description="Monolith decomposability into resilient Go/Python microservices running on auto-scaling Kubernetes.",
                status="COMPLETED",
                health_score=98.0,
                predicted_delay_days=0.0,
                delay_risk_level="LOW",
                start_date=today - timedelta(days=90),
                deadline=today - timedelta(days=10),
                budget=65000.0,
                created_by_id=1
            )
        ]
        db.add_all(projects)
        db.commit()

        print("Seeding Project Members...")
        members = [
            ProjectMember(project_id=1, user_id=2, role_in_project="PROJECT_MANAGER", allocated_hours_per_week=20),
            ProjectMember(project_id=1, user_id=3, role_in_project="TEAM_LEAD", allocated_hours_per_week=35),
            ProjectMember(project_id=1, user_id=4, role_in_project="DEVELOPER", allocated_hours_per_week=40),
            ProjectMember(project_id=1, user_id=5, role_in_project="DEVELOPER", allocated_hours_per_week=40),

            ProjectMember(project_id=2, user_id=2, role_in_project="PROJECT_MANAGER", allocated_hours_per_week=15),
            ProjectMember(project_id=2, user_id=4, role_in_project="DEVELOPER", allocated_hours_per_week=30),
            ProjectMember(project_id=2, user_id=6, role_in_project="TEACHER_OBSERVER", allocated_hours_per_week=5),

            ProjectMember(project_id=3, user_id=2, role_in_project="PROJECT_MANAGER", allocated_hours_per_week=20),
            ProjectMember(project_id=3, user_id=3, role_in_project="TEAM_LEAD", allocated_hours_per_week=30),
            ProjectMember(project_id=3, user_id=4, role_in_project="DEVELOPER", allocated_hours_per_week=40),
        ]
        db.add_all(members)
        db.commit()

        print("Seeding Tasks...")
        tasks = [
            Task(
                id=1,
                project_id=1,
                title="Sensor Calibration & LiDAR Synchronization",
                description="Implement timestamp sync between Velodyne LiDAR packets and stereo camera frames at 60Hz.",
                assigned_to_id=4,
                created_by_id=3,
                priority="HIGH",
                status="IN_PROGRESS",
                estimated_hours=24.0,
                actual_hours=18.0,
                deadline=today + timedelta(days=4),
                progress_percentage=75,
                is_at_risk=False,
                order_index=1
            ),
            Task(
                id=2,
                project_id=1,
                title="SLAM Edge Feature Extractor Optimization",
                description="Convert ORB-SLAM3 feature extraction kernel to CUDA for embedded Jetson Orin.",
                assigned_to_id=4,
                created_by_id=3,
                priority="URGENT",
                status="BLOCKED",
                estimated_hours=32.0,
                actual_hours=28.0,
                deadline=today + timedelta(days=2),
                progress_percentage=45,
                is_at_risk=True,
                risk_reason="CUDA memory leak identified on Jetpack 6.0 SDK driver.",
                order_index=2
            ),
            Task(
                id=3,
                project_id=1,
                title="Dynamic Obstacle Velocity Estimator",
                description="Extended Kalman Filter implementation for tracking moving targets and predicting trajectory.",
                assigned_to_id=5,
                created_by_id=3,
                priority="MEDIUM",
                status="TODO",
                estimated_hours=16.0,
                actual_hours=0.0,
                deadline=today + timedelta(days=12),
                progress_percentage=0,
                is_at_risk=False,
                order_index=3
            ),
            Task(
                id=4,
                project_id=1,
                title="Safety Fallback & Emergency Parachute Actuator",
                description="Hardware interlock triggers emergency parachute on telemetry signal loss.",
                assigned_to_id=3,
                created_by_id=2,
                priority="HIGH",
                status="IN_REVIEW",
                estimated_hours=12.0,
                actual_hours=12.0,
                deadline=today + timedelta(days=6),
                progress_percentage=100,
                is_at_risk=False,
                order_index=4
            ),
            Task(
                id=5,
                project_id=2,
                title="DICOM Image Ingestion & Anonymizer Pipeline",
                description="Parse and strip patient PII from DICOM headers and securely stream to encrypted cloud store.",
                assigned_to_id=4,
                created_by_id=2,
                priority="HIGH",
                status="COMPLETED",
                estimated_hours=20.0,
                actual_hours=18.5,
                deadline=today - timedelta(days=10),
                progress_percentage=100,
                is_at_risk=False,
                order_index=1
            ),
            Task(
                id=6,
                project_id=2,
                title="DenseNet Chest X-Ray Pathology Classifier",
                description="Train and validate multi-label thoracic pathology detection with 95% AUROC.",
                assigned_to_id=3,
                created_by_id=2,
                priority="URGENT",
                status="IN_PROGRESS",
                estimated_hours=40.0,
                actual_hours=32.0,
                deadline=today + timedelta(days=8),
                progress_percentage=80,
                is_at_risk=False,
                order_index=2
            ),
            Task(
                id=7,
                project_id=3,
                title="Graph Neural Network Subgraph Batcher",
                description="Optimize PyG neighbour sampler for billions of credit card transactions.",
                assigned_to_id=4,
                created_by_id=3,
                priority="URGENT",
                status="BLOCKED",
                estimated_hours=40.0,
                actual_hours=36.0,
                deadline=today + timedelta(days=1),
                progress_percentage=60,
                is_at_risk=True,
                risk_reason="GPU cluster out-of-memory errors on subgraphs with >500k edges.",
                order_index=1
            )
        ]
        db.add_all(tasks)
        db.commit()

        print("Seeding Daily Standup Updates...")
        updates = [
            TaskUpdate(
                task_id=1,
                user_id=4,
                yesterday_work="Wrote ROS2 timestamp synchronization node and unit tests for simulated sensor packets.",
                today_plan="Bench test with physical Velodyne VLP-16 sensor hardware.",
                blockers="None",
                progress_percentage=75,
                hours_spent=6.5
            ),
            TaskUpdate(
                task_id=2,
                user_id=4,
                yesterday_work="Profiled CUDA memory allocations with Nsight Compute.",
                today_plan="Investigate buffer leak in frame descriptors before Jetson execution.",
                blockers="Blocked by Jetpack 6.0 driver crash when batch size > 8.",
                progress_percentage=45,
                hours_spent=8.0
            ),
            TaskUpdate(
                task_id=6,
                user_id=3,
                yesterday_work="Fine-tuned DenseNet-121 backbone on CheXpert dataset with focal loss.",
                today_plan="Generate ROC curves and PR curves for cardiomegaly and pleural effusion.",
                blockers="None, training runs cleanly on A100 GPU.",
                progress_percentage=80,
                hours_spent=7.0
            )
        ]
        db.add_all(updates)
        db.commit()

        print("Seeding Project Risks...")
        risks = [
            ProjectRisk(
                project_id=1,
                risk_type="TECHNICAL",
                severity="CRITICAL",
                title="CUDA Memory Leak on Edge Hardware",
                description="Jetson Orin device runs out of memory during continuous 30-minute SLAM loop execution.",
                suggested_mitigation="Downgrade to Jetpack 5.1.2 or pin buffer allocations using zero-copy pinned memory.",
                detected_by_ai=True,
                resolved=False
            ),
            ProjectRisk(
                project_id=1,
                risk_type="SCHEDULE",
                severity="MEDIUM",
                title="Velocity Estimator Milestone Slippage",
                description="Task #3 dependency delay due to blocker in SLAM feature extractor.",
                suggested_mitigation="Temporarily reallocate Sarah Jenkins to assist Alex Chen on memory leak debugging.",
                detected_by_ai=True,
                resolved=False
            ),
            ProjectRisk(
                project_id=3,
                risk_type="RESOURCE",
                severity="HIGH",
                title="Distributed Training Hardware Bottleneck",
                description="Transaction graph model requires 80GB VRAM nodes currently queued in cloud quota.",
                suggested_mitigation="Apply mixed precision FP16 and gradient checkpointing to reduce peak VRAM by 45%.",
                detected_by_ai=True,
                resolved=False
            )
        ]
        db.add_all(risks)
        db.commit()

        print("Seeding Notifications & Chat...")
        notifications = [
            Notification(
                user_id=2,
                title="AI Delay Risk Detected",
                message="Project 'Autonomous Drone Navigation Stack' has predicted delay of 4.5 days due to blocked task #2.",
                type="RISK",
                action_url="/projects/1"
            ),
            Notification(
                user_id=4,
                title="Urgent Task Assigned",
                message="Elena Rostova assigned you to 'SLAM Edge Feature Extractor Optimization'.",
                type="UPDATE",
                action_url="/tasks"
            ),
            Notification(
                user_id=6,
                title="Weekly Progress Report Ready",
                message="AI generated week 38 summary report for supervised projects.",
                type="UPDATE",
                action_url="/reports"
            )
        ]
        db.add_all(notifications)

        chat_messages = [
            ChatMessage(project_id=1, sender_id=3, message="Hey team, please review the latest LiDAR synchronization PR when you get a chance."),
            ChatMessage(project_id=1, sender_id=4, message="Taking a look now! Also diving deep into the CUDA memory allocation issue today."),
            ChatMessage(project_id=1, sender_id=2, message="Great work team. The AI risk engine flagged task #2 as a potential 4-day blocker, let me know if we need extra cloud compute.")
        ]
        db.add_all(chat_messages)
        db.commit()

        print("\n[SUCCESS] Database initialization and seed data insertion completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    init_database(drop_all=True)
