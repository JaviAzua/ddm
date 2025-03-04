"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import ResponsiveLogo from "./responsive-logo";

const images = [
  "/banner/image-1.jpg",
  "/banner/image-2.jpg",
  "/banner/image-3.jpg",
  "/banner/image-4.jpg",
  "/banner/image-5.jpg",
];

function HeaderSection() {
  const randomImage = useMemo(
    () => images[Math.floor(Math.random() * images.length)],
    []
  );

  const titleVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 2,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const subtitleVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 2.2,
      },
    },
  };

  return (
    <section className="relative min-h-[85dvh] max-h-[85dvh]">
      <div className="absolute inset-y-1/2 inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-white z-10"></div>
      <Image
        src={randomImage || "/placeholder.svg"}
        alt="Imagen header de DDM | Bariloche"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div>

      {/* Title header */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
        <ResponsiveLogo />
        <h2 className="text-white text-center text-balance font-inter tracking-wide">
          <motion.p
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl lg:text-7xl font-bold up"
          >
            Diseño de Muebles
          </motion.p>
          <motion.p
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-7xl"
          >
            Muebles a medida
          </motion.p>
        </h2>
      </div>
    </section>
  );
}

export default HeaderSection;
