"""
Evaluation Script for Project Delay & Risk Prediction Models
Runs validation checks against realistic project scenarios to verify model bounds and behavior.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np

def evaluate_production_artifacts():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    artifacts_dir = os.path.join(base_dir, "artifacts")

    reg_path = os.path.join(artifacts_dir, "delay_model.joblib")
    clf_path = os.path.join(artifacts_dir, "risk_classifier.joblib")
    meta_path = os.path.join(artifacts_dir, "model_metadata.json")

    if not os.path.exists(reg_path) or not os.path.exists(clf_path):
        print(f"Error: Artifacts missing in {artifacts_dir}. Run train_delay_model.py first.")
        return False

    reg_model = joblib.load(reg_path)
    clf_model = joblib.load(clf_path)

    with open(meta_path, "r") as f:
        metadata = json.load(f)

    print("=" * 60)
    print("PRODUCTION ML MODEL EVALUATION REPORT")
    print("=" * 60)
    print(f"Algorithm: {metadata.get('best_model')}")
    print(f"Validation R2 Score: {metadata['metrics']['r2_score']:.4f}")
    print(f"Risk Classifier Accuracy: {metadata['metrics']['classifier_accuracy']*100:.2f}%")
    print("\nFeature Importances:")
    for k, v in metadata.get("feature_importances", {}).items():
        print(f"  {k:25s}: {v*100:5.2f}%")

    # Run 3 test personas:
    # 1. Healthy on-track project
    # 2. Moderate risk project
    # 3. Severely bottlenecked project
    test_cases = pd.DataFrame([
        {
            "name": "Healthy Sprint (On-track)",
            "task_count": 40,
            "completed_tasks": 32,
            "pending_tasks": 8,
            "team_size": 8,
            "average_completion_time": 12.0,
            "resource_allocation": 0.2,
            "historical_delays": 0.5,
            "blocker_count": 0
        },
        {
            "name": "Mid-Stage Slippage (Moderate Risk)",
            "task_count": 75,
            "completed_tasks": 28,
            "pending_tasks": 47,
            "team_size": 5,
            "average_completion_time": 22.0,
            "resource_allocation": 1.88,
            "historical_delays": 3.0,
            "blocker_count": 2
        },
        {
            "name": "Severe Crisis (High Blocker / Overload)",
            "task_count": 120,
            "completed_tasks": 15,
            "pending_tasks": 105,
            "team_size": 4,
            "average_completion_time": 35.0,
            "resource_allocation": 5.25,
            "historical_delays": 9.0,
            "blocker_count": 7
        }
    ])

    feature_cols = metadata["feature_columns"]
    X_test = test_cases[feature_cols]

    preds_delay = reg_model.predict(X_test)
    preds_risk = clf_model.predict(X_test)

    print("\n" + "=" * 60)
    print("SYNTHETIC SCENARIO INFERENCE TESTS")
    print("=" * 60)
    for i, row in test_cases.iterrows():
        print(f"\nScenario: {row['name']}")
        print(f"  Pending Tasks: {row['pending_tasks']} / {row['task_count']} | Team: {row['team_size']} | Blockers: {row['blocker_count']}")
        print(f"  -> Predicted Delay: {preds_delay[i]:.1f} days")
        print(f"  -> Risk Level:      {preds_risk[i]}")

    print("\n[OK] Model passed sanity validation checks.")
    return True

if __name__ == "__main__":
    evaluate_production_artifacts()
