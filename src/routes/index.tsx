import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  mean_evitas: number;
  max_evitas: number;
  red_events: number;
  orange_events: number;
  event_count: number;
  risk_rank: number;
};

function SwiftlyShell() {
  const [entered, setEntered] = useState(false);
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetch("/data/corridors.json")
      .then((r) => r.json())
      .then((d) => setCorridors(d.slice(0, 8)))
      .catch(() => {});
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (entered) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#080B12" }}>
        <iframe
          title="Swiftly Command Center"
          src="/swiftly.html"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
        <button
          onClick={() => setEntered(false)}
          style={{
            position: "fixed",
            top: 12,
            right: 14,
            zIndex: 9999,
            background: "rgba(8,11,18,0.85)",
            border: "1px solid rgba(96,165,250,0.4)",
            color: "#cbd5e1",
            padding: "6px 12px",
            fontSize: 11,
            letterSpacing: 1,
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "ui-monospace, SF Mono, monospace",
            backdropFilter: "blur(8px)",
          }}
        >
          ← BRIEFING
        </button>
      </div>
    );
  }

  const top = corridors[0];
  const timeStr = now.toLocaleTimeString("en-IN", { hour12: false });
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="swf-landing">
      <style>{css}</style>
      <div className="swf-grid-bg" />
      <div className="swf-glow" />

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

      <main className="swf-main">
        <section className="swf-hero">
          <div className="swf-eyebrow">
            <span className="swf-eyebrow-line" />
            EVITAS PIPELINE · v2.4 · DEPLOYED
          </div>
          <h1 className="swf-title">
            Towards an<br />
            <span className="swf-title-accent">Unjammed Bengaluru.</span>
          </h1>
          <p className="swf-subtitle">
            A causal-inference command center for the Bengaluru Traffic Police.
            Forecasts the impact of every planned and unplanned event across 23
            corridors, then optimally allocates officers, barricades, and
            diversions before congestion forms.
          </p>

          <div className="swf-stats">
            <Stat value="8,173" label="ASTraM Events" sub="Analyzed" />
            <Stat value="23" label="Corridors" sub="Monitored" />
            <Stat value="91.0" label="Peak EVITAS" sub="Mysore Rd · RED" />
            <Stat value="₹2.4Cr" label="Est. Annual Savings" sub="Officer optimization" />
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

        <aside className="swf-side">
          <div className="swf-card">
            <div className="swf-card-head">
              <span className="swf-card-title">CRITICAL CORRIDORS</span>
              <span className="swf-card-sub">Live · ranked by mean EVITAS</span>
            </div>
            <div className="swf-corr-list">
              {corridors.map((c) => {
                const band =
                  c.mean_evitas >= 60 ? "orange" : c.mean_evitas >= 40 ? "yellow" : "green";
                return (
                  <div className="swf-corr" key={c.corridor_name}>
                    <div className="swf-corr-rank">#{c.risk_rank}</div>
                    <div className="swf-corr-info">
                      <div className="swf-corr-name">{c.corridor_name}</div>
                      <div className="swf-corr-meta">
                        {c.event_count} events · {c.red_events} RED · {c.orange_events} ORANGE
                      </div>
                    </div>
                    <div className={`swf-corr-score swf-band-${band}`}>
                      {c.mean_evitas.toFixed(1)}
                    </div>
                  </div>
                );
              })}
              {!corridors.length && <div className="swf-corr-empty">Loading corridor risk data…</div>}
            </div>
            {top && (
              <div className="swf-alert">
                <div className="swf-alert-tag">▲ TOP RISK</div>
                <div className="swf-alert-body">
                  <strong>{top.corridor_name}</strong> — mean EVITAS {top.mean_evitas.toFixed(1)},
                  peak {top.max_evitas}. Recommend pre-positioning officers during 9–11 AM and 6–8 PM windows.
                </div>
              </div>
            )}
          </div>
        </aside>
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
  n, title, sub, body, stack,
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

