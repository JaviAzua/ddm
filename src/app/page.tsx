import HeroSection from "@/components/hero/hero-section";
import Navbar from "@/components/navbar/navbar";
import ContactSection from "@/components/contact/contact-form";

export default function Home() {
  return (
    <>
      <main className="flex flex-col h-screen">
        <h1 className="sr-only">
          DDM Bariloche - web de muebles a medida en madera y melamina con
          diseños personalizados en la ciudad de Bariloche, Argentina
        </h1>
        <Navbar />
        <HeroSection />

        {/* <BaseAnimation />
      <div className="pattern-cross pattern-gray-500 pattern-bg-uiwhite pattern-size-8 pattern-opacity-10 h-full w-full fixed top-0 left-0 -z-10"></div>
      <div className="h-dvh">
        <HeaderSection />
        <ScrollIndicator />
      </div>
      <WorksSection />
      <ContactForm /> */}
      </main>
      <ContactSection />
    </>
  );
}
