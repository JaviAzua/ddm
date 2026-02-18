import { WorkType } from "@/app/data/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Image from "next/image";

function ProjectsCarousel({ works }: { works: WorkType[] }) {
  return (
    <Carousel className="h-full w-full">
      <CarouselContent className="h-full">
        {works.map((work, i) => (
          <CarouselItem
            className="basis-3/4 md:basis-1/3 group cursor-pointer"
            key={work.id}
          >
            <div className="flex flex-col h-full opacity-100 transition-all duration-400 bg-light-gray/10 group-hover:bg-light-gray/20 border border-base-gray/20 p-2 gap-2">
              <div>
                <span className="shrink-0 text-sm font-inter w-fit">
                  ({String(i + 1).padStart(2, "0")})
                </span>
                <h3 className="shrink-0 text-base font-inter font-semibold">
                  {work.title}
                </h3>
                <p className="shrink-0 text-base font-inter text-base-gray">
                  {work.location}
                </p>
                <div className="flex gap-2">
                  {work.materials.map((material) => (
                    <p
                      key={material}
                      className="shrink-0 text-xs font-inter text-base-white bg-base-black px-1 py-0.5"
                    >
                      {material}
                    </p>
                  ))}
                </div>
              </div>

              <div className="relative w-full grow min-h-0 overflow-hidden h-full">
                <Image
                  src={work.images[0].url || "/placeholder.svg"}
                  alt={work.title}
                  width={1300}
                  height={1000}
                  className="md:group-hover:scale-105 transition-all duration-400 grayscale-25 md:group-hover:grayscale-0 absolute inset-0 w-full h-full object-cover"
                  sizes="(min-width: 1280px) 1300px, (min-width: 768px) 1000px, 1920px"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hover:scale-105 transition-all duration-300 size-12 md:size-20 left-2 md:-left-12 bg-base-black hover:bg-base-black border-none text-base-white hover:text-white cursor-pointer origin-right" />
      <CarouselNext className="hover:scale-105 transition-all duration-300 size-12 md:size-20 right-2 md:-right-12 bg-base-black hover:bg-base-black border-none text-base-white hover:text-white cursor-pointer origin-left" />
    </Carousel>
  );
}

export default ProjectsCarousel;
