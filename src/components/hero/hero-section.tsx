"use client";

import { works } from "@/app/data/data";
import type { WorkType } from "@/app/data/data";
import ProjectsCarousel from "./projects-carousel";
import WorkModal from "./work-modal";
import { motion } from "framer-motion";
import { useAnimation } from "@/context/animation-context";
import { getTransition } from "@/utils";
import { useState, useRef, useCallback } from "react";

function HeroSection() {
  const { showWelcome } = useAnimation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<WorkType | null>(null);
  const lastClickedItemRef = useRef<HTMLElement | null>(null);

  const handleWorkClick = useCallback((work: WorkType, triggerEl?: HTMLElement | null) => {
    lastClickedItemRef.current = triggerEl ?? null;
    setSelectedWork(work);
    setModalOpen(true);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/trabajos/${work.id}`);
    }
  }, []);

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setSelectedWork(null);
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", window.location.pathname.replace(/\/trabajos\/[^/]+$/, "") || "/");
      }
    }
  }, []);

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

  return (
    <section className="h-full grow overflow-hidden">
      <div className="pt-4 w-full h-full max-w-[90%] mx-auto md:grid grid-cols-1 md:grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
        <motion.div
          initial="initial"
          animate={showWelcome ? "postWelcome" : "noWelcome"}
          variants={variants}
          transition={getTransition(showWelcome, 2, 0.3)}
          className="flex"
        >
          <h2 className="titles-text">TRABAJOS</h2>
          <span className="text-2xl lg:text-4xl">
            (<span className="text-xl lg:text-3xl">{works.length}</span>)
          </span>
        </motion.div>

        <motion.p
          className="subtitles-text section-20vh py-6 w-full md:justify-self-end"
          initial="initial"
          animate={showWelcome ? "postWelcome" : "noWelcome"}
          variants={variants}
          transition={getTransition(showWelcome, 2, 0.3, 0.7, 0.7)}
        >
          <span>
            Muebles de madera y melamina con diseños personalizados.
            <br /> Calidad, estilo y funcionalidad en cada pieza.
          </span>
        </motion.p>

        <motion.div
          initial="initial"
          animate={showWelcome ? "postWelcome" : "noWelcome"}
          variants={projectsVariants}
          transition={getTransition(showWelcome, 2.2, 0.5)}
          className="min-h-0 min-w-0 md:col-span-2 lg:col-span-1 h-full overflow-x-hidden px-4 sm:px-6 md:px-12"
        >
          <ProjectsCarousel works={works} onWorkClick={handleWorkClick} />
        </motion.div>
        <div className="hidden lg:block" />
      </div>
      <WorkModal
        work={selectedWork}
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        onCloseFocusRef={lastClickedItemRef}
      />
    </section>
  );
}

export default HeroSection;
