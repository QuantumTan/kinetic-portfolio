import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import ChatTrigger from "@/components/chatbot/ChatTrigger";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />
      {/* HEADER OFFSET SPACER: Guarantees fixed header never covers content */}
      <div className="h-[64px] w-full shrink-0" aria-hidden="true" />
      <main className="w-full max-w-[1200px] px-4 sm:px-6 pt-6 sm:pt-10 pb-16 flex flex-col items-center">
        <Hero />
        <Skills />
        <Projects />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <Footer />
      <ChatTrigger />
    </div>
  );
}
