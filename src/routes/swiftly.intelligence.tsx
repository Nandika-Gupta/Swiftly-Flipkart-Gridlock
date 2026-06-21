import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ModuleShell } from "@/components/swiftly/ModuleShell";

export const Route = createFileRoute("/swiftly/intelligence")({
  head: () => ({
    meta: [
      { title: "Event Intelligence — Swiftly" },
      { name: "description", content: "Live ASTraM event feed with EVITAS impact classification, cause distribution and closure trends across Bengaluru." },
      { property: "og:title", content: "Event Intelligence — Swiftly" },
      { property: "og:description", content: "ASTraM event stream, cause distribution and closure trends." },
    ],
  }),
  component: IntelModule,
});

type LiveEvent = { id: string; cause: string; corridor: string; priority: string; status: string; address: string; time: string };

function IntelModule() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  useEffect(() => {
    fetch("/data/events.json").then((r) => r.json()).then((d) => setEvents(d.live_sample || [])).catch(() => {});
  }, []);

  const byCause = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.cause] = (acc[e.cause] ?? 0) + 1;
    return acc;
  }, {});
  const totalByCause = Object.entries(byCause).sort((a, b) => b[1] - a[1]);
  const high = events.filter((e) => /high|red|critical/i.test(e.priority)).length;
  const active = events.filter((e) => e.status === "active").length;

  return (
    <ModuleShell
      eyebrow="EVENT INTELLIGENCE"
      title="Live ASTraM event stream, classified by EVITAS impact."
      lede="Real Bengaluru event records, enriched with cause taxonomy and priority. Use this view to triage what needs immediate scenario simulation."
    >
      <div className="swf-cf-outputs" style={{ marginBottom: 18 }}>
        <Metric l="Active events" v={String(active)} />
        <Metric l="High priority" v={String(high)} />
        <Metric l="Causes tracked" v={String(totalByCause.length)} />
        <Metric l="Records loaded" v={String(events.length)} />
      </div>

      <div className="swf-cf-grid">
        <div className="swf-cf-panel">
          <div className="swf-cf-panel-h">CAUSE DISTRIBUTION</div>
          <p className="swf-cf-panel-lede">From ASTraM live sample. Top causes drive corridor stress.</p>
          <div className="swf-deploy-bars">
            {totalByCause.slice(0, 8).map(([cause, n]) => (
              <div className="swf-deploy-row" key={cause}>
                <div className="swf-deploy-name">{cause}</div>
                <div className="swf-deploy-track">
                  <div className="swf-deploy-fill" style={{ width: `${(n / Math.max(1, totalByCause[0][1])) * 100}%` }} />
                </div>
                <div className="swf-deploy-count">{n}</div>
              </div>
            ))}
            {totalByCause.length === 0 && <div className="swf-cf-empty">Loading event causes…</div>}
          </div>
        </div>

        <div className="swf-cf-panel" style={{ gridColumn: "span 2" }}>
          <div className="swf-cf-panel-h">LIVE EVENT FEED</div>
          <p className="swf-cf-panel-lede">Active ASTraM event records. Click a row to copy its ID — wire into the Scenario Lab to simulate impact.</p>
          <div className="swf-cf-live">
            {events.slice(0, 16).map((e) => (
              <button key={e.id} onClick={() => navigator.clipboard?.writeText(e.id)} className="swf-cf-live-row" style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, cursor: "pointer" }}>
                <span className={`swf-cf-live-dot ${e.status === "active" ? "active" : ""}`} />
                <div className="swf-cf-live-meta">
                  <div className="swf-cf-live-cause">{e.cause}</div>
                  <div className="swf-cf-live-addr">{e.corridor} · {e.address}</div>
                </div>
                <div className="swf-cf-live-pri">{e.priority}</div>
              </button>
            ))}
            {events.length === 0 && <div className="swf-cf-empty">Loading events…</div>}
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}

function Metric({ l, v }: { l: string; v: string }) {
  return (
    <div className="swf-cf-metric">
      <div className="swf-cf-metric-l">{l}</div>
      <div className="swf-cf-metric-v">{v}</div>
    </div>
  );
}
