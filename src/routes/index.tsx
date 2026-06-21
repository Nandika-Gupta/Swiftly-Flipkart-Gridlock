import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { swiftlyCss } from "@/components/swiftly/styles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swiftly — Event-Driven Congestion Intelligence for Bengaluru" },
      {
        name: "description",
        content:
          "Swiftly forecasts the operational impact of planned and unplanned events before congestion occurs — powered by 8,173 real ASTraM events, BTP historical statistics and MapMyIndia.",
      },
      { property: "og:title", content: "Swiftly — Event-Driven Congestion Intelligence" },
      {
        property: "og:description",
        content:
          "Predict. Deploy. Divert. Operational intelligence for Bengaluru Traffic Police.",
      },
    ],
  }),
  component: SwiftlyLanding,
});

const CAPABILITIES = [
  {
    code: "01",
    title: "Event Intelligence",
    body: "Live ASTraM event stream classified by EVITAS impact and cause.",
    to: "/swiftly/intelligence",
  },
  {
    code: "02",
    title: "Operational Scenario Lab",
    body: "Simulate crowd, closure, duration. See EVITAS, delay & deployment update live.",
    to: "/swiftly/deployment",
  },
  {
    code: "03",
    title: "Corridor Intelligence",
    body: "23 corridors ranked by EVITAS + BTP vulnerability (accidents, congestion, peaks).",
    to: "/swiftly/corridors",
  },
  {
    code: "04",
    title: "Response Planning",
    body: "Five-stage operational playbook from forecast to debrief.",
    to: "/swiftly/response",
  },
  {
    code: "05",
    title: "Command Copilot",
    body: "Ask plain-English questions grounded in ASTraM + BTP data.",
    to: "/swiftly/copilot",
  },
] as const;

const BANDS = [
  { band: "green", range: "0–34", label: "Normal", body: "Standard officer rotation. No special deployment." },
  { band: "yellow", range: "35–54", label: "Watch", body: "Pre-position spotters. Monitor adjacent corridors." },
  { band: "orange", range: "55–74", label: "Elevated", body: "Activate diversion plan. Reserve units on standby." },
  { band: "red", range: "75–100", label: "Critical", body: "Full deployment. Public advisory. Real-time re-scoring." },
] as const;

