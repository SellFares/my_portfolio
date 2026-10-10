"use client";

import { useRef } from "react";
import { EDUCATION } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHead from "@/components/ui/SectionHead";

export default function Education() {
  const ref = useRef<HTMLOListElement>(null);

  /* spine scales with scroll; each stop lights once the spine head passes it */
  useScrollProgress(ref, (p, el) => {
    el.style.setProperty("--p", String(p));
    const h = el.offsetHeight;
    el.querySelectorAll<HTMLElement>(".stop").forEach((s) => {
      s.classList.toggle("lit", s.offsetTop + 14 <= p * h);
    });
  }, 0.62);

  return (
    <section id="education" className="section edu" aria-labelledby="edu-h">
      <div className="wrap">
        <SectionHead index="05" label="Education" lead="The path" accent="so far." id="edu-h" />
        <ol className="path" ref={ref}>
          <span className="spine-bg" aria-hidden />
          <span className="spine-fg" aria-hidden />
          {EDUCATION.map((s, i) => (
            <li key={s.title} className="stop">
              <span className="node" aria-hidden />
              <p className="when mono">{s.when}</p>
              <div className="what">
                <h3>{s.title}</h3>
                <p className="place">{s.place}</p>
                <p className="detail">{s.detail}</p>
              </div>
              <span className="sr-only">{`Step ${i + 1} of ${EDUCATION.length}`}</span>
            </li>
          ))}
          <li className="next-wrap">
            <div className="next">
              <p className="mono">Next</p>
              <p className="next-t">Your <span className="accent">team?</span></p>
            </div>
          </li>
        </ol>
      </div>
      <style>{`
        .path{position:relative;margin-top:56px;padding-left:34px;--p:0}
        .spine-bg,.spine-fg{position:absolute;left:6px;top:8px;bottom:8px;width:2px;border-radius:1px}
        .spine-bg{background:var(--line)}
        .spine-fg{background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p))}
        .stop{position:relative;display:grid;grid-template-columns:1fr;gap:8px;padding:0 0 52px}
        .what h3{color:var(--mute);transition:color .8s var(--ease)}
        .stop.lit .what h3{color:var(--ink)}
        .node{position:absolute;left:-34px;top:5px;width:14px;height:14px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:background .6s var(--ease),box-shadow .6s var(--ease),transform .6s var(--ease)}
        .stop.lit .node{background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(13,13,13,.07);transform:scale(1.1)}
        .when{font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute);padding-top:4px}
        .what h3{font-size:clamp(24px,3vw,38px);font-weight:700;letter-spacing:-.04em;line-height:1.08;max-width:24ch}
        .place{margin-top:8px;font-size:15px;color:var(--ink-2)}
        .detail{margin-top:10px;font-size:14.5px;line-height:1.6;color:var(--mute);max-width:62ch}
        .next-wrap{position:relative}
        .next{display:inline-block;padding:22px 30px;border-radius:24px;border:1.5px dashed rgba(13,13,13,.3)}
        .next p.mono{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
        .next-t{font-size:clamp(28px,3.4vw,44px);font-weight:700;letter-spacing:-.045em;margin-top:4px;line-height:1.05}
        @media (min-width:900px){
          .path{padding-left:0}
          .spine-bg,.spine-fg{left:calc(24% + 23px)}
          .stop{grid-template-columns:24% 1fr;gap:0 48px;padding-bottom:64px}
          .node{left:calc(24% + 17px)}
          .when{text-align:right;padding-right:0}
          .next-wrap{padding-left:calc(24% + 48px)}
        }
      `}</style>
    </section>
  );
}
