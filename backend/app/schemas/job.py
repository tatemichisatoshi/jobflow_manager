from datetime import datetime
from typing import Optional, Dict, List, Any
from pydantic import BaseModel

# JobRun
class JobRunBase(BaseModel):
    status: str = "queued"

class JobRunCreate(JobRunBase):
    job_id: int

class JobRun(JobRunBase):
    id: int
    job_id: int
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    logs: Optional[str] = None
    result_summary: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# Job
class JobBase(BaseModel):
    name: str
    parameters: Optional[Dict[str, Any]] = None

class JobCreate(JobBase):
    pass

class JobUpdate(JobBase):
    pass

class Job(JobBase):
    id: int
    owner_id: int
    created_at: datetime
    runs: List[JobRun] = []

    class Config:
        from_attributes = True
