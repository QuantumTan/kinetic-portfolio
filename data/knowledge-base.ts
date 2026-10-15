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
    role: "Full-Stack Developer & Quality Assurance Analyst",
    focus: "Full-Stack Development (C# .NET 8 Clean Architecture, Laravel 12, Next.js), Quality Assurance Analysis (Automated Testing with Pest & xUnit, E2E Verification), and Relational Database Systems",
    university: "University of Mindanao",
    degree: "BS in Information Technology",
    status: "Active Student (3rd Year) & Student Org Officer / Peer Mentor (2024 - Present)",
    location: "Davao City, Philippines (UTC+8)",
    phone: "+639519941785",
    email: "jonathanjrhayo@gmail.com",
    altEmail: "jonathanpeguit@gmail.com",
    github: "https://github.com/QuantumTan",
    linkedin: "https://www.linkedin.com/in/jonathan-jr-peguit-a446ba1b8/",
    facebook: "https://facebook.com/tantanluxe",
    resume: "/assets/Resume.pdf",
    bio: "Full-Stack Developer and Quality Assurance Analyst specializing in enterprise backend architecture (C# .NET 8 Clean Architecture, Laravel 12, Java), full-stack web platforms (Next.js, TypeScript), relational database systems (MySQL, SQL Server), and rigorous test verification (automated test suites, regression testing, and QA defect lifecycle management). Student organization officer and peer mentor at the University of Mindanao.",
  },
  skills: {
    languages: ["C#", "Java", "PHP", "Python", "TypeScript", "JavaScript", "SQL", "HTML5", "CSS3"],
    frameworks: [".NET 8 / ASP.NET Core", "Laravel 12", "Next.js", "React", "Tailwind CSS", "Entity Framework Core", "GSAP"],
    databases: ["SQL Server", "MySQL"],
    toolchain: ["Git", "GitHub", "Vite", "Pest", "Composer", "Visual Studio", "Figma", "Linux/CLI"],
    softSkills: ["Technical Architecture", "Attention to Detail", "Reliability", "Organization", "Adaptability"],
    coreFocus: ["Full-Stack .NET 8 Clean Architecture", "Laravel 12 Enterprise Applications", "Quality Assurance Analysis & Test Automation", "Relational Database Schema Design & ACID Migrations"],
  },
  projects: [
    {
      name: "Enterprise CRM — .NET 8 Clean Architecture",
      stack: ["C#", ".NET 8", "ASP.NET Core Web API", "Entity Framework Core", "Domain-Driven Design", "SQL Server"],
      repo: "https://github.com/QuantumTan/CRMS_Peguit",
      summary: "Enterprise multi-tier CRM engineered with strict Clean Architecture, Domain-Driven Design, API layers, and automated database SQL migrations.",
    },
    {
      name: "Enterprise CRM Platform — Laravel 12",
      stack: ["Laravel 12", "PHP 8.2", "MySQL", "Blade", "Vite", "Tailwind CSS", "Pest", "Fortify"],
      repo: "https://github.com/QuantumTan/CRMSystem",
      summary: "Full-stack customer relationship management platform with sales pipelines, Kanban boards, role RBAC (Admin, Manager, Sales), and Excel/PDF reporting.",
    },
    {
      name: "SwineTrack POS & Livestock Inventory",
      stack: ["Laravel 12", "PHP", "MySQL", "Tailwind CSS", "Vite", "Blade"],
      repo: "https://github.com/QuantumTan/swineTrackPOS",
      summary: "Commercial POS and livestock inventory telemetry system with weight-based transaction engines.",
    },
    {
      name: "Kinetic Systems Portfolio & AI Copilot",
      stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "GSAP 3", "Gemini AI"],
      repo: "https://github.com/QuantumTan",
      summary: "High-precision kinetic HUD portfolio with embedded Gemini LLM engineering copilot.",
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
      notes: "3rd Year Student, Student Organization Officer & Peer Mentor.",
    },
    {
      institution: "Calinan National High School",
      timeline: "2022 - 2024",
      program: "Accountancy, Business & Management (ABM)",
      notes: "Graduated with High Honors. Research distinction awards.",
    },
  ],
  faq: [
    {
      q: "What are Jonathan's core projects?",
      a: "Jonathan has engineered CRMS_Peguit (C# .NET 8 Clean Architecture), CRMSystem (Laravel 12 / PHP 8.2), SwineTrack POS (Laravel 12 / MySQL), and Kinetic Core Portfolio (Next.js 15 / Gemini AI).",
    },
    {
      q: "What is Jonathan's primary engineering stack?",
      a: "Jonathan is a Full-Stack Developer and Quality Assurance Analyst specializing in enterprise backend systems (.NET 8 C#, Laravel 12, Java, MySQL, SQL Server), modern web platforms (Next.js, TypeScript), and automated testing suites (Pest, xUnit, Postman).",
    },
    {
      q: "What is Jonathan's availability for hire or contract work?",
      a: "Jonathan is actively open for Full-Stack Developer roles, Quality Assurance Analyst positions, and software engineering opportunities. Contact him directly at jonathanjrhayo@gmail.com or +639519941785.",
    },
    {
      q: "How can I access his resume?",
      a: "[STATUS: LOCKED_FOR_UPDATE] Jonathan's official resume/CV is currently undergoing revision with his latest certifications and project metrics. All technical specifications are verified across this live portfolio. For direct copy inquiries, email jonathanjrhayo@gmail.com.",
    },
  ],
};

