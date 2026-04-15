# TinyCloud Frontend

## What Is This

This repository contains the TinyCloud web UI: a React + TypeScript frontend for creating short links, browsing saved links, editing and deleting mappings, and generating QR codes.

In production it is shipped as a static bundle behind Nginx, which proxies API requests to the backend service.

## How To Run

### Local development

```bash
npm ci
npm run dev
```

This starts the Vite dev server.

### Production-style local build

```bash
npm ci
npm run build
docker build -t tinycloud-frontend:local .
docker run --rm -p 8081:80 -e BACKEND_HOST=host.docker.internal tinycloud-frontend:local
```

The container serves the built app with Nginx and proxies `/url-mapping` to `BACKEND_HOST`.

### Full stack locally

The easiest full-stack local run is through `tinycloud-project/docker-compose.yml`, which starts this frontend together with the backend and Postgres.

## Architecture

Main frontend pieces:

- `src/App.tsx` composes the main layout and feature panels
- `src/components` contains UI for shortening links, QR generation, editing, and link listing
- `src/hooks/useLinks.ts` manages fetch/reload/delete behavior
- `src/hooks/useApiStatus.ts` probes backend availability
- `src/services/api.ts` centralizes API requests
- `nginx.conf` proxies `/url-mapping` traffic to the backend service
- `charts/tinycloud-frontend` packages the app for Kubernetes

Runtime flow:

1. The browser loads a static Vite build from Nginx.
2. UI actions call `apiRequest(...)` in `src/services/api.ts`.
3. Nginx forwards `/url-mapping` requests to the backend service defined by `BACKEND_HOST`.
4. The UI refreshes local state after create, update, or delete actions.

## CI/CD

GitHub Actions workflow: `.github/workflows/pipeline.yaml`

On every push to `main`, the pipeline:

1. Creates a new patch semver tag.
2. Builds the frontend Docker image.
3. Pushes the image to Amazon ECR.
4. Packages and pushes the Helm chart to ECR as an OCI artifact.
5. Triggers `tinycloud-infra` to deploy the new frontend version to `dev`.

## Infra / Deploy Flow

The deploy handoff mirrors the backend flow:

1. This repo publishes a versioned Docker image and Helm chart.
2. `tinycloud-infra` is triggered with `environment`, `service=frontend`, and `version`.
3. Helmfile selects the correct frontend release per environment.
4. Environment values inject the backend service name and hostname for ingress.
5. Kubernetes rolls out the new frontend pod and exposes it through ingress where enabled.

The Helm values currently map environments to backend services like `tinycloud-backend-dev`, `tinycloud-backend-staging`, and `tinycloud-backend-prod`.

## What Was Learned

- Keeping the frontend stateless makes deployments simple: the only runtime coupling is the backend host injected into Nginx.
- A thin API client layer and small custom hooks are enough for a compact product when the domain is narrow and CRUD-heavy.
- Shipping the same app through Vite locally and Nginx in containers gives a clean split between developer speed and deployable output.

## Known Limitations

- There is no automated test suite in this repository yet.
- API base resolution assumes the frontend and backend share the same origin pathing through Nginx or ingress.
- The app is intentionally lightweight and does not include authentication, user accounts, or analytics.
- Error handling is functional but still basic, relying on simple alerts/messages rather than richer recovery states.
