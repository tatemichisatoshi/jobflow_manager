from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app import models, schemas
from app.api import deps
# from app.worker import run_job_task  # Will implement later

router = APIRouter()

@router.get("/", response_model=List[schemas.Job])
async def read_jobs(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve jobs.
    """
    query = select(models.Job).options(selectinload(models.Job.runs)).offset(skip).limit(limit)
    if not current_user.is_superuser:
        query = query.filter(models.Job.owner_id == current_user.id)
    result = await db.execute(query)
    jobs = result.scalars().all()
    return jobs

@router.post("/", response_model=schemas.Job)
async def create_job(
    *,
    db: AsyncSession = Depends(deps.get_db),
    job_in: schemas.JobCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new job.
    """
    job = models.Job(
        name=job_in.name,
        parameters=job_in.parameters,
        owner_id=current_user.id
    )
    db.add(job)
    db.add(job)
    await db.commit()
    
    # Re-query with eager loading to ensure runs is available for the response model
    # avoiding MissingGreenlet on lazy load
    query = select(models.Job).options(selectinload(models.Job.runs)).filter(models.Job.id == job.id)
    result = await db.execute(query)
    job = result.scalars().first()
    
    return job

@router.get("/{job_id}", response_model=schemas.Job)
async def read_job(
    *,
    db: AsyncSession = Depends(deps.get_db),
    job_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get job by ID.
    """
    query = select(models.Job).options(selectinload(models.Job.runs)).filter(models.Job.id == job_id)
    result = await db.execute(query)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not current_user.is_superuser and job.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return job

@router.post("/{job_id}/run", response_model=schemas.JobRun)
async def run_job(
    *,
    db: AsyncSession = Depends(deps.get_db),
    job_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Trigger a job run.
    """
    # 1. Fetch Job
    job = await db.get(models.Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not current_user.is_superuser and job.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    # 2. Create JobRun
    job_run = models.JobRun(job_id=job.id, status="queued")
    db.add(job_run)
    await db.commit()
    await db.refresh(job_run)

    # 3. Trigger Celery Task inside worker
    from app.worker import execute_job_task
    execute_job_task.delay(job_run.id)

    return job_run

@router.delete("/{job_id}", response_model=schemas.Job)
async def delete_job(
    *,
    db: AsyncSession = Depends(deps.get_db),
    job_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a job.
    """
    query = select(models.Job).filter(models.Job.id == job_id)
    result = await db.execute(query)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not current_user.is_superuser and job.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    # Cascade delete (if not handled by DB FK) or just delete parent if cleaner
    # For simplicity, we just delete the job. 
    # SQLAlchemy async delete:
    await db.delete(job)
    await db.commit()
    return job
