import HeroSection from "@/components/hero/hero-section";
import ContactSection from "@/components/contact/contact-form";
import { getWorksForHero } from "./actions/works";
import HowSection from "@/components/how-section/how-section";

const USE_FETCHED_WORKS = false;

export default async function Home() {
  const works = USE_FETCHED_WORKS ? await getWorksForHero() : undefined;

  return (
    <main>
      <h1 className="sr-only">
        DDM Bariloche - web de muebles a medida en madera y melamina con diseños
        personalizados en la ciudad de Bariloche, Argentina
      </h1>
      <div className="flex flex-col h-screen">
        <HeroSection useFetchedData={USE_FETCHED_WORKS} works={works} />
      </div>
      <div className="pt-[10vh]">
        <HowSection />
      </div>
      <ContactSection />
    </main>
  );
}
