"use client";

import Image from "next/image";
import { useMemo } from "react";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import ResponsiveLogo from "./responsive-logo";

const images = [
  "/banner/image-1.jpg",
  "/banner/image-2.jpg",
  "/banner/image-3.jpg",
];

function HeaderSection() {
  const randomImage = useMemo(
    () => images[Math.floor(Math.random() * images.length)],
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        delay: 0.8,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-[85dvh] max-h-[85dvh]">
      <Image
        src={randomImage || "/placeholder.svg"}
        alt="Imagen header de DDM | Bariloche"
        fill
        sizes="100vw"
        className="object-cover grayscale-[0.3] brightness-90"
      />
      <div className="absolute inset-0 bg-black opacity-30 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/grain.jpg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

      {/* Title header */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.5,
            ease: "linear",
          }}
        >
          <ResponsiveLogo />
        </motion.div>

        <motion.h2
          className="text-6xl md:text-7xl lg:text-8xl font-semibold text-white text-center"
          variants={itemVariants}
        >
          Muebles a medida
        </motion.h2>
        <motion.div
          className="w-full max-w-[98%] h-1 bg-white/85 mt-8"
          variants={lineVariants}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-5 pr-2 w-full text-white/80 flex justify-end items-end gap-2"
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="mb-2 text-xl font-semibold font-hindMadurai text-right">
          Descubrí más
        </p>
        <ArrowDownIcon className="size-10 border-2 border-white rounded-full opacity-80" />
      </motion.div>
    </section>
  );
}

export default HeaderSection;
