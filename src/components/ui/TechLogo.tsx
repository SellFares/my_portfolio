/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";

/** Real brand logos (devicon “original” / simple-icons). Official colours; tint is only used for the soft glow. */
export const BRAND: Record<string, { src: string; tint: string; label: string }> = {
  nodejs: { src: "/logos/nodejs.svg", tint: "#5fa04e", label: "Node.js" },
  express: { src: "/logos/express.svg", tint: "#888888", label: "Express.js" },
  python: { src: "/logos/python.svg", tint: "#3776ab", label: "Python" },
  javascript: { src: "/logos/javascript.svg", tint: "#f0db4f", label: "JavaScript" },
  typescript: { src: "/logos/typescript.svg", tint: "#3178c6", label: "TypeScript" },
  react: { src: "/logos/react.svg", tint: "#61dafb", label: "React" },
  html5: { src: "/logos/html5.svg", tint: "#e34f26", label: "HTML5" },
  css3: { src: "/logos/css3.svg", tint: "#1572b6", label: "CSS3" },
  bootstrap: { src: "/logos/bootstrap.svg", tint: "#7952b3", label: "Bootstrap" },
  mongodb: { src: "/logos/mongodb.svg", tint: "#47a248", label: "MongoDB" },
  mongoose: { src: "/logos/mongoose.svg", tint: "#880000", label: "Mongoose" },
  mysql: { src: "/logos/mysql.svg", tint: "#00758f", label: "MySQL" },
  c: { src: "/logos/c.svg", tint: "#5c6bc0", label: "C" },
  bash: { src: "/logos/bash.svg", tint: "#888888", label: "Bash" },
  linux: { src: "/logos/linux.svg", tint: "#f5c518", label: "Linux" },
  git: { src: "/logos/git.svg", tint: "#f05032", label: "Git" },
  github: { src: "/logos/github.svg", tint: "#888888", label: "GitHub" },
  postman: { src: "/logos/postman.svg", tint: "#ff6c37", label: "Postman" },
  vscode: { src: "/logos/vscode.svg", tint: "#007acc", label: "VS Code" },
  jest: { src: "/logos/jest-si.svg", tint: "#c21325", label: "Jest" },
  render: { src: "/logos/render-si.svg", tint: "#888888", label: "Render" },
  vercel: { src: "/logos/vercel-si.svg", tint: "#888888", label: "Vercel" },
};

/** Thin line icons (24×24, 1.4 stroke) for concepts that have no brand logo. */
export const CONCEPT: Record<string, React.ReactNode> = {
  rest: (<><path d="M8 7l-4 5 4 5M16 7l4 5-4 5" /><path d="M13.5 5l-3 14" /></>),
  jwt: (<><circle cx="8" cy="12" r="3.5" /><path d="M11.5 12H21M17 12v3M20 12v2" /></>),
  nosql: (<><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" /><path d="M9 18l2 2 4-4" /></>),
  sql: (<><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" /><path d="M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" /></>),
  memory: (<><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" /></>),
  makefile: (<><circle cx="12" cy="12" r="3.2" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>),
  integration: (<><circle cx="12" cy="12" r="8" /><path d="M8 12.5l2.6 2.6L16 9.5" /></>),
  agile: (<><path d="M20 12a8 8 0 01-13.7 5.6M4 12a8 8 0 0113.7-5.6" /><path d="M18 3v4h-4M6 21v-4h4" /></>),
  review: (<><circle cx="9" cy="12" r="5.5" /><circle cx="15" cy="12" r="5.5" /></>),
  docs: (<><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 15.5h5M10 8.5h2" /></>),
  "peer-eval": (<><path d="M4 7h10M4 12h7M4 17h10" /><path d="M16 14l2.2 2.2L22 11.5" /></>),
  pair: (<><circle cx="8" cy="8" r="2.8" /><circle cx="16" cy="8" r="2.8" /><path d="M3 19c.5-3.2 2.4-5 5-5s4.5 1.8 5 5M11 19c.5-3.2 2.4-5 5-5s4.5 1.8 5 5" /></>),
  self: (<><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>),
  norm: (<><path d="M3 15l12-12 6 6L9 21z" /><path d="M7 11l2 2M10 8l1.5 1.5M13 5l2 2" /></>),
};

export function isBrand(id: string): boolean {
  return id in BRAND;
}

type Props = { id: string; size?: number; className?: string; title?: string; style?: CSSProperties };

/** Brand logo if one exists, otherwise a custom thin line icon. Decorative unless `title` is given. */
export default function TechLogo({ id, size = 24, className, title, style }: Props) {
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
  if (isBrand(id)) {
    return (
      <img
        src={BRAND[id].src}
        width={size}
        height={size}
        alt={title ?? ""}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain", ...style }}
      />
    );
  }
  const icon = CONCEPT[id];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      {...a11y}
    >
      {icon}
    </svg>
  );
}
