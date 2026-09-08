import type { Metadata } from "next";
import { Silkscreen, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ui/ClientWrapper";

const pixelFont = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixel",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Comprehensive Search Engine Optimization Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://jonathanpeguitjr.vercel.app"),
  title: {
    default: "Jonathan Peguit Jr. | Full-Stack Laravel & .NET Developer",
    template: "%s | Jonathan Peguit Jr.",
  },
  description:
    "Official portfolio of Jonathan Peguit Jr. (QuantumTan) — Full-Stack Laravel Developer (Blade & Bootstrap 5), .NET 8 Clean Architecture Engineer, Student Org Officer, and Peer Mentor at the University of Mindanao.",
  keywords: [
    "Jonathan Peguit",
    "Jonathan Peguit Jr",
    "Jonathan Hayo Peguit Jr",
    "QuantumTan",
    "Jonathan Peguit portfolio",
    "Jonathan Peguit University of Mindanao",
    "Jonathan Peguit Davao City",
    "Jonathan Peguit software engineer",
    "Jonathan Peguit developer",
    "Full-Stack Laravel Developer Davao",
    ".NET 8 Clean Architecture Philippines",
    "Laravel 12 Blade Bootstrap Developer",
    "CRMS_Peguit",
    "CRMSystem",
    "swineTrackPOS",
    "Java Specialist Davao",
  ],
  authors: [{ name: "Jonathan Peguit Jr.", url: "https://github.com/QuantumTan" }],
  creator: "Jonathan Peguit Jr.",
  publisher: "Jonathan Peguit Jr.",
  referrer: "origin-when-cross-origin",
  category: "technology",
  alternates: {
    canonical: "https://jonathanpeguitjr.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jonathanpeguitjr.vercel.app",
    siteName: "Jonathan Peguit Jr. Portfolio",
    title: "Jonathan Peguit Jr. | Full-Stack Laravel & .NET Developer",
    description:
      "Explore enterprise systems, Laravel 12 platforms, .NET 8 Clean Architecture repositories, and kinetic web interfaces engineered by Jonathan Peguit Jr.",
    images: [
      {
        url: "/assets/logo-portfolio.png",
        width: 1200,
        height: 630,
        alt: "Jonathan Peguit Jr. - Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Peguit Jr. | Full-Stack Developer",
    description:
      "Official portfolio of Jonathan Peguit Jr. — Full-Stack Laravel 12, .NET 8 Clean Architecture, Next.js, Java.",
    images: ["/assets/logo-portfolio.png"],
    creator: "@QuantumTan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "HrnpRciGIgvXl2VOA8ObfsclmCSoXDKRDbScmaRN_M0",
  },
  icons: {
    icon: "/assets/logo-portfolio.png",
    shortcut: "/assets/logo-portfolio.png",
    apple: "/assets/logo-portfolio.png",
  },
};

// JSON-LD Structured Data Schema for Google Knowledge Graph & Top Search Rankings
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://jonathanpeguitjr.vercel.app/#person",
      name: "Jonathan Peguit Jr.",
      alternateName: ["Jonathan Peguit", "QuantumTan", "Jonathan Hayo Peguit Jr."],
      url: "https://jonathanpeguitjr.vercel.app",
      image: "https://jonathanpeguitjr.vercel.app/assets/logo-portfolio.png",
      jobTitle: "Full-Stack & Systems Developer",
      worksFor: {
        "@type": "Organization",
        name: "University of Mindanao",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "University of Mindanao",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Davao City",
          addressCountry: "PH",
        },
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Davao City",
        addressCountry: "PH",
      },
      email: "mailto:jonathanjrhayo@gmail.com",
      telephone: "+639519941785",
      sameAs: [
        "https://github.com/QuantumTan",
        "https://www.linkedin.com/in/jonathan-jr-peguit-a446ba1b8/",
        "https://facebook.com/tantanluxe",
        "https://jnthnpeguit.netlify.app",
      ],
      knowsAbout: [
        "C#",
        ".NET 8",
        "Clean Architecture",
        "Laravel 12",
        "PHP",
        "Java",
        "Next.js",
        "TypeScript",
        "MySQL",
        "Software Engineering",
        "Full-Stack Web Development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://jnthnpeguit.netlify.app/#website",
      url: "https://jnthnpeguit.netlify.app",
      name: "Jonathan Peguit Jr. Developer Portfolio",
      description: "Official developer portfolio and software engineering registry of Jonathan Peguit Jr.",
      publisher: {
        "@id": "https://jnthnpeguit.netlify.app/#person",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": "https://jnthnpeguit.netlify.app/#profilepage",
      url: "https://jnthnpeguit.netlify.app",
      name: "Jonathan Peguit Jr. Profile",
      mainEntity: {
        "@id": "https://jnthnpeguit.netlify.app/#person",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${pixelFont.variable} ${monoFont.variable} font-mono bg-bg text-text antialiased selection:bg-white selection:text-black relative min-h-screen`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
