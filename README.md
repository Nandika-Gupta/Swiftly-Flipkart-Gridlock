# SWIFTLY - Event-Driven Congestion Intelligence for Bengaluru

> **Predict. Deploy. Divert.**
> An operational command surface that forecasts the traffic impact of planned and unplanned events *before* congestion occurs - built on 8,173 real ASTraM event records, Bengaluru Traffic Police (BTP) historical statistics and MapMyIndia corridor intelligence.

---

## Theme

**Dark, high-density command-center aesthetic** in the spirit of modern public-safety operations dashboards (Drishti / Palantir Gotham style).

- **Palette** - Deep navy/space `#060912` → `#0b1424` surfaces, cyan `#4fd1ff` signal accents, EVITAS band colors (green / yellow / orange / red) for risk severity, amber CTA `#ff8c42`.
- **Typography** - System UI stack with monospace numerals for metrics; uppercase eyebrows with wide letter-spacing for section structure.
- **Motion** - Subtle radial glows, animated scan bars on loading, hover lifts on capability cards. No frivolous animation.
- **Density** - Inspired by real traffic-ops control rooms: information-rich panels, no marketing whitespace inside operational modules.

Landing page sells the vision. Operational modules demonstrate the technology.

---

## Screenshots

### Landing - vision, EVITAS framework, partners, capabilities
![Landing](docs/screenshots/01_landing.png)

### Operations Center - standalone 3D command surface (event simulation, AI insight, corridor map)
![Operations Center](docs/screenshots/02_operations_center.png)

### Module 01 · Event Intelligence - live ASTraM event stream, EVITAS classification
![Event Intelligence](docs/screenshots/03_event_intelligence.png)

### Module 02 · Operational Scenario Lab - simulate crowd / closure / duration, see deployment update
![Scenario Lab](docs/screenshots/04_scenario_lab.png)

### Module 03 · Corridor Intelligence - 23 corridors ranked by EVITAS + BTP vulnerability
![Corridor Intelligence](docs/screenshots/05_corridor_intelligence.png)

### Module 04 · Response Planning - five-stage operational playbook
![Response Planning](docs/screenshots/06_response_planning.png)

### Module 05 · Command Copilot - plain-English Q&A grounded in ASTraM + BTP data
![Command Copilot](docs/screenshots/07_command_copilot.png)

---

## What's inside

**Five operational modules** wired around the **EVITAS** (Event Vulnerability & Impact Traffic Assessment Score, 0–100):

| # | Module | What it does |
|---|--------|--------------|
| 01 | **Event Intelligence** | Live ASTraM event stream classified by EVITAS impact and cause |
| 02 | **Operational Scenario Lab** | Simulate crowd, closure, duration - EVITAS, delay and deployment update live |
| 03 | **Corridor Intelligence** | 23 Bengaluru corridors ranked by EVITAS + BTP vulnerability (accidents, congestion, peaks) |
| 04 | **Response Planning** | Five-stage operational playbook from forecast → debrief |
| 05 | **Command Copilot** | Ask plain-English questions grounded in ASTraM + BTP data |

**EVITAS bands**

| Band | Range | Posture |
|------|-------|---------|
| Green | 0–34 | Normal - standard rotation |
| Yellow | 35–54 | Watch - pre-position spotters |
| Orange | 55–74 | Elevated - activate diversion, reserves on standby |
| Red | 75–100 | Critical - full deployment, public advisory, real-time re-scoring |

---

## Data sources

All data shipped with this repo is **real, not synthetic**:

| Source | What it provides | Path |
|--------|-------------------|------|
| **ASTraM Event Data** | 8,173 Bengaluru event records · 23 corridors · 18 months | `public/data/events.json`, `public/data/counterfactuals.json` |
| **Bengaluru Traffic Police (BTP)** | Historical statistics — accidents, incidents, congestion index, peak windows. Used as historical risk factors, not real-time feeds | `public/data/btp_stats.json` |
| **MapMyIndia** | Corridor visualization, route intelligence, diversion planning surface | Embedded in the standalone Operations Center bundle |

---

## Tech stack

- **Framework** - React 19, SSR, file-based routing
- **Bundler** - Vite 7
- **Styling** - Tailwind CSS v4 + custom design tokens
- **UI Primitives** - Radix UI + shadcn/ui
- **Data** - Static JSON snapshots in `public/data/`
- **AI Copilot** - Server function calling an OpenAI-compatible gateway via `@ai-sdk/openai-compatible`
- **Operations Center** - Pre-bundled standalone HTML (`public/swiftly.html`) so the 3D map surface loads independently of the SPA shell

---

## Project structure

```
src/
  routes/
    __root.tsx               # Root layout + global head
    index.tsx                # Landing page (vision, EVITAS, partners, capabilities)
    swiftly.intelligence.tsx # Module 01 — Event Intelligence
    swiftly.deployment.tsx   # Module 02 — Operational Scenario Lab
    swiftly.corridors.tsx    # Module 03 — Corridor Intelligence
    swiftly.response.tsx     # Module 04 — Response Planning
    swiftly.copilot.tsx      # Module 05 — Command Copilot
    api/                     # Server routes (Copilot endpoint, etc.)
  components/swiftly/        # ModuleShell, ScenarioLab, design tokens
public/
  swiftly.html               # Standalone Operations Center bundle
  swiftly-augment.js         # Data + Copilot wiring for the standalone surface
  data/                      # ASTraM, BTP, corridor, counterfactual JSON
docs/screenshots/            # README screenshots
```

---

## Run locally

**Prerequisites** — Node 20+ and [Bun](https://bun.sh) (or npm/pnpm).

```bash
# install
bun install            # or: npm install

# dev server (http://localhost:8080)
bun run dev            # or: npm run dev

# production build
bun run build
bun run preview
```
---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/swiftly.html` | Standalone Operations Center (hard-loaded, bypasses SPA router) |
| `/swiftly/intelligence` | Module 01 |
| `/swiftly/deployment` | Module 02 |
| `/swiftly/corridors` | Module 03 |
| `/swiftly/response` | Module 04 |
| `/swiftly/copilot` | Module 05 |

---



---

*SWIFTLY · Towards an Unjammed Bengaluru.*
