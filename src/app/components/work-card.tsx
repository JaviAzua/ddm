import type React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface WorkCardProps {
  title: string;
  image: string;
  index: number;
  id: string;
  animationType?: "onView" | "immediate";
}

const WorkCard: React.FC<WorkCardProps> = ({
  title,
  image,
  index,
  id,
  animationType = "onView",
}) => {
  const animationProps =
    animationType === "onView"
      ? {
          initial: { opacity: 0, scale: 0.9 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true },
        }
      : {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
        };

  return (
    <Link href={`/trabajos/${id}`} passHref>
      <motion.div
        className="cursor-pointer group relative overflow-hidden w-full h-full"
        {...animationProps}
        transition={{ duration: 0.5, delay: 0.1 * index }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-300 z-10" />
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-all duration-400"
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
        <ArrowUpRightIcon className="absolute top-2 right-2 text-white w-6 h-6 md:w-8 md:h-8 transition-all duration-300 z-20 group-hover:scale-125" />
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 * index }}
          className="absolute bottom-2 left-2 right-2 text-white text-lg md:text-xl font-medium z-20 line-clamp-2"
        >
          {title}
        </motion.h3>
      </motion.div>
    </Link>
  );
};

export default WorkCard;
