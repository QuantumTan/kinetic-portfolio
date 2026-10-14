// ============================================================
// DATA: mentorship-data.ts (ENGINEERING LEADERSHIP & MENTORSHIP)
// ============================================================

export interface LeadershipMetric {
  id: string;
  metric: string;
  value: string;
  label: string;
  description: string;
}

export interface MentorshipPillar {
  title: string;
  scope: string;
  skills: string[];
  impactStatement: string;
}

export interface MentorshipLog {
  institution: string;
  role: string;
  tenure: string;
  metrics: LeadershipMetric[];
  pillars: MentorshipPillar[];
  endorsements: {
    author: string;
    role: string;
    quote: string;
  }[];
}

export const mentorshipData: MentorshipLog = {
  institution: "University of Mindanao (Davao City, PH)",
  role: "Student Organization Officer & Peer Mentor",
  tenure: "2024 — PRESENT",
  metrics: [
    {
      id: "m1",
      metric: "50+",
      value: "50+",
      label: "PEERS_MENTORED",
      description: "Direct 1-on-1 and cohort coaching in Java OOP, .NET C#, and relational database design.",
    },
    {
      id: "m2",
      metric: "12+",
      value: "12+",
      label: "LAB_SESSIONS_LED",
      description: "Conducted hands-on technical labs covering Git branching, Clean Architecture, and MVC patterns.",
    },
    {
      id: "m3",
      metric: "100+",
      value: "100+",
      label: "CODE_REVIEWS_GIVEN",
      description: "Detailed code reviews focusing on SOLID principles, clean naming, and zero-defect SQL schema logic.",
    },
    {
      id: "m4",
      metric: "100%",
      value: "100%",
      label: "LAB_PASS_RATE",
      description: "Assisted mentees achieved 100% pass rates in their mid-year Object-Oriented Programming practicums.",
    },
  ],
  pillars: [
    {
      title: "Object-Oriented Architecture & Clean Code",
      scope: "Java Core, C# .NET, Data Structures & Algorithms",
      skills: ["Encapsulation", "Polymorphism", "Interface Segregation", "Inversion of Control"],
      impactStatement:
        "Trained junior IT peers to move beyond monolithic script writing to modular, testable, class-based software architecture.",
    },
    {
      title: "Relational Schema Design & SQL Optimization",
      scope: "MySQL, SQL Server, Normalization & Indexing",
      skills: ["3NF Normalization", "Foreign Key Constraints", "Index Strategies", "Transactions"],
      impactStatement:
        "Guided student development teams in structuring relational databases to avoid data redundancy and N+1 query bottlenecks.",
    },
    {
      title: "Collaborative Git Workflows & Team CI/CD",
      scope: "Git, GitHub, PR Reviews, Trunk-Based Development",
      skills: ["Branch Protection", "Rebasing", "Semantic Commits", "Issue Tracking"],
      impactStatement:
        "Instituted disciplined GitHub pull-request standards, teaching peers how to perform professional peer code reviews.",
    },
  ],
  endorsements: [
    {
      author: "UM Department of Information Technology",
      role: "Faculty & Peer Mentorship Program",
      quote:
        "Jonathan demonstrates rare technical maturity for his cohort. He translates complex architectural paradigms like Domain-Driven Design and Clean Architecture into clear, practical mental models for his peers.",
    },
    {
      author: "Student Mentee Cohort",
      role: "CS & IT Student Body",
      quote:
        "Jonathan doesn't just give you the answer—he guides you through the debugging stack trace and explains the 'why' behind every OOP design choice.",
    },
  ],
};
