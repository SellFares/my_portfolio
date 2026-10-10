"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reactive reduced-motion flag (false during SSR, updates after mount). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True while the element intersects the viewport (or once, when `once` is set). */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  opts: IntersectionObserverInit & { once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  const { once, root, rootMargin, threshold } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { root, rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, root, rootMargin, threshold]);
  return inView;
}

/**
 * Scroll progress (0 → 1) through an element: 0 when its top reaches the
 * `start` line of the viewport, 1 when its bottom reaches it.
 * Calls `onChange` inside a rAF-throttled scroll handler — no React re-renders.
 */
export function useScrollProgress<T extends Element>(
  ref: RefObject<T | null>,
  onChange: (progress: number, el: T) => void,
  start = 0.6,
) {
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const line = window.innerHeight * start;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      cb.current(p, el);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, start]);
}
