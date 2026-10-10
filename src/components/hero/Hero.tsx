"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const vref = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    const v = vref.current;
    const section = sectionRef.current;
    if (!v || !section) return;
    reduced.current = prefersReducedMotion();
    let inView = true;
    let unlocked = false;

    /* 1 — try to start with sound; fall back to muted if the browser blocks it */
    if (!reduced.current) {
      v.muted = false;
      v.play().then(
        () => { unlocked = true; setSoundOn(true); },
        () => {
          v.muted = true;
          v.play().catch(() => {});
          setBlocked(true);
        },
      );
    } else {
      v.muted = true;
      v.pause();
    }

    /* 2 — first user gesture unlocks sound (unless it's on the sound button itself) */
    const unlock = (e: Event) => {
      if (unlocked || reduced.current) return;
      if ((e.target as Element | null)?.closest?.("[data-sound-btn]")) return;
      v.muted = false;
      v.play().then(() => {
        unlocked = true;
        setSoundOn(true);
        setBlocked(false);
      }, () => { v.muted = true; });
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    evs.forEach((n) => window.addEventListener(n, unlock, { passive: true }));

    /* 3 — the voice only plays while the hero is on screen (≥35 %) */
    const io = new IntersectionObserver(
      ([entry]) => {
        const nowIn = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        if (nowIn === inView) return;
        inView = nowIn;
        if (!nowIn) v.pause();
        else if (!reduced.current || !v.muted || unlocked) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.5, 1] },
    );
    io.observe(section);

    return () => {
      evs.forEach((n) => window.removeEventListener(n, unlock));
      io.disconnect();
      v.pause();
    };
  }, []);

  const toggleSound = () => {
    const v = vref.current;
    if (!v) return;
    const next = !soundOn;
    v.muted = !next;
    if (next) v.play().catch(() => { v.muted = true; });
    setSoundOn(next);
    setBlocked(false);
  };

  return (
    <section id="top" ref={sectionRef} className="hero" aria-label="Introduction">
      <div className="hero-ghost" aria-hidden>{PROFILE.firstName.toUpperCase()}</div>

      <div className="hero-stage">
        <video
          ref={vref}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero/poster.webp"
          aria-label={`Video introduction: ${PROFILE.name} speaking to the camera`}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        <button
          type="button"
          data-sound-btn
          className={`hero-sound ${blocked ? "is-blocked" : ""}`}
          onClick={toggleSound}
          aria-label={soundOn ? "Mute the voice introduction" : "Play the voice introduction"}
          aria-pressed={soundOn}
        >
          {soundOn ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" />
            </svg>
          )}
        </button>
      </div>

      <div className="hero-copy wrap">
        <div className="hero-left">
          <p className="hero-kicker mono rv"><span>{PROFILE.role}</span></p>
          <h1 className="hero-h1">
            <span className="rv-mask"><span className="rv-in">Software</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}>
              <span className="rv-in"><span className="accent">Engineer.</span></span>
            </span>
          </h1>
        </div>
        <div className="hero-right rv" style={{ ["--i" as string]: 3 }}>
          <p className="hero-meta mono">{PROFILE.stack}<br />{PROFILE.location}</p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#work" onClick={(e) => { e.preventDefault(); scrollToTarget("#work"); }}>Explore work</a>
            <a className="btn btn-ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }}>Let&apos;s talk</a>
            <a className="btn btn-ghost" href={PROFILE.resume} download>Résumé ↓</a>
          </div>
        </div>
      </div>

      <style>{`
        .hero{position:relative;min-height:100svh;display:flex;flex-direction:column;align-items:center;overflow-x:clip;padding-top:76px}
        .hero-ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-56%);font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(150px,34vw,560px);color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.09);white-space:nowrap;user-select:none;pointer-events:none;z-index:0;animation:ghostIn 1.8s var(--ease) both}
        @keyframes ghostIn{from{opacity:0;transform:translate(-50%,-50%) scale(.96)}to{opacity:1;transform:translate(-50%,-56%) scale(1)}}
        .hero-stage{position:relative;height:62svh;aspect-ratio:768/960;margin-top:8px;flex:none}
        .hero-video{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;background:#fff}
        .hero-sound{position:absolute;left:50%;bottom:6%;transform:translateX(-50%);width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;z-index:3;transition:transform .5s var(--ease),background .4s}
        .hero-sound:hover{transform:translateX(-50%) scale(1.08);background:#2b2b2b}
        .hero-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(13,13,13,.35);animation:ping 1.8s var(--ease) infinite}
        @keyframes ping{0%{box-shadow:0 0 0 0 rgba(13,13,13,.35)}80%,100%{box-shadow:0 0 0 22px rgba(13,13,13,0)}}
        .hero-copy{position:relative;z-index:2;display:flex;flex-direction:column;gap:28px;padding-block:28px 56px}
        .hero-kicker{font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute);margin-bottom:14px}
        .hero-h1{font-weight:700;letter-spacing:-.05em;line-height:.95;font-size:clamp(52px,15vw,88px)}
        .hero-meta{font-size:12px;line-height:1.7;color:var(--mute);margin-bottom:18px;text-transform:uppercase;letter-spacing:.04em}
        .hero-cta{display:flex;flex-wrap:wrap;gap:10px}
        @media (min-width:900px){
          .hero{padding-top:0}
          .hero-stage{height:min(96svh,1040px);margin-top:0}
          .hero-copy{position:absolute;left:0;right:0;bottom:0;flex-direction:row;align-items:flex-end;justify-content:space-between;padding-block:0 clamp(28px,6vh,64px);pointer-events:none}
          .hero-copy>*{pointer-events:auto}
          .hero-h1{font-size:clamp(56px,6.6vw,120px)}
          .hero-right{text-align:right;display:flex;flex-direction:column;align-items:flex-end}
          .hero-cta{justify-content:flex-end;max-width:420px}
        }
      `}</style>
    </section>
  );
}
