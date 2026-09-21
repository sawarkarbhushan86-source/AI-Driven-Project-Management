-- ============================================================================
-- Seed Data for AI-Driven Project Management Platform
-- Default credentials for demo: password is 'password123'
-- Bcrypt hash for 'password123': $2b$12$e0NRJvxzNn9E3Jvj1L9K3.fQ9cI6P1Z3sZ4T5kU6x7Y8W9A0B1C2D
-- (Or the standard passlib bcrypt compatible hash)
-- ============================================================================

-- 1. USERS
INSERT INTO users (id, email, hashed_password, full_name, role, avatar_url, department, is_active)
VALUES
(1, 'admin@aipmp.io', '$2b$12$LZ4/mG/wIflmU4r02x6OYe3vK2nQ9uR2Wf9f4SgC5sC2s5T6u7V8a', 'Dr. Alistair Vance', 'ADMIN', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Executive Leadership', true),
(2, 'pm@aipmp.io', '$2b$12$LZ4/mG/wIflmU4r02x6OYe3vK2nQ9uR2Wf9f4SgC5sC2s5T6u7V8a', 'Marcus Sterling', 'PROJECT_MANAGER', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Product Management', true),
(3, 'lead@aipmp.io', '$2b$12$LZ4/mG/wIflmU4r02x6OYe3vK2nQ9uR2Wf9f4SgC5sC2s5T6u7V8a', 'Elena Rostova', 'TEAM_LEAD', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Architecture & AI', true),
(4, 'dev@aipmp.io', '$2b$12$LZ4/mG/wIflmU4r02x6OYe3vK2nQ9uR2Wf9f4SgC5sC2s5T6u7V8a', 'Alex Chen', 'DEVELOPER', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'Core Engineering', true),
(5, 'sarah.dev@aipmp.io', '$2b$12$LZ4/mG/wIflmU4r02x6OYe3vK2nQ9uR2Wf9f4SgC5sC2s5T6u7V8a', 'Sarah Jenkins', 'DEVELOPER', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Frontend Engineering', true),
(6, 'teacher@aipmp.io', '$2b$12$LZ4/mG/wIflmU4r02x6OYe3vK2nQ9uR2Wf9f4SgC5sC2s5T6u7V8a', 'Prof. Katherine Hayes', 'CLIENT_TEACHER', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Academic Evaluation', true)
ON CONFLICT (id) DO NOTHING;

-- 2. PROJECTS
INSERT INTO projects (id, name, description, status, health_score, predicted_delay_days, delay_risk_level, start_date, deadline, budget, created_by_id)
VALUES
(1, 'Autonomous Drone Navigation Stack', 'End-to-end vision-based obstacle avoidance and real-time path planning pipeline for autonomous UAVs.', 'IN_PROGRESS', 72.50, 4.50, 'MEDIUM', '2026-08-01', '2026-10-30', 85000.00, 2),
(2, 'Healthcare AI Diagnostic Portal', 'HIPAA-compliant multimodal medical imaging diagnostics with automated radiology reporting and clinician review workflows.', 'IN_PROGRESS', 94.00, 0.50, 'LOW', '2026-07-15', '2026-11-15', 120000.00, 2),
(3, 'FinTech High-Frequency Fraud Engine', 'Sub-millisecond graph neural network transaction risk evaluation and AML anomaly screening.', 'IN_PROGRESS', 61.00, 7.20, 'HIGH', '2026-08-15', '2026-11-01', 95000.00, 2),
(4, 'Next-Gen Cloud Microservices Migration', 'Containerizing monolith services into Kubernetes clusters with zero-downtime Canary deployments.', 'COMPLETED', 98.00, 0.00, 'LOW', '2026-05-01', '2026-08-30', 65000.00, 1)
ON CONFLICT (id) DO NOTHING;

-- 3. PROJECT MEMBERS
INSERT INTO project_members (project_id, user_id, role_in_project, allocated_hours_per_week)
VALUES
(1, 2, 'PROJECT_MANAGER', 15),
(1, 3, 'TEAM_LEAD', 30),
(1, 4, 'DEVELOPER', 40),
(1, 5, 'DEVELOPER', 40),
(2, 2, 'PROJECT_MANAGER', 20),
(2, 4, 'DEVELOPER', 35),
(2, 6, 'TEACHER_OBSERVER', 5),
(3, 2, 'PROJECT_MANAGER', 20),
(3, 3, 'TEAM_LEAD', 25),
(3, 4, 'DEVELOPER', 40)
ON CONFLICT (project_id, user_id) DO NOTHING;

-- 4. TASKS
INSERT INTO tasks (id, project_id, title, description, assigned_to_id, created_by_id, priority, status, estimated_hours, actual_hours, deadline, progress_percentage, is_at_risk, risk_reason, order_index)
VALUES
(1, 1, 'Sensor Calibration & LiDAR Synchronization', 'Implement timestamp sync between Velodyne LiDAR and stereo camera frames at 60Hz.', 4, 3, 'HIGH', 'IN_PROGRESS', 24.0, 18.0, '2026-09-25', 75, false, null, 1),
(2, 1, 'SLAM Edge Feature Extractor Optimization', 'Convert ORB-SLAM3 feature extraction kernel to CUDA for embedded Jetson Orin.', 4, 3, 'URGENT', 'BLOCKED', 32.0, 28.0, '2026-09-22', 45, true, 'CUDA memory leak identified on Jetpack 6.0 SDK', 2),
(3, 1, 'Dynamic Obstacle Velocity Estimator', 'Kalman filter implementation for tracking moving targets and predicting trajectory.', 5, 3, 'MEDIUM', 'TODO', 16.0, 0.0, '2026-10-05', 0, false, null, 3),
(4, 1, 'Safety Fallback & Emergency Parachute Actuator', 'Hardware interlock triggers emergency landing protocol on telemetry signal loss.', 3, 2, 'HIGH', 'IN_REVIEW', 12.0, 12.0, '2026-09-28', 100, false, null, 4),
(5, 2, 'DICOM Image Ingestion & Anonymizer Pipeline', 'Parse and strip patient PII from DICOM headers and securely stream to encrypted blob store.', 4, 2, 'HIGH', 'COMPLETED', 20.0, 18.5, '2026-08-30', 100, false, null, 1),
(6, 2, 'DenseNet Chest X-Ray Pathology Classifier', 'Train and validate multi-label thoracic pathology detection with 95% AUROC.', 3, 2, 'URGENT', 'IN_PROGRESS', 40.0, 32.0, '2026-09-30', 80, false, null, 2),
(7, 3, 'Graph Neural Network Subgraph Batcher', 'Optimize PyG neighbour sampler for billions of credit card transactions.', 4, 3, 'URGENT', 'BLOCKED', 40.0, 36.0, '2026-09-20', 60, true, 'OOM issues on GPU cluster during distributed training', 1)
ON CONFLICT (id) DO NOTHING;

-- 5. TASK UPDATES (Daily Standups)
INSERT INTO task_updates (id, task_id, user_id, yesterday_work, today_plan, blockers, progress_percentage, hours_spent)
VALUES
(1, 1, 4, 'Wrote ROS2 timestamp synchronization node and unit tests for simulated sensor packets.', 'Bench test with physical Velodyne VLP-16 sensor hardware.', 'None', 75, 6.5),
(2, 2, 4, 'Profiled CUDA memory allocations with Nsight Compute.', 'Investigate buffer leak in frame descriptors before Jetson execution.', 'Blocked by Jetpack 6.0 driver crash when batch size > 8.', 45, 8.0),
(3, 6, 3, 'Fine-tuned DenseNet-121 backbone on CheXpert dataset with focal loss.', 'Generate ROC curves and PR curves for cardiomegaly and pleural effusion.', 'None, training runs cleanly on A100 GPU.', 80, 7.0)
ON CONFLICT (id) DO NOTHING;

-- 6. PROJECT RISKS
INSERT INTO project_risks (id, project_id, risk_type, severity, title, description, suggested_mitigation, detected_by_ai, resolved)
VALUES
(1, 1, 'TECHNICAL', 'CRITICAL', 'CUDA Memory Leak on Edge Hardware', 'Jetson Orin device runs out of memory during continuous 30-minute SLAM loop execution.', 'Downgrade to Jetpack 5.1.2 or pin buffer allocations using zero-copy pinned memory.', true, false),
(2, 1, 'SCHEDULE', 'MEDIUM', 'Velocity Estimator Milestone Slippage', 'Task #3 dependency delay due to blocker in SLAM feature extractor.', 'Temporarily reallocate Sarah Jenkins to assist Alex Chen on memory leak debugging.', true, false),
(3, 3, 'RESOURCE', 'HIGH', 'Distributed Training Hardware Bottleneck', 'Transaction graph model requires 80GB VRAM nodes currently queued in cloud quota.', 'Apply mixed precision FP16 and gradient checkpointing to reduce peak VRAM by 45%.', true, false)
ON CONFLICT (id) DO NOTHING;

-- 7. TEAM PERFORMANCE
INSERT INTO team_performance (project_id, user_id, tasks_completed, average_completion_time_hrs, productivity_score, on_time_delivery_rate, recorded_date)
VALUES
(1, 4, 12, 14.5, 88.5, 92.0, CURRENT_DATE),
(1, 5, 10, 16.0, 91.0, 95.0, CURRENT_DATE),
(2, 3, 15, 12.0, 96.0, 98.0, CURRENT_DATE),
(3, 4, 8, 22.0, 78.0, 80.0, CURRENT_DATE)
ON CONFLICT (project_id, user_id, recorded_date) DO NOTHING;

-- 8. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, is_read, action_url)
VALUES
(2, 'AI Delay Risk Detected', 'Project "Autonomous Drone Navigation Stack" has predicted delay increased to 4.5 days due to blocked task #2.', 'RISK', false, '/projects/1'),
(4, 'Urgent Task Assigned', 'Elena Rostova assigned you to "SLAM Edge Feature Extractor Optimization".', 'UPDATE', false, '/tasks'),
(6, 'Weekly Progress Report Ready', 'AI generated week 38 summary report for supervised projects.', 'UPDATE', true, '/reports');

-- 9. CHAT MESSAGES
INSERT INTO chat_messages (project_id, sender_id, message)
VALUES
(1, 3, 'Hey team, please review the latest LiDAR synchronization PR when you get a chance.'),
(1, 4, 'Taking a look now! Also diving deep into the CUDA memory allocation issue today.'),
(1, 2, 'Great work team. The AI risk engine flagged task #2 as a potential 4-day blocker, let me know if we need extra cloud compute.');
