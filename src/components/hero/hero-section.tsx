"use client";

import { works } from "@/app/data/data";
import ProjectsCarousel from "./projects-carousel";
import { motion } from "framer-motion";
import { useAnimation } from "@/context/animation-context";

function HeroSection() {
  const { showWelcome } = useAnimation();

  const variants = {
    initial: { opacity: 0, filter: "blur(10px)", y: -50 },
    postWelcome: { opacity: 1, filter: "blur(0px)", y: 0 },
    noWelcome: { opacity: 1, filter: "blur(0px)", y: 0 },
  };

  const projectsVariants = {
    initial: { opacity: 0, filter: "blur(20px)" },
    postWelcome: { opacity: 1, filter: "blur(0px)" },
    noWelcome: { opacity: 1, filter: "blur(0px)" },
  };

  const getTransition = (
    postDelay: number,
    noDelay: number,
    postDuration = 0.5,
    noDuration = 0.3,
  ) => ({
    delay: showWelcome ? postDelay : noDelay,
    duration: showWelcome ? postDuration : noDuration,
  });

  return (
    <section className="h-full">
      <div className="pt-4 w-full h-full max-w-[90%] mx-auto md:grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
        <div className="flex">
          <motion.h2
            className="font-lora text-9xl font-bold tracking-widest"
            initial="initial"
            animate={showWelcome ? "postWelcome" : "noWelcome"}
            variants={variants}
            transition={getTransition(2, 0.3)}
          >
            OBRAS
          </motion.h2>
          <motion.span
            className="text-4xl"
            initial="initial"
            animate={showWelcome ? "postWelcome" : "noWelcome"}
            variants={variants}
            transition={getTransition(2, 0.3)}
          >
            (<span className="text-3xl">{works.length}</span>)
          </motion.span>
        </div>

        <motion.p
          className="font-inter text-2xl text-balance text-right tracking-tighter relative lg:min-w-[16.3vw] lg:max-w-[16.3vw]"
          initial="initial"
          animate={showWelcome ? "postWelcome" : "noWelcome"}
          variants={variants}
          transition={getTransition(2, 0.3, 0.7, 0.7)}
        >
          <span className="flex items-center h-full justify-end">
            Muebles de madera y melamina con diseños personalizados.
            <br /> Calidad, estilo y funcionalidad en cada pieza.
          </span>
        </motion.p>

        <motion.div
          initial="initial"
          animate={showWelcome ? "postWelcome" : "noWelcome"}
          variants={projectsVariants}
          transition={getTransition(2.2, 0.5)}
          className="min-h-0 min-w-0"
        >
          <ProjectsCarousel works={works} />
        </motion.div>
        <div className="hidden lg:block" />
      </div>
    </section>
  );
}

export default HeroSection;
