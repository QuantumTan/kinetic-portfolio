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
  metadataBase: new URL("https://jnthnpeguit.netlify.app"),
  title: {
    default: "Jonathan Peguit Jr. | Full-Stack & Systems Developer",
    template: "%s | Jonathan Peguit Jr.",
  },
  description:
    "Official portfolio of Jonathan Peguit Jr. (QuantumTan) — IT Student, Student Org Officer, and Peer Mentor at the University of Mindanao. Specializes in C# .NET Clean Architecture, Laravel 12 enterprise applications, Next.js, and Java.",
  keywords: [
    "Jonathan Peguit",
    "Jonathan Peguit Jr",
    "Jonathan Peguit portfolio",
    "Jonathan Peguit University of Mindanao",
    "QuantumTan",
    "Jonathan Peguit developer",
    "Jonathan Peguit software engineer",
    "Jonathan Peguit Davao City",
    "Jonathan Peguit Philippines",
    "CRMS_Peguit",
    "Full-Stack Developer Davao",
    ".NET Developer Philippines",
    "Laravel Developer Davao",
  ],
  authors: [{ name: "Jonathan Peguit Jr.", url: "https://github.com/QuantumTan" }],
  creator: "Jonathan Peguit Jr.",
  publisher: "Jonathan Peguit Jr.",
  alternates: {
    canonical: "https://jnthnpeguit.netlify.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jnthnpeguit.netlify.app",
    siteName: "Jonathan Peguit Jr. Portfolio",
    title: "Jonathan Peguit Jr. | Full-Stack, .NET & Systems Developer",
    description:
      "Explore enterprise repositories, .NET Clean Architecture solutions, Laravel systems, and kinetic web interfaces engineered by Jonathan Peguit Jr.",
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
      "Official portfolio of Jonathan Peguit Jr. — C# .NET Clean Architecture, Laravel 12, Next.js, Java.",
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
      "@id": "https://jnthnpeguit.netlify.app/#person",
      name: "Jonathan Peguit Jr.",
      alternateName: ["Jonathan Peguit", "QuantumTan", "Jonathan Hayo Peguit Jr."],
      url: "https://jnthnpeguit.netlify.app",
      image: "https://jnthnpeguit.netlify.app/assets/logo-portfolio.png",
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
