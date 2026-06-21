# Bengaluru Traffic Command

AI-powered traffic command center for Bengaluru — real-time impact analysis, deployment planning, and response planning for large events and road incidents.

## Overview

Bengaluru Traffic Command is an operations dashboard that helps traffic officers and city planners anticipate congestion, allocate resources, and respond to incidents. It combines ASTraM datasets with a counterfactual scenario engine to produce realistic, data-driven recommendations rather than static placeholder outputs.

## Key Features

- **Overview** — Live command-center snapshot of city-wide traffic posture, EVITAS score, and active corridors.
- **Impact Analysis** — Counterfactual scenario engine to simulate changes in crowd size, event duration, road closures, and officer allocation. Dynamically updates EVITAS score and predicted delay.
- **Deployment Planner** — Calculates officer allocation using corridor risk, event severity, historical congestion impact, and crowd size. Produces realistic manpower and barricading recommendations.
- **Response Planner** — What-if analysis for increasing crowd size (25% / 50% / 100%), modifying road closures, and changing event duration to project operational impact immediately.

## Tech Stack

- **Framework:** TanStack Start (React 19 + Vite 7)
- **Styling:** Tailwind CSS v4
- **Backend:** Lovable Cloud (Supabase: Postgres, Auth, Storage, Edge Functions)
- **Language:** TypeScript

## Getting Started

```bash
bun install
bun run dev
```

The app runs on `http://localhost:8080`.

## Deployment

This project is built with [Lovable](https://lovable.dev) and can be deployed via the Lovable platform or self-hosted on Vercel / Cloudflare after connecting the GitHub repo.

## Data

All analytics are driven by ASTraM datasets and live signals from the Lovable Cloud backend — no static or placeholder AI outputs.
