"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  useEffect,
} from "react";
import { useSearchParams } from "next/navigation";
import { setHasVisited } from "@/app/actions";

interface AnimationContextType {
  showWelcome: boolean;
  /** true cuando la animación de entrada terminó (o no se mostró). Usar para encadenar animaciones del contenido. */
  hasWelcomeCompleted: boolean;
  isPreviewMode: boolean;
  startExit: () => void;
  completeWelcome: () => void;
  isPending: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  showWelcome: false,
  hasWelcomeCompleted: false,
  isPreviewMode: false,
  startExit: () => {},
  completeWelcome: () => {},
  isPending: false,
});

export const AnimationProvider = ({
  children,
  initialHasVisited,
}: {
  children: React.ReactNode;
  initialHasVisited: boolean;
}) => {
  const searchParams = useSearchParams();
  const isPreviewMode = searchParams.get("welcome") === "1";

  const [showWelcome, setShowWelcome] = useState(
    isPreviewMode || !initialHasVisited,
  );
  const [hasWelcomeCompleted, setHasWelcomeCompleted] = useState(initialHasVisited);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isPreviewMode) setShowWelcome(true);
  }, [isPreviewMode]);

  const startExit = () => {
    setShowWelcome(false);
    // Fallback: marcar listo tras el exit del overlay por si onExitComplete no dispara (delay 1.5 + duration 0.1 ≈ 1.6s)
    setTimeout(() => setHasWelcomeCompleted(true), 1600);
  };

  const completeWelcome = () => {
    setHasWelcomeCompleted(true);
    if (isPreviewMode) return;
    startTransition(async () => {
      await setHasVisited();
    });
  };

  return (
    <AnimationContext.Provider
      value={{
        showWelcome,
        hasWelcomeCompleted,
        isPreviewMode,
        startExit,
        completeWelcome,
        isPending,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within AnimationProvider");
  }
  return context;
}
