import type { Metadata } from "next";
import data from "@/app/data/data.json";
import WorksBentoGrid from "../components/works-bento-grid";

export const metadata: Metadata = {
  title: "Nuestros Trabajos | DDM Muebles a Medida",
  description:
    "Explora nuestra galería de trabajos de muebles a medida. Diseños únicos y personalizados para cada cliente.",
  openGraph: {
    title: "Nuestros Trabajos | DDM Muebles a Medida",
    description:
      "Explora nuestra galería de trabajos de muebles a medida. Diseños únicos y personalizados para cada cliente.",
    images: [
      {
        url: "https://www.ddmmuebles.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DDM Muebles a Medida - Galería de Trabajos",
      },
    ],
  },
};

export default function WorksPage() {
  const works = data.folders;

  return (
    <div className="container mx-auto px-4 pt-20 flex-grow flex flex-col h-[400vh] md:h-[300vh] lg:h-[200vh]">
      <div
        className="pattern-cross pattern-gray-500 pattern-bg-white 
  pattern-size-8 pattern-opacity-10 h-full w-full fixed top-0 left-0 -z-10"
      ></div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8">
        Nuestros Trabajos
      </h1>
      <WorksBentoGrid works={works} />
    </div>
  );
}
