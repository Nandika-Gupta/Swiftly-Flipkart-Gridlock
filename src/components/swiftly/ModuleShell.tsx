import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { swiftlyCss } from "./styles";

const MODULES = [
  { to: "/", label: "Overview", code: "00" },
  { to: "/swiftly/intelligence", label: "Event Intelligence", code: "01" },
  { to: "/swiftly/deployment", label: "Operational Scenario Lab", code: "02" },
  { to: "/swiftly/corridors", label: "Corridor Intelligence", code: "03" },
  { to: "/swiftly/response", label: "Response Planning", code: "04" },
  { to: "/swiftly/copilot", label: "Command Copilot", code: "05" },
] as const;

export function ModuleShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <div className="swf-mod">
      <style>{swiftlyCss}</style>
      <style>{moduleCss}</style>
      <div className="swf-grid-bg" />
      <div className="swf-glow swf-glow-a" />
      <div className="swf-glow swf-glow-b" />

      <header className="swf-mod-top">
        <Link to="/" className="swf-mod-brand">
          <div className="swf-logo">◈</div>
          <div>
            <div className="swf-brand-name">SWIFTLY</div>
            <div className="swf-brand-sub">Command Center</div>
          </div>
        </Link>
        <div className="swf-mod-status">
          <span className="swf-pill swf-pill-dark"><span className="swf-dot swf-dot-green" /> ASTraM</span>
          <span className="swf-pill swf-pill-dark"><span className="swf-dot swf-dot-blue" /> BTP STATS</span>
          <span className="swf-pill swf-pill-dark"><span className="swf-dot swf-dot-green" /> MapMyIndia</span>
        </div>
      </header>

      <nav className="swf-mod-nav">
        {MODULES.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="swf-mod-navlink"
            activeProps={{ className: "swf-mod-navlink is-active" }}
            activeOptions={{ exact: true }}
          >
            <span className="swf-mod-navcode">{m.code}</span>
            <span>{m.label}</span>
          </Link>
        ))}
      </nav>

      <section className="swf-mod-head">
        <div className="swf-section-eyebrow">— {eyebrow}</div>
        <h1 className="swf-mod-title">{title}</h1>
        {lede ? <p className="swf-mod-lede">{lede}</p> : null}
      </section>

      <main className="swf-mod-main">{children}</main>

      <footer className="swf-footer">
        <div>SWIFTLY · Predict. Deploy. Divert.</div>
        <div>ASTraM Event Data + Bengaluru Traffic Police Statistics + MapMyIndia</div>
      </footer>
    </div>
  );
}

const moduleCss = `
.swf-mod{position:relative;min-height:100vh;background:#07111d;color:#e8edf7;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding-bottom:80px}
.swf-mod-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;padding:14px 26px;border-bottom:1px solid rgba(163,178,219,.12);background:rgba(7,17,29,.78);backdrop-filter:blur(18px)}
.swf-mod-brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit}
.swf-mod-status{display:flex;gap:8px;flex-wrap:wrap}
.swf-mod-nav{position:sticky;top:62px;z-index:25;display:flex;gap:4px;padding:10px 22px;overflow-x:auto;border-bottom:1px solid rgba(163,178,219,.1);background:rgba(7,17,29,.62);backdrop-filter:blur(14px)}
.swf-mod-navlink{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:8px;border:1px solid transparent;color:#9aafd6;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;white-space:nowrap;transition:all .18s}
.swf-mod-navlink:hover{color:#fff;background:rgba(255,255,255,.04)}
.swf-mod-navlink.is-active{color:#07111d;background:linear-gradient(135deg,#4fd1ff,#ff8c42);border-color:transparent;box-shadow:0 10px 24px rgba(79,209,255,.22)}
.swf-mod-navcode{font-size:9px;opacity:.7;letter-spacing:1px}
.swf-mod-head{max-width:1280px;margin:36px auto 18px;padding:0 28px}
.swf-mod-title{font-size:clamp(28px,3.4vw,42px);font-weight:900;letter-spacing:-.02em;margin:8px 0 12px;background:linear-gradient(135deg,#fff 30%,#9ec5ff 95%);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.05}
.swf-mod-lede{max-width:860px;color:#a9b9d8;font-size:14px;line-height:1.65;margin:0}
.swf-mod-main{max-width:1280px;margin:24px auto 0;padding:0 28px}
`;
