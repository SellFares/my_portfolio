"use client";

import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo from "@/components/ui/TechLogo";

function FeedMock() {
  return (
    <div className="mock mock-feed" aria-hidden>
      <div className="m-top">
        <span className="m-dot" /><span className="m-bar w40" />
        <span className="m-sp" />
        <span className="m-toggle"><i /></span>
      </div>
      {[0, 1].map((n) => (
        <div className="m-post" key={n}>
          <div className="m-head"><span className="m-av" /><span className="m-bar w30" /><span className="m-bar w15 faint" /></div>
          <span className="m-bar w90" />
          <span className="m-bar w60" />
          {n === 0 && <div className="m-img" />}
          <div className="m-foot"><span className="m-pill" /><span className="m-pill" /></div>
        </div>
      ))}
    </div>
  );
}

function SystemsMock() {
  const rows = ["malloc / free", "string operations", "character classification", "linked lists"];
  return (
    <div className="mock mock-sys" aria-hidden>
      <div className="m-win"><i /><i /><i /></div>
      <div className="m-term mono">
        <p>$ make</p>
        {rows.map((r, i) => (
          <p key={r} style={{ ["--i" as string]: i }}><span className="ok">✓</span> {r}</p>
        ))}
        <p className="dim">max 25 lines / function</p>
        <p className="dim">no global variables</p>
      </div>
    </div>
  );
}

