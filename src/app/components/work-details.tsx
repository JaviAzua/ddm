"use client";

import type React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Folder } from "../../../types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";

interface WorkDetailProps {
  work: Folder;
}

const WorkDetail: React.FC<WorkDetailProps> = ({ work }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Efecto para sincronizar el estado con la URL al cargar
  useEffect(() => {
    const imageIndexParam = searchParams.get("imageIndex");
    if (imageIndexParam !== null) {
      const index = Number.parseInt(imageIndexParam, 10);
      if (!isNaN(index) && index >= 0 && index < work.images.length) {
        setCurrentImageIndex(index);
        setDialogOpen(true);
      }
    }
  }, [searchParams, work.images.length]);

  // Función para actualizar la URL y el estado
  const updateImageIndex = (index: number | null) => {
    // Crear una nueva instancia de URLSearchParams basada en los parámetros actuales
    const params = new URLSearchParams(searchParams.toString());

    if (index !== null) {
      params.set("imageIndex", index.toString());
    } else {
      params.delete("imageIndex");
    }

    // Actualizar la URL sin recargar la página
    router.push(`?${params.toString()}`, { scroll: false });

    // Actualizar el estado local
    setCurrentImageIndex(index);
  };

  const openImage = (index: number) => {
    updateImageIndex(index);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    // Al cerrar el diálogo, eliminamos el parámetro de la URL
    updateImageIndex(null);
  };

  const navigateImage = (direction: "next" | "prev") => {
    if (currentImageIndex === null) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentImageIndex + 1) % work.images.length;
    } else {
      newIndex =
        (currentImageIndex - 1 + work.images.length) % work.images.length;
    }

    // Actualizar la URL y el estado
    updateImageIndex(newIndex);
  };

  const currentImage =
    currentImageIndex !== null ? work.images[currentImageIndex] : null;

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
          <motion.div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openImage(index)}
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={`${work.title} - Image ${index + 1}`}
              fill
              className="object-cover hover:scale-110 transition-all duration-300"
              sizes="(min-width: 1280px) 50vw, (min-width: 768px) 50vw, 100vw"
            />
          </motion.div>
        ))}
      </motion.div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            // Si el diálogo se cierra, eliminamos el parámetro de la URL
            updateImageIndex(null);
          }
        }}
      >
        <DialogContent className="p-0 max-w-[95vw] h-[95vh] overflow-hidden flex flex-col bg-black/50 backdrop-blur-3xl z-[99]">
          <DialogTitle className="sr-only">Detailed Work</DialogTitle>
          <div className="relative flex-1 flex items-center justify-center">
            {currentImage && (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="relative max-w-full max-h-full w-auto h-auto">
                  <Image
                    src={currentImage.url || "/placeholder.svg"}
                    alt={`${work.title} - Image ${
                      currentImageIndex !== null ? currentImageIndex + 1 : ""
                    }`}
                    width={1200}
                    height={800}
                    className="object-contain max-h-[90vh] w-auto h-auto"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Navigation controls */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => navigateImage("prev")}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => navigateImage("next")}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={closeDialog}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close dialog</span>
            </Button>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex !== null
              ? `${currentImageIndex + 1} / ${work.images.length}`
              : ""}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkDetail;
