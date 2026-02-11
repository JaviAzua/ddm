"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useAnimation } from "@/context/animation-context";
import LeftBlock from "./welcome-animation/left-block";
import RightBlock from "./welcome-animation/right-block";

export function WelcomeAnimation() {
  const { showWelcome, isPreviewMode, startExit, completeWelcome, isPending } =
    useAnimation();

  useEffect(() => {
    if (!showWelcome) return;
    const t = setTimeout(startExit, 300);
    return () => clearTimeout(t);
  }, [showWelcome, startExit]);

  return (
    <AnimatePresence onExitComplete={completeWelcome} mode="wait">
      {showWelcome && (
        <motion.div
          key="welcome-overlay"
          className="fixed inset-0 z-9999"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.1, delay: 1.5 },
          }}
        >
          <div className="flex h-full w-full ">
            <LeftBlock />
            <RightBlock />
          </div>

          {isPending && (
            <div className="mt-4 text-center text-gray-500">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
