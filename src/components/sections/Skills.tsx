"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FAMILIES, PROJECTS, SKILLS, type Skill } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo, { BRAND, isBrand } from "@/components/ui/TechLogo";

export default function Skills() {
  const gridRef = useRef<HTMLUListElement>(null);
  const [family, setFamily] = useState<string>("All");
  const [active, setActive] = useState<Skill>(SKILLS[0]);
  const [cols, setCols] = useState(8);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const g = gridRef.current;
    if (!g) return;
    const measure = () => setCols(getComputedStyle(g).gridTemplateColumns.split(" ").length || 8);
    measure();
    window.addEventListener("resize", measure);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(g);
    return () => { window.removeEventListener("resize", measure); io.disconnect(); };
  }, []);

  const usedIn = useMemo(
    () => PROJECTS.filter((p) => p.skillIds.includes(active.id)).map((p) => p.title),
    [active],
  );
  const brand = isBrand(active.id) ? BRAND[active.id] : null;

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-h">
      <div className="wrap">
        <SectionHead index="02" label="Skills" lead="The periodic table of my" accent="stack." id="skills-h" />
        <div className="chips rv" role="group" aria-label="Filter skills by family">
          {["All", ...FAMILIES].map((f) => (
            <button key={f} type="button" className={`chip ${family === f ? "on" : ""}`} aria-pressed={family === f} onClick={() => setFamily(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="sk-layout">
          <ul className="sk-grid" ref={gridRef} aria-label="Skills">
            {SKILLS.map((s, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              const dim = family !== "All" && s.family !== family;
              return (
                <li
                  key={s.id}
                  className={`tile ${shown ? "in" : ""} ${dim ? "dim" : ""} ${active.id === s.id ? "cur" : ""}`}
                  style={{ ["--d" as string]: `${(row + col) * 40}ms` }}
                >
                  <button
                    type="button"
                    className="tile-btn"
                    onMouseEnter={() => setActive(s)}
                    onFocus={() => setActive(s)}
                    onClick={() => setActive(s)}
                  >
                    <span className="num mono">{i + 1}</span>
                    <span className="sym">{s.symbol}</span>
                    <span className="nm">{s.name}</span>
                    <span className="fam mono">{s.family}</span>
                    {s.note && <span className="sr-only">, {s.note.toLowerCase()}</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="inspector" aria-label="Skill details">
            <div className="insp-card card">
              <div className="insp-stage">
                {brand && <span className="glow" style={{ background: `radial-gradient(closest-side, ${brand.tint}33, transparent 72%)` }} aria-hidden />}
                <div key={active.id} className="pop">
                  <TechLogo id={active.id} size={150} style={{ color: "var(--ink)" }} />
                </div>
              </div>
              <p className="mono insp-meta">№ {SKILLS.findIndex((s) => s.id === active.id) + 1} · {active.symbol}</p>
              <h3 className="insp-name">{active.name}</h3>
              <p className="insp-fam">{active.family}{active.note ? ` · ${active.note}` : ""}</p>
              <p className="insp-use">
                {usedIn.length ? <>Used in <b>{usedIn.join(" and ")}</b></> : <>Listed under {active.family} skills</>}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .chips{display:flex;flex-wrap:wrap;gap:8px;margin:36px 0 28px}
        .chip{height:36px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:background .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
        .chip:hover{transform:translateY(-1px);box-shadow:inset 0 0 0 1px var(--ink)}
        .chip.on{background:var(--ink);color:#fff;box-shadow:none}
        .sk-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:24px;align-items:start}
        .sk-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
        .tile{aspect-ratio:1/1.08;opacity:0;transform:translateY(14px) scale(.96);transition:opacity .8s var(--ease),transform .8s var(--ease);transition-delay:var(--d)}
        .tile.in{opacity:1;transform:none}
        .tile.in.dim{opacity:.22;transition-delay:0s}
        .tile.in.dim .tile-btn{filter:grayscale(1)}
        .tile-btn{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:18px 4px 6px;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);text-align:center;transition:background .35s var(--ease),color .35s var(--ease),transform .5s var(--ease),box-shadow .5s var(--ease)}
        .tile-btn:hover,.tile.cur .tile-btn{background:var(--ink);color:#fff;transform:translateY(-3px);box-shadow:0 14px 26px -14px rgba(0,0,0,.5)}
        .num{position:absolute;top:7px;left:9px;font-size:9px;opacity:.55}
        .sym{font-size:clamp(22px,2.6vw,32px);font-weight:700;letter-spacing:-.05em;line-height:1}
        .nm{font-size:10.5px;line-height:1.15;font-weight:500;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:100%;padding-inline:2px}
        .fam{font-size:8px;text-transform:uppercase;letter-spacing:.06em;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
        .inspector{position:static}
        .insp-card{padding:22px 22px 26px;text-align:left;overflow:hidden}
        .insp-stage{position:relative;height:190px;display:grid;place-items:center;margin-bottom:14px}
        .glow{position:absolute;inset:-10px;filter:blur(8px)}
        .pop{position:relative;animation:pop .6s var(--ease) both}
        @keyframes pop{0%{opacity:0;transform:scale(.7) rotate(-6deg)}100%{opacity:1;transform:none}}
        .insp-meta{font-size:11px;color:var(--mute);letter-spacing:.05em}
        .insp-name{font-size:26px;font-weight:700;letter-spacing:-.04em;line-height:1.05;margin-top:6px}
        .insp-fam{color:var(--mute);font-size:14px;margin-top:4px}
        .insp-use{margin-top:14px;padding-top:14px;border-top:1px solid var(--line);font-size:14px;color:var(--ink-2)}
        @media (min-width:640px){.sk-grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
        @media (min-width:1024px){
          .sk-layout{grid-template-columns:minmax(0,1fr) 320px;gap:32px}
          .sk-grid{grid-template-columns:repeat(8,minmax(0,1fr))}
          .inspector{position:sticky;top:96px}
        }
      `}</style>
    </section>
  );
}