function Panel({ p, open, onOpen, n }: { p: Project; open: boolean; onOpen: () => void; n: number }) {
  return (
    <article
      className={`panel ${open ? "open" : ""}`}
      onMouseEnter={onOpen}
      aria-label={`${p.title} — ${p.kicker}`}
    >
      {/* folded spine */}
      <button type="button" className="spine" onClick={onOpen} onFocus={onOpen} aria-expanded={open} aria-controls={`${p.id}-body`} tabIndex={open ? -1 : 0}>
        <span className="sp-num mono">{p.index}</span>
        <span className="sp-title">{p.title}</span>
        <span className="sp-plus" aria-hidden>+</span>
      </button>

      {/* open content */}
      <div className="body" id={`${p.id}-body`} inert={!open}>
        <div className="body-in" style={{ ["--n" as string]: n }}>
          <div className="b-left">
            <p className="mono b-kicker"><b>{p.index}</b> — {p.kicker}</p>
            <h3 className="b-title">{p.title}</h3>
            <p className="b-period mono">{p.period}</p>
            <p className="b-desc">{p.description}</p>
            <ul className="b-feat">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <ul className="b-tech" aria-label="Technologies">
              {p.tech.map((t) => (
                <li key={t.label}>{t.logo && <TechLogo id={t.logo} size={14} />}{t.label}</li>
              ))}
            </ul>
            {p.link && (
              <a className="btn btn-primary b-link" href={p.link.href} target="_blank" rel="noopener noreferrer">
                {p.link.label} ↗
              </a>
            )}
          </div>
          <div className="b-right">
            <div className="wipe">
              {p.mock === "feed" ? <FeedMock /> : <SystemsMock />}
              <span className="ill mono">Illustrative UI</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const [openId, setOpenId] = useState(PROJECTS[0].id);
  return (
    <section id="work" className="section work" aria-labelledby="work-h">
      <div className="wrap">
        <SectionHead index="03" label="Selected work" lead="Things I've" accent="built." id="work-h" />
        <div className="acc rv" style={{ ["--n" as string]: PROJECTS.length }}>
          {PROJECTS.map((p) => (
            <Panel key={p.id} p={p} n={PROJECTS.length} open={openId === p.id} onOpen={() => setOpenId(p.id)} />
          ))}
        </div>
      </div>

      <style>{`
        .work .acc{margin-top:48px;container-type:inline-size;display:flex;flex-direction:column;gap:12px}
        .panel{position:relative;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;display:grid;grid-template-rows:auto 0fr;transition:grid-template-rows .9s var(--ease),box-shadow .6s var(--ease)}
        .panel.open{grid-template-rows:0fr 1fr;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -40px rgba(0,0,0,.28)}
        .spine{display:flex;align-items:center;gap:16px;padding:22px 24px;text-align:left;overflow:hidden;min-height:0;transition:opacity .4s var(--ease)}
        .panel.open .spine{opacity:0;pointer-events:none;padding-block:0}
        .sp-num{font-size:12px;color:var(--mute)}
        .sp-title{font-weight:700;letter-spacing:-.04em;font-size:26px;flex:1}
        .sp-plus{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:20px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:transform .6s var(--ease),background .4s,color .4s}
        .spine:hover .sp-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
        .body{min-height:0;overflow:hidden}
        .body-in{display:grid;grid-template-columns:1fr;gap:24px;padding:26px 22px 28px;opacity:0;transition:opacity .6s var(--ease) .15s}
        .panel.open .body-in{opacity:1}
        .b-kicker{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--mute)}
        .b-kicker b{color:var(--ink);font-weight:500}
        .b-title{font-size:clamp(40px,5vw,64px);font-weight:700;letter-spacing:-.05em;line-height:1;margin-top:10px}
        .b-period{font-size:12px;color:var(--mute);margin-top:8px}
        .b-desc{margin-top:14px;font-size:14.5px;line-height:1.55;color:var(--ink-2);max-width:56ch}
        .b-feat{margin-top:16px;display:grid;grid-template-columns:1fr;gap:6px 20px;font-size:13px;line-height:1.35}
        .b-feat li{position:relative;padding-left:16px;color:var(--ink-2)}
        .b-feat li::before{content:"";position:absolute;left:0;top:.62em;width:7px;height:1px;background:var(--ink)}
        .b-tech{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}
        .b-tech li{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 11px 0 9px;border-radius:999px;font-size:12px;font-weight:500;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line)}
        .b-link{margin-top:18px;height:44px}
        .b-right{display:flex}
        .wipe{position:relative;flex:1;min-height:300px;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;padding:20px;clip-path:inset(0 100% 0 0);transition:clip-path 1.1s var(--ease) .25s}
        .panel.open .wipe{clip-path:inset(0 0 0 0)}
        .ill{position:absolute;right:12px;bottom:10px;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}

        /* mini UIs (grayscale) */
        .mock{display:flex;flex-direction:column;gap:10px;height:100%}
        .m-bar{display:block;height:8px;border-radius:4px;background:#d4d1cb}
        .m-bar.faint{background:#e6e3dd}
        .w15{width:15%}.w30{width:30%}.w40{width:40%}.w60{width:60%}.w90{width:90%}
        .m-top{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
        .m-dot{width:16px;height:16px;border-radius:50%;background:var(--ink)}
        .m-sp{flex:1}
        .m-toggle{width:32px;height:18px;border-radius:9px;background:var(--ink);position:relative}
        .m-toggle i{position:absolute;right:3px;top:3px;width:12px;height:12px;border-radius:50%;background:#fff}
        .m-post{display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
        .m-head{display:flex;align-items:center;gap:8px}
        .m-av{width:22px;height:22px;border-radius:50%;background:#b9b6b0}
        .m-img{height:72px;border-radius:10px;background:repeating-linear-gradient(135deg,#e4e1db 0 8px,#ece9e4 8px 16px)}
        .m-foot{display:flex;gap:8px}
        .m-pill{width:44px;height:16px;border-radius:8px;background:#ebe8e2}
        .mock-sys{gap:0;border-radius:12px;overflow:hidden;background:var(--ink);padding:0}
        .m-win{display:flex;gap:6px;padding:11px 14px;background:#1c1c1c}
        .m-win i{width:9px;height:9px;border-radius:50%;background:#555}
        .m-term{padding:16px 16px 36px;color:#e6e3dd;font-size:12.5px;line-height:1.9}
        .m-term .ok{color:#fff}
        .m-term .dim{color:#8a8782}
        .panel.open .m-term p{animation:line .6s var(--ease) both;animation-delay:calc(var(--i,0)*120ms + 700ms)}
        @keyframes line{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}

        @media (min-width:900px){
          .work .acc{flex-direction:row;height:min(78svh,600px);gap:12px}
          .panel{display:block;flex:0 0 76px;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
          .panel.open{flex:1 1 76px}
          .spine{position:absolute;inset:0;flex-direction:column;justify-content:space-between;align-items:center;padding:22px 0}
          .sp-title{writing-mode:vertical-rl;transform:rotate(180deg);flex:0 1 auto;white-space:nowrap;font-size:22px;margin-block:auto}
          .sp-num{order:0}
          .sp-plus{order:3}
          .body{position:absolute;inset:0;overflow:hidden}
          .body-in{grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:36px;padding:30px 36px;height:100%;width:calc(100cqw - (var(--n) - 1) * 88px);align-items:stretch}
          .b-feat{grid-template-columns:1fr 1fr}
          .wipe{min-height:0}
        }
      `}</style>
    </section>
  );
}
