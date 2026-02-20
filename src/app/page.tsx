import HeroSection from "@/components/hero/hero-section";
import ContactSection from "@/components/contact/contact-form";
import { getWorksForHero } from "./actions/works";

/** Set to true to load works from Supabase (1 image in list, full work when modal opens). False = use local data from data.ts */
const USE_FETCHED_WORKS = false;

export default async function Home() {
  const works = USE_FETCHED_WORKS ? await getWorksForHero() : undefined;

  return (
    <>
      <main className="flex flex-col h-screen">
        <h1 className="sr-only">
          DDM Bariloche - web de muebles a medida en madera y melamina con
          diseños personalizados en la ciudad de Bariloche, Argentina
        </h1>

        <HeroSection useFetchedData={USE_FETCHED_WORKS} works={works} />

        {/* <BaseAnimation />
      <div className="pattern-cross pattern-gray-500 pattern-bg-uiwhite pattern-size-8 pattern-opacity-10 h-full w-full fixed top-0 left-0 -z-10"></div>
      <div className="h-dvh">
        <HeaderSection />
        <ScrollIndicator />
      </div>
      <WorksSection />
      <ContactForm /> */}
      </main>

      <section
        id="nosotros"
        className="max-w-[90%] mx-auto py-16 md:py-24 scroll-mt-20"
      >
        <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-base-black dark:text-base-white mb-4">
          Sobre nosotros
        </h2>
        <p className="text-base-black/80 dark:text-base-white/80 max-w-prose font-inter">
          DDM Bariloche se dedica a la fabricación de muebles a medida en madera
          y melamina. Diseños personalizados, calidad y atención al detalle en
          cada proyecto en Bariloche y la región.
        </p>
      </section>

      <ContactSection />
    </>
  );
}