function SwiftlyLanding() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now ? now.toLocaleTimeString("en-IN", { hour12: false }) : "—— : —— : ——";
  const dateStr = now ? now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

  return (
    <div className="swf-landing">
      <style>{swiftlyCss}</style>
      <style>{landingCss}</style>
      <div className="swf-grid-bg" />
      <div className="swf-glow swf-glow-a" />
      <div className="swf-glow swf-glow-b" />

      <header className="swf-topbar">
        <div className="swf-brand">
          <div className="swf-logo">◈</div>
          <div>
            <div className="swf-brand-name">SWIFTLY</div>
            <div className="swf-brand-sub">Event-Driven Congestion Intelligence</div>
          </div>
        </div>
        <div className="swf-topbar-right">
          <div className="swf-pill"><span className="swf-dot swf-dot-green" /> ASTraM</div>
          <div className="swf-pill"><span className="swf-dot swf-dot-blue" /> MapMyIndia</div>
          <div className="swf-clock">
            <div className="swf-time">{timeStr}</div>
            <div className="swf-date">{dateStr} IST</div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="swf-shell">
        <section className="swf-hero-panel">
          <div className="swf-hero-copy">
            <div className="swf-hero-badge">EVITAS · PREDICT · DEPLOY · DIVERT</div>
            <h1 className="swf-hero-brand">SWIFTLY</h1>
            <h2 className="swf-hero-tagline">Towards an Unjammed Bengaluru.</h2>
            <p className="swf-hero-mission">Predicting and preventing event-driven congestion before it happens.</p>
          </div>
          <div className="swf-stats swf-stats-tight">
            <Stat value="8,173" label="ASTraM Events" sub="Analyzed" />
            <Stat value="23" label="Corridors" sub="Monitored" />
            <Stat value="91.0" label="Peak EVITAS" sub="Mysore Rd · RED" />
            <Stat value="82%" label="Confidence" sub="Historical fit" />
          </div>
          <div className="swf-cta-row">
            <Link to="/swiftly/intelligence" className="swf-cta-primary">
              ENTER COMMAND CENTER<span className="swf-cta-arrow">→</span>
            </Link>
            <a className="swf-cta-secondary" href="#capabilities">VIEW CAPABILITIES</a>
          </div>
        </section>
      </main>

      {/* PROBLEM */}
      <section className="swf-section">
        <div className="swf-section-head">
          <span className="swf-section-eyebrow">— OPERATIONAL CONTEXT</span>
          <h2 className="swf-section-title">Event-driven congestion is still managed reactively.</h2>
        </div>
        <div className="swf-problem-grid">
          <div className="swf-problem-card">
            <div className="swf-problem-tag">The Challenge</div>
            <p>Rallies, festivals, VIP movements, accidents and sudden gatherings create localized breakdowns across Bengaluru — every day.</p>
          </div>
          <div className="swf-problem-card">
            <div className="swf-problem-tag">Why Today's Systems Fail</div>
            <ul className="swf-problem-list">
              <li>Impact is not quantified in advance.</li>
              <li>Deployment relies on individual experience.</li>
              <li>Diversion is activated after gridlock.</li>
              <li>No structured post-event learning.</li>
            </ul>
          </div>
          <div className="swf-problem-card swf-problem-card-accent">
            <div className="swf-problem-tag">Swiftly's Answer</div>
            <p>Forecast event impact before congestion begins. Generate data-driven deployment and diversion recommendations using historical event intelligence.</p>
          </div>
        </div>
      </section>

      {/* EVITAS FRAMEWORK */}
      <section className="swf-section">
        <div className="swf-section-head">
          <span className="swf-section-eyebrow">— EVITAS FRAMEWORK</span>
          <h2 className="swf-section-title">A 0–100 score for event-driven traffic risk.</h2>
          <p className="swf-section-lede">EVITAS blends corridor baseline risk, BTP historical vulnerability, crowd size, duration, road closure and officer mitigation into one number.</p>
        </div>
        <div className="swf-band-grid">
          {BANDS.map((b) => (
            <div key={b.band} className={`swf-band-card swf-bcard-${b.band}`}>
              <div className="swf-bcard-top">
                <span className="swf-bcard-range">{b.range}</span>
                <span className="swf-bcard-label">{b.label}</span>
              </div>
              <div className="swf-bcard-headline">EVITAS {b.range}</div>
              <p className="swf-bcard-body">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DATA & PARTNERS */}
      <section className="swf-section">
        <div className="swf-section-head">
          <span className="swf-section-eyebrow">— DATA &amp; PARTNERS</span>
          <h2 className="swf-section-title">Built on real Bengaluru operational data.</h2>
        </div>
        <div className="swf-partner-grid">
          <div className="swf-partner-card swf-partner-astram">
            <div className="swf-partner-mark">ASTraM</div>
            <div className="swf-partner-name">ASTraM Event Data</div>
            <p>8,173 real Bengaluru event records · 23 corridors · 18 months. Not synthetic.</p>
          </div>
          <div className="swf-partner-card">
            <div className="swf-partner-mark">BTP</div>
            <div className="swf-partner-name">Bengaluru Traffic Police</div>
            <p>Historical statistics: accidents, incidents, congestion index, vehicle volumes, peak windows. Used as historical risk factors — not real-time feeds.</p>
          </div>
          <div className="swf-partner-card swf-partner-mmi">
            <div className="swf-partner-mark">MMI</div>
            <div className="swf-partner-name">MapMyIndia</div>
            <p>Corridor visualization, route intelligence and diversion planning surface.</p>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="swf-section">
        <div className="swf-section-head">
          <span className="swf-section-eyebrow">— CORE CAPABILITIES</span>
          <h2 className="swf-section-title">Five operational modules. One command surface.</h2>
        </div>
        <div className="swf-cap-grid">
          {CAPABILITIES.map((c) => (
            <Link key={c.to} to={c.to} className="swf-cap-card">
              <div className="swf-cap-code">{c.code}</div>
              <div className="swf-cap-title">{c.title}</div>
              <p className="swf-cap-body">{c.body}</p>
              <div className="swf-cap-cta">OPEN MODULE <span>→</span></div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="swf-footer">
        <div>SWIFTLY · Predict. Deploy. Divert.</div>
        <div>Source: ASTraM Event Data + Bengaluru Traffic Police Statistics + MapMyIndia</div>
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

const landingCss = `
.swf-band-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.swf-cap-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.swf-cap-card{display:flex;flex-direction:column;gap:10px;padding:22px;border-radius:14px;border:1px solid rgba(150,173,220,.18);background:linear-gradient(160deg,rgba(255,255,255,.04),rgba(7,17,29,.6));text-decoration:none;color:inherit;transition:all .22s;position:relative;overflow:hidden}
.swf-cap-card::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(79,209,255,.0),rgba(255,140,66,.0));transition:all .25s;pointer-events:none}
.swf-cap-card:hover{transform:translateY(-3px);border-color:rgba(79,209,255,.45);box-shadow:0 18px 38px rgba(0,0,0,.45)}
.swf-cap-card:hover::before{background:linear-gradient(135deg,rgba(79,209,255,.08),rgba(255,140,66,.06))}
.swf-cap-code{font-size:11px;font-weight:800;letter-spacing:2px;color:#4fd1ff}
.swf-cap-title{font-size:20px;font-weight:800;color:#fff;letter-spacing:-.01em}
.swf-cap-body{font-size:13px;color:#a9b9d8;line-height:1.6;margin:0;flex:1}
.swf-cap-cta{margin-top:6px;font-size:11px;font-weight:800;letter-spacing:1.4px;color:#ff8c42;display:flex;align-items:center;gap:6px}
.swf-cap-cta span{transition:transform .2s}
.swf-cap-card:hover .swf-cap-cta span{transform:translateX(4px)}
@media (max-width:1024px){
  .swf-band-grid{grid-template-columns:repeat(2,1fr)}
  .swf-cap-grid{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:640px){
  .swf-band-grid{grid-template-columns:1fr}
  .swf-cap-grid{grid-template-columns:1fr}
}
`;
