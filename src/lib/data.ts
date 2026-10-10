/**
 * Single source of truth for every piece of text on the site.
 * Everything here comes from the résumé (Sellami_Fares_NodeJS_Engineer_CV.pdf).
 * If something is not in the résumé it is not in this file.
 */

export const PROFILE = {
  name: "Sellami Fares",
  firstName: "Fares",
  initials: "SF",
  /** Headline under the name in the résumé */
  role: "Junior–Mid Software Engineer",
  /** Short role used as the hero heading ("Software Engineer.") */
  heroRole: "Software Engineer",
  stack: "Node.js · Python · MERN Stack",
  email: "sellamifares787@email.com",
  phone: "+60 17 353 8642",
  phoneHref: "tel:+60173538642",
  location: "Kuala Lumpur, Malaysia",
  /** Summary — verbatim from the résumé */
  resumeSummary:
    "Junior–Mid Software Engineer with demonstrated experience designing and shipping full-stack, backend-heavy web applications using Node.js, Express.js, JavaScript, and Python. Proven track record of building and consuming RESTful APIs, engineering MongoDB and MySQL database schemas, and implementing JWT-based authentication from scratch — without relying on boilerplate. Currently a cadet in the 42 KL Core Programme (hosted at Sunway University), an École 42 network school that trains engineers through rigorous peer review, C programming, and project-based delivery with zero lectures. Comfortable working independently under pressure, contributing to code reviews, and writing clean, maintainable code aligned with team standards. Seeking a backend-focused engineering role where I can contribute to scalable Node.js/Python systems from day one.",
  /** One more short line from the résumé (Education section) */
  extraLine:
    "Scholarship holder — maintaining top 35% CGPA while simultaneously enrolled in 42 KL Core Programme.",
  /** Paraphrase of the résumé's own wording (clean, maintainable code, peer review) */
  quote:
    "Clean, maintainable code that other people can read — reviewed by peers and written to team standards.",
  github: "https://github.com/SellFares",
  githubLabel: "github.com/SellFares",
  linkedin: "https://www.linkedin.com/in/fares-sellami1b294537a",
  linkedinLabel: "linkedin.com/in/fares-sellami1b294537a",
  resume: "/Sellami_Fares_Resume.pdf",
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "Fluent" },
    { name: "English", level: "Intermediate — IELTS 5.0 (B1), actively improving" },
  ],
  /** ID card back / front facts */
  degree: "Bachelor of Engineering — Software Engineering (Year 2)",
  school: "Xiamen University Malaysia (XMUM)",
  validTill: "2027",
} as const;

/** Sections that have data. Achievements has none in the résumé, so it is not here. */
export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export type Skill = {
  id: string;
  name: string;
  symbol: string;
  family: string;
  /** Tools the résumé says this skill is still being learned */
  note?: string;
};

