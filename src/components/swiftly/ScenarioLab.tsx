import { useEffect, useMemo, useState } from "react";

type CorridorFull = {
  corridor_name: string;
  event_count?: number;
  mean_cate?: number;
  planned_rate?: number;
  closure_rate?: number;
  mean_severity?: number;
  zone?: string;
  lat?: number;
  lon?: number;
  risk_score?: number;
  risk_rank?: number;
};

type CFRow = {
  id: string;
  event_cause: string;
  corridor_name: string;
  zone_name?: string;
  priority?: string;
  requires_road_closure?: string;
  severity_score?: number;
  cate?: number;
  counterfactual_delta?: number;
  latitude?: number;
  longitude?: number;
  start_datetime?: string;
};

type LiveEvent = {
  id: string;
  cause: string;
  corridor: string;
  priority: string;
  status: string;
  lat: number;
  lng: number;
  address: string;
  time: string;
};

const EVENT_TYPES = [
  { key: "public_event", label: "Public Event / Festival", weight: 1.25 },
  { key: "procession", label: "Procession / Rally", weight: 1.35 },
  { key: "vip_movement", label: "VIP Movement", weight: 1.15 },
  { key: "protest", label: "Protest", weight: 1.4 },
  { key: "accident", label: "Major Accident", weight: 1.2 },
  { key: "construction", label: "Planned Construction", weight: 0.9 },
  { key: "water_logging", label: "Water Logging", weight: 1.05 },
];

