"""In-memory job state + manager for the (unwired) batch prediction pipeline.

Role in the system
------------------
``JobState`` holds status/logs/progress for one prediction job; ``JobManager``
manages them under a thread lock with cancel support. Used by
workers/prediction_worker.py and services/prediction_service.py for the
``/api/materials-prediction`` flow (currently unwired in main.py).
"""

import time  # timestamps for job lifecycle
import uuid  # job id generation
import threading  # thread-safe job state access
from typing import Dict, Any, Optional  # type hints

class JobState:
    def __init__(self, job_id: str, dataset_id: str, total_rows: int, selected_models: list, selected_properties: list, settings: dict):
        self.job_id = job_id
        self.dataset_id = dataset_id
        self.total_rows = total_rows
        self.selected_models = selected_models
        self.selected_properties = selected_properties
        self.settings = settings
        self.status = "queued"  # 'queued', 'running', 'completed', 'canceled', 'failed'
        self.progress_percent = 0.0
        self.completed_count = 0
        self.failed_count = 0
        self.current_operation = "Initializing prediction pipeline..."
        self.results = []
        self.logs = [f"[{time.strftime('%H:%M:%S')}] Job {job_id} created with {total_rows} rows."]
        self.warnings = []
        self.errors = []
        self.created_at = time.time()
        self.completed_at = None
        self.canceled = False

    def log(self, message: str):
        timestamp = time.strftime('%H:%M:%S')
        line = f"[{timestamp}] {message}"
        self.logs.append(line)
        if len(self.logs) > 500:
            self.logs = self.logs[-500:]

    def to_dict(self) -> dict:
        return {
            "job_id": self.job_id,
            "dataset_id": self.dataset_id,
            "status": self.status,
            "progress_percent": round(self.progress_percent, 1),
            "total_rows": self.total_rows,
            "completed_count": self.completed_count,
            "failed_count": self.failed_count,
            "current_operation": self.current_operation,
            "selected_models": self.selected_models,
            "selected_properties": self.selected_properties,
            "settings": self.settings,
            "logs": self.logs[-50:],  # Return latest 50 logs
            "warnings": self.warnings,
            "errors": self.errors,
            "created_at": self.created_at,
            "completed_at": self.completed_at,
            "runtime_seconds": round((self.completed_at or time.time()) - self.created_at, 2)
        }

class JobManager:
    def __init__(self):
        self.jobs: Dict[str, JobState] = {}
        self.lock = threading.Lock()

    def create_job(self, dataset_id: str, total_rows: int, selected_models: list, selected_properties: list, settings: dict) -> JobState:
        job_id = f"job_{uuid.uuid4().hex[:10]}"
        job = JobState(job_id, dataset_id, total_rows, selected_models, selected_properties, settings)
        with self.lock:
            self.jobs[job_id] = job
        return job

    def get_job(self, job_id: str) -> Optional[JobState]:
        with self.lock:
            return self.jobs.get(job_id)

    def cancel_job(self, job_id: str) -> bool:
        job = self.get_job(job_id)
        if job and job.status in ("queued", "running"):
            job.status = "canceled"
            job.canceled = True
            job.log("Job cancellation requested by user.")
            return True
        return False

job_manager = JobManager()
