"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE, WHAT_I_AM } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const STRAP_TEXT = `${PROFILE.name.toUpperCase()} · ${PROFILE.heroRole.toUpperCase()} · `;

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastType = useRef<string>("mouse");

  /* damped pendulum: pointer velocity → angular velocity, spring back, idle sway */
  useEffect(() => {
    const section = sectionRef.current;
    const swing = swingRef.current;
    if (!section || !swing) return;
    const reduced = prefersReducedMotion();
    let angle = 0;
    let vel = 0;
    let raf = 0;
    let last = performance.now();
    let lastX = 0;
    let lastT = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastT && now - lastT < 100) {
        const vx = (e.clientX - lastX) / Math.max(8, now - lastT); // px/ms
        const card = cardRef.current?.getBoundingClientRect();
        const near = card && e.clientX > card.left - 40 && e.clientX < card.right + 40 && e.clientY > card.top - 40 && e.clientY < card.bottom + 40;
        vel += vx * (near ? 22 : 4);
        vel = Math.max(-90, Math.min(90, vel));
      }
      lastX = e.clientX;
      lastT = now;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const idle = reduced ? 0 : Math.sin(now / 1100) * 1.4;
      const k = 14; // spring (ω ≈ 3.7 rad/s)
      const c = 1.7; // damping
      const acc = -k * (angle - idle) - c * vel;
      vel += acc * dt;
      angle += vel * dt;
      angle = Math.max(-16, Math.min(16, angle));
      swing.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduced) { last = performance.now(); raf = requestAnimationFrame(tick); }
    });
    io.observe(section);
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <section id="about" ref={sectionRef} className="section about" aria-labelledby="about-h">
      <div className="wrap about-grid">
        {/* left */}
        <div className="about-left">
          <p className="tag rv"><b>01</b><i aria-hidden /><span>About</span></p>
          <h2 className="h2 about-h" id="about-h">
            <span className="rv-mask"><span className="rv-in">Hi, I&apos;m <span className="accent">{PROFILE.firstName}.</span></span></span>
          </h2>
          <p className="about-sum rv">{PROFILE.resumeSummary}</p>
          <p className="about-extra rv" style={{ ["--i" as string]: 1 }}>{PROFILE.extraLine}</p>
          <div className="about-cta rv" style={{ ["--i" as string]: 2 }}>
            <a className="btn btn-primary" href={PROFILE.resume} download>Résumé ↓</a>
            <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>

        {/* centre — lanyard ID card */}
        <div className="about-mid">
          <div className="lanyard" ref={swingRef}>
            <div className="strap" aria-hidden>
              <div className="strap-run">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i}>{STRAP_TEXT}</span>
                ))}
              </div>
            </div>
            <div className="clip" aria-hidden />
            <div
              ref={cardRef}
              className={`idcard ${flipped ? "is-flipped" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-describedby="idcard-hint"
              onKeyDown={onKey}
              onPointerEnter={(e) => { lastType.current = e.pointerType; if (e.pointerType === "mouse") setFlipped(true); }}
              onPointerLeave={(e) => { if (e.pointerType === "mouse") setFlipped(false); }}
              onPointerDown={(e) => { lastType.current = e.pointerType; }}
              onClick={() => { if (lastType.current !== "mouse") setFlipped((f) => !f); }}
            >
              <div className="idcard-inner">
                {/* front */}
                <div className="face front" aria-hidden={flipped}>
                  <div className="band"><span className="mono">DEVELOPER ID</span><span className="slot" aria-hidden /></div>
                  <div className="photo-ring">
                    <div className="photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={480} height={600} />
                    </div>
                  </div>
                  <h3 className="idname">{PROFILE.name}</h3>
                  <p className="idrole">{PROFILE.role}</p>
                  <dl className="idrows mono">
                    <div><dt>Dept.</dt><dd>Software Engineering</dd></div>
                    <div><dt>Valid till</dt><dd>{PROFILE.validTill}</dd></div>
                  </dl>
                  <div className="idbottom" aria-hidden>
                    <svg className="barcode" viewBox="0 0 120 26" preserveAspectRatio="none">
                      {BARS.map(([x, w], i) => <rect key={i} x={x} y="0" width={w} height="26" fill="#0d0d0d" />)}
                    </svg>
                    <span className="holo" />
                  </div>
                </div>
                {/* back */}
                <div className="face back" aria-hidden={!flipped}>
                  <p className="mono back-tag">What I am</p>
                  <ul className="back-list">
                    {WHAT_I_AM.map((l) => <li key={l}>{l}</li>)}
                  </ul>
                  <div className="back-foot">
                    <span className="sig">{PROFILE.name}</span>
                    <p className="mono">If found, say hello · {PROFILE.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="sr-only" id="idcard-hint">{`Press Enter or Space to flip the card. Interactive ID card of ${PROFILE.name}: ${WHAT_I_AM.join("; ")}.`}</p>
        </div>

        {/* right */}
        <aside className="about-right" aria-label="Quick facts">
          <p className="mono facts-h rv">Quick facts</p>
          <dl className="facts">
            {([
              ["Location", PROFILE.location],
              ["Education", `${PROFILE.degree} — ${PROFILE.school}`],
              ["Current", "Cadet — 42 KL Core Programme"],
              ["Email", PROFILE.email],
            ] as const).map(([k, v], i) => (
              <div key={k} className="rv" style={{ ["--i" as string]: i }}>
                <dt className="mono">{k}</dt>
                <dd>{k === "Email" ? <a href={`mailto:${v}`} className="ul">{v}</a> : v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="quote rv" style={{ ["--i" as string]: 4 }}>
            <span className="accent">“</span>{PROFILE.quote}<span className="accent">”</span>
          </blockquote>
        </aside>
      </div>

      <style>{`
        .about{--sec-pt:clamp(96px,14vh,160px);overflow-x:clip}
        .about-grid{display:grid;grid-template-columns:1fr;gap:56px;align-items:stretch}
        .about-left{display:flex;flex-direction:column;gap:22px}
        .about-left .tag{margin-bottom:0}
        .about-h{font-size:clamp(44px,5vw,76px)}
        .about-sum{font-size:16px;line-height:1.65;color:var(--ink-2);max-width:62ch}
        .about-extra{font-size:15px;line-height:1.6;color:var(--mute);border-left:2px solid var(--ink);padding-left:14px;max-width:56ch}
        .about-cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:8px}
        .ul{text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(13,13,13,.3);transition:text-decoration-color .3s}
        .ul:hover{text-decoration-color:var(--ink)}

        .about-mid{position:relative;display:flex;justify-content:center;order:-1;min-height:520px;margin-top:calc(var(--sec-pt) * -1)}
        .lanyard{position:relative;width:300px;transform-origin:50% 0;display:flex;flex-direction:column;align-items:center;will-change:transform}
        .strap{position:relative;width:30px;height:calc(var(--sec-pt) + 56px);background:var(--ink);overflow:hidden;border-radius:0 0 3px 3px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
        .strap-run{position:absolute;left:0;top:0;width:30px;writing-mode:vertical-rl;display:flex;color:#fff;font-family:var(--mono);font-size:8.5px;letter-spacing:.18em;white-space:nowrap;animation:strapRun 18s linear infinite}
        .strap-run span{padding:10px 0;line-height:30px}
        @keyframes strapRun{from{transform:translateY(0)}to{transform:translateY(-50%)}}
        .clip{width:18px;height:26px;margin-top:-2px;border-radius:3px 3px 8px 8px;background:linear-gradient(90deg,#d9d9d9,#8f8f8f 45%,#e8e8e8 60%,#a8a8a8);box-shadow:0 2px 6px rgba(0,0,0,.25),inset 0 0 0 1px rgba(0,0,0,.12);position:relative}
        .clip::after{content:"";position:absolute;left:50%;bottom:5px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}

        .idcard{width:300px;height:404px;margin-top:-6px;perspective:1400px;cursor:pointer;border-radius:22px;outline-offset:6px}
        .idcard-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
        .idcard.is-flipped .idcard-inner{transform:rotateY(180deg)}
        .face{position:absolute;inset:0;border-radius:22px;background:var(--card);overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -28px rgba(0,0,0,.35),0 6px 14px -8px rgba(0,0,0,.18)}
        .front{display:flex;flex-direction:column;align-items:center}
        .band{width:100%;height:40px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;position:relative;font-size:10.5px;letter-spacing:.28em}
        .slot{position:absolute;top:8px;left:50%;width:44px;height:6px;margin-left:-22px;border-radius:3px;background:rgba(255,255,255,.18);display:none}
        .photo-ring{margin-top:16px;padding:3px;border-radius:26px;background:linear-gradient(145deg,#d6d6d6,#8a8a8a 45%,#e4e4e4);box-shadow:0 0 0 7px rgba(13,13,13,.04),0 14px 28px -12px rgba(0,0,0,.35)}
        .photo{width:128px;height:156px;border-radius:23px;overflow:hidden;background:var(--soft)}
        .photo img{width:100%;height:100%;object-fit:cover;object-position:50% 30%;filter:grayscale(1) contrast(1.05);transition:transform .8s var(--ease)}
        .idcard:hover .photo img{transform:scale(1.08)}
        .idname{margin-top:14px;font-size:21px;font-weight:700;letter-spacing:-.04em}
        .idrole{font-size:12px;color:var(--mute);margin-top:2px}
        .idrows{width:100%;padding:12px 22px 0;font-size:10.5px;display:grid;gap:5px}
        .idrows div{display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed var(--line);padding-bottom:4px}
        .idrows dt{color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
        .idrows dd{margin:0;text-align:right}
        .idbottom{position:absolute;left:22px;right:22px;bottom:16px;display:flex;align-items:flex-end;justify-content:space-between;gap:14px}
        .barcode{width:150px;height:26px}
        .holo{width:34px;height:34px;border-radius:50%;background:conic-gradient(from 20deg,#e6e6e6,#9a9a9a,#f3f3f3,#7d7d7d,#e0e0e0,#a6a6a6,#e6e6e6);box-shadow:inset 0 0 0 1px rgba(0,0,0,.15);animation:holo 6s linear infinite}
        @keyframes holo{to{transform:rotate(360deg)}}
        .back{transform:rotateY(180deg);padding:26px 24px;display:flex;flex-direction:column;background:var(--card)}
        .back::before{content:"";position:absolute;left:0;right:0;top:0;height:40px;background:var(--ink)}
        .back-tag{position:relative;margin-top:-8px;color:#fff;font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;height:22px;display:flex;align-items:center;justify-content:center}
        .back-list{margin-top:28px;display:grid;gap:11px;font-size:13px;line-height:1.4;color:var(--ink-2)}
        .back-list li{padding-left:16px;position:relative}
        .back-list li::before{content:"";position:absolute;left:0;top:.55em;width:7px;height:1px;background:var(--ink)}
        .back-foot{margin-top:auto}
        .sig{font-family:var(--serif);font-style:italic;font-size:30px;line-height:1;display:block;margin-bottom:10px;color:var(--ink)}
        .back-foot p{font-size:9.5px;color:var(--mute);border-top:1px solid var(--line);padding-top:8px;overflow-wrap:anywhere}

        .about-right{display:flex;flex-direction:column;gap:20px}
        .facts-h{font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute)}
        .facts{display:flex;flex-direction:column}
        .facts>div{display:flex;flex-direction:column;gap:3px;padding:14px 0;border-top:1px solid var(--line)}
        .facts dt{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--mute)}
        .facts dd{margin:0;font-size:15px;line-height:1.45;overflow-wrap:anywhere}
        .quote{margin-top:auto;font-size:clamp(22px,2vw,28px);line-height:1.2;letter-spacing:-.03em;font-weight:600;padding-top:20px;border-top:1px solid var(--line)}
        .quote .accent{font-size:1.4em;line-height:0}

        @media (min-width:1024px){
          .about-grid{grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:48px}
          .about-mid{order:0;min-height:0}
        }
        @media (max-width:420px){.lanyard,.idcard{transform-origin:50% 0}}
      `}</style>
    </section>
  );
}

/* decorative barcode geometry */
const BARS: [number, number][] = (() => {
  const out: [number, number][] = [];
  let x = 0;
  const pattern = [2, 1, 3, 1, 2, 2, 1, 3, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 2, 1, 2, 1, 3];
  pattern.forEach((w, i) => {
    if (i % 2 === 0) out.push([x, w * 1.4]);
    x += w * 1.4 + 0.6;
  });
  return out.filter(([bx, bw]) => bx + bw <= 120);
})();
