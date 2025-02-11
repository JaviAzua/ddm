"use client";

import type React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Folder } from "../../../types";
import { DialogTitle } from "@radix-ui/react-dialog";

interface WorkDetailProps {
  work: Folder;
}

const WorkDetail: React.FC<WorkDetailProps> = ({ work }) => {
  return (
    <div className="space-y-8">
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {work.title}
      </motion.h1>

      <motion.p
        className="text-lg text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {work.description}
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {work.images.map((image, index) => (
          <Dialog key={index}>
            <DialogTitle className="sr-only">{work.title}</DialogTitle>
            <DialogTrigger asChild>
              <motion.div
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${work.title} - Image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-all duration-300"
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-0">
              <div
                className="relative w-full h-full"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${work.title} - Image ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="95vw"
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </motion.div>
    </div>
  );
};

export default WorkDetail;
