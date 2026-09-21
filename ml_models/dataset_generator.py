"""
Dataset Generator for Project Delay Prediction
Generates synthetic, realistic project tracking data for training
Random Forest and XGBoost predictive models.
"""

import numpy as np
import pandas as pd
import os

def generate_project_delay_data(num_samples: int = 2500, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)

    # Features
    task_count = np.random.randint(10, 200, size=num_samples)
    completion_ratio = np.random.uniform(0.05, 0.95, size=num_samples)
    completed_tasks = (task_count * completion_ratio).astype(int)
    pending_tasks = task_count - completed_tasks

    team_size = np.random.randint(2, 30, size=num_samples)
    average_completion_time = np.random.uniform(6.0, 48.0, size=num_samples) # hours
    resource_allocation = np.round(pending_tasks / (team_size * 5.0), 2) # workload ratio
    historical_delays = np.random.exponential(scale=3.0, size=num_samples).round(1)
    blocker_count = np.random.poisson(lam=2.5, size=num_samples)

    # Delay modeling with non-linear physics and realistic interactions
    noise = np.random.normal(0, 1.2, size=num_samples)
    
    # Delay formula based on resource bottleneck, blocker count, and workload
    raw_delay = (
        (pending_tasks / (team_size * 4.0)) * 1.8 +
        (blocker_count * 1.6) +
        (historical_delays * 0.4) +
        ((average_completion_time - 16.0).clip(min=0) * 0.15) +
        ((resource_allocation - 1.5).clip(min=0) * 3.0) +
        noise
    )

    delay_days = np.clip(raw_delay, a_min=0.0, a_max=45.0).round(1)

    # Class labels for risk categorization:
    # 0: LOW (<= 2 days)
    # 1: MEDIUM (2 to 7 days)
    # 2: HIGH (> 7 days)
    risk_labels = []
    for d in delay_days:
        if d <= 2.0:
            risk_labels.append("LOW")
        elif d <= 7.0:
            risk_labels.append("MEDIUM")
        else:
            risk_labels.append("HIGH")

    df = pd.DataFrame({
        "task_count": task_count,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "team_size": team_size,
        "average_completion_time": average_completion_time.round(1),
        "resource_allocation": resource_allocation,
        "historical_delays": historical_delays,
        "blocker_count": blocker_count,
        "predicted_delay_days": delay_days,
        "risk_level": risk_labels
    })

    return df

if __name__ == "__main__":
    output_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(output_dir, "project_delay_dataset.csv")
    df = generate_project_delay_data()
    df.to_csv(data_path, index=False)
    print(f"Generated synthetic dataset with {len(df)} samples saved to: {data_path}")
    print(df.head(5))
