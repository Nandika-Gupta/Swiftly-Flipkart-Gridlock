import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swiftly — Towards an Unjammed Bengaluru" },
      {
        name: "description",
        content:
          "Swiftly is a Bengaluru Traffic Intelligence Platform that forecasts event-driven congestion and recommends manpower, barricades and diversion strategies in real time.",
      },
      { property: "og:title", content: "Swiftly — Towards an Unjammed Bengaluru" },
      {
        property: "og:description",
        content:
          "Forecasting event-driven congestion and recommending optimal manpower, barricading, and diversion strategies for Bengaluru Traffic Police.",
      },
    ],
  }),
  component: SwiftlyShell,
});

function SwiftlyShell() {
  return (
    <iframe
      title="Swiftly Command Center"
      src="/swiftly.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: 0,
        background: "#080B12",
      }}
    />
  );
}
