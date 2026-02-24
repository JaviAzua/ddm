import { unstable_cache } from "next/cache";
import HeroSection from "@/components/hero/hero-section";
import ContactSection from "@/components/contact/contact-form";
import { getWorksForHero } from "./actions/works";
import HowSection from "@/components/how-section/how-section";
import Footer from "../components/footer/footer";
import Navbar from "@/components/navbar/navbar";

const USE_FETCHED_WORKS = false;

/** 1 week in seconds — backup revalidate if on-demand is never triggered */
const WORKS_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;

const getCachedWorksForHero = unstable_cache(
  getWorksForHero,
  ["works-hero"],
  { revalidate: WORKS_REVALIDATE_SECONDS, tags: ["works"] },
);

export default async function Home() {
  const works = USE_FETCHED_WORKS ? await getCachedWorksForHero() : undefined;

  return (
    <main>
      <Navbar />
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
      <Footer />
    </main>
  );
}
