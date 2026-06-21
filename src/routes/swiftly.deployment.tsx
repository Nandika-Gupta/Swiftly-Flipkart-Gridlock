import { createFileRoute, Link } from "@tanstack/react-router";
import { ModuleShell } from "@/components/swiftly/ModuleShell";
import { ScenarioLab } from "@/components/swiftly/ScenarioLab";

export const Route = createFileRoute("/swiftly/deployment")({
  head: () => ({
    meta: [
      { title: "Operational Scenario Lab — Swiftly" },
      { name: "description", content: "Simulate event impact on Bengaluru corridors. Live EVITAS, delay, recovery and officer deployment recomputed from your inputs and real ASTraM + BTP statistics." },
      { property: "og:title", content: "Operational Scenario Lab — Swiftly" },
      { property: "og:description", content: "Drive crowd, closure and officer parameters. See EVITAS, delay and deployment update live." },
    ],
  }),
  component: DeploymentModule,
});

function DeploymentModule() {
  return (
    <ModuleShell
      eyebrow="OPERATIONAL SCENARIO LAB"
      title="Simulate event impact. See EVITAS, delay, recovery & deployment update live."
      lede="Drive every parameter directly. Outputs are computed from your inputs, real ASTraM corridor & counterfactual datasets, and Bengaluru Traffic Police historical statistics — not pre-recorded."
    >
      <ScenarioLab />
      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/swiftly/response" className="swf-cta-secondary">→ Response Planning</Link>
        <Link to="/swiftly/corridors" className="swf-cta-secondary">→ Corridor Intelligence</Link>
      </div>
    </ModuleShell>
  );
}