export type SkillGroup = { family: string; skills: Omit<Skill, "family">[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Backend",
    skills: [
      { id: "nodejs", name: "Node.js", symbol: "Nd" },
      { id: "express", name: "Express.js", symbol: "Ex" },
      { id: "python", name: "Python", symbol: "Py" },
      { id: "rest", name: "REST API design", symbol: "Re" },
      { id: "jwt", name: "JWT authentication", symbol: "Jw" },
    ],
  },
  {
    family: "Frontend",
    skills: [
      { id: "javascript", name: "JavaScript (ES6+)", symbol: "Js" },
      { id: "typescript", name: "TypeScript", symbol: "Ts" },
      { id: "react", name: "React.js", symbol: "Rc" },
      { id: "html5", name: "HTML5", symbol: "Ht" },
      { id: "css3", name: "CSS3", symbol: "Cs" },
      { id: "bootstrap", name: "Bootstrap", symbol: "Bs" },
    ],
  },
  {
    family: "Databases",
    skills: [
      { id: "mongodb", name: "MongoDB", symbol: "Mg" },
      { id: "mongoose", name: "Mongoose", symbol: "Mo" },
      { id: "mysql", name: "MySQL", symbol: "My" },
      { id: "nosql", name: "NoSQL", symbol: "Nq" },
      { id: "sql", name: "SQL", symbol: "Sq" },
    ],
  },
  {
    family: "Systems & C",
    skills: [
      { id: "c", name: "C programming", symbol: "Cc" },
      { id: "memory", name: "Memory management", symbol: "Mm" },
      { id: "bash", name: "Bash scripting", symbol: "Ba" },
      { id: "linux", name: "Unix/Linux", symbol: "Ux" },
      { id: "makefile", name: "Makefile", symbol: "Mk" },
    ],
  },
  {
    family: "Testing",
    skills: [
      { id: "postman", name: "Postman (API testing)", symbol: "Pm" },
      { id: "integration", name: "Manual integration testing", symbol: "Mi" },
      { id: "jest", name: "Jest", symbol: "Je", note: "Learning" },
    ],
  },
  {
    family: "Tools",
    skills: [
      { id: "git", name: "Git", symbol: "Gi" },
      { id: "github", name: "GitHub", symbol: "Gh" },
      { id: "render", name: "Render (cloud deployment)", symbol: "Rn" },
      { id: "vercel", name: "Vercel", symbol: "Vc" },
      { id: "vscode", name: "VS Code", symbol: "Vs" },
    ],
  },
  {
    family: "Workflow",
    skills: [
      { id: "agile", name: "Agile/Scrum", symbol: "As" },
      { id: "review", name: "Peer code review", symbol: "Pr" },
      { id: "docs", name: "Technical documentation", symbol: "Td" },
    ],
  },
  {
    family: "42 Skills",
    skills: [
      { id: "peer-eval", name: "Peer evaluation", symbol: "Pe" },
      { id: "pair", name: "Pair programming", symbol: "Pp" },
      { id: "self", name: "Self-directed learning", symbol: "Sd" },
      { id: "norm", name: "Norm-compliant code", symbol: "Nc" },
    ],
  },
];

export const SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) =>
  g.skills.map((s) => ({ ...s, family: g.family })),
);

export const FAMILIES = SKILL_GROUPS.map((g) => g.family);

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  period: string;
  description: string;
  features: string[];
  /** Tech chips — skill ids (for logos) or plain labels */
  tech: { label: string; logo?: string }[];
  /** Skill ids from SKILLS that this project uses (shown in the Skills inspector) */
  skillIds: string[];
  link?: { label: string; href: string };
  mock: "feed" | "systems";
};

export const PROJECTS: Project[] = [
  {
    id: "dailyfeed",
    index: "01",
    title: "DailyFeed",
    kicker: "Full-Stack Social Platform (Solo)",
    period: "Feb 2026 – Apr 2026",
    description:
      "Delivered a production-ready backend API serving 100% of application data — designed, built, and deployed end-to-end in under 8 weeks using Node.js and Express.js, replacing the instructor-provided API entirely to take full ownership of the system.",
    features: [
      "12+ RESTful API endpoints, each validated in Postman",
      "JWT auth as reusable Express middleware",
      "MongoDB schema: 3 collections with cross-document references",
      "Profile and post image upload via Multer",
      "Dark mode and real-time DOM updates",
      "dotenv config — zero credentials in source code",
    ],
    tech: [
      { label: "Node.js", logo: "nodejs" },
      { label: "Express.js", logo: "express" },
      { label: "MongoDB", logo: "mongodb" },
      { label: "Mongoose", logo: "mongoose" },
      { label: "JavaScript", logo: "javascript" },
      { label: "Bootstrap", logo: "bootstrap" },
      { label: "Postman", logo: "postman" },
      { label: "Render", logo: "render" },
      { label: "JWT", logo: "jwt" },
    ],
    skillIds: [
      "nodejs", "express", "javascript", "rest", "jwt", "mongodb", "mongoose",
      "bootstrap", "postman", "render", "integration",
    ],
    link: { label: "Live site", href: "https://dailyfeed-front-end-part.onrender.com" },
    mock: "feed",
  },
  {
    id: "libft",
    index: "02",
    title: "libft",
    kicker: "Custom C Standard Library (42 KL Core)",
    period: "Jul 2026 – Present",
    description:
      "Rebuilding 40+ standard library functions in pure C from scratch — covering memory allocation (malloc/free), string operations, character classification, and linked list manipulation with no built-in functions permitted.",
    features: [
      "40+ standard library functions in pure C",
      "malloc/free, strings, character checks, linked lists",
      "42 Norm: max 25 lines per function, no globals",
      "Mandatory header guards",
      "Validated through peer evaluation",
      "Built with a Makefile",
    ],
    tech: [
      { label: "C", logo: "c" },
      { label: "Makefile", logo: "makefile" },
      { label: "Memory management", logo: "memory" },
      { label: "Peer review", logo: "review" },
    ],
    skillIds: ["c", "makefile", "memory", "review", "peer-eval", "norm"],
    link: { label: "GitHub", href: "https://github.com/SellFares" },
    mock: "systems",
  },
];

