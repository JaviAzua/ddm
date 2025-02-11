import type { Metadata } from "next";
import { notFound } from "next/navigation";
import data from "@/app/data/data.json";
import WorkDetail from "@/app/components/work-details";
import { config } from "../../../../env";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const work = data.folders.find((folder) => folder.id === id);

  if (!work) {
    return {
      title: "Trabajo no encontrado",
    };
  }

  return {
    title: `${work.title} | DDM Muebles a Medida`,
    description: work.description,
    openGraph: {
      title: `${work.title} | DDM Muebles a Medida`,
      description: work.description,
      images: [
        {
          url: work.images[0]?.url || config.BASE_URL + "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { id } = await params;
  const work = data.folders.find((folder) => folder.id === id);

  if (!work) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 pt-20 py-16">
      <div
        className="pattern-cross pattern-gray-500 pattern-bg-white 
  pattern-size-8 pattern-opacity-10 h-full w-full fixed top-0 left-0 -z-10"
      ></div>
      <WorkDetail work={work} />
    </div>
  );
}
