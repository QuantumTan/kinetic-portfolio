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

export function getAutonomousResponse(rawQuery: string): string {
  const query = rawQuery.toLowerCase().trim();
  const kb = knowledgeBase;

  // 1. Projects
  if (
    query.includes("project") ||
    query.includes("crms") ||
    query.includes("crm") ||
    query.includes("swinetrack") ||
    query.includes("portfolio") ||
    query.includes("repo") ||
    query.includes("work") ||
    query.includes("built")
  ) {
    const list = kb.projects
      .map(
        (p, i) =>
          `[0${i + 1}] ${p.name}\n• Stack: ${p.stack.join(" / ")}\n• Summary: ${p.summary}\n• Repo: ${p.repo}`
      )
      .join("\n\n");
    return `[PROJECTS_REGISTRY]\nJonathan has built 4 production-grade engineering solutions:\n\n${list}\n\nAsk for deep-dive specifications on any specific project.`;
  }

  // 2. Tech Stack / Skills / Languages
  if (
    query.includes("skill") ||
    query.includes("stack") ||
    query.includes("language") ||
    query.includes("framework") ||
    query.includes("tech") ||
    query.includes("tool") ||
    query.includes("c#") ||
    query.includes(".net") ||
    query.includes("laravel") ||
    query.includes("java") ||
    query.includes("database") ||
    query.includes("mysql") ||
    query.includes("sql") ||
    query.includes("matrix")
  ) {
    return `[TECH_STACK_MATRIX]
Jonathan's core engineering toolchain:

[LANGUAGES]
• ${kb.skills.languages.join(" • ")}

[FRAMEWORKS & ARCHITECTURE]
• ${kb.skills.frameworks.join(" • ")}

[DATABASES & STORAGE]
• ${kb.skills.databases.join(" • ")}

[TOOLING & CI/CD]
• ${kb.skills.toolchain.join(" • ")}

[CORE SPECIALIZATION]
• ${kb.skills.coreFocus.join("\n• ")}`;
  }

  // 3. Resume / CV
  if (
    query.includes("resume") ||
    query.includes("cv") ||
    query.includes("pdf") ||
    query.includes("download")
  ) {
    return `[RESUME_ENDPOINT]
Jonathan's official curriculum vitae is available:
• PDF Path: /assets/Resume.pdf (Click [GET_RESUME_PDF] in header/hero)
• Verified Credentials: See section 03 in this portfolio
• LinkedIn: ${kb.owner.linkedin}
• GitHub: ${kb.owner.github}`;
  }

  // 4. Contact / Hire / Inquiries
  if (
    query.includes("contact") ||
    query.includes("email") ||
    query.includes("phone") ||
    query.includes("hire") ||
    query.includes("reach") ||
    query.includes("call") ||
    query.includes("inquir") ||
    query.includes("message")
  ) {
    return `[COMMUNICATIONS_DISPATCH]
You can contact Jonathan Peguit Jr. directly:
• Direct Email: ${kb.owner.email}
• Mobile / Phone: ${kb.owner.phone}
• LinkedIn: ${kb.owner.linkedin}
• GitHub: ${kb.owner.github}
• Base: ${kb.owner.location}
• Status: Available for enterprise backend, .NET / Laravel, and full-stack software internships.`;
  }

  // 5. Education / University / Background
  if (
    query.includes("educat") ||
    query.includes("school") ||
    query.includes("university") ||
    query.includes("mindanao") ||
    query.includes("college") ||
    query.includes("degree") ||
    query.includes("mentor") ||
    query.includes("student")
  ) {
    const eduList = kb.education
      .map((e, i) => `[0${i + 1}] ${e.institution} (${e.timeline})\n• ${e.program}\n• ${e.notes}`)
      .join("\n\n");
    return `[ACADEMIC_TRAJECTORY]\n${eduList}`;
  }

  // 6. Certifications
  if (
    query.includes("cert") ||
    query.includes("credential") ||
    query.includes("badge") ||
    query.includes("certiport") ||
    query.includes("hackerrank") ||
    query.includes("pearson")
  ) {
    const certList = kb.certifications
      .map((c, i) => `[0${i + 1}] ${c.name}\n• Issuer: ${c.issuer}\n• Focus: ${c.scope.join(", ")}`)
      .join("\n\n");
    return `[VERIFIED_CREDENTIALS]\n${certList}\n\nAll certificates are verified and linkable in section 03 of this page.`;
  }

  // 7. Who is Jonathan / Bio / Role
  if (
    query.includes("who") ||
    query.includes("about") ||
    query.includes("bio") ||
    query.includes("experience") ||
    query.includes("jonathan") ||
    query.includes("peguit") ||
    query.includes("tan")
  ) {
    return `[OPERATOR_PROFILE: JONATHAN PEGUIT JR.]
${kb.owner.bio}

• Current Program: ${kb.owner.degree} at ${kb.owner.university}
• Key Engineering Focus: ${kb.owner.focus}
• Active Repositories: ${kb.projects.length} verified enterprise and full-stack solutions
• Status: ${kb.owner.status}

Direct questions regarding projects, tech stack, resume, or contact endpoints can be answered immediately.`;
  }

  // 8. General / Fallback
  return `[TAN // COPILOT_RESPONSE]
Jonathan Peguit Jr. is a Full-Stack, .NET & Systems Developer specializing in C# .NET 8 Clean Architecture, Laravel 12, Java, and database systems.

Available queries:
• "What are Jonathan's core projects?" for project breakdown.
• "What is his tech stack?" for languages, frameworks, and databases.
• "Where is his resume?" to view and download his CV.
• "How can I contact him?" for email, phone, and LinkedIn endpoints.`;
}
