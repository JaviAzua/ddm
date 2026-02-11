import { motion } from "framer-motion";
import DDMLogo from "../ddm-logo";

export default function LeftBlock() {
  return (
    <motion.div
      exit={{
        x: "-100%",
        transition: { duration: 1, delay: 0.3, ease: "easeInOut" },
      }}
      className="w-full h-full relative bg-base-white"
    >
      <div className="flex items-center justify-center absolute inset-0 z-10">
        <motion.div
          initial={{
            opacity: 0,
            filter: "blur(10px)",
            scale: 1.5,
          }}
          exit={{
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            transition: {
              duration: 0.2,
              ease: "easeInOut",
            },
          }}
        >
          <DDMLogo className="size-[80vh] text-base-black" />
        </motion.div>
      </div>
    </motion.div>
  );
}
