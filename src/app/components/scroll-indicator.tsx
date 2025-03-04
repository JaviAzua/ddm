"use client";

import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function ScrollIndicator({}) {
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
    <motion.div
      className="absolute bottom-5 pr-2 w-full flex justify-end items-end gap-2 text-black animate-pulse"
      variants={scrollIndicatorVariants}
      initial="hidden"
      animate="visible"
    >
      <p className="text-xl md:text-3xl font-semibold font-inter text-right tracking-widest">
        Descubrí más
      </p>
      <ArrowDownIcon className="size-10 border-2 border-black rounded-full opacity-80" />
    </motion.div>
  );
}

export default ScrollIndicator;
