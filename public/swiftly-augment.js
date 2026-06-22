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

  // Inject a real chat composer into the bundled Copilot side panel.
  function findCopilotPanel() {
    const candidates = document.querySelectorAll('div[style*="width:380px"], div[style*="width: 380px"]');
    for (const el of candidates) {
      const s = el.getAttribute("style") || "";
      if (s.includes("top:88px") || s.includes("top: 88px")) {
        if (s.includes("right:18px") || s.includes("right: 18px")) return el;
      }
    }
    return null;
  }

  function renderMarkdown(src) {
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const lines = String(src || "").split(/\r?\n/);
    let html = "", inList = false;
    for (let raw of lines) {
      const line = raw.replace(/\s+$/, "");
      const bullet = line.match(/^\s*[\*\-•]\s+(.*)$/);
      if (bullet) {
        if (!inList) { html += "<ul style='margin:4px 0 4px 18px;padding:0;'>"; inList = true; }
        html += "<li style='margin:2px 0;'>" + inline(bullet[1]) + "</li>";
      } else {
        if (inList) { html += "</ul>"; inList = false; }
        if (line.trim() === "") html += "<div style='height:6px;'></div>";
        else html += "<div>" + inline(line) + "</div>";
      }
    }
    if (inList) html += "</ul>";
    return html;
    function inline(s) {
      s = esc(s);
      s = s.replace(/\*\*([^*]+)\*\*/g, "<b style='color:#e7f3ff;'>$1</b>");
      s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
      s = s.replace(/`([^`]+)`/g, "<code style='background:rgba(255,255,255,.08);padding:1px 5px;border-radius:4px;font-family:ui-monospace,monospace;font-size:11.5px;'>$1</code>");
      return s;
    }
  }

  function injectCopilotChat() {
    const panel = findCopilotPanel();
    if (!panel) return;
    if (!panel.querySelector(".swf-cop-chat")) {
      // Make panel a column layout so chat sticks to bottom and scrolls properly.
      panel.style.display = "flex";
      panel.style.flexDirection = "column";
      panel.style.overflow = "hidden";

      const wrap = document.createElement("div");
      wrap.className = "swf-cop-chat";
      wrap.style.cssText = "margin-top:auto;padding:10px 12px 12px;border-top:1px solid rgba(79,209,255,.18);display:flex;flex-direction:column;gap:8px;min-height:0;flex:1 1 auto;background:rgba(6,12,22,.55);";
      wrap.innerHTML = `
        <div class="swf-cop-log" style="flex:1 1 auto;min-height:120px;overflow:auto;display:flex;flex-direction:column;gap:8px;font:12.5px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#cfd9ee;padding-right:4px;"></div>
        <div style="display:flex;gap:6px;flex:0 0 auto;">
          <input class="swf-cop-input" placeholder="Ask Copilot…" style="flex:1;padding:9px 11px;border-radius:8px;border:1px solid rgba(79,209,255,.3);background:rgba(7,17,29,.7);color:#e7eefc;font:13px -apple-system,sans-serif;outline:none;" />
          <button class="swf-cop-send" style="padding:9px 14px;border-radius:8px;border:1px solid rgba(79,209,255,.45);background:rgba(79,209,255,.18);color:#4fd1ff;font:700 12px -apple-system,sans-serif;letter-spacing:.06em;cursor:pointer;">SEND</button>
        </div>
      `;
      panel.appendChild(wrap);

      const log = wrap.querySelector(".swf-cop-log");
      const input = wrap.querySelector(".swf-cop-input");
      const send = wrap.querySelector(".swf-cop-send");

      function addMsg(role, text, asMarkdown) {
        const row = document.createElement("div");
        const isUser = role === "user";
        row.style.cssText = "padding:9px 11px;border-radius:10px;max-width:94%;word-wrap:break-word;overflow-wrap:anywhere;" + (isUser
          ? "align-self:flex-end;background:rgba(79,209,255,.18);color:#eaf6ff;border:1px solid rgba(79,209,255,.32);"
          : "align-self:flex-start;background:rgba(255,255,255,.05);color:#cfd9ee;border:1px solid rgba(255,255,255,.08);");
        if (asMarkdown) row.innerHTML = renderMarkdown(text);
        else row.textContent = text;
        log.appendChild(row);
        log.scrollTop = log.scrollHeight;
        return row;
      }

      async function submit(forcedText) {
        const q = (forcedText != null ? forcedText : input.value || "").trim();
        if (!q) return;
        input.value = "";
        addMsg("user", q, false);
        const thinking = addMsg("bot", "Thinking…", false);
        send.disabled = true;
        try {
          const answer = await window.SWIFTLY_askLLM(q);
          thinking.innerHTML = renderMarkdown(answer || "(no response)");
        } catch (e) {
          thinking.textContent = "Copilot error: " + (e && e.message ? e.message : e);
        } finally {
          send.disabled = false;
          input.focus();
        }
      }

      send.addEventListener("click", () => submit());
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      panel._swfSubmit = submit;
      setTimeout(() => input.focus(), 100);
    }

    // Wire suggestion chips (Optimise manpower split, etc.) to send their text.
    panel.querySelectorAll("span,button,div").forEach((el) => {
      if (el._swfChipBound) return;
      const txt = (el.textContent || "").trim();
      if (!txt || txt.length > 60) return;
      const chipy = [
        "Optimise manpower split", "Compare diversion options",
        "Explain the EVITAS score", "Draft field-team brief",
      ];
      if (!chipy.includes(txt)) return;
      // Heuristic: only bind elements that look like clickable chips (rounded bg).
      const st = el.getAttribute("style") || "";
      if (!/border-radius/.test(st)) return;
      el._swfChipBound = true;
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        if (panel._swfSubmit) panel._swfSubmit(txt);
      });
    });
  }

  setInterval(injectCopilotChat, 700);

})();

