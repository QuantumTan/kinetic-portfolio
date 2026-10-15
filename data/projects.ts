// ============================================================
// DATA: projects.ts (CURATED ACTIVE GITHUB REPOSITORIES)
// ============================================================

export interface Project {
  id: string;
  code: string;
  title: string;
  role: string;
  stack: string[];
  short: string;
  description: string;
  image: string;
  link: string;
  github: string;
  status: "PRODUCTION" | "COMPLETED" | "ACTIVE";
  highlight: boolean;
}

export const projects: Project[] = [
  {
    id: "crms-peguit",
    code: "PRJ-01",
    title: "Enterprise CRM — .NET 8 Clean Architecture",
    role: "Full-Stack Developer & Systems Architect",
    stack: ["C#", ".NET 8", "ASP.NET Core", "EF Core", "Domain-Driven Design", "SQL Server"],
    short: "Enterprise multi-tier CRM engineered with strict Clean Architecture and DDD patterns.",
    description:
      "A high-performance enterprise customer relationship management solution structured with Domain-Driven Design (DDD). Separates API endpoints, core domain business logic, infrastructure persistence with Entity Framework Core, and automated SQL database migrations.",
    image: "/assets/projects/crms-peguit-placeholder.svg",
    link: "https://github.com/QuantumTan/CRMS_Peguit",
    github: "https://github.com/QuantumTan/CRMS_Peguit",
    status: "PRODUCTION",
    highlight: true,
  },
  {
    id: "crm-system",
    code: "PRJ-02",
    title: "Enterprise CRM Platform — Laravel 12",
    role: "Full-Stack Developer & QA Lead",
    stack: ["Laravel 12", "PHP 8.2", "MySQL", "Blade", "Vite", "Tailwind CSS", "Pest", "Fortify"],
    short: "Full-stack customer relationship management platform with sales pipelines and role RBAC.",
    description:
      "Enterprise CRM featuring lead tracking, customer lifecycle workflows, Kanban drag-and-drop pipeline boards, activity logging, follow-up scheduling, and automated Excel/PDF reporting under strict role-based access control (Admin, Manager, Sales).",
    image: "/assets/projects/crm-placeholder.svg",
    link: "https://github.com/QuantumTan/CRMSystem",
    github: "https://github.com/QuantumTan/CRMSystem",
    status: "PRODUCTION",
    highlight: true,
  },
  {
    id: "swinetrack-pos",
    code: "PRJ-03",
    title: "SwineTrack POS & Livestock Inventory",
    role: "Full-Stack Developer & Systems Analyst",
    stack: ["Laravel 12", "PHP", "MySQL", "Tailwind CSS", "Vite", "Blade"],
    short: "Point-of-Sale (POS) and commercial livestock inventory management software.",
    description:
      "A dedicated point-of-sale and livestock weight-tracking system developed for agricultural commerce. Features real-time price-per-kilogram calculations, batch sales logging, and relational inventory schemas.",
    image: "/assets/projects/swinetrack-placeholder.svg",
    link: "https://github.com/QuantumTan/swineTrackPOS",
    github: "https://github.com/QuantumTan/swineTrackPOS",
    status: "COMPLETED",
    highlight: true,
  },
  {
    id: "portfolio",
    code: "PRJ-04",
    title: "Kinetic Systems Portfolio & AI Copilot",
    role: "Full-Stack Developer & UI Architect",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "GSAP 3", "Gemini AI"],
    short: "High-precision kinetic HUD portfolio with embedded Gemini LLM engineering copilot.",
    description:
      "A refined cyber-HUD portfolio engineered with Next.js 15 App Router, GSAP hardware-accelerated animations, custom block cursor, and server-side proxied Google Gemini 2.0 Flash agent.",
    image: "/assets/projects/portfolio-placeholder.svg",
    link: "#",
    github: "https://github.com/QuantumTan",
    status: "PRODUCTION",
    highlight: true,
  },
];
