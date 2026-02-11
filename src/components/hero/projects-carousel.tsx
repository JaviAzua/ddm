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
    <Carousel className="h-full">
      <CarouselContent className="h-full">
        {works.map((work, i) => (
          <CarouselItem
            className="basis-1/3 group cursor-pointer"
            key={work.id}
          >
            <div className="flex flex-col h-full opacity-100 transition-all duration-400 bg-base-gray group-hover:bg-light-gray p-4">
              <span className="shrink-0 text-sm font-inter w-fit px-2 py-1">
                ({String(i + 1).padStart(2, "0")})
              </span>
              <h3 className="shrink-0 text-base font-inter pt-2 font-semibold">
                {work.title}
              </h3>
              <p className="shrink-0 text-base font-inter pt-2 text-base-white">
                {work.location}
              </p>
              <div className="flex gap-2 pt-1">
                {work.materials.map((material) => (
                  <p
                    key={material}
                    className="shrink-0 text-xs font-inter text-base-white bg-base-black px-1 py-0.5"
                  >
                    {material}
                  </p>
                ))}
              </div>

              <div className="min-h-[6vh]" />
              <div className="relative w-full flex-1 min-h-0">
                <Image
                  src={work.images[0].url || "/placeholder.svg"}
                  alt={work.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hover:scale-105 transition-all duration-300 size-20 bg-base-black hover:bg-base-black border-none text-base-white hover:text-white cursor-pointer" />
      <CarouselNext className="hover:scale-105 transition-all duration-300 size-20 bg-base-black hover:bg-base-black border-none text-base-white hover:text-white cursor-pointer" />
    </Carousel>
  );
}

export default ProjectsCarousel;
