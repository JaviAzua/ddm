"use client";
import { motion } from "framer-motion";
import data from "@/app/data/data.json";
import WorkCard from "./work-card";
import Link from "next/link";

function WorksSection() {
  const works = data.folders.slice(0, 6);

  return (
    <section
      className="h-screen flex flex-col overflow-hidden relative"
      id="trabajos"
    >
      <div className="flex flex-wrap justify-between items-center mt-20 container mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl xl:text-7xl font-bold font-hindMadurai"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Nuestros Trabajos
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/trabajos" passHref>
            <span className="text-xl md:text-2xl font-hindMadurai text-gray-700 hover:text-black transition-all">
              Ver todos
            </span>
          </Link>
        </motion.div>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative mt-8">
        {works.map((work, index) => (
          <WorkCard
            id={work.id}
            index={index}
            key={work.id}
            title={work.title}
            image={work.images[0].url}
          />
        ))}
      </div>
    </section>
  );
}

export default WorksSection;
