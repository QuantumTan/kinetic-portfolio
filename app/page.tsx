import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import MentorshipTelemetry from "@/components/sections/MentorshipTelemetry";
import Contact from "@/components/sections/Contact";
import ChatTrigger from "@/components/chatbot/ChatTrigger";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />
      {/* HEADER OFFSET SPACER: Guarantees fixed header never covers content and provides space for CyberNeko */}
      <div className="h-[88px] sm:h-[96px] w-full shrink-0" aria-hidden="true" />
      <main className="w-full max-w-[1200px] px-4 sm:px-6 pt-6 sm:pt-10 pb-16 flex flex-col items-center gap-10 sm:gap-14">
        <Hero />
        <Skills />
        <Projects />
        {/* UNIFIED DUAL-COLUMN LEDGER: VERIFIED CREDENTIALS & ACADEMIC TRAJECTORY */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <Certifications />
          <Education />
        </div>
        <MentorshipTelemetry />
        <Contact />
      </main>
      <Footer />
      <ChatTrigger />
    </div>
  );
}
