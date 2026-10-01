---
name: deploy-to-cloud
description: Automates production deployment configuration for Parabox apps across Vercel (Next.js frontend) and Railway / Fly.io / Modal (FastAPI backend) with GitHub Actions CI/CD.
---

# Deploy to Cloud Skill

Use this skill when preparing a product app for live cloud deployment.

---

## 🎯 Target Architecture

* **Frontend:** Vercel / Cloudflare Pages (Next.js 15, SSR, Edge middleware).
* **Backend:** Railway / Fly.io / Modal (FastAPI, Python 3.12, Uvicorn, Celery/Worker).
* **Database:** Neon Serverless Postgres / Supabase / AWS RDS.
* **CI/CD:** GitHub Actions workflow executing `pytest`, `pnpm build`, and automated Playwright smoke tests.

---

## 🛠️ Step-by-Step Deployment Protocol

1. **Backend Containerization:**
   - Verify `apps/<name>/Dockerfile` with multi-stage build:
     ```dockerfile
     FROM python:3.12-slim as builder
     COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
     WORKDIR /app
     COPY pyproject.toml uv.lock ./
     RUN uv sync --frozen --no-install-project
     COPY . .
     RUN uv sync --frozen
     CMD ["uv", "run", "uvicorn", "apps.<name>.src.main:app", "--host", "0.0.0.0", "--port", "8000"]
     ```

2. **Frontend Deployment Config:**
   - Verify `apps/<name>/next.config.ts` has standalone build output enabled if deploying to Docker, or standard Vercel adapter.
   - Configure environment variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_BASE_URL`.

3. **CI/CD Workflow (`.github/workflows/deploy.yml`):**
   - Step 1: Run Backend `pytest`.
   - Step 2: Run Frontend `pnpm typecheck && pnpm build`.
   - Step 3: Run Playwright headless smoke tests.
   - Step 4: Deploy on `main` merge.