const css = `
.swf-landing{position:fixed;inset:0;overflow-y:auto;background:#05070D;color:#E6EDF7;font-family:'Inter',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.swf-grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(96,165,250,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,.05) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse at top,#000 0%,transparent 70%);pointer-events:none;z-index:0}
.swf-glow{position:fixed;top:-200px;left:50%;transform:translateX(-50%);width:1200px;height:600px;background:radial-gradient(ellipse,rgba(59,130,246,.18),transparent 60%);pointer-events:none;z-index:0}

.swf-topbar{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px 28px;border-bottom:1px solid rgba(96,165,250,.12);background:rgba(5,7,13,.7);backdrop-filter:blur(12px)}
.swf-brand{display:flex;align-items:center;gap:12px}
.swf-logo{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#3b82f6,#06b6d4);display:flex;align-items:center;justify-content:center;font-size:18px;color:#05070D;font-weight:900}
.swf-brand-name{font-size:15px;font-weight:800;letter-spacing:3px}
.swf-brand-sub{font-size:10px;color:#64748b;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px}
.swf-topbar-right{display:flex;align-items:center;gap:14px}
.swf-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid rgba(96,165,250,.18);border-radius:20px;font-size:10px;letter-spacing:1.2px;color:#94a3b8;font-family:ui-monospace,SF Mono,monospace}
.swf-dot{width:6px;height:6px;border-radius:50%}
.swf-dot-green{background:#22c55e;box-shadow:0 0 8px #22c55e}
.swf-dot-blue{background:#60a5fa;box-shadow:0 0 8px #60a5fa}
.swf-badge{padding:5px 10px;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.3);border-radius:4px;font-size:10px;letter-spacing:1.5px;color:#93c5fd;font-weight:600}
.swf-clock{text-align:right;font-family:ui-monospace,SF Mono,monospace}
.swf-time{font-size:14px;font-weight:600;color:#E6EDF7}
.swf-date{font-size:9px;color:#64748b;letter-spacing:1px}

.swf-main{position:relative;z-index:5;display:grid;grid-template-columns:1.4fr 1fr;gap:48px;padding:64px 48px 48px;max-width:1480px;margin:0 auto}
@media(max-width:980px){.swf-main{grid-template-columns:1fr;padding:32px 20px}}

.swf-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:2.5px;color:#60a5fa;font-family:ui-monospace,SF Mono,monospace;margin-bottom:24px}
.swf-eyebrow-line{display:inline-block;width:32px;height:1px;background:#60a5fa}
.swf-title{font-size:clamp(40px,5.5vw,76px);line-height:.98;font-weight:800;letter-spacing:-.03em;margin:0 0 24px;background:linear-gradient(180deg,#fff 30%,#94a3b8 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.swf-title-accent{background:linear-gradient(135deg,#60a5fa,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent}
.swf-subtitle{font-size:17px;line-height:1.6;color:#94a3b8;max-width:560px;margin:0 0 40px}

.swf-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:40px}
@media(max-width:640px){.swf-stats{grid-template-columns:repeat(2,1fr)}}
.swf-stat{padding:18px;border:1px solid rgba(96,165,250,.12);border-radius:10px;background:rgba(15,23,42,.4)}
.swf-stat-value{font-size:24px;font-weight:800;color:#fff;letter-spacing:-.02em;font-family:ui-monospace,SF Mono,monospace}
.swf-stat-label{font-size:11px;color:#cbd5e1;margin-top:4px;font-weight:600;letter-spacing:.5px}
.swf-stat-sub{font-size:10px;color:#64748b;margin-top:2px;letter-spacing:.5px}

.swf-cta-row{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.swf-cta-primary{display:inline-flex;align-items:center;gap:14px;padding:16px 28px;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#05070D;border:0;border-radius:8px;font-size:13px;font-weight:800;letter-spacing:2px;cursor:pointer;font-family:inherit;box-shadow:0 8px 32px rgba(59,130,246,.4);transition:transform .15s,box-shadow .15s}
.swf-cta-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(59,130,246,.55)}
.swf-cta-arrow{font-size:18px;transition:transform .2s}
.swf-cta-primary:hover .swf-cta-arrow{transform:translateX(4px)}
.swf-cta-secondary{padding:16px 24px;background:transparent;color:#cbd5e1;border:1px solid rgba(96,165,250,.25);border-radius:8px;font-size:12px;letter-spacing:2px;font-weight:600;text-decoration:none;font-family:inherit}
.swf-cta-secondary:hover{border-color:#60a5fa;color:#fff}

.swf-card{border:1px solid rgba(96,165,250,.15);border-radius:14px;background:linear-gradient(180deg,rgba(15,23,42,.7),rgba(8,11,18,.7));padding:22px;backdrop-filter:blur(12px)}
.swf-card-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid rgba(96,165,250,.1)}
.swf-card-title{font-size:11px;font-weight:700;letter-spacing:2px;color:#fff}
.swf-card-sub{font-size:10px;color:#64748b;letter-spacing:.5px}
.swf-corr-list{display:flex;flex-direction:column;gap:8px}
.swf-corr{display:grid;grid-template-columns:36px 1fr auto;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;background:rgba(15,23,42,.5);border:1px solid transparent;transition:border-color .15s}
.swf-corr:hover{border-color:rgba(96,165,250,.25)}
.swf-corr-rank{font-family:ui-monospace,SF Mono,monospace;font-size:11px;color:#64748b;font-weight:700}
.swf-corr-name{font-size:13px;font-weight:600;color:#E6EDF7}
.swf-corr-meta{font-size:10px;color:#64748b;margin-top:2px;font-family:ui-monospace,SF Mono,monospace}
.swf-corr-score{font-family:ui-monospace,SF Mono,monospace;font-size:15px;font-weight:800;padding:6px 10px;border-radius:6px;min-width:54px;text-align:center}
.swf-band-green{background:rgba(34,197,94,.15);color:#4ade80;border:1px solid rgba(34,197,94,.3)}
.swf-band-yellow{background:rgba(234,179,8,.15);color:#facc15;border:1px solid rgba(234,179,8,.3)}
.swf-band-orange{background:rgba(249,115,22,.15);color:#fb923c;border:1px solid rgba(249,115,22,.3)}
.swf-corr-empty{color:#64748b;font-size:12px;padding:20px;text-align:center}

.swf-alert{margin-top:16px;padding:14px;border-radius:8px;background:linear-gradient(135deg,rgba(249,115,22,.12),rgba(239,68,68,.08));border:1px solid rgba(249,115,22,.3)}
.swf-alert-tag{font-size:10px;letter-spacing:2px;color:#fb923c;font-weight:800;margin-bottom:6px}
.swf-alert-body{font-size:12px;color:#cbd5e1;line-height:1.5}

.swf-pipeline{position:relative;z-index:5;padding:48px 48px 80px;max-width:1480px;margin:0 auto}
.swf-section-head{margin-bottom:36px}
.swf-section-eyebrow{font-size:11px;letter-spacing:2.5px;color:#60a5fa;font-family:ui-monospace,SF Mono,monospace}
.swf-section-title{font-size:clamp(28px,3.5vw,42px);font-weight:700;letter-spacing:-.02em;margin:10px 0 0;color:#fff;max-width:680px;line-height:1.15}
.swf-stages{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:900px){.swf-stages{grid-template-columns:1fr}}
.swf-stage{position:relative;padding:28px;border:1px solid rgba(96,165,250,.15);border-radius:12px;background:rgba(15,23,42,.4);overflow:hidden}
.swf-stage::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#3b82f6,#06b6d4)}
.swf-stage-n{font-family:ui-monospace,SF Mono,monospace;font-size:12px;color:#60a5fa;letter-spacing:2px;font-weight:700}
.swf-stage-title{font-size:22px;font-weight:700;color:#fff;margin-top:8px;letter-spacing:-.01em}
.swf-stage-sub{font-size:12px;color:#22d3ee;margin-top:4px;letter-spacing:1px;text-transform:uppercase;font-weight:600}
.swf-stage-body{font-size:13px;line-height:1.65;color:#94a3b8;margin:16px 0 18px}
.swf-stage-stack{font-size:10px;color:#64748b;letter-spacing:1.2px;font-family:ui-monospace,SF Mono,monospace;padding-top:14px;border-top:1px solid rgba(96,165,250,.1)}

.swf-footer{position:relative;z-index:5;display:flex;justify-content:space-between;padding:24px 48px;border-top:1px solid rgba(96,165,250,.1);font-size:11px;color:#64748b;letter-spacing:1px;font-family:ui-monospace,SF Mono,monospace}
@media(max-width:640px){.swf-footer{flex-direction:column;gap:8px;text-align:center}}
`;
