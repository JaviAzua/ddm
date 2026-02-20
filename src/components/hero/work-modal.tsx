"use client";

import type React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContentWithoutClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import type { WorkType } from "@/app/data/data";
import { cn } from "@/lib/utils";

interface WorkModalProps {
  work: WorkType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseFocusRef?: React.RefObject<HTMLElement | null>;
  /** Show loading state (e.g. while fetching full work with all images) */
  loading?: boolean;
}

const ZOOM_LEVEL = 2.2;
const LENS_SIZE = 200;

const WorkModal: React.FC<WorkModalProps> = ({
  work,
  open,
  onOpenChange,
  onCloseFocusRef,
  loading = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<{
    active: boolean;
    x: number;
    y: number;
    rect: { width: number; height: number } | null;
  }>({ active: false, x: 0, y: 0, rect: null });

  const images = work?.images ?? [];
  const currentImage = images[currentImageIndex];
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    setCurrentImageIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentImageIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (hasMultiple) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goPrev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goNext();
        }
      }
    },
    [open, onOpenChange, hasMultiple, goPrev, goNext],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset index when work changes and sync when opening
  useEffect(() => {
    if (open && work) {
      setCurrentImageIndex(0);
    }
  }, [open, work?.id]);

  // Reset hover zoom when changing image
  useEffect(() => {
    setHoverState((s) => ({ ...s, active: false }));
  }, [currentImageIndex]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && onCloseFocusRef?.current) {
        onCloseFocusRef.current.focus();
      }
      onOpenChange(next);
    },
    [onOpenChange, onCloseFocusRef],
  );

  const handleImageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = imageContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setHoverState({
        active: true,
        x,
        y,
        rect: { width: rect.width, height: rect.height },
      });
    },
    [],
  );

  const handleImageMouseLeave = useCallback(() => {
    setHoverState((s) => ({ ...s, active: false }));
  }, []);

  if (!work) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContentWithoutClose
        ref={contentRef}
        className="h-full w-full p-0 max-w-[90%] md:max-w-[80%] lg:max-w-[75%] max-h-[95vh] overflow-hidden flex flex-col bg-base-black backdrop-blur-3xl border-0 gap-0 transition-all duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=closed]:blur-md data-[state=open]:blur-0"
        onPointerDownOutside={() => handleOpenChange(false)}
        onEscapeKeyDown={() => handleOpenChange(false)}
      >
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-base-black/70 backdrop-blur-sm">
            <span className="text-base-white font-inter">Cargando…</span>
          </div>
        )}
        <DialogTitle className="sr-only">
          {work.title} - Detalle del trabajo
        </DialogTitle>
        <div className="flex justify-end pr-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white hover:text-white z-10 w-fit"
            onClick={() => handleOpenChange(false)}
            aria-label="Cerrar"
          >
            <X className="size-6" />
          </Button>
        </div>

        {/* Top: Thumbnail strip */}
        {hasMultiple && (
          <div className="shrink-0 flex gap-2 p-3 overflow-x-auto border-b border-white/10 bg-base-black/20">
            <div className="flex gap-2 min-w-0">
              {work.images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "relative shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    index === currentImageIndex
                      ? "border-white scale-105"
                      : "border-white/30 opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt={`${work.title} - miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Middle: Title + description */}
        <div className="shrink-0 space-y-2 px-4 py-4">
          <motion.h1
            layout
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-base-white font-lora"
          >
            {work.title}
          </motion.h1>
          <motion.p
            layout
            className="text-base-white/90 font-inter text-sm md:text-base"
          >
            {work.description}
          </motion.p>
        </div>

        {/* Bottom / Main: Full-size image */}
        <div className="relative flex-1 min-h-[40vh] flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {currentImage && (
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <div
                  ref={imageContainerRef}
                  onMouseMove={handleImageMouseMove}
                  onMouseLeave={handleImageMouseLeave}
                  className="relative max-w-full max-h-full w-auto h-auto cursor-zoom-in overflow-visible"
                >
                  <Image
                    src={currentImage.url || "/placeholder.svg"}
                    alt={`${work.title} - Imagen ${currentImageIndex + 1}`}
                    width={1200}
                    height={800}
                    className="object-contain max-h-[50vh] md:max-h-[60vh] w-auto h-auto select-none pointer-events-none"
                  />
                  {/* Focal zoom lens on hover */}
                  {hoverState.active &&
                    hoverState.rect &&
                    (() => {
                      const { width: rw, height: rh } = hoverState.rect;
                      const lensLeft = Math.max(
                        0,
                        Math.min(hoverState.x - LENS_SIZE / 2, rw - LENS_SIZE),
                      );
                      const lensTop = Math.max(
                        0,
                        Math.min(hoverState.y - LENS_SIZE / 2, rh - LENS_SIZE),
                      );
                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute pointer-events-none rounded-full border-2 border-white/80 bg-white/5 shadow-2xl overflow-hidden"
                          style={{
                            width: LENS_SIZE,
                            height: LENS_SIZE,
                            left: lensLeft,
                            top: lensTop,
                            boxShadow:
                              "0 0 0 1px rgba(255,255,255,0.2), 0 25px 50px -12px rgba(0,0,0,0.5)",
                          }}
                        >
                          <div
                            className="absolute bg-cover bg-no-repeat"
                            style={{
                              width: hoverState.rect.width * ZOOM_LEVEL,
                              height: hoverState.rect.height * ZOOM_LEVEL,
                              left: LENS_SIZE / 2 - hoverState.x * ZOOM_LEVEL,
                              top: LENS_SIZE / 2 - hoverState.y * ZOOM_LEVEL,
                              backgroundImage: `url(${currentImage.url || "/placeholder.svg"})`,
                              backgroundSize: `${hoverState.rect.width * ZOOM_LEVEL}px ${hoverState.rect.height * ZOOM_LEVEL}px`,
                              backgroundPosition: "0 0",
                            }}
                          />
                        </motion.div>
                      );
                    })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {hasMultiple && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={goPrev}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={goNext}
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {hasMultiple && (
          <div className="shrink-0 py-2 text-center text-white/80 text-sm">
            {currentImageIndex + 1} / {work.images.length}
          </div>
        )}
      </DialogContentWithoutClose>
    </Dialog>
  );
};

export default WorkModal;
