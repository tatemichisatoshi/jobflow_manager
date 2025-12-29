# Jobflow Manager

Jobflow Manager is a background job management SaaS designed for internal enterprise use.
Users can create parameterized jobs, execute them asynchronously via Celery workers, and monitor their status and logs in real-time through a Web UI.

## Use Cases

- Managing data collection and validation batches within a company.
- Visualizing execution history and results of periodic or manual jobs.
- Background processing infrastructure for business tools used by multiple team members.

## Key Features

- **Authentication/Authorization**: Secure login using JWT (separation of Admin/User privileges).
- **Job Management**: Create, list, and view details of jobs.
- **Asynchronous Execution**: Jobs are queued in Redis and processed asynchronously by Celery workers.
- **Real-time Status**: Track job state transitions (Queued -> Running -> Success/Failed).
- **Log & Result Verification**: Detailed view for execution logs and processing result summaries.

## Design Decisions

- **Separation of Concerns**: Adopted Celery to completely separate the Web/API layer (FastAPI) from heavy execution logic (Worker), ensuring response performance and stability.
- **Scalable Database Design**: Normalized and separated Job definitions and JobRun history to handle future data growth.
- **Pragmatic UI**: Prioritized readability and clarity of operation over flashy design, assuming a business application context.

## Architecture

Adopted a modern stack assuming real-world operation.

- **Frontend**: Next.js 14 (App Router), TypeScript, Vanilla CSS
- **Backend**: FastAPI, Python 3.11, SQLAlchemy (Async)
- **Database**: PostgreSQL (Data), Redis (Queue)
- **Worker**: Celery
- **Infrastructure**: Docker Compose, Docker
- **CI**: GitHub Actions

## Directory Structure

```
jobflow-manager/
├── backend/          # FastAPI Application
│   ├── app/
│   │   ├── api/      # API Endpoints
│   │   ├── core/     # Auth & Config
│   │   ├── models/   # DB Models
│   │   └── worker.py # Celery Task Definitions
│   ├── alembic/      # DB Migrations
│   └── tests/        # Pytest
├── frontend/         # Next.js Application
│   ├── src/
│   │   ├── app/      # Page Components
│   │   ├── components/
│   │   └── lib/      # API Client
├── docker-compose.yml
└── Makefile          # Operation Commands
```

## How to Start

### Prerequisites

- Docker & Docker Compose
- Make (Optional)

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tatemichisatoshi/jobflow_manager.git
   cd jobflow_manager
   ```

2. **Configure Environment Variables**
   Copy `.env.example` to create `.env`.
   ```bash
   cp .env.example .env
   # Check frontend/.env.local if necessary
   ```

3. **Start Services**
   ```bash
   make up
   # or
   docker compose up -d
   ```

4. **Create Admin User**
   Create an admin user for initial setup.
   ```bash
   make user-create
   ```
   *Created User: `admin@example.com` / `admin`*

5. **Access**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Future Roadmap

- **WebSocket Support**: [Issue #1](https://github.com/tatemichisatoshi/jobflow_manager/issues/1) - Real-time status updates without polling.
- **Scheduled Execution**: [Issue #2](https://github.com/tatemichisatoshi/jobflow_manager/issues/2) - Cron-like scheduled job features.
- **Notification Integration**: [Issue #3](https://github.com/tatemichisatoshi/jobflow_manager/issues/3) - Slack/Email notifications upon job completion.

## Development Commands

- **Run Backend Tests**: `make test-backend`
- **Frontend Lint**: `cd frontend && npm run lint`
