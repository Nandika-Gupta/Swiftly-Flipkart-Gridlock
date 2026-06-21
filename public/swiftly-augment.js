// Swiftly augmentation: loads ASTraM/EVITAS data + wires real Copilot to /api/copilot
(function () {
  // Hide non-functional sidebar nav buttons from the bundled Command Center UI.
  const HIDDEN_TITLES = new Set(["Live Events", "Simulation", "Deployment", "Reports"]);
  function hideNavButtons(root) {
    root.querySelectorAll('button[data-dc-tpl="17"]').forEach((btn) => {
      const title = btn.getAttribute("title");
      if (title && HIDDEN_TITLES.has(title)) {
        btn.style.display = "none";
        btn.setAttribute("aria-hidden", "true");
      }
    });
  }
  // Run after bundle DOM swap and on any late renders.
  function installNavHider() {
    hideNavButtons(document.body);
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) hideNavButtons(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) installNavHider();
  else document.addEventListener("DOMContentLoaded", installNavHider);

  window.SWIFTLY_DATA = window.SWIFTLY_DATA || {};
  Promise.all([
    fetch("/data/corridors.json").then((r) => r.json()).catch(() => []),
    fetch("/data/events.json").then((r) => r.json()).catch(() => ({})),
    fetch("/data/counterfactuals.json").then((r) => r.json()).catch(() => []),
  ]).then(([corridors, events, cf]) => {
    window.SWIFTLY_DATA = { corridors, events, counterfactuals: cf };
    window.dispatchEvent(new CustomEvent("swiftly:data-ready"));
    console.log("[Swiftly] data loaded:", {
      corridors: corridors.length, events: Object.keys(events || {}).length, cf: cf.length,
    });
  });

  window.SWIFTLY_askLLM = async function (question) {
    const d = window.SWIFTLY_DATA || {};
    const ctx = {
      top_corridors: (d.corridors || []).slice(0, 8),
      counterfactuals_sample: (d.counterfactuals || []).slice(0, 10),
    };
    const res = await fetch("/api/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context: ctx }),
    });
    if (!res.ok) throw new Error("Copilot HTTP " + res.status);
    const json = await res.json();
    return json.text || json.answer || "";
  };
})();
