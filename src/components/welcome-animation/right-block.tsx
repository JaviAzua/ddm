import { motion } from "framer-motion";

type Props = {};

function RightBlock({}: Props) {
  return (
    <motion.div
      exit={{
        x: "100%",
        transition: { duration: 1, delay: 0.5, ease: "easeInOut" },
      }}
      className="max-w-[20vw] h-full flex items-center justify-center w-full bg-light-gray"
    >
      <div className="flex flex-col text-base-black items-center justify-center">
        <motion.span
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
          className="text-2xl font-inter font-bold"
        >
          DDM Bariloche
        </motion.span>
        <motion.span
          initial={{
            opacity: 0,
            filter: "blur(10px)",
            scale: 2,
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
          className="text-2xl font-inter"
        >
          Muebles a medida
        </motion.span>
      </div>
    </motion.div>
  );
}

export default RightBlock;
