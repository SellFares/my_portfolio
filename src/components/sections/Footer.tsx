"use client";

import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="foot wrap">
      <p>© {new Date().getFullYear()} {PROFILE.name}</p>
      <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTarget(0); }} className="ul">Back to top ↑</a>
      <p className="mono">Built with Next.js</p>
      <style>{`
        .foot{margin-top:0;padding-bottom:36px;padding-top:22px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;font-size:13px;color:var(--mute)}
        .foot .mono{font-size:12px}
      `}</style>
    </footer>
  );
}
