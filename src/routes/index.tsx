import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swiftly — Bengaluru Traffic Intelligence Platform" },
      {
        name: "description",
        content:
          "Swiftly forecasts event-driven congestion in Bengaluru using the EVITAS pipeline — DR Learner counterfactuals, event impact scoring, and ILP-optimized officer deployment.",
      },
      { property: "og:title", content: "Swiftly — Bengaluru Traffic Intelligence" },
      {
        property: "og:description",
        content:
          "ASTraM-grade event intelligence for BTP. 8,173 events, 23 corridors, real-time EVITAS risk scoring and optimal resource allocation.",
      },
    ],
  }),
  component: SwiftlyShell,
});

type Corridor = {
  corridor_name: string;
  mean_evitas?: number;
  max_evitas?: number;
  red_events?: number;
  orange_events?: number;
  event_count?: number;
  risk_rank?: number;
  risk_score?: number;
  closure_rate?: number;
  mean_severity?: number;
};

const commandTabs = [
  "Live Map",
  "Forecast & Intel",
  "What-if Simulator",
  "Response Plan",
  "Corridor Intelligence",
  "AI Copilot",
] as const;

function SwiftlyShell() {
  const [entered, setEntered] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/data/corridors.json")
      .then((r) => r.json())
      .then((d: Corridor[]) => {
        const sorted = [...d].sort(
          (a, b) => (a.risk_rank ?? 999) - (b.risk_rank ?? 999),
        );
        setCorridors(sorted.slice(0, 8));
      })
      .catch(() => {});
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!entered) setFrameLoaded(false);
  }, [entered]);

  const top = corridors[0];
  const topThree = useMemo(() => corridors.slice(0, 3), [corridors]);
  const topFour = useMemo(() => corridors.slice(0, 4), [corridors]);
  const timeStr = now ? now.toLocaleTimeString("en-IN", { hour12: false }) : "—— : —— : ——";
  const dateStr = now
    ? now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "";
  const scoreOf = (c: Corridor) =>
    c.mean_evitas ?? (c.risk_score != null ? c.risk_score * 100 : 0);

  if (entered) {
    return (
      <div className="swf-entered">
        <style>{css}</style>
        <iframe
          title="Swiftly Command Center"
          src="/swiftly.html"
          onLoad={() => setFrameLoaded(true)}
          className={`swf-frame ${frameLoaded ? "is-ready" : ""}`}
        />

        {!frameLoaded && (
          <div className="swf-loader-shell" aria-live="polite">
            <div className="swf-loader-panel">
              <div className="swf-loader-brand">
                <div className="swf-loader-mark">◈</div>
                <div>
                  <div className="swf-loader-name">SWIFTLY COMMAND CENTER</div>
                  <div className="swf-loader-sub">Initializing 3D corridor intelligence</div>
                </div>
              </div>

              <div className="swf-loader-stage-wrap">
                <div className="swf-loader-stage is-active">
                  <span className="swf-loader-stage-dot" />
                  Loading standalone map bundle
                </div>
                <div className="swf-loader-stage is-active">
                  <span className="swf-loader-stage-dot" />
                  Hydrating telemetry overlays
                </div>
                <div className="swf-loader-stage">
                  <span className="swf-loader-stage-dot" />
                  Handing over to live ops surface
                </div>
              </div>

              <div className="swf-loader-bar">
                <div className="swf-loader-bar-fill" />
              </div>

              <div className="swf-loader-grid">
                <LoaderStat label="Pipeline" value="ASTraM → EVITAS" />
                <LoaderStat label="Corridors" value="23 live" />
                <LoaderStat label="Mode" value="Command center" />
                <LoaderStat label="Status" value="Secured render" />
              </div>
            </div>
          </div>
        )}

        <div className="swf-entered-topbar">
          <div className="swf-entered-brand">
            <div className="swf-entered-logo">◈</div>
            <div>
              <div className="swf-entered-title">SWIFTLY</div>
              <div className="swf-entered-sub">Bengaluru Traffic Intelligence</div>
            </div>
          </div>

          <div className="swf-entered-right">
            <div className="swf-pill swf-pill-dark">
              <span className="swf-dot swf-dot-green" /> LIVE MAP CORE
            </div>
            <div className="swf-pill swf-pill-dark">
              <span className="swf-dot swf-dot-blue" /> EVITAS ACTIVE
            </div>
            <button className="swf-return-chip" onClick={() => setEntered(false)}>
              ← BRIEFING
            </button>
          </div>
        </div>

        <div className="swf-entered-bottom">
          <div className="swf-entered-bottom-label">Standalone Swiftly 3D map preserved</div>
          <div className="swf-entered-bottom-tabs">
            {commandTabs.map((tab) => (
              <span key={tab} className="swf-mini-tab">
                {tab}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="swf-landing">
      <style>{css}</style>
      <div className="swf-grid-bg" />
      <div className="swf-glow swf-glow-a" />
      <div className="swf-glow swf-glow-b" />

      <header className="swf-topbar">
        <div className="swf-brand">
          <div className="swf-logo">◈</div>
          <div>
            <div className="swf-brand-name">SWIFTLY</div>
            <div className="swf-brand-sub">Bengaluru Traffic Intelligence</div>
          </div>
        </div>
        <div className="swf-topbar-right">
          <div className="swf-pill">
            <span className="swf-dot swf-dot-green" /> ASTraM LIVE
          </div>
          <div className="swf-pill">
            <span className="swf-dot swf-dot-blue" /> MapMyIndia
          </div>
          <div className="swf-badge">BTP · ADMIN</div>
          <div className="swf-clock">
            <div className="swf-time">{timeStr}</div>
            <div className="swf-date">{dateStr} IST</div>
          </div>
        </div>
      </header>

      <main className="swf-shell">
        <aside className="swf-rail">
          <div className="swf-rail-card swf-rail-brand-card">
            <div className="swf-rail-mark">◈</div>
            <div className="swf-rail-title">Swiftly Ops Stack</div>
            <div className="swf-rail-copy">
              Field-grade event intelligence for planned, unplanned, and cascading congestion scenarios.
            </div>
          </div>

          <div className="swf-rail-section">
            <div className="swf-rail-kicker">Active command modules</div>
            <div className="swf-rail-tabs">
              {commandTabs.map((tab, index) => (
                <div key={tab} className={`swf-rail-tab ${index === 0 ? "is-active" : ""}`}>
                  <span className="swf-rail-tab-index">0{index + 1}</span>
                  <span>{tab}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="swf-rail-section">
            <div className="swf-rail-kicker">Critical corridors</div>
            <div className="swf-rail-risks">
              {topThree.map((c) => (
                <div key={c.corridor_name} className="swf-rail-risk">
                  <div>
                    <div className="swf-rail-risk-name">{c.corridor_name}</div>
                    <div className="swf-rail-risk-meta">{c.event_count ?? 0} events tracked</div>
                  </div>
                  <div className="swf-rail-risk-score">{scoreOf(c).toFixed(1)}</div>
                </div>
              ))}
              {!topThree.length && <div className="swf-corr-empty">Loading corridor risk data…</div>}
            </div>
          </div>
        </aside>

        <section className="swf-content">
          <section className="swf-hero-panel">
            <div className="swf-hero-copy">
              <div className="swf-eyebrow">
                <span className="swf-eyebrow-line" />
                EVITAS PIPELINE · v2.4 · DEPLOYED
              </div>
              <h1 className="swf-title">
                Swiftly command intelligence for an
                <span className="swf-title-accent"> operational Bengaluru.</span>
              </h1>
              <p className="swf-subtitle">
                A deployable briefing layer wrapped around the preserved Swiftly standalone map — causal forecasting,
                corridor vulnerability, scenario simulation, response planning, and AI-assisted field recommendations.
              </p>
            </div>

            <div className="swf-live-strip">
              <div className="swf-live-status">
                <div className="swf-live-status-label">Live posture</div>
                <div className="swf-live-status-value">Moderate escalation window</div>
              </div>
              <div className="swf-live-status-chip">Forecast confidence 82%</div>
            </div>

            <div className="swf-stats swf-stats-tight">
              <Stat value="8,173" label="ASTraM Events" sub="Analyzed" />
              <Stat value="23" label="Corridors" sub="Monitored" />
              <Stat value="91.0" label="Peak EVITAS" sub="Mysore Rd · RED" />
              <Stat value="₹2.4Cr" label="Est. Savings" sub="Officer optimization" />
              <Stat value="82%" label="Confidence" sub="Historical fit" />
            </div>

            <div className="swf-cta-row">
              <button className="swf-cta-primary" onClick={() => setEntered(true)}>
                ENTER COMMAND CENTER
                <span className="swf-cta-arrow">→</span>
              </button>
              <a className="swf-cta-secondary" href="#pipeline">
                VIEW PIPELINE
              </a>
            </div>
          </section>

          <section className="swf-command-grid">
            <div className="swf-card swf-card-strong">
              <div className="swf-card-head">
                <span className="swf-card-title">CORRIDOR LEADERBOARD</span>
                <span className="swf-card-sub">Live · ranked by EVITAS risk</span>
              </div>
              <div className="swf-corr-list">
                {topFour.map((c) => {
                  const s = scoreOf(c);
                  const band = s >= 80 ? "red" : s >= 60 ? "orange" : s >= 40 ? "yellow" : "green";
                  return (
                    <div className="swf-corr" key={c.corridor_name}>
                      <div className="swf-corr-rank">#{c.risk_rank ?? "—"}</div>
                      <div className="swf-corr-info">
                        <div className="swf-corr-name">{c.corridor_name}</div>
                        <div className="swf-corr-meta">
                          {c.event_count ?? 0} events · closure {((c.closure_rate ?? 0) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className={`swf-corr-score swf-band-${band}`}>{s.toFixed(1)}</div>
                    </div>
                  );
                })}
                {!topFour.length && <div className="swf-corr-empty">Loading corridor risk data…</div>}
              </div>
              {top && (
                <div className="swf-alert">
                  <div className="swf-alert-tag">▲ TOP RISK</div>
                  <div className="swf-alert-body">
                    <strong>{top.corridor_name}</strong> — EVITAS {scoreOf(top).toFixed(1)}. Pre-position officers 9–11 AM and 6–8 PM.
                  </div>
                </div>
              )}
            </div>

            <div className="swf-plan-card">
              <div className="swf-plan-kicker">Response plan engine</div>
              <div className="swf-plan-title">Minimum safe, balanced, and aggressive deployment</div>
              <div className="swf-plan-list">
                <PlanRow tone="amber" title="Minimum Safe" officers="8 officers" detail="4 checkpoints · 94 min horizon" />
                <PlanRow tone="blue" title="Recommended" officers="11 officers" detail="5 checkpoints · 88 min horizon" />
                <PlanRow tone="red" title="Aggressive" officers="15 officers" detail="7 checkpoints · 84 min horizon" />
              </div>
            </div>
          </section>
        </section>
      </main>

      <section id="pipeline" className="swf-pipeline">
        <div className="swf-section-head">
          <span className="swf-section-eyebrow">— THE EVITAS PIPELINE</span>
          <h2 className="swf-section-title">From raw event to deployed officer in three stages.</h2>
        </div>
        <div className="swf-stages">
          <Stage
            n="01"
            title="DR Learner"
            sub="Causal Counterfactuals"
            body="A doubly-robust estimator (econml.DRLearner) computes the causal_delta for every event — the counterfactual congestion impact had the event not occurred. Trained on 8,173 ASTraM records across 18 months."
            stack="LightGBM · EconML · 18 months"
          />
          <Stage
            n="02"
            title="EVITAS Score"
            sub="0–100 Event Impact"
            body="Fuses causal_delta, severity_score, corridor closure_rate, and time-of-day factor into a single 0–100 score. Banded into GREEN (0–39), YELLOW (40–59), ORANGE (60–79), RED (80–100) for instant operational triage."
            stack="Weighted normalization · Per-event"
          />
          <Stage
            n="03"
            title="ILP Optimizer"
            sub="Manpower Allocation"
            body="Given N officers available, solves an integer linear program to minimize total weighted risk across corridors, guaranteeing minimum coverage for every RED and ORANGE corridor. SciPy linprog backend."
            stack="scipy.optimize · Real-time"
          />
        </div>
      </section>

      <footer className="swf-footer">
        <div>SWIFTLY · Built for the Bengaluru Traffic Police</div>
        <div>Powered by ASTraM · MapMyIndia · EVITAS v2.4</div>
      </footer>
    </div>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="swf-stat">
      <div className="swf-stat-value">{value}</div>
      <div className="swf-stat-label">{label}</div>
      <div className="swf-stat-sub">{sub}</div>
    </div>
  );
}

function Stage({
  n,
  title,
  sub,
  body,
  stack,
}: { n: string; title: string; sub: string; body: string; stack: string }) {
  return (
    <div className="swf-stage">
      <div className="swf-stage-n">{n}</div>
      <div className="swf-stage-title">{title}</div>
      <div className="swf-stage-sub">{sub}</div>
      <p className="swf-stage-body">{body}</p>
      <div className="swf-stage-stack">{stack}</div>
    </div>
  );
}

function LoaderStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="swf-loader-stat">
      <div className="swf-loader-stat-label">{label}</div>
      <div className="swf-loader-stat-value">{value}</div>
    </div>
  );
}

function IntelCard({
  title,
  body,
  list,
  tags,
  accent,
}: {
  title: string;
  body?: string;
  list?: string[];
  tags?: string[];
  accent: "cyan" | "amber" | "green";
}) {
  return (
    <div className={`swf-intel-card swf-accent-${accent}`}>
      <div className="swf-intel-title">{title}</div>
      {body ? <p className="swf-intel-body">{body}</p> : null}
      {tags ? (
        <div className="swf-intel-tags">
          {tags.map((tag) => (
            <span key={tag} className="swf-intel-tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      {list ? (
        <div className="swf-intel-list">
          {list.map((item, index) => (
            <div key={item} className="swf-intel-list-item">
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PlanRow({
  tone,
  title,
  officers,
  detail,
}: {
  tone: "amber" | "blue" | "red";
  title: string;
  officers: string;
  detail: string;
}) {
  return (
    <div className={`swf-plan-row swf-plan-${tone}`}>
      <div className="swf-plan-row-top">
        <div className="swf-plan-row-title">{title}</div>
        <div className="swf-plan-row-chip">{officers}</div>
      </div>
      <div className="swf-plan-row-detail">{detail}</div>
    </div>
  );
}

const css = `
.swf-landing{position:relative;min-height:100vh;overflow:hidden;background:#07111d;color:#e8edf7;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.swf-grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(77,118,177,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(77,118,177,.07) 1px,transparent 1px);background-size:72px 72px;mask-image:radial-gradient(circle at 40% 20%,#000 0%,transparent 78%);pointer-events:none;z-index:0}
.swf-glow{position:fixed;border-radius:999px;filter:blur(80px);pointer-events:none;z-index:0;opacity:.75}
.swf-glow-a{width:720px;height:720px;left:-120px;top:120px;background:radial-gradient(circle,rgba(238,107,37,.34),transparent 68%)}
.swf-glow-b{width:800px;height:800px;right:-180px;top:160px;background:radial-gradient(circle,rgba(64,112,245,.34),transparent 70%)}

.swf-topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:16px 26px;border-bottom:1px solid rgba(163,178,219,.12);background:rgba(7,17,29,.7);backdrop-filter:blur(18px)}
.swf-brand{display:flex;align-items:center;gap:12px}
.swf-logo,.swf-entered-logo,.swf-loader-mark,.swf-rail-mark{display:flex;align-items:center;justify-content:center;font-weight:900}
.swf-logo{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#4fd1ff,#ff8c42);color:#07111d;font-size:18px;box-shadow:0 14px 30px rgba(79,209,255,.16)}
.swf-brand-name{font-size:15px;font-weight:800;letter-spacing:3px;color:#f4f7fb}
.swf-brand-sub{font-size:10px;color:#98a7c7;letter-spacing:1.6px;text-transform:uppercase;margin-top:2px}
.swf-topbar-right{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end}
.swf-pill{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:999px;border:1px solid rgba(154,174,219,.18);background:rgba(255,255,255,.03);color:#b5c0d7;font-size:10px;letter-spacing:1.25px;font-weight:700}
.swf-pill-dark{background:rgba(7,17,29,.52);border-color:rgba(150,173,220,.22)}
.swf-dot{width:7px;height:7px;border-radius:50%}
.swf-dot-green{background:#2ed573;box-shadow:0 0 10px rgba(46,213,115,.7)}
.swf-dot-blue{background:#4fd1ff;box-shadow:0 0 10px rgba(79,209,255,.7)}
.swf-badge{padding:7px 12px;border-radius:10px;background:linear-gradient(135deg,rgba(255,140,66,.16),rgba(79,209,255,.12));border:1px solid rgba(255,255,255,.1);font-size:10px;letter-spacing:1.4px;color:#ffd6b7;font-weight:700}
.swf-clock{text-align:right;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.swf-time{font-size:14px;font-weight:700;color:#f6f8fb}
.swf-date{font-size:9px;color:#97a7c7;letter-spacing:1px}

.swf-shell{position:relative;z-index:5;display:grid;grid-template-columns:280px minmax(0,1fr);gap:22px;padding:22px;max-width:1560px;margin:0 auto}
.swf-rail,.swf-content{min-width:0}
.swf-rail{display:flex;flex-direction:column;gap:16px}
.swf-rail-card,.swf-rail-section,.swf-hero-panel,.swf-preview-panel,.swf-card,.swf-plan-card,.swf-stage,.swf-loader-panel{border:1px solid rgba(176,187,218,.14);background:linear-gradient(180deg,rgba(17,28,45,.62),rgba(10,18,31,.52));backdrop-filter:blur(18px);box-shadow:0 20px 50px rgba(0,0,0,.22)}
.swf-rail-card,.swf-rail-section,.swf-card,.swf-plan-card,.swf-stage,.swf-loader-panel{border-radius:20px}
.swf-hero-panel,.swf-preview-panel{border-radius:24px}
.swf-rail-brand-card{padding:20px}
.swf-rail-mark{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#ff8c42,#4fd1ff);color:#07111d;font-size:20px;margin-bottom:18px}
.swf-rail-title{font-size:22px;font-weight:800;letter-spacing:-.02em;color:#f7f9fc}
.swf-rail-copy{margin-top:8px;color:#96a7c7;font-size:14px;line-height:1.55}
.swf-rail-section{padding:18px}
.swf-rail-kicker{font-size:11px;color:#8fa1c3;letter-spacing:1.8px;text-transform:uppercase;font-weight:800;margin-bottom:14px}
.swf-rail-tabs{display:flex;flex-direction:column;gap:9px}
.swf-rail-tab{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid transparent;color:#c3cde0;font-size:13px;font-weight:600}
.swf-rail-tab.is-active{border-color:rgba(255,140,66,.34);background:linear-gradient(90deg,rgba(255,140,66,.12),rgba(79,209,255,.08));color:#fff}
.swf-rail-tab-index{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#7891bc;font-size:11px}
.swf-rail-risks{display:flex;flex-direction:column;gap:10px}
.swf-rail-risk{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.03)}
.swf-rail-risk-name{font-size:13px;font-weight:700;color:#f0f4fb}
.swf-rail-risk-meta{margin-top:4px;font-size:10px;color:#8296bb;letter-spacing:.6px}
.swf-rail-risk-score{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;font-weight:800;color:#ffb16f}

.swf-content{display:flex;flex-direction:column;gap:22px}
.swf-hero-panel{padding:28px 28px 24px;position:relative;overflow:hidden}
.swf-hero-panel::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,114,36,.28) 0%,rgba(144,99,166,.16) 48%,rgba(52,96,213,.32) 100%);opacity:.95;pointer-events:none}
.swf-hero-panel>*{position:relative;z-index:1}
.swf-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:2.4px;color:#7bd8ff;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;margin-bottom:18px}
.swf-eyebrow-line{display:inline-block;width:32px;height:1px;background:#7bd8ff}
.swf-title{max-width:920px;font-size:clamp(38px,4.9vw,68px);line-height:1.02;font-weight:850;letter-spacing:-.04em;margin:0;color:#f7f9fd}
.swf-title-accent{display:inline;color:#8de2ff}
.swf-subtitle{max-width:880px;margin:16px 0 0;color:#d2daea;font-size:18px;line-height:1.62}
.swf-live-strip{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-top:24px;padding:14px 16px;border-radius:16px;background:rgba(9,18,32,.26);border:1px solid rgba(255,255,255,.08)}
.swf-live-status-label{font-size:10px;text-transform:uppercase;letter-spacing:1.6px;color:#93a6ca;font-weight:800}
.swf-live-status-value{margin-top:6px;font-size:16px;font-weight:700;color:#f3f7fc}
.swf-live-status-chip{padding:10px 12px;border-radius:12px;background:rgba(255,140,66,.14);border:1px solid rgba(255,140,66,.25);color:#ffd1ad;font-size:12px;font-weight:700}
.swf-stats{display:grid;gap:14px}
.swf-stats-tight{grid-template-columns:repeat(5,minmax(0,1fr));margin-top:18px}
.swf-stat{padding:16px 16px 14px;border-radius:18px;background:rgba(8,16,30,.28);border:1px solid rgba(255,255,255,.08)}
.swf-stat-value{font-size:26px;font-weight:850;color:#fff;letter-spacing:-.03em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.swf-stat-label{font-size:11px;color:#d4dceb;margin-top:4px;font-weight:700;letter-spacing:.6px;text-transform:uppercase}
.swf-stat-sub{font-size:10px;color:#93a5c6;margin-top:4px;letter-spacing:.5px}
.swf-cta-row{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:22px}
.swf-cta-primary{display:inline-flex;align-items:center;gap:14px;padding:15px 24px;border:0;border-radius:14px;background:linear-gradient(135deg,#ff8c42,#4fd1ff);color:#08111b;font-size:12px;font-weight:900;letter-spacing:2px;cursor:pointer;box-shadow:0 18px 40px rgba(27,40,73,.28);transition:transform .18s ease,box-shadow .18s ease}
.swf-cta-primary:hover{transform:translateY(-2px);box-shadow:0 22px 48px rgba(27,40,73,.34)}
.swf-cta-arrow{font-size:18px;transition:transform .18s ease}
.swf-cta-primary:hover .swf-cta-arrow{transform:translateX(4px)}
.swf-cta-secondary{padding:14px 20px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(8,16,30,.22);color:#eef3fa;font-size:12px;letter-spacing:1.5px;font-weight:800;text-decoration:none}
.swf-cta-secondary:hover{border-color:rgba(79,209,255,.35)}

.swf-command-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(320px,.8fr);gap:22px}
.swf-preview-panel{padding:22px;position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(16,27,45,.58),rgba(10,17,30,.56))}
.swf-preview-panel::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,124,38,.22) 0%,rgba(149,101,168,.14) 47%,rgba(55,99,218,.28) 100%);pointer-events:none}
.swf-preview-panel>*{position:relative;z-index:1}
.swf-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:16px}
.swf-panel-eyebrow{font-size:11px;letter-spacing:1.7px;text-transform:uppercase;color:#94a8cd;font-weight:800}
.swf-panel-title{margin:8px 0 0;font-size:30px;font-weight:800;letter-spacing:-.02em;color:#fff}
.swf-panel-chip{padding:9px 11px;border-radius:12px;background:rgba(79,209,255,.1);border:1px solid rgba(79,209,255,.2);font-size:11px;color:#a8e5ff;font-weight:800;letter-spacing:1px;white-space:nowrap}
.swf-module-tabs{display:flex;gap:10px;flex-wrap:wrap;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.08)}
.swf-module-tab{padding:8px 0;border:0;background:transparent;color:#cad4e7;font-size:13px;font-weight:600;cursor:default;border-bottom:2px solid transparent}
.swf-module-tab.is-active{color:#ff8f65;border-color:#ff6c4b}
.swf-preview-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(280px,.75fr);gap:18px;padding-top:18px}
.swf-map-ghost{position:relative;min-height:520px;border-radius:22px;overflow:hidden;background:radial-gradient(circle at center,rgba(255,183,39,.14),transparent 22%),linear-gradient(180deg,rgba(5,11,20,.92),rgba(8,14,24,.94));border:1px solid rgba(255,255,255,.08)}
.swf-map-ghost::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(79,107,165,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(79,107,165,.18) 1px,transparent 1px);background-size:42px 42px;opacity:.24}
.swf-map-radar{position:absolute;inset:12%;border-radius:50%;background:radial-gradient(circle,rgba(255,152,53,.35),rgba(255,118,33,.18) 26%,transparent 46%);filter:blur(16px)}
.swf-map-ring{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;border:3px solid rgba(255,166,61,.74)}
.swf-map-ring-a{width:112px;height:112px}
.swf-map-ring-b{width:236px;height:236px;border-color:rgba(255,166,61,.28)}
.swf-map-cross{position:absolute;left:50%;top:50%;border-radius:999px;background:linear-gradient(90deg,#0bd4ff,#27f0ff)}
.swf-map-cross-a{width:70%;height:18px;transform:translate(-50%,-50%) rotate(-27deg)}
.swf-map-cross-b{width:58%;height:18px;transform:translate(-50%,-50%) rotate(26deg)}
.swf-map-node{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;background:#ffd059;box-shadow:0 0 0 6px rgba(255,208,89,.18),0 0 30px rgba(255,208,89,.5)}
.swf-diagnostic-stack{display:flex;flex-direction:column;gap:16px}
.swf-intel-card{padding:22px;border-radius:22px;background:rgba(154,171,225,.12);border:1px solid rgba(255,255,255,.12)}
.swf-intel-title{font-size:15px;font-weight:800;margin-bottom:14px}
.swf-intel-body{margin:0;color:#dfe7f4;font-size:15px;line-height:1.62}
.swf-intel-tags{display:flex;gap:10px;flex-wrap:wrap}
.swf-intel-tag{padding:10px 12px;border-radius:12px;background:rgba(9,16,28,.22);border:1px solid rgba(255,255,255,.1);color:#d4deee;font-size:12px;font-weight:700}
.swf-intel-list{display:flex;flex-direction:column;gap:12px}
.swf-intel-list-item{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:flex-start}
.swf-intel-list-item span{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#35d098;color:#08111b;font-size:12px;font-weight:900}
.swf-intel-list-item p{margin:0;color:#dbe5f3;font-size:14px;line-height:1.55}
.swf-accent-cyan .swf-intel-title{color:#4fd1ff}
.swf-accent-amber .swf-intel-title{color:#ffaf61}
.swf-accent-green .swf-intel-title{color:#41d89e}

.swf-side-stack{display:flex;flex-direction:column;gap:22px}
.swf-card{padding:20px}
.swf-card-strong{background:linear-gradient(180deg,rgba(18,29,48,.72),rgba(8,15,26,.66))}
.swf-card-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.08)}
.swf-card-title{font-size:11px;font-weight:800;letter-spacing:2px;color:#fff}
.swf-card-sub{font-size:10px;color:#8fa1c3;letter-spacing:.6px}
.swf-corr-list{display:flex;flex-direction:column;gap:8px}
.swf-corr{display:grid;grid-template-columns:40px 1fr auto;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid transparent}
.swf-corr:hover{border-color:rgba(255,255,255,.1)}
.swf-corr-rank{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#7e95bc;font-weight:800}
.swf-corr-name{font-size:13px;font-weight:700;color:#e9eef7}
.swf-corr-meta{font-size:10px;color:#8ca0c4;margin-top:3px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.swf-corr-score{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:15px;font-weight:800;padding:6px 10px;border-radius:10px;min-width:56px;text-align:center}
.swf-band-green{background:rgba(46,213,115,.12);color:#69ef9e;border:1px solid rgba(46,213,115,.24)}
.swf-band-yellow{background:rgba(255,192,71,.12);color:#ffd37a;border:1px solid rgba(255,192,71,.24)}
.swf-band-orange{background:rgba(255,140,66,.14);color:#ffb079;border:1px solid rgba(255,140,66,.22)}
.swf-corr-empty{color:#8ca0c4;font-size:12px;padding:18px;text-align:center}
.swf-alert{margin-top:16px;padding:14px;border-radius:14px;background:linear-gradient(135deg,rgba(255,140,66,.14),rgba(255,99,70,.09));border:1px solid rgba(255,140,66,.26)}
.swf-alert-tag{font-size:10px;letter-spacing:2px;color:#ffb275;font-weight:900;margin-bottom:6px}
.swf-alert-body{font-size:12px;color:#d8e0ee;line-height:1.55}
.swf-plan-card{padding:20px;background:linear-gradient(180deg,rgba(18,29,48,.72),rgba(8,15,26,.66))}
.swf-plan-kicker{font-size:11px;color:#90a4ca;letter-spacing:1.8px;text-transform:uppercase;font-weight:900}
.swf-plan-title{margin-top:8px;font-size:22px;font-weight:800;line-height:1.2;color:#fff}
.swf-plan-list{display:flex;flex-direction:column;gap:12px;margin-top:18px}
.swf-plan-row{padding:16px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03)}
.swf-plan-row-top{display:flex;justify-content:space-between;gap:12px;align-items:center}
.swf-plan-row-title{font-size:14px;font-weight:800}
.swf-plan-row-chip{padding:7px 10px;border-radius:999px;background:rgba(8,16,30,.24);font-size:11px;font-weight:800;color:#dfe7f5}
.swf-plan-row-detail{margin-top:8px;color:#9eb0cf;font-size:12px}
.swf-plan-amber .swf-plan-row-title{color:#ffb25f}
.swf-plan-blue .swf-plan-row-title{color:#6db8ff}
.swf-plan-red .swf-plan-row-title{color:#ff7a7a}

.swf-pipeline{position:relative;z-index:5;padding:10px 22px 72px;max-width:1560px;margin:0 auto}
.swf-section-head{margin-bottom:26px}
.swf-section-eyebrow{font-size:11px;letter-spacing:2.4px;color:#7bd8ff;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.swf-section-title{font-size:clamp(28px,3.3vw,42px);font-weight:800;letter-spacing:-.02em;margin:10px 0 0;color:#fff;max-width:700px;line-height:1.12}
.swf-stages{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.swf-stage{position:relative;padding:24px;overflow:hidden}
.swf-stage::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#ff8c42,#4fd1ff)}
.swf-stage-n{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#7bd8ff;letter-spacing:2px;font-weight:800}
.swf-stage-title{font-size:22px;font-weight:800;color:#fff;margin-top:8px;letter-spacing:-.01em}
.swf-stage-sub{font-size:12px;color:#ffb16f;margin-top:4px;letter-spacing:1px;text-transform:uppercase;font-weight:800}
.swf-stage-body{font-size:13px;line-height:1.68;color:#a9b7d0;margin:16px 0 18px}
.swf-stage-stack{font-size:10px;color:#7f95bc;letter-spacing:1.2px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;padding-top:14px;border-top:1px solid rgba(255,255,255,.08)}
.swf-footer{position:relative;z-index:5;display:flex;justify-content:space-between;gap:10px;padding:24px 22px 30px;max-width:1560px;margin:0 auto;border-top:1px solid rgba(176,187,218,.1);font-size:11px;color:#7f93b8;letter-spacing:1px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}

.swf-entered{position:fixed;inset:0;background:#050b14;overflow:hidden}
.swf-frame{position:absolute;inset:0;width:100%;height:100%;border:0;opacity:0;transition:opacity .32s ease;background:#050b14}
.swf-frame.is-ready{opacity:1}
.swf-loader-shell{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at center,rgba(14,23,39,.32),rgba(4,8,15,.95));z-index:40}
.swf-loader-panel{width:min(720px,100%);padding:28px;background:linear-gradient(135deg,rgba(18,31,50,.9),rgba(10,18,31,.88));border-radius:28px}
.swf-loader-brand{display:flex;align-items:center;gap:16px}
.swf-loader-mark{width:54px;height:54px;border-radius:16px;background:linear-gradient(135deg,#ff8c42,#4fd1ff);font-size:24px;color:#07111d;box-shadow:0 16px 34px rgba(79,209,255,.18)}
.swf-loader-name{font-size:20px;font-weight:850;letter-spacing:.02em;color:#f4f8fd}
.swf-loader-sub{margin-top:4px;font-size:13px;color:#9eb1d2}
.swf-loader-stage-wrap{display:flex;flex-direction:column;gap:12px;margin-top:22px}
.swf-loader-stage{display:flex;align-items:center;gap:10px;color:#8ea3c8;font-size:13px}
.swf-loader-stage.is-active{color:#e8edf7}
.swf-loader-stage-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.16);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.swf-loader-stage.is-active .swf-loader-stage-dot{background:linear-gradient(135deg,#ff8c42,#4fd1ff);box-shadow:0 0 14px rgba(79,209,255,.25)}
.swf-loader-bar{margin-top:22px;height:10px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden}
.swf-loader-bar-fill{height:100%;width:42%;border-radius:999px;background:linear-gradient(90deg,#ff8c42,#4fd1ff);animation:swf-loader-progress 1.6s ease-in-out infinite}
.swf-loader-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:22px}
.swf-loader-stat{padding:14px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.swf-loader-stat-label{font-size:10px;text-transform:uppercase;letter-spacing:1.4px;color:#8ea3c8;font-weight:800}
.swf-loader-stat-value{margin-top:6px;font-size:14px;font-weight:800;color:#f4f8fd}
@keyframes swf-loader-progress{0%{transform:translateX(-8%);width:30%}50%{transform:translateX(90%);width:42%}100%{transform:translateX(-8%);width:30%}}

.swf-entered-topbar{position:fixed;top:16px;left:16px;right:16px;z-index:45;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 16px;border-radius:20px;background:rgba(7,17,29,.58);border:1px solid rgba(176,187,218,.16);backdrop-filter:blur(18px)}
.swf-entered-brand{display:flex;align-items:center;gap:12px}
.swf-entered-logo{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#ff8c42,#4fd1ff);color:#07111d;font-size:18px}
.swf-entered-title{font-size:14px;font-weight:850;letter-spacing:2px;color:#f6f9fd}
.swf-entered-sub{font-size:10px;color:#95a8cc;letter-spacing:1.5px;text-transform:uppercase}
.swf-entered-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}
.swf-return-chip{padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(135deg,rgba(255,140,66,.16),rgba(79,209,255,.12));color:#eef4fa;font-size:11px;font-weight:900;letter-spacing:1.5px;cursor:pointer}
.swf-entered-bottom{position:fixed;left:16px;right:16px;bottom:16px;z-index:45;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 16px;border-radius:18px;background:rgba(7,17,29,.52);border:1px solid rgba(176,187,218,.14);backdrop-filter:blur(18px)}
.swf-entered-bottom-label{font-size:11px;color:#b6c4dd;letter-spacing:1.3px;text-transform:uppercase;font-weight:800}
.swf-entered-bottom-tabs{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.swf-mini-tab{padding:8px 10px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#ced7e7;font-size:11px;font-weight:700}

@media (max-width:1200px){
  .swf-shell{grid-template-columns:1fr}
  .swf-rail{order:2}
  .swf-content{order:1}
  .swf-command-grid{grid-template-columns:1fr}
  .swf-preview-grid{grid-template-columns:1fr}
  .swf-stats-tight{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (max-width:900px){
  .swf-topbar{padding:14px 16px}
  .swf-shell,.swf-pipeline,.swf-footer{padding-left:16px;padding-right:16px}
  .swf-live-strip,.swf-panel-head,.swf-entered-topbar,.swf-entered-bottom{flex-direction:column;align-items:flex-start}
  .swf-loader-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .swf-stages{grid-template-columns:1fr}
}
@media (max-width:640px){
  .swf-stats-tight{grid-template-columns:repeat(2,minmax(0,1fr))}
  .swf-title{font-size:34px}
  .swf-subtitle{font-size:15px}
  .swf-panel-title{font-size:24px}
  .swf-map-ghost{min-height:320px}
  .swf-loader-grid{grid-template-columns:1fr}
  .swf-footer{flex-direction:column}
}
`;