export type KnowledgeBase = typeof knowledgeBase;

export function getAutonomousResponse(rawQuery: string): string {
  const query = rawQuery.toLowerCase().trim();
  const kb = knowledgeBase;

  // Recruiter: Quality Assurance & Testing Strategy
  if (
    query.includes("quality assurance") ||
    query.includes("qa") ||
    query.includes("test") ||
    query.includes("testing") ||
    query.includes("pest") ||
    query.includes("xunit") ||
    query.includes("bug") ||
    query.includes("regression") ||
    query.includes("automation")
  ) {
    return `[QA_STRATEGY // TEST VERIFICATION & INTEGRITY]
As a Full-Stack Developer and Quality Assurance Analyst, Jonathan integrates quality engineering directly into every stage of development:
• Automated Feature & Unit Testing: Builds comprehensive Pest PHP and xUnit test suites covering business rules, request validation, authentication gates, and database transactions.
• Domain Invariant Assertion: Validates strict encapsulation and zero ORM leakage in Clean Architecture domain models.
• API Contract Testing: Postman test suites validating HTTP status codes, schema adherence, and edge cases.
• Defect Lifecycle & Regression: Rigorous bug tracking, manual exploratory testing, test scenario documentation, and zero-compromise regression prevention.`;
  }

  // Recruiter Q1: Clean Architecture in .NET 8 CRM
  if (
    query.includes("structure clean architecture") ||
    query.includes("structure in your .net 8") ||
    (query.includes(".net 8") && query.includes("clean architecture"))
  ) {
    return `[SYS_ARCH // .NET 8 CLEAN ARCHITECTURE BREAKDOWN]
Jonathan engineered CRMS_Peguit using strict 4-Tier Clean Architecture with Domain-Driven Design (DDD):

1. Domain Core (CRMS.Domain): Zero external dependencies. Holds aggregate roots (Deal, Customer, Ticket), value objects (Money, Email), and domain invariants.
2. Application Layer (CRMS.Application): Decoupled from EF Core. Implements CQRS with MediatR command/query dispatching and FluentValidation pipeline behaviors.
3. Infrastructure Layer (CRMS.Infrastructure): Implements repository interfaces, Entity Framework Core 8 DbContext, SQL Server schema configurations via Fluent API, and automated migrations.
4. Presentation / API (CRMS.Api): Thin ASP.NET Core Web API controllers acting strictly as entry points with JWT bearer authentication and ProblemDetails RFC 7807 error responses.

Click [ARCH_BLUEPRINT] on PRJ-01 to explore the interactive layer diagram and real C# snippets.`;
  }

  // Recruiter Q2: Difference between Laravel 12 and .NET 8 CRM
  if (
    query.includes("difference between your laravel") ||
    (query.includes("difference") && query.includes("laravel") && query.includes(".net"))
  ) {
    return `[ARCH_COMPARISON // LARAVEL 12 vs .NET 8 CRM]
Both systems solve enterprise CRM operations, but each showcases different architectural paradigms:

• CRMS_Peguit (.NET 8):
  - Architecture: Strict Onion / Hexagonal Clean Architecture + Domain-Driven Design (DDD).
  - Patterns: CQRS via MediatR, Unit of Work, FluentValidation pipeline, isolated Domain Core.
  - Persistence: Microsoft SQL Server Enterprise + Entity Framework Core 8 code-first migrations.
  - Focus: High-throughput API contracts, strict compile-time type safety, and microservice modularity.

• Enterprise CRM Platform (Laravel 12):
  - Architecture: Multi-Tier MVC with dedicated Domain Service layer & Spatie RBAC.
  - Patterns: Atomic DB::transactions, FormRequest validation, Policy Gates (Admin vs Sales Rep).
  - Persistence: MySQL InnoDB relational schema with cascading foreign constraints and full audit logs.
  - Features: Interactive drag-and-drop Kanban sales board, real-time stage progression, and automated Excel/PDF reporting.

Both demonstrate Jonathan's ability to architect systems in both compiled enterprise stacks (.NET/C#) and rapid full-stack ecosystems (Laravel/PHP).`;
  }

  // Recruiter Q3: Availability for internships, full-stack, or QA roles
  if (
    query.includes("available for internship") ||
    query.includes("available for full-stack") ||
    query.includes("available for qa") ||
    query.includes("availability") ||
    query.includes("internship or full-stack")
  ) {
    return `[AVAILABILITY_STATUS // OPEN FOR OPPORTUNITIES]
Yes. Jonathan Peguit Jr. is actively available for:
• Full-Stack Development Roles (.NET 8 / C#, Laravel 12 / PHP, Next.js / TypeScript)
• Quality Assurance Analyst & Test Automation Positions (Pest, xUnit, Manual & Automated QA)
• Software Engineering Internships & Technical Collaboration
• Enterprise Systems Architecture & API Integrity Audits

Key Qualifications:
• 3rd Year BS IT student & Technical Peer Mentor at University of Mindanao.
• Certiport Pearson VUE Certified in Java & HackerRank certified.
• Proven production repositories in .NET 8 Clean Architecture and Laravel 12 with automated test suites.
• Direct Contact: jonathanjrhayo@gmail.com | Phone: +63 951 994 1785
• Location: Davao City, Philippines (UTC+8) — Open to remote or hybrid arrangements.`;
  }

  // 0. Architecture & Blueprints Deep Dive
  if (
    query.includes("architecture") ||
    query.includes("clean architecture") ||
    query.includes("blueprint") ||
    query.includes("domain") ||
    query.includes("onion") ||
    query.includes("mediatr") ||
    query.includes("rbac") ||
    query.includes("pricing") ||
    query.includes("schema")
  ) {
    if (query.includes("laravel") || query.includes("rbac") || query.includes("lead")) {
      return `[SYS_ARCH // LARAVEL 12 ENTERPRISE PLATFORM]
Jonathan structures his Laravel 12 CRM platform with strict separation of concerns:
• Routing & Auth: Fortify + Custom RBAC middleware (EnsureUserHasRole: Admin|Manager|Sales).
• Validation: Dedicated FormRequest classes isolate payload validation before reaching controllers.
• Domain Services: Complex actions (Lead conversion, PDF/Excel generation) are encapsulated in Services wrapped in DB::transaction() blocks.
• Database: Relational MySQL InnoDB schema with indexed foreign keys and strict ACID compliance.
Click [ARCH_BLUEPRINT] in the Projects section to inspect the full schema & request lifecycle.`;
    }

    if (query.includes("swinetrack") || query.includes("pos") || query.includes("weight")) {
      return `[SYS_ARCH // SWINETRACK POS ENGINE]
Jonathan's SwineTrack POS architecture solves high-throughput commercial livestock checkout:
• Weight Engine: Dynamic price-per-kg calculation factoring in live carcass grade and gross/tare deduction.
• Concurrency Protection: Uses pessimistic locking (SELECT ... FOR UPDATE) on livestock units to prevent duplicate sales across simultaneous checkout registers.
• Batch Stock Ledger: Automatically decrements pen headcount and records immutable audit receipts.
Click [ARCH_BLUEPRINT] in the Projects section to simulate the checkout lifecycle.`;
    }

    return `[SYS_ARCH // .NET 8 CLEAN ARCHITECTURE]
Jonathan implements strict Onion / Clean Architecture with Domain-Driven Design (DDD) in CRMS_Peguit:
• Tier 01 (CRMS.Api): Web API Controllers, JWT middleware, Swagger, DI Composition Root.
• Tier 02 (CRMS.Application): CQRS Commands & Queries dispatched via MediatR, FluentValidation pipeline behaviors, DTO projections. Decoupled from EF Core.
• Tier 03 (CRMS.Domain): Core enterprise aggregates, rich entities, and domain invariants with ZERO external package dependencies.
• Tier 04 (CRMS.Infrastructure): EF Core 8 DbContext, SQL Server migrations, and Unit of Work repository implementations.
Click [ARCH_BLUEPRINT] in the Projects section to inspect the interactive layer graph and SQL Server schema!`;
  }

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
    return `[RESUME_STATUS: LOCKED_FOR_REVISION]
Jonathan's official CV/Resume is currently locked while being updated with latest credentials & metrics.
• Status: UNDER_REVISION
• Verified Portfolio: Explore sections 01-04 on this terminal site for complete architectural specifications
• Direct Copy Request: jonathanjrhayo@gmail.com
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
Jonathan Peguit Jr. is a Full-Stack Developer and Quality Assurance Analyst specializing in C# .NET 8 Clean Architecture, Laravel 12, Next.js, and automated test verification.

Available queries:
• "What are Jonathan's core projects?" for project breakdown.
• "How does he approach QA and testing?" for test automation and verification.
• "What is his tech stack?" for languages, frameworks, and databases.
• "Where is his resume?" to view and download his CV.
• "How can I contact him?" for email, phone, and LinkedIn endpoints.`;
}
