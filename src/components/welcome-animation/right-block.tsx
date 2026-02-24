import { motion } from "framer-motion";

type Props = {};

function RightBlock({}: Props) {
  return (
    <motion.div
      style={{ backgroundImage: `url('/woodtexture.webp')` }}
      exit={{
        x: "100%",
        transition: { duration: 1, delay: 0.5, ease: "easeInOut" },
      }}
      className="h-full w-full flex-1"
    ></motion.div>
  );
}

export default RightBlock;
