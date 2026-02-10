import { works } from "@/app/data/data";
import ProjectsCarousel from "./projects-carousel";

type Props = {};

function HeroSection({}: Props) {
  const slicedWorks = works.slice(0, 6);
  return (
    <section className="h-full">
      <div className="pt-4 w-full h-full max-w-[90%] mx-auto md:grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
        <h2 className="font-lora text-9xl font-bold tracking-widest">OBRAS</h2>

        <p className="font-inter text-2xl text-balance text-right tracking-tighter relative">
          <span className="flex items-center h-full justify-end">
            Muebles de madera y melamina con diseños personalizados.
            <br /> Calidad, estilo y funcionalidad en cada pieza.
          </span>
          <span className="absolute text-4xl top-0 left-0">
            (<span className="text-3xl">{works.length}</span>)
          </span>
        </p>

        <div className="hidden lg:block" />
        <div className="min-h-0 min-w-0 ">
          <ProjectsCarousel works={slicedWorks} />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
