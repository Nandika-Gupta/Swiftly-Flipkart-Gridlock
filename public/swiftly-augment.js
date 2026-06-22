// Swiftly augmentation: loads ASTraM/EVITAS data + wires real Copilot to /api/copilot
(function () {
  // Hide non-functional sidebar nav buttons from the bundled Command Center UI.
  const HIDDEN_TITLES = new Set(["Live Events", "Simulation", "Deployment", "Reports"]);

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

  // Poll across bundle DOM swap and late renders.
  let attempts = 0;
  function pollAugment() {
    attempts++;
    hideNavButtons();
    if (attempts < 120) {
      requestAnimationFrame(pollAugment);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pollAugment);
  } else {
    pollAugment();
  }

  // Inject a "Back to Home" button so users can return to the landing page.
  function injectBackButton() {
    if (document.getElementById("swf-back-home")) return;
    const a = document.createElement("a");
    a.id = "swf-back-home";
    a.href = "/";
    a.textContent = "◄ EXIT TO MISSION CONTROL";
    a.style.cssText = [
      "position:fixed", "top:12px", "left:12px", "z-index:99999",
      "padding:8px 14px", "border-radius:8px",
      "background:rgba(7,17,29,.92)", "color:#4fd1ff",
      "border:1px solid rgba(79,209,255,.4)",
      "font:600 12px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      "letter-spacing:.08em", "text-transform:uppercase",
      "text-decoration:none", "cursor:pointer",
      "box-shadow:0 4px 14px rgba(0,0,0,.4)",
    ].join(";");
    a.addEventListener("mouseenter", () => { a.style.background = "rgba(79,209,255,.18)"; });
    a.addEventListener("mouseleave", () => { a.style.background = "rgba(7,17,29,.92)"; });
    document.body.appendChild(a);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectBackButton);
  } else {
    injectBackButton();
  }
  setInterval(injectBackButton, 1500);



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
