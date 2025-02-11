"use client";

import type React from "react";
import WorkCard from "./work-card";

interface Work {
  id: string;
  title: string;
  images: { url: string }[];
}

interface WorksBentoGridProps {
  works: Work[];
}

const gridItems = [
  "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-3",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-3",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-4 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-3 md:row-span-2",
];

const WorksBentoGrid: React.FC<WorksBentoGridProps> = ({ works }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 flex-grow">
      {works.slice(0, gridItems.length).map((work, index) => (
        <div key={work.id} className={`w-full ${gridItems[index]}`}>
          <WorkCard
            id={work.id}
            index={index}
            title={work.title}
            image={work.images[0].url}
            animationType="immediate"
          />
        </div>
      ))}
    </div>
  );
};

export default WorksBentoGrid;
