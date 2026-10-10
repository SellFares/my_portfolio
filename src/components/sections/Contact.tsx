"use client";

import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";

const LINES = ["Let\u2019s build", "something together."];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = PROFILE.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  /* letter hop: add a class on pointer over, remove when the animation ends */
  const over = (e: React.PointerEvent) => {
    const el = e.target as HTMLElement;
    if (el.dataset.ch !== undefined) el.classList.add("hop");
  };
  const end = (e: React.AnimationEvent) => (e.target as HTMLElement).classList.remove("hop");

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-h">
      <div className="wrap">
        <p className="tag rv"><b>06</b><i aria-hidden /><span>Contact</span></p>
        <h2 className="big" id="contact-h" aria-label={`${LINES[0]} ${LINES[1]}`} onPointerOver={over} onAnimationEnd={end}>
          {LINES.map((line, li) => (
            <span className="rv-mask" key={li} aria-hidden style={{ ["--i" as string]: li }}>
              <span className="rv-in">
                {line.split("").map((c, i) =>
                  c === " " ? " " : <span key={i} data-ch className={`ch ${li === 1 && i >= 9 ? "accent" : ""}`}>{c}</span>,
                )}
              </span>
            </span>
          ))}
        </h2>

        <div className="c-grid">
          <div className="c-main rv">
            <div className="mail-row">
              <a className="mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <button type="button" className="copy" onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</span>
            </div>
            <ul className="c-links">
              <li><span className="mono">Phone</span><a href={PROFILE.phoneHref} className="ul">{PROFILE.phone}</a></li>
              <li><span className="mono">GitHub</span><a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="ul">{PROFILE.githubLabel} ↗</a></li>
              <li><span className="mono">LinkedIn</span><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="ul">{PROFILE.linkedinLabel} ↗</a></li>
            </ul>
          </div>

          <a className="badge rv" href={`mailto:${PROFILE.email}`} aria-label="Say hello by email" style={{ ["--i" as string]: 2 }}>
            <svg viewBox="0 0 200 200" aria-hidden>
              <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <text className="mono"><textPath href="#circ" startOffset="0" textLength="488" lengthAdjust="spacing">say hello · say hello · say hello · say hello · </textPath></text>
            </svg>
            <span className="arr" aria-hidden>↗</span>
          </a>
        </div>
      </div>


      <style>{`
        .contact{padding-bottom:40px}
        .big{font-weight:700;letter-spacing:-.055em;line-height:.98;font-size:clamp(46px,10.5vw,176px)}
        .big .rv-mask{padding-top:.04em}
        .ch{display:inline-block;transition:color .3s}
        .ch.hop{animation:hop .7s var(--ease)}
        @keyframes hop{0%{transform:translateY(0)}35%{transform:translateY(-.16em)}70%{transform:translateY(.02em)}100%{transform:translateY(0)}}
        .c-grid{display:flex;flex-wrap:wrap;gap:40px;align-items:flex-end;justify-content:space-between;margin-top:56px}
        .c-main{flex:1 1 420px;min-width:0}
        .mail-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px}
        .mail{font-size:clamp(22px,3.6vw,48px);font-weight:600;letter-spacing:-.04em;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:8px;text-decoration-color:rgba(13,13,13,.25);transition:text-decoration-color .4s var(--ease);overflow-wrap:anywhere}
        .mail:hover{text-decoration-color:var(--ink)}
        .copy{height:34px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);transition:background .4s var(--ease),color .4s var(--ease);min-width:92px}
        .copy:hover{background:var(--ink);color:#fff}
        .c-links{margin-top:36px;display:grid;gap:0;max-width:560px}
        .c-links li{display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-top:1px solid var(--line);font-size:15px;flex-wrap:wrap}
        .c-links li:last-child{border-bottom:1px solid var(--line)}
        .c-links .mono{font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--mute)}
        .badge{position:relative;width:170px;height:170px;border-radius:50%;display:grid;place-items:center;flex:none;transition:transform .6s var(--ease)}
        .badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
        .badge text{font-size:14px;letter-spacing:0;text-transform:uppercase;fill:var(--ink)}
        .badge .arr{width:64px;height:64px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:24px;transition:transform .6s var(--ease)}
        .badge:hover .arr{transform:rotate(45deg) scale(1.08)}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </section>
  );
}
