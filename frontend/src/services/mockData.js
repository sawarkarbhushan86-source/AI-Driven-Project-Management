export const mockUsers = [
  {
    id: 1,
    email: "admin@aipmp.io",
    full_name: "Dr. Alistair Vance",
    role: "ADMIN",
    department: "Executive Leadership",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  {
    id: 2,
    email: "pm@aipmp.io",
    full_name: "Marcus Sterling",
    role: "PROJECT_MANAGER",
    department: "Product Management",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
  },
  {
    id: 3,
    email: "lead@aipmp.io",
    full_name: "Elena Rostova",
    role: "TEAM_LEAD",
    department: "Architecture & AI",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    id: 4,
    email: "dev@aipmp.io",
    full_name: "Alex Chen",
    role: "DEVELOPER",
    department: "Core Engineering",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
  },
  {
    id: 5,
    email: "sarah.dev@aipmp.io",
    full_name: "Sarah Jenkins",
    role: "DEVELOPER",
    department: "Frontend & UX",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
  },
  {
    id: 6,
    email: "teacher@aipmp.io",
    full_name: "Prof. Katherine Hayes",
    role: "CLIENT_TEACHER",
    department: "Academic Oversight",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
  }
];

export const mockProjects = [
  {
    id: 1,
    name: "Autonomous Drone Navigation Stack",
    description: "Vision-based obstacle avoidance, SLAM localization, and real-time path planning pipeline for autonomous aerial robotics.",
    status: "IN_PROGRESS",
    health_score: 72.5,
    predicted_delay_days: 4.5,
    delay_risk_level: "MEDIUM",
    start_date: "2026-08-01",
    deadline: "2026-10-30",
    budget: 85000,
    created_by_id: 2,
    total_tasks: 4,
    completed_tasks: 1,
    pending_tasks: 3,
    progress_percentage: 55.0,
    active_risks_count: 2
  },
  {
    id: 2,
    name: "Healthcare AI Diagnostic Portal",
    description: "HIPAA-compliant multimodal medical imaging diagnostics with automated radiology reporting and clinician review workflows.",
    status: "IN_PROGRESS",
    health_score: 94.0,
    predicted_delay_days: 0.5,
    delay_risk_level: "LOW",
    start_date: "2026-07-15",
    deadline: "2026-11-15",
    budget: 120000,
    created_by_id: 2,
    total_tasks: 2,
    completed_tasks: 1,
    pending_tasks: 1,
    progress_percentage: 90.0,
    active_risks_count: 0
  },
  {
    id: 3,
    name: "FinTech High-Frequency Fraud Engine",
    description: "Sub-millisecond graph neural network transaction risk evaluation and anti-money laundering anomaly screener.",
    status: "IN_PROGRESS",
    health_score: 61.0,
    predicted_delay_days: 7.2,
    delay_risk_level: "HIGH",
    start_date: "2026-08-15",
    deadline: "2026-11-01",
    budget: 95000,
    created_by_id: 2,
    total_tasks: 1,
    completed_tasks: 0,
    pending_tasks: 1,
    progress_percentage: 60.0,
    active_risks_count: 1
  },
  {
    id: 4,
    name: "Next-Gen Microservices Migration",
    description: "Monolith decomposability into resilient Go/Python microservices running on auto-scaling Kubernetes.",
    status: "COMPLETED",
    health_score: 98.0,
    predicted_delay_days: 0.0,
    delay_risk_level: "LOW",
    start_date: "2026-05-01",
    deadline: "2026-08-30",
    budget: 65000,
    created_by_id: 1,
    total_tasks: 5,
    completed_tasks: 5,
    pending_tasks: 0,
    progress_percentage: 100.0,
    active_risks_count: 0
  }
];

export const mockTasks = [
  {
    id: 1,
    project_id: 1,
    title: "Sensor Calibration & LiDAR Synchronization",
    description: "Implement timestamp sync between Velodyne LiDAR packets and stereo camera frames at 60Hz.",
    assigned_to_id: 4,
    assigned_to: mockUsers[3],
    priority: "HIGH",
    status: "IN_PROGRESS",
    estimated_hours: 24,
    actual_hours: 18,
    deadline: "2026-09-25",
    progress_percentage: 75,
    is_at_risk: false,
    risk_reason: null
  },
  {
    id: 2,
    project_id: 1,
    title: "SLAM Edge Feature Extractor Optimization",
    description: "Convert ORB-SLAM3 feature extraction kernel to CUDA for embedded Jetson Orin.",
    assigned_to_id: 4,
    assigned_to: mockUsers[3],
    priority: "URGENT",
    status: "BLOCKED",
    estimated_hours: 32,
    actual_hours: 28,
    deadline: "2026-09-22",
    progress_percentage: 45,
    is_at_risk: true,
    risk_reason: "CUDA memory leak identified on Jetpack 6.0 SDK driver."
  },
  {
    id: 3,
    project_id: 1,
    title: "Dynamic Obstacle Velocity Estimator",
    description: "Extended Kalman filter implementation for tracking moving targets and predicting trajectory.",
    assigned_to_id: 5,
    assigned_to: mockUsers[4],
    priority: "MEDIUM",
    status: "TODO",
    estimated_hours: 16,
    actual_hours: 0,
    deadline: "2026-10-05",
    progress_percentage: 0,
    is_at_risk: false,
    risk_reason: null
  },
  {
    id: 4,
    project_id: 1,
    title: "Safety Fallback & Emergency Parachute Actuator",
    description: "Hardware interlock triggers emergency parachute on telemetry signal loss.",
    assigned_to_id: 3,
    assigned_to: mockUsers[2],
    priority: "HIGH",
    status: "IN_REVIEW",
    estimated_hours: 12,
    actual_hours: 12,
    deadline: "2026-09-28",
    progress_percentage: 100,
    is_at_risk: false,
    risk_reason: null
  },
  {
    id: 5,
    project_id: 2,
    title: "DICOM Image Ingestion & Anonymizer Pipeline",
    description: "Parse and strip patient PII from DICOM headers and securely stream to encrypted cloud store.",
    assigned_to_id: 4,
    assigned_to: mockUsers[3],
    priority: "HIGH",
    status: "COMPLETED",
    estimated_hours: 20,
    actual_hours: 18.5,
    deadline: "2026-08-30",
    progress_percentage: 100,
    is_at_risk: false,
    risk_reason: null
  },
  {
    id: 6,
    project_id: 2,
    title: "DenseNet Chest X-Ray Pathology Classifier",
    description: "Train and validate multi-label thoracic pathology detection with 95% AUROC.",
    assigned_to_id: 3,
    assigned_to: mockUsers[2],
    priority: "URGENT",
    status: "IN_PROGRESS",
    estimated_hours: 40,
    actual_hours: 32,
    deadline: "2026-09-30",
    progress_percentage: 80,
    is_at_risk: false,
    risk_reason: null
  },
  {
    id: 7,
    project_id: 3,
    title: "Graph Neural Network Subgraph Batcher",
    description: "Optimize PyG neighbour sampler for billions of credit card transactions.",
    assigned_to_id: 4,
    assigned_to: mockUsers[3],
    priority: "URGENT",
    status: "BLOCKED",
    estimated_hours: 40,
    actual_hours: 36,
    deadline: "2026-09-20",
    progress_percentage: 60,
    is_at_risk: true,
    risk_reason: "GPU cluster out-of-memory errors on subgraphs with >500k edges."
  }
];

export const mockTaskUpdates = [
  {
    id: 1,
    task_id: 1,
    user_id: 4,
    user: mockUsers[3],
    yesterday_work: "Wrote ROS2 timestamp synchronization node and unit tests for simulated sensor packets.",
    today_plan: "Bench test with physical Velodyne VLP-16 sensor hardware.",
    blockers: "None",
    progress_percentage: 75,
    hours_spent: 6.5,
    created_at: "2026-09-21T09:30:00Z"
  },
  {
    id: 2,
    task_id: 2,
    user_id: 4,
    user: mockUsers[3],
    yesterday_work: "Profiled CUDA memory allocations with Nsight Compute.",
    today_plan: "Investigate buffer leak in frame descriptors before Jetson execution.",
    blockers: "Blocked by Jetpack 6.0 driver crash when batch size > 8.",
    progress_percentage: 45,
    hours_spent: 8.0,
    created_at: "2026-09-21T10:15:00Z"
  },
  {
    id: 3,
    task_id: 6,
    user_id: 3,
    user: mockUsers[2],
    yesterday_work: "Fine-tuned DenseNet-121 backbone on CheXpert dataset with focal loss.",
    today_plan: "Generate ROC curves and PR curves for cardiomegaly and pleural effusion.",
    blockers: "None, training runs cleanly on A100 GPU.",
    progress_percentage: 80,
    hours_spent: 7.0,
    created_at: "2026-09-21T11:00:00Z"
  }
];

export const mockDashboardSummary = {
  total_projects: 4,
  active_projects: 3,
  average_health_score: 81.4,
  total_tasks: 7,
  completed_tasks: 2,
  blocked_tasks: 2,
  overall_completion_percentage: 65.8,
  high_risk_projects_count: 1,
  status_distribution: {
    todo: 1,
    in_progress: 2,
    in_review: 1,
    completed: 2,
    blocked: 1
  },
  burndown_series: [
    { day: "Day 1", ideal_remaining: 184.0, actual_remaining: 184.0 },
    { day: "Day 2", ideal_remaining: 165.6, actual_remaining: 172.0 },
    { day: "Day 3", ideal_remaining: 147.2, actual_remaining: 154.5 },
    { day: "Day 4", ideal_remaining: 128.8, actual_remaining: 139.0 },
    { day: "Day 5", ideal_remaining: 110.4, actual_remaining: 126.0 },
    { day: "Day 6", ideal_remaining: 92.0, actual_remaining: 114.5 },
    { day: "Day 7", ideal_remaining: 73.6, actual_remaining: 98.0 },
    { day: "Day 8", ideal_remaining: 55.2, actual_remaining: 81.0 },
    { day: "Day 9", ideal_remaining: 36.8, actual_remaining: 68.0 },
    { day: "Day 10", ideal_remaining: 18.4, actual_remaining: 52.0 }
  ],
  team_productivity: [
    { developer_name: "Elena Rostova", tasks_completed: 15, avg_hours_per_task: 12.0, productivity_score: 96.0 },
    { developer_name: "Sarah Jenkins", tasks_completed: 10, avg_hours_per_task: 16.0, productivity_score: 91.0 },
    { developer_name: "Alex Chen", tasks_completed: 12, avg_hours_per_task: 14.5, productivity_score: 88.5 }
  ],
  top_projects: mockProjects,
  recent_blockers: [
    {
      id: 2,
      task_title: "SLAM Edge Feature Extractor Optimization",
      developer_name: "Alex Chen",
      blocker_text: "Blocked by Jetpack 6.0 driver crash when batch size > 8.",
      created_at: "2026-09-21T10:15:00Z"
    },
    {
      id: 7,
      task_title: "Graph Neural Network Subgraph Batcher",
      developer_name: "Alex Chen",
      blocker_text: "GPU cluster out-of-memory errors on subgraphs with >500k edges.",
      created_at: "2026-09-20T16:00:00Z"
    }
  ]
};

export const mockTeacherOverview = [
  {
    id: 1,
    name: "Autonomous Drone Navigation Stack",
    health_score: 72.5,
    predicted_delay_days: 4.5,
    delay_risk_level: "MEDIUM",
    status: "IN_PROGRESS",
    deadline: "2026-10-30",
    lead_name: "Marcus Sterling",
    member_count: 4,
    completion_percentage: 55.0,
    active_blockers_count: 1
  },
  {
    id: 2,
    name: "Healthcare AI Diagnostic Portal",
    health_score: 94.0,
    predicted_delay_days: 0.5,
    delay_risk_level: "LOW",
    status: "IN_PROGRESS",
    deadline: "2026-11-15",
    lead_name: "Marcus Sterling",
    member_count: 3,
    completion_percentage: 90.0,
    active_blockers_count: 0
  },
  {
    id: 3,
    name: "FinTech Real-Time Fraud Engine",
    health_score: 61.0,
    predicted_delay_days: 7.2,
    delay_risk_level: "HIGH",
    status: "IN_PROGRESS",
    deadline: "2026-11-01",
    lead_name: "Marcus Sterling",
    member_count: 3,
    completion_percentage: 60.0,
    active_blockers_count: 1
  },
  {
    id: 4,
    name: "Next-Gen Microservices Migration",
    health_score: 98.0,
    predicted_delay_days: 0.0,
    delay_risk_level: "LOW",
    status: "COMPLETED",
    deadline: "2026-08-30",
    lead_name: "Dr. Alistair Vance",
    member_count: 2,
    completion_percentage: 100.0,
    active_blockers_count: 0
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: "AI Delay Risk Detected",
    message: "Project 'Autonomous Drone Navigation Stack' has predicted delay of 4.5 days due to blocked task #2.",
    type: "RISK",
    is_read: false,
    action_url: "/projects/1",
    created_at: "2026-09-21T08:00:00Z"
  },
  {
    id: 2,
    title: "Urgent Task Assigned",
    message: "Elena Rostova assigned you to 'SLAM Edge Feature Extractor Optimization'.",
    type: "UPDATE",
    is_read: false,
    action_url: "/tasks",
    created_at: "2026-09-21T08:30:00Z"
  },
  {
    id: 3,
    title: "Weekly Progress Report Ready",
    message: "AI generated week 38 summary report for supervised projects.",
    type: "UPDATE",
    is_read: true,
    action_url: "/reports",
    created_at: "2026-09-20T12:00:00Z"
  }
];
