import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ModuleShell } from "@/components/swiftly/ModuleShell";

export const Route = createFileRoute("/swiftly/corridors")({
  head: () => ({
    meta: [
      { title: "Corridor Intelligence — Swiftly" },
      { name: "description", content: "23 Bengaluru corridors ranked by EVITAS risk, enriched with BTP historical vulnerability — accidents, incidents, congestion, peak windows." },
      { property: "og:title", content: "Corridor Intelligence — Swiftly" },
      { property: "og:description", content: "Corridor risk leaderboard with BTP-blended vulnerability." },
    ],
  }),
  component: CorridorModule,
});

type Corridor = { corridor_name: string; risk_score?: number; risk_rank?: number; event_count?: number; closure_rate?: number; mean_severity?: number; zone?: string };
type BtpStat = { corridor_name: string; accidents_per_year: number; incidents_per_year: number; congestion_index: number; vehicle_volume_kpd: number; peak_vulnerability: number; peak_windows: string[] };

function CorridorModule() {
  const [corrs, setCorrs] = useState<Corridor[]>([]);
  const [btp, setBtp] = useState<BtpStat[]>([]);
  useEffect(() => {
    fetch("/data/corridors.json").then((r) => r.json()).then(setCorrs).catch(() => {});
    fetch("/data/btp_stats.json").then((r) => r.json()).then(setBtp).catch(() => {});
  }, []);

  const rows = useMemo(() => {
    return corrs
      .slice()
      .sort((a, b) => (a.risk_rank ?? 999) - (b.risk_rank ?? 999))
      .map((c) => ({
        ...c,
        btp: btp.find((b) => b.corridor_name === c.corridor_name),
      }));
  }, [corrs, btp]);

  return (
    <ModuleShell
      eyebrow="CORRIDOR INTELLIGENCE"
      title="23 corridors. Ranked by EVITAS risk + BTP vulnerability."
      lede="Source: ASTraM Event Data + Bengaluru Traffic Police Statistics. BTP figures are historical risk factors, not real-time feeds."
    >
      <div className="swf-cf-panel">
        <div className="swf-cf-panel-h">CORRIDOR LEADERBOARD</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, color: "#cfd9ee" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#8fa3c6", letterSpacing: 1, fontSize: 10, textTransform: "uppercase" }}>
                <th style={th}>#</th>
                <th style={th}>Corridor</th>
                <th style={th}>EVITAS base</th>
                <th style={th}>Events</th>
                <th style={th}>Closure %</th>
                <th style={th}>Accidents/yr</th>
                <th style={th}>Incidents/yr</th>
                <th style={th}>Congestion</th>
                <th style={th}>Peak vuln.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const evitas = (r.risk_score ?? 0) * 100;
                const band = evitas >= 65 ? "red" : evitas >= 55 ? "orange" : evitas >= 45 ? "yellow" : "green";
                return (
                  <tr key={r.corridor_name} style={{ borderTop: "1px solid rgba(150,173,220,.1)" }}>
                    <td style={td}>{r.risk_rank?.toFixed(0)}</td>
                    <td style={{ ...td, color: "#fff", fontWeight: 700 }}>{r.corridor_name}</td>
                    <td style={td}><span className={`swf-rband-${band}`} style={{ padding: "3px 8px", borderRadius: 6, fontWeight: 800 }}>{evitas.toFixed(1)}</span></td>
                    <td style={td}>{r.event_count?.toFixed(0) ?? "—"}</td>
                    <td style={td}>{((r.closure_rate ?? 0) * 100).toFixed(1)}%</td>
                    <td style={td}>{r.btp?.accidents_per_year.toFixed(0) ?? "—"}</td>
                    <td style={td}>{r.btp?.incidents_per_year.toFixed(0) ?? "—"}</td>
                    <td style={td}>{r.btp?.congestion_index.toFixed(0) ?? "—"}</td>
                    <td style={td}>{r.btp?.peak_vulnerability.toFixed(0) ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <div className="swf-cf-empty">Loading corridors…</div>}
        </div>
      </div>
    </ModuleShell>
  );
}

const th: React.CSSProperties = { padding: "10px 8px", fontWeight: 700 };
const td: React.CSSProperties = { padding: "10px 8px" };