function hav(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

type BtpStat = {
  corridor_name: string;
  accidents_per_year: number;
  incidents_per_year: number;
  congestion_index: number;
  vehicle_volume_kpd: number;
  peak_vulnerability: number;
  peak_windows: string[];
  source: string;
};

export function ScenarioLab() {
  const [corridors, setCorridors] = useState<CorridorFull[]>([]);
  const [cfRows, setCfRows] = useState<CFRow[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [btpStats, setBtpStats] = useState<BtpStat[]>([]);

  const [corridorName, setCorridorName] = useState("Varthur Road");
  const [eventType, setEventType] = useState("procession");
  const [crowd, setCrowd] = useState(8000);
  const [duration, setDuration] = useState(4);
  const [closurePct, setClosurePct] = useState(35);
  const [officers, setOfficers] = useState(6);

  useEffect(() => {
    fetch("/data/corridors.json").then((r) => r.json()).then(setCorridors).catch(() => {});
    fetch("/data/counterfactuals.json").then((r) => r.json()).then(setCfRows).catch(() => {});
    fetch("/data/btp_stats.json").then((r) => r.json()).then(setBtpStats).catch(() => {});
    fetch("/data/events.json")
      .then((r) => r.json())
      .then((d) => setLiveEvents(d.live_sample || []))
      .catch(() => {});
  }, []);


  const corridor = useMemo(
    () => corridors.find((c) => c.corridor_name === corridorName),
    [corridors, corridorName],
  );
  const eventMeta = EVENT_TYPES.find((e) => e.key === eventType) ?? EVENT_TYPES[0];
  const btp = useMemo(
    () => btpStats.find((b) => b.corridor_name === corridorName),
    [btpStats, corridorName],
  );

  // ── BTP historical vulnerability uplift (0–14 pts) ───────────────────────
  // Blends accident frequency, incident density, congestion index and peak vulnerability.
  const btpUplift = btp
    ? Math.min(
        14,
        (btp.accidents_per_year / 220) * 4 +
          (btp.incidents_per_year / 320) * 3.5 +
          (btp.congestion_index / 100) * 3.5 +
          (btp.peak_vulnerability / 100) * 3,
      )
    : 0;

  // ── EVITAS contribution model (transparent, explainable) ─────────────────
  const baseRisk = (corridor?.risk_score ?? 0.35) * 100 * 0.55; // corridor history baseline
  const crowdC = Math.min((crowd / 10000) * 22, 30) * eventMeta.weight;
  const durationC = Math.min((duration / 6) * 12, 16);
  const closureC = (closurePct / 100) * 26 * eventMeta.weight;
  const officerMit = -Math.min(officers * 1.9, 28);
  const rawEvitas = baseRisk + btpUplift + crowdC + durationC + closureC + officerMit;
  const evitas = Math.max(0, Math.min(100, Math.round(rawEvitas * 10) / 10));

  const band: "green" | "yellow" | "orange" | "red" =
    evitas >= 75 ? "red" : evitas >= 55 ? "orange" : evitas >= 35 ? "yellow" : "green";

  const predictedDelayMin = Math.round(evitas * 0.9 + crowd / 1800);
  const recoveryMin = Math.round(
    duration * 60 * 0.35 + (closurePct / 100) * 55 + crowd / 700 - officers * 2.5,
  );
  // BTP peak vulnerability and accident frequency bump manpower needs
  const btpManpowerBump = btp ? (btp.peak_vulnerability / 100) * 1.6 + (btp.accidents_per_year / 250) : 0;
  const optimalOfficers = Math.max(
    2,
    Math.ceil(crowd / 2200 + closurePct / 18 + eventMeta.weight * 2.2 + (corridor?.mean_severity ?? 1) * 1.5 + btpManpowerBump),
  );
  const barricades = Math.ceil(optimalOfficers / 3) + (closurePct >= 50 ? 2 : 0);
  const impactRadiusKm =
    Math.round((crowd / 5000 + closurePct / 28 + duration * 0.18) * 10) / 10;


  // ── Diversion: nearest 2 alternate corridors by lat/lon ──────────────────
  const diversion = useMemo(() => {
    if (!corridor || corridor.lat == null || corridor.lon == null) return [];
    return corridors
      .filter((c) => c.corridor_name !== corridor.corridor_name && c.lat != null && c.lon != null)
      .map((c) => ({
        name: c.corridor_name,
        km: hav(corridor.lat!, corridor.lon!, c.lat!, c.lon!),
        risk: (c.risk_score ?? 0) * 100,
      }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 2);
  }, [corridor, corridors]);

  // ── Historical similar events ────────────────────────────────────────────
  const similarCf = useMemo(() => {
    return cfRows
      .filter((r) => r.event_cause === eventType || r.corridor_name === corridorName)
      .slice(0, 3);
  }, [cfRows, eventType, corridorName]);

  const similarLive = useMemo(() => {
    if (!corridor) return liveEvents.slice(0, 3);
    return liveEvents
      .map((e) => ({
        ...e,
        km: corridor.lat && corridor.lon ? hav(corridor.lat, corridor.lon, e.lat, e.lng) : 999,
      }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 3);
  }, [liveEvents, corridor]);

  // ── Explainability factor breakdown ──────────────────────────────────────
  const factors = [
    { name: "Corridor baseline (ASTraM risk_score)", value: baseRisk, tone: "blue" },
    { name: "BTP historical vulnerability (accidents, incidents, peak congestion)", value: btpUplift, tone: "blue" },
    { name: `Crowd impact (× ${eventMeta.weight} event weight)`, value: crowdC, tone: "amber" },
    { name: "Event duration", value: durationC, tone: "amber" },
    { name: `Road closure ${closurePct}%`, value: closureC, tone: "red" },
    { name: `Officer mitigation (${officers} officers)`, value: officerMit, tone: "green" },
  ];

  const maxAbs = Math.max(...factors.map((f) => Math.abs(f.value)), 1);

  // ── What-if presets ──────────────────────────────────────────────────────
  const applyCrowdDelta = (mult: number) => setCrowd(Math.round(crowd * mult));

  return (
    <div className="swf-cf">
      <div className="swf-cf-attrib">
        <span className="swf-cf-attrib-dot" />
        Source: <b>ASTraM Event Data + Bengaluru Traffic Police Statistics</b>
        <span className="swf-cf-attrib-note">BTP stats used as historical risk factors — not real-time feeds.</span>
      </div>

      {/* Controls */}
      <div className="swf-cf-controls">
        <div className="swf-cf-control">
          <label>Corridor</label>
          <select value={corridorName} onChange={(e) => setCorridorName(e.target.value)}>
            {corridors
              .slice()
              .sort((a, b) => (a.risk_rank ?? 999) - (b.risk_rank ?? 999))
              .map((c) => (
                <option key={c.corridor_name} value={c.corridor_name}>
                  {c.corridor_name}
                </option>
              ))}
          </select>
        </div>
        <div className="swf-cf-control">
          <label>Event Type</label>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
            {EVENT_TYPES.map((e) => (
              <option key={e.key} value={e.key}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
        <div className="swf-cf-control">
          <label>Crowd Size <span className="swf-cf-val">{crowd.toLocaleString()}</span></label>
          <input type="range" min={500} max={50000} step={500} value={crowd}
            onChange={(e) => setCrowd(Number(e.target.value))} />
        </div>
        <div className="swf-cf-control">
          <label>Duration <span className="swf-cf-val">{duration} h</span></label>
          <input type="range" min={1} max={12} step={1} value={duration}
            onChange={(e) => setDuration(Number(e.target.value))} />
        </div>
        <div className="swf-cf-control">
          <label>Road Closure <span className="swf-cf-val">{closurePct}%</span></label>
          <input type="range" min={0} max={100} step={5} value={closurePct}
            onChange={(e) => setClosurePct(Number(e.target.value))} />
        </div>
        <div className="swf-cf-control">
          <label>Officers Deployed <span className="swf-cf-val">{officers}</span></label>
          <input type="range" min={0} max={20} step={1} value={officers}
            onChange={(e) => setOfficers(Number(e.target.value))} />
        </div>

        <div className="swf-cf-presets">
          <span>What-if presets:</span>
          <button onClick={() => applyCrowdDelta(1.25)}>Crowd +25%</button>
          <button onClick={() => applyCrowdDelta(1.5)}>+50%</button>
          <button onClick={() => applyCrowdDelta(2)}>+100%</button>
          <button onClick={() => setClosurePct(Math.min(100, closurePct + 25))}>Closure +25%</button>
          <button onClick={() => setDuration(Math.min(12, duration + 2))}>+2 h</button>
          <button onClick={() => { setCrowd(8000); setDuration(4); setClosurePct(35); setOfficers(6); }}>Reset</button>
        </div>
      </div>

      {/* Live outputs */}
      <div className="swf-cf-outputs">
        <div className={`swf-cf-evitas swf-rband-${band}`}>
          <div className="swf-cf-evitas-label">EVITAS</div>
          <div className="swf-cf-evitas-val">{evitas.toFixed(1)}</div>
          <div className="swf-cf-evitas-band">{band.toUpperCase()}</div>
        </div>
        <div className="swf-cf-metric">
          <div className="swf-cf-metric-l">Predicted Delay</div>
          <div className="swf-cf-metric-v">{predictedDelayMin} min</div>
        </div>
        <div className="swf-cf-metric">
          <div className="swf-cf-metric-l">Recovery Time</div>
          <div className="swf-cf-metric-v">{Math.max(5, recoveryMin)} min</div>
        </div>
        <div className="swf-cf-metric">
          <div className="swf-cf-metric-l">Impact Radius</div>
          <div className="swf-cf-metric-v">{impactRadiusKm} km</div>
        </div>
        <div className="swf-cf-metric">
          <div className="swf-cf-metric-l">Optimal Officers</div>
          <div className="swf-cf-metric-v">{optimalOfficers}
            <span className={`swf-cf-gap ${officers >= optimalOfficers ? "ok" : "short"}`}>
              {officers >= optimalOfficers ? "✓ adequate" : `↑ deploy +${optimalOfficers - officers}`}
            </span>
          </div>
        </div>
        <div className="swf-cf-metric">
          <div className="swf-cf-metric-l">Barricades</div>
          <div className="swf-cf-metric-v">{barricades}</div>
        </div>
      </div>

      {/* Explainability + Diversion + Similar events */}
      <div className="swf-cf-grid">
        <div className="swf-cf-panel">
          <div className="swf-cf-panel-h">EXPLAINABLE DECISION ENGINE</div>
          <p className="swf-cf-panel-lede">Why is EVITAS {evitas.toFixed(1)}? Each input&apos;s contribution to the score.</p>
          <div className="swf-cf-factors">
            {factors.map((f) => (
              <div className="swf-cf-factor" key={f.name}>
                <div className="swf-cf-factor-head">
                  <span>{f.name}</span>
                  <span className={`swf-cf-factor-v swf-cf-tone-${f.tone}`}>
                    {f.value >= 0 ? "+" : ""}{f.value.toFixed(1)}
                  </span>
                </div>
                <div className="swf-cf-factor-bar">
                  <div
                    className={`swf-cf-factor-fill swf-cf-tone-${f.tone}`}
                    style={{ width: `${(Math.abs(f.value) / maxAbs) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="swf-cf-panel">
          <div className="swf-cf-panel-h">DEPLOYMENT &amp; DIVERSION RECOMMENDATION</div>
          <ul className="swf-cf-rec">
            <li><b>{optimalOfficers}</b> officers · <b>{barricades}</b> barricade points</li>
            <li>Pre-position <b>{Math.ceil(optimalOfficers * 0.6)}</b> at corridor entry, <b>{Math.floor(optimalOfficers * 0.4)}</b> at junctions</li>
            <li>Activate {closurePct >= 40 ? "full" : "partial"} diversion {duration}h before peak</li>
          </ul>
          <div className="swf-cf-divert-h">Suggested diversion corridors (nearest by GPS)</div>
          {diversion.length === 0 ? (
            <div className="swf-cf-empty">Loading corridor geometry…</div>
          ) : (
            <div className="swf-cf-divert">
              {diversion.map((d) => (
                <div className="swf-cf-divert-row" key={d.name}>
                  <div>
                    <div className="swf-cf-divert-name">{d.name}</div>
                    <div className="swf-cf-divert-meta">{d.km.toFixed(1)} km · risk {d.risk.toFixed(0)}</div>
                  </div>
                  <div className={`swf-cf-divert-chip ${d.risk > 55 ? "warn" : "ok"}`}>
                    {d.risk > 55 ? "MONITOR" : "ABSORBS"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="swf-cf-panel">
          <div className="swf-cf-panel-h">HISTORICAL SIMILAR EVENT INTELLIGENCE</div>
          <p className="swf-cf-panel-lede">From ASTraM dataset — same cause or same corridor.</p>
          {similarCf.length === 0 ? (
            <div className="swf-cf-empty">No counterfactual matches yet.</div>
          ) : (
            <div className="swf-cf-hist">
              {similarCf.map((r) => (
                <div className="swf-cf-hist-row" key={r.id}>
                  <div className="swf-cf-hist-top">
                    <span className="swf-cf-hist-id">{r.id}</span>
                    <span className="swf-cf-hist-pri">{r.priority ?? "—"}</span>
                  </div>
                  <div className="swf-cf-hist-meta">
                    {r.event_cause} · {r.corridor_name}
                  </div>
                  <div className="swf-cf-hist-stats">
                    <span>CATE <b>{(r.cate ?? 0).toFixed(2)}</b></span>
                    <span>severity <b>{(r.severity_score ?? 0).toFixed(1)}</b></span>
                    <span>closure <b>{r.requires_road_closure === "True" ? "yes" : "no"}</b></span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="swf-cf-divert-h" style={{ marginTop: 14 }}>Nearest live ASTraM events</div>
          {similarLive.length === 0 ? (
            <div className="swf-cf-empty">Loading live events…</div>
          ) : (
            <div className="swf-cf-live">
              {similarLive.map((e: LiveEvent & { km?: number }) => (
                <div key={e.id} className="swf-cf-live-row">
                  <span className={`swf-cf-live-dot ${e.status === "active" ? "active" : ""}`} />
                  <div className="swf-cf-live-meta">
                    <div className="swf-cf-live-cause">{e.cause}</div>
                    <div className="swf-cf-live-addr">{e.corridor} · {e.km != null ? `${e.km.toFixed(1)} km` : ""}</div>
                  </div>
                  <div className="swf-cf-live-pri">{e.priority}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="swf-cf-panel">
          <div className="swf-cf-panel-h">BTP CORRIDOR VULNERABILITY (HISTORICAL)</div>
          <p className="swf-cf-panel-lede">
            Bengaluru Traffic Police annual statistics for <b>{corridorName}</b>. Historical risk factors — feeds the EVITAS baseline and manpower sizing, not real-time signals.
          </p>
          {!btp ? (
            <div className="swf-cf-empty">No BTP stats for this corridor.</div>
          ) : (
            <>
              <div className="swf-cf-btp-grid">
                <div className="swf-cf-btp-cell">
                  <div className="swf-cf-btp-l">Accidents / yr</div>
                  <div className="swf-cf-btp-v">{btp.accidents_per_year.toFixed(0)}</div>
                </div>
                <div className="swf-cf-btp-cell">
                  <div className="swf-cf-btp-l">Incidents / yr</div>
                  <div className="swf-cf-btp-v">{btp.incidents_per_year.toFixed(0)}</div>
                </div>
                <div className="swf-cf-btp-cell">
                  <div className="swf-cf-btp-l">Congestion idx</div>
                  <div className="swf-cf-btp-v">{btp.congestion_index.toFixed(0)}<span className="swf-cf-btp-u">/100</span></div>
                </div>
                <div className="swf-cf-btp-cell">
                  <div className="swf-cf-btp-l">Volume</div>
                  <div className="swf-cf-btp-v">{btp.vehicle_volume_kpd.toFixed(0)}<span className="swf-cf-btp-u">k veh/day</span></div>
                </div>
                <div className="swf-cf-btp-cell">
                  <div className="swf-cf-btp-l">Peak vulnerability</div>
                  <div className="swf-cf-btp-v">{btp.peak_vulnerability.toFixed(0)}<span className="swf-cf-btp-u">/100</span></div>
                </div>
                <div className="swf-cf-btp-cell">
                  <div className="swf-cf-btp-l">EVITAS uplift</div>
                  <div className="swf-cf-btp-v">+{btpUplift.toFixed(1)}</div>
                </div>
              </div>
              <div className="swf-cf-btp-peaks">
                <span>Peak windows:</span>
                {btp.peak_windows.map((w) => (
                  <span key={w} className="swf-cf-btp-chip">{w}</span>
                ))}
              </div>
              <div className="swf-cf-btp-src">Source: Bengaluru Traffic Police · Annual Statistics</div>
            </>
          )}
        </div>
      </div>
    </div>

  );
}
