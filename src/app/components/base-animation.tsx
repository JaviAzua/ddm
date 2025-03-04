"use client";

import { motion } from "framer-motion";

function BaseAnimation() {
  return (
    <motion.div
      initial={{
        clipPath: "circle(100% at 50% 50%)",
        opacity: 1,
      }}
      animate={{
        clipPath: "circle(0% at 50% 50%)",
        opacity: [1, 1, 1, 1, 0],
      }}
      transition={{
        delay: 1.5,
      }}
      className="bg-black absolute inset-0 z-50"
    />
  );
}

export default BaseAnimation;
