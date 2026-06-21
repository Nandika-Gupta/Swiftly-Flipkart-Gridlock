import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleShell } from "@/components/swiftly/ModuleShell";

export const Route = createFileRoute("/swiftly/response")({
  head: () => ({
    meta: [
      { title: "Response Planning — Swiftly" },
      { name: "description", content: "Stage-by-stage incident response playbook: notify, deploy, divert, recover. Calibrated against ASTraM + BTP historical patterns." },
      { property: "og:title", content: "Response Planning — Swiftly" },
      { property: "og:description", content: "Operational response playbook for Bengaluru traffic incidents." },
    ],
  }),
  component: ResponseModule,
});

const STAGES = [
  { code: "T-60", title: "PREDICT & NOTIFY", body: "EVITAS forecast issued. Inspector-on-duty briefed. Diversion plan staged. Reserve units placed on standby.", role: "Traffic Cell" },
  { code: "T-30", title: "PRE-POSITION", body: "60% of allocated officers at corridor entry, 40% at junction nodes. Barricades trucked in. Adjacent corridors warned.", role: "Field Units" },
  { code: "T-0", title: "ACTIVATE", body: "Diversion activated based on closure %. Real-time updates to MapMyIndia routing. Public advisory broadcast.", role: "Control Room" },
  { code: "T+30", title: "STABILIZE", body: "Officers rotate, fatigue management. Live EVITAS re-scored every 5 min. Reserve units redeployed to hotspots.", role: "Sector Officer" },
  { code: "T+RECOVERY", title: "DEBRIEF", body: "Outcome logged: actual delay vs predicted, officer-hours, diversion uptake. Feeds back into corridor risk_score.", role: "Analytics" },
];

function ResponseModule() {
  const [selected, setSelected] = useState(0);
  const s = STAGES[selected];

  return (
    <ModuleShell
      eyebrow="RESPONSE PLANNING"
      title="From forecast to debrief — five operational stages."
      lede="Each stage maps to a role and an action. Outcomes log back into ASTraM history to improve future EVITAS scoring."
    >
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 18 }} className="swf-resp-layout">
        <div className="swf-cf-panel" style={{ padding: 12 }}>
          <div className="swf-cf-panel-h">PLAYBOOK STAGES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {STAGES.map((st, i) => (
              <button
                key={st.code}
                onClick={() => setSelected(i)}
                style={{
                  textAlign: "left",
                  padding: "12px 12px",
                  borderRadius: 8,
                  border: "1px solid " + (i === selected ? "rgba(79,209,255,.55)" : "rgba(150,173,220,.18)"),
                  background: i === selected ? "rgba(79,209,255,.08)" : "transparent",
                  color: "#e8edf7",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: 1.4, color: "#8fa3c6" }}>{st.code}</div>
                <div style={{ fontWeight: 800, fontSize: 13, marginTop: 2 }}>{st.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="swf-cf-panel">
          <div className="swf-cf-panel-h">{s.code} · {s.title}</div>
          <p className="swf-cf-panel-lede">Owner: <b style={{ color: "#fff" }}>{s.role}</b></p>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "#cfd9ee", marginTop: 8 }}>{s.body}</p>
          <div className="swf-cf-btp-grid" style={{ marginTop: 18 }}>
            <Cell l="ETA window" v={s.code} />
            <Cell l="Role" v={s.role} />
            <Cell l="Data input" v="ASTraM + BTP" />
          </div>
          <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/swiftly/deployment" className="swf-cta-secondary">Open Scenario Lab →</Link>
            <Link to="/swiftly/copilot" className="swf-cta-secondary">Ask Copilot →</Link>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}

function Cell({ l, v }: { l: string; v: string }) {
  return (
    <div className="swf-cf-btp-cell">
      <div className="swf-cf-btp-l">{l}</div>
      <div className="swf-cf-btp-v" style={{ fontSize: 14 }}>{v}</div>
    </div>
  );
}
