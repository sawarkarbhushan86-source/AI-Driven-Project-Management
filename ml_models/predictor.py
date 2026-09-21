"""
Production Prediction Pipeline for Project Delay and Health Score
Encapsulates model artifact loading, input sanitization, inference execution,
and intelligent fallback heuristics.
"""

import os
import json
import logging
from typing import Dict, Any, Optional
import numpy as np

logger = logging.getLogger(__name__)

class ProjectDelayPredictor:
    _instance = None

    def __init__(self, artifacts_dir: Optional[str] = None):
        if artifacts_dir is None:
            artifacts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
        self.artifacts_dir = artifacts_dir
        self.reg_model = None
        self.clf_model = None
        self.metadata = None
        self.load_models()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_models(self):
        reg_path = os.path.join(self.artifacts_dir, "delay_model.joblib")
        clf_path = os.path.join(self.artifacts_dir, "risk_classifier.joblib")
        meta_path = os.path.join(self.artifacts_dir, "model_metadata.json")

        if os.path.exists(reg_path) and os.path.exists(clf_path):
            try:
                import joblib
                self.reg_model = joblib.load(reg_path)
                self.clf_model = joblib.load(clf_path)
                if os.path.exists(meta_path):
                    with open(meta_path, "r") as f:
                        self.metadata = json.load(f)
                logger.info("Successfully loaded ML delay prediction artifacts.")
            except Exception as e:
                logger.warning(f"Could not load ML artifacts: {e}. Fallback heuristics enabled.")
        else:
            logger.info("ML artifacts not present yet. Fallback heuristics will be used.")

    def predict(
        self,
        task_count: int,
        completed_tasks: int,
        pending_tasks: int,
        team_size: int,
        average_completion_time: float,
        resource_allocation: float,
        historical_delays: float,
        blocker_count: int
    ) -> Dict[str, Any]:
        """
        Runs model inference or fallback heuristic.
        """
        team_size = max(1, team_size)
        task_count = max(1, task_count)
        pending_tasks = max(0, pending_tasks)
        completed_tasks = max(0, min(task_count, completed_tasks))

        # Check if loaded model exists
        if self.reg_model is not None and self.clf_model is not None:
            try:
                import pandas as pd
                features = pd.DataFrame([{
                    "task_count": task_count,
                    "completed_tasks": completed_tasks,
                    "pending_tasks": pending_tasks,
                    "team_size": team_size,
                    "average_completion_time": average_completion_time,
                    "resource_allocation": resource_allocation,
                    "historical_delays": historical_delays,
                    "blocker_count": blocker_count
                }])

                delay_days = float(self.reg_model.predict(features)[0])
                delay_days = round(max(0.0, delay_days), 1)
                risk_level = str(self.clf_model.predict(features)[0])

                # Health score calculation
                health_score = self.compute_health_score(
                    delay_days=delay_days,
                    completion_ratio=completed_tasks / task_count,
                    blocker_count=blocker_count,
                    resource_allocation=resource_allocation
                )

                return {
                    "predicted_delay_days": delay_days,
                    "risk_level": risk_level,
                    "health_score": health_score,
                    "engine": "ML_MODEL"
                }
            except Exception as e:
                logger.error(f"Inference error, falling back to heuristic: {e}")

        # Intelligent Fallback Heuristic
        workload_ratio = pending_tasks / (team_size * 4.0)
        delay_est = max(0.0, (workload_ratio * 1.5) + (blocker_count * 1.8) + (historical_delays * 0.35))
        delay_days = round(min(45.0, delay_est), 1)

        if delay_days <= 2.0:
            risk_level = "LOW"
        elif delay_days <= 7.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        health_score = self.compute_health_score(
            delay_days=delay_days,
            completion_ratio=completed_tasks / task_count,
            blocker_count=blocker_count,
            resource_allocation=resource_allocation
        )

        return {
            "predicted_delay_days": delay_days,
            "risk_level": risk_level,
            "health_score": health_score,
            "engine": "HEURISTIC_RULE_ENGINE"
        }

    @staticmethod
    def compute_health_score(
        delay_days: float,
        completion_ratio: float,
        blocker_count: int,
        resource_allocation: float
    ) -> float:
        """
        Computes composite project health score (0.0 to 100.0).
        """
        score = 100.0

        # Delay penalty (up to 35 points)
        score -= min(35.0, delay_days * 3.5)

        # Blocker penalty (up to 25 points)
        score -= min(25.0, blocker_count * 5.0)

        # Resource overload penalty (up to 20 points)
        if resource_allocation > 1.5:
            score -= min(20.0, (resource_allocation - 1.5) * 15.0)

        # Completion bonus (up to 10 points)
        score += min(10.0, completion_ratio * 10.0)

        return round(float(np.clip(score, 10.0, 100.0)), 1)
