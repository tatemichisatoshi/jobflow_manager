.PHONY: up down build logs test-backend lint-backend user-create

# Docker Compose Operations
up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

# Backend Operations
test-backend:
	docker compose exec backend pytest

lint-backend:
	docker compose exec backend flake8 .
	docker compose exec backend mypy .

# DB Operations
migrate:
	docker compose exec backend alembic upgrade head

# Admin Management
user-create:
	docker compose exec backend python -m app.initial_data
