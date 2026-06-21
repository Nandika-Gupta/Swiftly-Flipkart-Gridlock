// Swiftly augmentation: loads ASTraM/EVITAS data + wires real Copilot to /api/copilot
(function () {
  // Hide non-functional sidebar nav buttons from the bundled Command Center UI.
  const HIDDEN_TITLES = new Set(["Live Events", "Simulation", "Deployment", "Reports"]);
  const RENAME_MAP = {
    "Risk Analysis": "IMPACT ANALYSIS",
    "Resources": "DEPLOYMENT PLANNER",
    "Replay": "RESPONSE PLANNER",
  };

  function hideNavButtons() {
    let found = 0;
    document.querySelectorAll('button[data-dc-tpl="17"]').forEach((btn) => {
      const title = btn.getAttribute("title");
      if (title && HIDDEN_TITLES.has(title)) {
        btn.style.display = "none";
        btn.style.pointerEvents = "none";
        btn.setAttribute("aria-hidden", "true");
        found++;
      }
    });
    return found;
  }

  function renameNavButtons() {
    let renamed = 0;
    document.querySelectorAll('button[data-dc-tpl="17"]').forEach((btn) => {
      const title = btn.getAttribute("title");
      if (title && RENAME_MAP[title] && !btn.dataset.swiftlyRenamed) {
        btn.setAttribute("title", RENAME_MAP[title]);
        const label = btn.querySelector("span, .label, .text");
        if (label) {
          label.textContent = RENAME_MAP[title];
        } else {
          // Fallback: update any text node directly inside the button
          Array.from(btn.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === title) {
              node.textContent = RENAME_MAP[title];
            }
          });
        }
        btn.dataset.swiftlyRenamed = "1";
        renamed++;
      }
    });
    return renamed;
  }

  // Poll across bundle DOM swap and late renders.
  let attempts = 0;
  function pollAugment() {
    attempts++;
    hideNavButtons();
    renameNavButtons();
    if (attempts < 120) {
      requestAnimationFrame(pollAugment);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pollAugment);
  } else {
    pollAugment();
  }


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