export const CERTIFICATIONS = [
  { title: "Developing Front-End Apps with React", issuer: "IBM" },
  { title: "Introduction to HTML, CSS & JavaScript", issuer: "IBM" },
  { title: "Introduction to Software Engineering", issuer: "IBM" },
  { title: "React.js Full Course", issuer: "Tarmeez Academy (Udemy)" },
  { title: "Node.js — Express, MongoDB, REST API & Postman", issuer: "Tarmeez Academy" },
  { title: "Advanced JavaScript Series", issuer: "Tarmeez Academy" },
  { title: "Comprehensive JavaScript — Zero to Advanced", issuer: "Tarmeez Academy" },
];

export type Stop = {
  when: string;
  title: string;
  place: string;
  detail: string;
  kind: "education" | "project" | "training";
};

/** Education + training (+ projects) in chronological order. The résumé lists no jobs or internships. */
export const EDUCATION: Stop[] = [
  {
    when: "2024",
    title: "Baccalaureate — Computer Science",
    place: "Hannibal High School — Tunis, Tunisia",
    detail: "Graduated with distinction — 16.42 / 20.",
    kind: "education",
  },
  {
    when: "Sep 2024 – Present",
    title: "Bachelor of Engineering — Software Engineering (Year 2)",
    place: "Xiamen University Malaysia (XMUM) — Sepang, Malaysia",
    detail:
      "Expected 2027. Modules: Computer Networks, Operating Systems, Database Systems, Computer Architecture, Software Engineering Principles, Data Structures, Python Programming. Scholarship holder — maintaining top 35% CGPA.",
    kind: "education",
  },
  {
    when: "Feb 2026 – Apr 2026",
    title: "DailyFeed",
    place: "Solo full-stack project",
    detail: "Backend API designed, built and deployed end-to-end in under 8 weeks.",
    kind: "project",
  },
  {
    when: "Jul 2026",
    title: "Passed the 42 Piscine",
    place: "42 KL — hosted at Sunway University, Kuala Lumpur",
    detail:
      "A 26-day intensive selection process: daily C programming and Shell scripting projects, peer evaluation sessions, and ranked logic exams.",
    kind: "training",
  },
  {
    when: "Jul 2026 – Present",
    title: "42 KL — Core Programme (Cadet)",
    place: "École 42 Network — hosted at Sunway University, Kuala Lumpur",
    detail:
      "Project-based curriculum with zero teachers and zero lectures. Target: complete the Core Programme in 8–12 months alongside the XMUM degree, with libft and Exam Rank 02 as immediate milestones by November 2026.",
    kind: "training",
  },
];

/** ID card back — “What I am” */
export const WHAT_I_AM = [
  "Junior–Mid Software Engineer — Node.js · Python · MERN",
  "BEng Software Engineering (Year 2), XMUM — scholarship, top 35% CGPA",
  "Cadet, 42 KL Core Programme",
  "Built DailyFeed and libft",
  "Baccalaureate with distinction — 16.42 / 20",
];
