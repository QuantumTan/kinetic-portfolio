// ============================================================
// DATA: knowledge-base.ts (CURATED KNOWLEDGE BASE // 4 CORE REPOSITORIES)
// ============================================================

export const knowledgeBase = {
  persona: {
    name: "TAN",
    version: "2.7.0",
    owner: "Jonathan Peguit Jr.",
    tagline: "Autonomous Terminal Copilot & Knowledge Dispatcher",
    personality:
      "Direct, analytical, precise, technically competent, polite, zero fluff, zero emojis. Communicates with clarity like an advanced systems terminal.",
  },
  owner: {
    name: "Jonathan Peguit Jr.",
    handle: "QuantumTan",
    role: "Full-Stack, .NET & Systems Developer",
    focus: "Enterprise .NET Clean Architecture (C# / ASP.NET), Laravel 12 Web Platforms, and Systems Development",
    university: "University of Mindanao",
    degree: "BS in Information Technology",
    status: "Active Student & Student Org Officer / Peer Mentor (2024 - Present)",
    location: "Davao City, Philippines (UTC+8)",
    phone: "+639519941785",
    email: "jonathanjrhayo@gmail.com",
    altEmail: "jonathanpeguit@gmail.com",
    github: "https://github.com/QuantumTan",
    linkedin: "https://www.linkedin.com/in/jonathan-jr-peguit-a446ba1b8/",
    facebook: "https://facebook.com/tantanluxe",
    resume: "/assets/Resume.pdf",
    bio: "Software developer specializing in enterprise backend architecture (C# .NET 8 Clean Architecture, Laravel 12, Java), full-stack web platforms (Next.js, TypeScript), and relational database systems (MySQL, SQL Server). Student organization officer and peer mentor at the University of Mindanao.",
  },
  skills: {
    languages: ["C#", "Java", "PHP", "Python", "TypeScript", "JavaScript", "SQL", "HTML5", "CSS3"],
    frameworks: [".NET 8 / ASP.NET Core", "Laravel 12", "Next.js", "React", "Tailwind CSS", "Entity Framework Core", "GSAP"],
    databases: ["SQL Server", "MySQL"],
    toolchain: ["Git", "GitHub", "Vite", "Pest", "Composer", "Visual Studio", "Figma", "Linux/CLI"],
    softSkills: ["Technical Architecture", "Attention to Detail", "Reliability", "Organization", "Adaptability"],
    coreFocus: ["Enterprise .NET Clean Architecture", "Laravel 12 Enterprise Applications", "Relational Database Schema Design", "AI Copilot Integration"],
  },
  projects: [
    {
      name: "CRMS_Peguit (.NET Clean Architecture)",
      stack: ["C#", ".NET 8", "ASP.NET Core Web API", "Entity Framework Core", "Domain-Driven Design", "SQL Server"],
      repo: "https://github.com/QuantumTan/CRMS_Peguit",
      summary: "Enterprise multi-tier CRM engineered with strict Clean Architecture, Domain-Driven Design, API layers, and automated database SQL migrations.",
    },
    {
      name: "CRM System (Laravel 12 Enterprise Platform)",
      stack: ["Laravel 12", "PHP 8.2", "MySQL", "Blade", "Vite", "Tailwind CSS", "Pest", "Fortify"],
      repo: "https://github.com/QuantumTan/CRMSystem",
      summary: "Full-stack customer relationship management platform with sales pipelines, Kanban boards, role RBAC (Admin, Manager, Sales), and Excel/PDF reporting.",
    },
    {
      name: "SwineTrack POS",
      stack: ["Laravel 12", "PHP", "MySQL", "Tailwind CSS", "Vite", "Blade"],
      repo: "https://github.com/QuantumTan/swineTrackPOS",
      summary: "Commercial POS and livestock inventory telemetry system with weight-based transaction engines.",
    },
    {
      name: "Kinetic Core Portfolio",
      stack: ["Next.js 15", "Tailwind CSS", "GSAP 3", "Gemini AI", "TypeScript"],
      repo: "https://github.com/QuantumTan",
      summary: "Monochrome brutalist portfolio with embedded Gemini LLM agent.",
    },
  ],
  certifications: [
    {
      name: "Information Technology Specialist: Java",
      issuer: "Certiport (Pearson VUE)",
      credentialUrl: "https://www.credly.com/badges/10b5deeb-b2e7-49e3-9604-f0bc0e1d22b7",
      scope: ["OOP Principles", "Data Types & Control Flow", "Compilation & Debugging"],
    },
    {
      name: "Java (Basic) Certificate",
      issuer: "HackerRank",
      credentialUrl: "https://www.hackerrank.com/certificates/170ede890f2c",
      scope: ["Data Structures", "Inheritance", "Exception Handling"],
    },
    {
      name: "CSS (Basic) Certificate",
      issuer: "HackerRank",
      credentialUrl: "https://www.hackerrank.com/certificates/a247020ee377",
      scope: ["Cascading & Specificity", "Box Model", "Modern Layout Engines"],
    },
    {
      name: "Java Masterclass Certification",
      issuer: "Udemy",
      scope: ["Advanced Java Core", "Concurrency & Collections", "Enterprise Patterns"],
    },
  ],
  education: [
    {
      institution: "University of Mindanao",
      timeline: "2024 - PRESENT",
      program: "Bachelor of Science in Information Technology",
      notes: "Student Organization Officer & Peer Mentor.",
    },
    {
      institution: "Calinan National High School",
      timeline: "2022 - 2024",
      program: "Accountancy, Business & Management (ABM)",
      notes: "Graduated with High Honors. Research distinction awards.",
    },
    {
      institution: "Dacudao National High School",
      timeline: "2018 - 2022",
      program: "Junior High School",
      notes: "Graduated with High Honors.",
    },
  ],
  faq: [
    {
      q: "What are Jonathan's core projects?",
      a: "Jonathan has engineered CRMS_Peguit (C# .NET 8 Clean Architecture), CRMSystem (Laravel 12 / PHP 8.2), SwineTrack POS (Laravel 12 / MySQL), and Kinetic Core Portfolio (Next.js 15 / Gemini AI).",
    },
    {
      q: "What is Jonathan's primary engineering stack?",
      a: "Jonathan specializes in enterprise backend systems (.NET 8 C#, Laravel 12, Java, MySQL, SQL Server) and modern web platforms (Next.js, TypeScript).",
    },
    {
      q: "What is Jonathan's availability for hire or contract work?",
      a: "Jonathan is open for backend engineering roles, full-stack systems collaborations, and software internships. Contact him directly at jonathanjrhayo@gmail.com or +639519941785.",
    },
    {
      q: "How can I access his resume?",
      a: "The verified resume is directly downloadable at /assets/Resume.pdf on this terminal site.",
    },
  ],
};

export type KnowledgeBase = typeof knowledgeBase;
