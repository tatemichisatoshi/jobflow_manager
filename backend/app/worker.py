import os
import time
from celery import Celery
from app.core.config import settings
from app.db.session import SessionLocal
from app import models
import asyncio
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# Use sync engine for Celery to avoid complex async loop management if possible,
# or just use asyncio.run with the async engine. 
# Using sync engine with psycopg2 is more robust for Celery.
SYNC_DATABASE_URL = str(settings.DATABASE_URL).replace("postgresql+asyncpg", "postgresql")
engine_sync = create_engine(SYNC_DATABASE_URL)
SessionSync = sessionmaker(bind=engine_sync)

celery_app = Celery("worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

@celery_app.task(acks_late=True)
def execute_job_task(job_run_id: int):
    db = SessionSync()
    import random
    import uuid
    
    try:
        # 1. Get JobRun
        job_run = db.query(models.JobRun).get(job_run_id)
        if not job_run:
            return "JobRun not found"

        # 2. Update status to running
        job_run.status = "running"
        job_run.started_at = datetime.utcnow()
        db.commit()

        # 3. Simulate work
        # Load parameters
        params = job_run.job.parameters or {}
        target_month = params.get("target_month", "2024-01")
        dept = params.get("department", "Unknown")
        include_drafts = params.get("include_drafts", False)

        def log(msg):
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
            return f"[{timestamp}] [INFO] {msg}"

        logs = []
        logs.append(log(f"ジョブを開始しました。実行ID: {uuid.uuid4()}"))
        logs.append(log(f"設定: 対象月={target_month}, 部署={dept}, ドラフト含む={include_drafts}"))
        logs.append(log("レポート生成エンジンの初期化中... (v2.4.1)"))
        
        # Simulate connection
        time.sleep(1)
        logs.append(log("データウェアハウス(DWH)に接続中..."))
        time.sleep(random.uniform(0.5, 1.5))
        logs.append(log("接続確立。レイテンシ: 42ms"))

        # Simulate data fetching
        time.sleep(1)
        logs.append(log(f"部署[{dept.upper()}]のデータを集計中..."))
        logs.append(log("クエリ実行: SELECT * FROM sales_monthly_snapshot WHERE ..."))
        
        # Simulate heavy processing
        process_time = random.uniform(2.0, 4.0)
        time.sleep(process_time)
        record_count = random.randint(1500, 50000)
        logs.append(log(f"データ取得完了。{record_count:,}件のレコードを処理しました ({process_time:.2f}秒)"))

        # Real PDF Generation
        logs.append(log("PDFレンダリングを開始します (ReportLab)..."))
        
        # Ensure directory exists
        reports_dir = "/app/app/static/reports" # Inside container
        if not os.path.exists(reports_dir):
            os.makedirs(reports_dir)
            
        filename = f"{dept}_{target_month}_{uuid.uuid4().hex[:8]}.pdf"
        filepath = os.path.join(reports_dir, filename)
        
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        
        c = canvas.Canvas(filepath, pagesize=A4)
        width, height = A4
        
        # Title
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, height - 50, "Monthly Sales Report")
        
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 80, f"Target Period: {target_month}")
        c.drawString(50, height - 100, f"Department: {dept.upper()}")
        c.drawString(50, height - 120, f"Generated At: {datetime.utcnow().isoformat()}")
        
        c.line(50, height - 130, width - 50, height - 130)
        
        # Content
        y = height - 160
        c.drawString(50, y, f"Total Records Processed: {record_count:,}")
        y -= 20
        c.drawString(50, y, f"Include Drafts: {include_drafts}")
        y -= 20
        c.drawString(50, y, "Status: FINAL")
        
        # Mock Data Table
        y -= 40
        c.drawString(50, y, "Top Regions:")
        y -= 20
        regions = ["North America", "Europe", "Asia Pacific", "Latin America"]
        for region in regions:
            val = random.randint(100000, 1000000)
            c.drawString(70, y, f"- {region}: ${val:,}")
            y -= 20
            
        c.showPage()
        c.save()
        
        file_size_bytes = os.path.getsize(filepath)
        file_size_mb = f"{file_size_bytes / 1024 / 1024:.2f} MB"
        
        logs.append(log(f"レンダリング成功。ファイルを保存しました: {filepath}"))
        logs.append(log(f"ファイルサイズ: {file_size_mb}"))

        # Simulate Upload (Internal Storage)
        logs.append(log("社内ストレージへアーカイブ中..."))
        time.sleep(0.5)
        logs.append(log("アーカイブ完了。"))

        logs.append(log("ジョブが正常に終了しました。"))

        # 4. Result
        job_run.status = "success"
        job_run.finished_at = datetime.utcnow()
        job_run.logs = "\n".join(logs)
        
        # Return valid URL accessible from browser
        # Note: In docker-compose, backend is mapped to localhost:8000
        download_url = f"http://localhost:8000/static/reports/{filename}"
        
        job_run.result_summary = {
            "target_month": target_month,
            "department": dept,
            "record_count": record_count,
            "file_size": file_size_mb,
            "download_url": download_url
        }
        
        db.commit()
        return "Success"
    except Exception as e:
        db.rollback()
        if job_run:
            job_run.status = "failed"
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
            job_run.logs = (job_run.logs or "") + f"\n[{timestamp}] [ERROR] Process failed: {str(e)}"
            job_run.finished_at = datetime.utcnow()
            db.commit()
        raise e
    finally:
        db.close()

from datetime import datetime
