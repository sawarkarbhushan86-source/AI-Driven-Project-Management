"""
Training Pipeline for Project Delay Prediction and Risk Detection
Trains both Random Forest and XGBoost models, compares performance metrics,
and serializes the winning artifacts for real-time production inference.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, classification_report

try:
    from xgboost import XGBRegressor, XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

from dataset_generator import generate_project_delay_data

FEATURE_COLUMNS = [
    "task_count",
    "completed_tasks",
    "pending_tasks",
    "team_size",
    "average_completion_time",
    "resource_allocation",
    "historical_delays",
    "blocker_count"
]

def train_and_export_models():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    artifacts_dir = os.path.join(base_dir, "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    dataset_path = os.path.join(base_dir, "project_delay_dataset.csv")
    if os.path.exists(dataset_path):
        print(f"Loading existing dataset from {dataset_path}...")
        df = pd.read_csv(dataset_path)
    else:
        print("Dataset not found. Generating fresh synthetic dataset...")
        df = generate_project_delay_data(num_samples=3000)
        df.to_csv(dataset_path, index=False)

    X = df[FEATURE_COLUMNS]
    y_reg = df["predicted_delay_days"]
    y_clf = df["risk_level"]

    # Split
    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42
    )

    # Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 1. Train Random Forest Regressor
    print("Training Random Forest Regressor...")
    rf_reg = RandomForestRegressor(n_estimators=150, max_depth=12, random_state=42, n_jobs=-1)
    rf_reg.fit(X_train, y_reg_train)
    rf_preds = rf_reg.predict(X_test)
    rf_rmse = np.sqrt(mean_squared_error(y_reg_test, rf_preds))
    rf_mae = mean_absolute_error(y_reg_test, rf_preds)
    rf_r2 = r2_score(y_reg_test, rf_preds)

    print(f"Random Forest Regressor -> R2: {rf_r2:.4f}, MAE: {rf_mae:.4f} days, RMSE: {rf_rmse:.4f} days")

    # 2. Train XGBoost Regressor (or GradientBoosting fallback)
    best_reg_model = rf_reg
    best_model_name = "RandomForest"
    best_r2 = rf_r2

    if HAS_XGBOOST:
        print("Training XGBoost Regressor...")
        xgb_reg = XGBRegressor(n_estimators=150, max_depth=6, learning_rate=0.08, random_state=42)
        xgb_reg.fit(X_train, y_reg_train)
        xgb_preds = xgb_reg.predict(X_test)
        xgb_rmse = np.sqrt(mean_squared_error(y_reg_test, xgb_preds))
        xgb_mae = mean_absolute_error(y_reg_test, xgb_preds)
        xgb_r2 = r2_score(y_reg_test, xgb_preds)
        print(f"XGBoost Regressor -> R2: {xgb_r2:.4f}, MAE: {xgb_mae:.4f} days, RMSE: {xgb_rmse:.4f} days")

        if xgb_r2 > best_r2:
            best_reg_model = xgb_reg
            best_model_name = "XGBoost"
            best_r2 = xgb_r2
    else:
        print("XGBoost not installed, training Scikit-Learn GradientBoostingRegressor...")
        gb_reg = GradientBoostingRegressor(n_estimators=120, max_depth=5, random_state=42)
        gb_reg.fit(X_train, y_reg_train)
        gb_preds = gb_reg.predict(X_test)
        gb_r2 = r2_score(y_reg_test, gb_preds)
        if gb_r2 > best_r2:
            best_reg_model = gb_reg
            best_model_name = "GradientBoosting"

    print(f"Best Regression Model Selected: {best_model_name} (R2: {best_r2:.4f})")

    # 3. Train Risk Level Classifier
    print("Training Random Forest Risk Classifier...")
    rf_clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf_clf.fit(X_train, y_clf_train)
    clf_preds = rf_clf.predict(X_test)
    clf_acc = accuracy_score(y_clf_test, clf_preds)
    print(f"Risk Classifier Accuracy: {clf_acc * 100:.2f}%")

    # Feature Importances
    feature_importances = dict(zip(FEATURE_COLUMNS, best_reg_model.feature_importances_.tolist()))
    print("Feature Importances:")
    for feat, imp in sorted(feature_importances.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {feat}: {imp * 100:.2f}%")

    # Save Artifacts
    reg_model_path = os.path.join(artifacts_dir, "delay_model.joblib")
    clf_model_path = os.path.join(artifacts_dir, "risk_classifier.joblib")
    scaler_path = os.path.join(artifacts_dir, "feature_scaler.joblib")
    meta_path = os.path.join(artifacts_dir, "model_metadata.json")

    joblib.dump(best_reg_model, reg_model_path)
    joblib.dump(rf_clf, clf_model_path)
    joblib.dump(scaler, scaler_path)

    metadata = {
        "best_model": best_model_name,
        "feature_columns": FEATURE_COLUMNS,
        "metrics": {
            "r2_score": float(best_r2),
            "classifier_accuracy": float(clf_acc)
        },
        "feature_importances": feature_importances
    }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nArtifacts successfully exported to: {artifacts_dir}")
    return metadata

if __name__ == "__main__":
    train_and_export_models()
