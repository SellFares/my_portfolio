"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLUListElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* scroll state + progress bar (rAF throttled, direct style writes) */
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      setScrolled(y > 40);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* active section */
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    /* clear when above first section (hero) or on certifications band */
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(""); },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    if (hero) heroIo.observe(hero);
    return () => { io.disconnect(); heroIo.disconnect(); };
  }, []);

  /* slide the ink indicator under the active link */
  const place = useCallback(() => {
    const pill = pillRef.current;
    const ind = indRef.current;
    if (!pill || !ind) return;
    const link = pill.querySelector<HTMLElement>(`[data-id="${active}"]`)?.parentElement;
    if (!link) { ind.style.opacity = "0"; return; }
    ind.style.opacity = "1";
    ind.style.width = `${link.offsetWidth}px`;
    ind.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);
  useLayoutEffect(place, [place]);
  useEffect(() => {
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

  /* mobile overlay: Esc, scroll lock, focus return */
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const btn = menuBtn.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    overlayRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(`#${id}`), open ? 120 : 0);
  };

  return (
    <>
      <div ref={barRef} className="nav-progress" aria-hidden />
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="nav-brand" onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}>
          <span className="nav-mark" aria-hidden>{PROFILE.initials}</span>
          <span className="nav-name">{PROFILE.name}</span>
        </a>

        <nav aria-label="Primary" className="nav-pill-wrap">
          <ul className="nav-pill" ref={pillRef}>
            <span className="nav-ind" ref={indRef} aria-hidden />
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  className={active === n.id ? "on" : ""}
                  aria-current={active === n.id ? "location" : undefined}
                  onClick={go(n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuBtn}
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div id="mobile-menu" ref={overlayRef} className={`overlay ${open ? "is-open" : ""}`} inert={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a href={`#${n.id}`} onClick={go(n.id)}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <p className="overlay-foot mono">{PROFILE.email}</p>
      </div>

      <style>{`
        .nav-progress{position:fixed;inset:0 0 auto 0;height:2px;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;z-index:60;pointer-events:none}
        .nav{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px var(--gutter);pointer-events:none}
        .nav>*{pointer-events:auto}
        .nav-brand{display:flex;align-items:center;gap:12px;border-radius:999px}
        .nav-mark{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:14px;letter-spacing:-.04em;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink);background:transparent;transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
        .nav-brand:hover .nav-mark{transform:rotate(360deg)}
        .nav-name{font-weight:600;letter-spacing:-.03em;font-size:16px;transition:opacity .5s var(--ease),transform .5s var(--ease)}
        .nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
        .nav-pill-wrap{display:none}
        .nav-pill{position:relative;display:flex;gap:2px;padding:5px;border-radius:999px;transition:background .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
        .nav.is-scrolled .nav-pill{background:rgba(255,255,255,.78);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 12px 32px -18px rgba(0,0,0,.25)}
        .nav-pill li{position:relative;z-index:1}
        .nav-pill a{display:block;padding:9px 18px;border-radius:999px;font-size:14px;font-weight:500;letter-spacing:-.01em;color:var(--ink-2);transition:color .4s var(--ease)}
        .nav-pill a:hover{color:var(--ink)}
        .nav-pill a.on{color:#fff;transition-delay:.12s}
        .nav-ind{position:absolute;left:0;top:5px;bottom:5px;border-radius:999px;background:var(--ink);opacity:0;transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s;z-index:0}
        .nav-menu-btn{height:42px;padding:0 20px;border-radius:999px;font-size:14px;font-weight:500;background:rgba(255,255,255,.8);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line);position:relative;z-index:80}
        .overlay{position:fixed;inset:0;z-index:70;background:var(--paper);padding:110px var(--gutter) 40px;display:flex;flex-direction:column;justify-content:space-between;clip-path:circle(0% at calc(100% - 52px) 40px);transition:clip-path .9s var(--ease);visibility:hidden}
        .overlay.is-open{clip-path:circle(150% at calc(100% - 52px) 40px);visibility:visible}
        .overlay ol{display:flex;flex-direction:column;gap:6px}
        .overlay li{overflow:hidden}
        .overlay a{display:flex;align-items:baseline;gap:16px;font-size:clamp(40px,12vw,72px);font-weight:700;letter-spacing:-.05em;line-height:1.1;transform:translateY(110%);transition:transform .9s var(--ease);transition-delay:calc(var(--i)*60ms + 150ms)}
        .overlay.is-open a{transform:none}
        .overlay .mono{font-family:var(--mono);font-size:12px;font-weight:400;letter-spacing:.04em;color:var(--mute)}
        .overlay-foot{font-size:13px;color:var(--mute)}
        @media (min-width:900px){.nav-pill-wrap{display:block}.nav-menu-btn,.overlay{display:none}}
      `}</style>
    </>
  );
}
