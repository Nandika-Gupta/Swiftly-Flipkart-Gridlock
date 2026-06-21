import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ModuleShell } from "@/components/swiftly/ModuleShell";

export const Route = createFileRoute("/swiftly/copilot")({
  head: () => ({
    meta: [
      { title: "Command Copilot — Swiftly" },
      { name: "description", content: "Natural-language briefing assistant for Bengaluru Traffic Police. Ask about corridors, events, and deployment posture." },
      { property: "og:title", content: "Command Copilot — Swiftly" },
      { property: "og:description", content: "NL briefing assistant grounded in ASTraM + BTP data." },
    ],
  }),
  component: CopilotModule,
});

const SUGGESTIONS = [
  "What's the EVITAS risk on Mysore Road tonight?",
  "Compare Varthur Road and ORR North 1 for a 10k crowd.",
  "How many officers for a procession on Bellary Road?",
  "Which corridor has the highest BTP accident rate?",
];

function CopilotModule() {
  const [log, setLog] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Command Copilot online. Grounded in ASTraM event data + BTP historical statistics. Ask anything about corridor risk, event impact, or deployment." },
  ]);
  const [q, setQ] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const reply = stubReply(text);
    setLog((l) => [...l, { role: "user", text }, { role: "ai", text: reply }]);
    setQ("");
  };

  return (
    <ModuleShell
      eyebrow="COMMAND COPILOT"
      title="Brief me. In plain English."
      lede="Conversational interface over ASTraM events, corridor risk scores and BTP historical statistics. Prototype responses are rule-based — wire an LLM via Lovable AI Gateway for full generative answers."
    >
      <div className="swf-cf-grid" style={{ gridTemplateColumns: "1fr 280px" }}>
        <div className="swf-cf-panel" style={{ display: "flex", flexDirection: "column", minHeight: 480 }}>
          <div className="swf-cf-panel-h">CONVERSATION</div>
          <div style={{ flex: 1, overflowY: "auto", marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {log.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: m.role === "user" ? "linear-gradient(135deg,#4fd1ff,#ff8c42)" : "rgba(255,255,255,.04)",
                  color: m.role === "user" ? "#07111d" : "#e8edf7",
                  fontWeight: m.role === "user" ? 700 : 500,
                  fontSize: 13,
                  lineHeight: 1.55,
                  border: m.role === "ai" ? "1px solid rgba(150,173,220,.18)" : "none",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(q); }}
            style={{ display: "flex", gap: 8, marginTop: 14 }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask Copilot…"
              style={{
                flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(150,173,220,.22)",
                background: "rgba(7,17,29,.6)", color: "#e8edf7", fontSize: 13, outline: "none",
              }}
            />
            <button type="submit" className="swf-cta-secondary">Send →</button>
          </form>
        </div>

        <div className="swf-cf-panel">
          <div className="swf-cf-panel-h">QUICK PROMPTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  textAlign: "left", padding: "10px 12px", borderRadius: 8,
                  border: "1px solid rgba(150,173,220,.18)", background: "rgba(255,255,255,.02)",
                  color: "#cfd9ee", fontSize: 12, lineHeight: 1.5, cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}

function stubReply(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("mysore")) return "Mysore Road · EVITAS baseline 68 (ORANGE). 743 historical events, 11% closure rate. Recommend 6 officers + 2 barricade points for a standard procession. Open Scenario Lab to tune crowd size.";
  if (lower.includes("varthur") && lower.includes("orr")) return "Varthur Road EVITAS 51 vs ORR North 1 EVITAS 52 for a 10k procession. Varthur has higher closure rate (12%); ORR North 1 has higher event throughput. ORR North 1 needs +1 officer.";
  if (lower.includes("procession") && lower.includes("bellary")) return "Bellary Road 1 · procession with default crowd estimate: 7 officers, 3 barricade points, partial diversion 2h ahead. BTP shows 124 accidents/yr on this corridor — pre-position medical unit.";
  if (lower.includes("accident") || lower.includes("btp")) return "Highest BTP accident corridors: Mysore Road (~118/yr), ORR East 1 (~104/yr), Bellary Road 1 (~98/yr). These also carry the top EVITAS baselines.";
  return "I can answer questions about corridor risk, event impact, BTP historical vulnerability and deployment recommendations. Try one of the quick prompts.";
}
