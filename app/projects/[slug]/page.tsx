import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/data/projects";
import { architectureData } from "@/data/architecture-data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatTrigger from "@/components/chatbot/ChatTrigger";
import ProjectBlueprintClient from "./ProjectBlueprintClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  const arch = architectureData[slug];

  if (!project) {
    return {
      title: "System Blueprint Not Found",
    };
  }

  return {
    title: `${project.title} | Systems Architecture Blueprint`,
    description: `${project.description} Engineered by Jonathan Peguit Jr.`,
    openGraph: {
      title: `${project.title} - Architectural Blueprint`,
      description: arch?.pattern || project.short,
      url: `https://jonathanpeguitjr.vercel.app/projects/${slug}`,
      siteName: "Jonathan Peguit Jr. Portfolio",
      images: [
        {
          url: project.image || "/assets/logo-portfolio.png",
          width: 1200,
          height: 630,
          alt: `${project.title} Architectural Specification`,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  const arch = architectureData[slug];

  if (!project || !arch) {
    notFound();
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />
      {/* HEADER OFFSET SPACER */}
      <div className="h-[88px] sm:h-[96px] w-full shrink-0" aria-hidden="true" />

      <main className="w-full max-w-[1200px] px-4 sm:px-6 pt-6 sm:pt-10 pb-16 flex flex-col items-center">
        {/* BREADCRUMB & BACK NAVIGATION */}
        <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-[var(--color-border)] font-mono text-xs">
          <Link
            href="/#projects"
            className="pixel-btn text-[0.65rem] sm:text-xs py-1.5 px-3 flex items-center gap-2 cursor-pointer hover:underline"
          >
            <span>[← BACK_TO_REGISTRY]</span>
          </Link>

          <div className="flex items-center gap-2 text-[var(--color-text-dim)]">
            <span>SYS_REGISTRY</span>
            <span>//</span>
            <span className="text-[var(--color-text)] font-bold">{project.code}</span>
          </div>
        </div>

        {/* CLIENT INTERACTIVE BLUEPRINT TABS */}
        <ProjectBlueprintClient project={project} arch={arch} />
      </main>

      <Footer />
      <ChatTrigger />
    </div>
  );
}
