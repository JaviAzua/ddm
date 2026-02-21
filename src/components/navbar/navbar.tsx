"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import DDMLogo from "../ddm-logo";
import BurguerMenuIcon from "./burguer-menu-icon";
import { useAnimation } from "@/context/animation-context";

const menuPanelVariants = {
  closed: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const menuItemVariants = {
  closed: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

const navLinkClass =
  "relative font-montserrat cursor-pointer tracking-wide py-2 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-[width] after:duration-300 hover:after:w-full";

const scrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const navItems = [
  {
    href: "#",
    id: "top",
    label: "Ir al inicio donde se ven los trabajos",
    text: "Trabajos",
  },
  {
    href: "#nosotros",
    id: "nosotros",
    label: "Ir a sobre nosotros",
    text: "Nosotros",
  },
  {
    href: "#contacto",
    id: "contacto",
    label: "Ir a contacto",
    text: "Contacto",
  },
] as const;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showWelcome } = useAnimation();

  const handleNavClick =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      scrollTo(id)(e);
      setIsMenuOpen(false);
    };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: showWelcome ? 1.5 : 0.2 }}
      className="sticky top-0 z-50 bg-base-white dark:bg-base-black shadow-sm shadow-base-black/5"
    >
      <section className="flex justify-between items-center max-w-[95%] mx-auto text-base-black dark:text-base-white z-10">
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="flex gap-2 items-center"
        >
          <DDMLogo className="w-32" />
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-inter font-bold">DDM Bariloche</span>
            <span className="text-sm font-inter">Muebles a medida</span>
          </div>
        </Link>

        {/* Desktop: inline links */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Navegación principal"
        >
          {navItems.map(({ href, id, label, text }) => (
            <a
              key={id}
              href={href}
              onClick={scrollTo(id)}
              className={navLinkClass}
              aria-label={label}
            >
              {text}
            </a>
          ))}
        </nav>

        {/* Mobile: burger + dropdown */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 -mr-2 cursor-pointer touch-manipulation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-controls="mobile-nav-menu"
        >
          <BurguerMenuIcon className="w-10 h-10" />
        </button>
      </section>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-nav-menu"
            variants={menuPanelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            id="mobile-nav-menu"
            role="menu"
            className="md:hidden px-4 pt-2 pb-4 bg-base-black dark:bg-base-white text-base-white dark:text-base-black absolute w-full text-right left-0 right-0 top-full origin-top"
          >
            <div className="flex flex-col gap-1 pt-2">
              {navItems.map(({ href, id, label, text }) => (
                <motion.div key={id} variants={menuItemVariants}>
                  <Link
                    href={href}
                    role="menuitem"
                    onClick={handleNavClick(id)}
                    className="block py-[5vh] rounded-md font-medium hover:bg-white/10 dark:hover:bg-black/10 text-center font-lora text-2xl font transition-colors"
                    aria-label={label}
                  >
                    {text.toUpperCase()}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
