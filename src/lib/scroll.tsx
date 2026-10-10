"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

/** Mounts Lenis (smooth scroll). Disabled entirely under prefers-reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });
    lenis = instance;
    let raf = requestAnimationFrame(function tick(time) {
      instance.raf(time);
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (typeof window === "undefined") return;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  let top = 0;
  if (typeof target === "number") top = target;
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY;
  }
  window.scrollTo({ top: top + offset, behavior: "auto" });
}

export function lockScroll() {
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  lenis?.start();
}
