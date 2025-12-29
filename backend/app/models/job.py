import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Job(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    parameters = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("user.id"))

    owner = relationship("User", backref="jobs")
    runs = relationship("JobRun", back_populates="job", cascade="all, delete-orphan")

class JobRun(Base):
    __tablename__ = "job_run"  # custom table name to avoid potential conflicts or pluralization issues

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job.id"))
    status = Column(String, default="queued", index=True)  # queued, running, success, failed
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)
    logs = Column(Text, nullable=True)
    result_summary = Column(JSON, nullable=True)

    job = relationship("Job", back_populates="runs")
