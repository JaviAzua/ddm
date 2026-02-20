"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import DDMLogo from "../ddm-logo";
import BurguerMenuIcon from "./burguer-menu-icon";
import { useAnimation } from "@/context/animation-context";

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
  { href: "#", id: "top", label: "Ir al inicio", text: "Inicio" },
  { href: "#nosotros", id: "nosotros", label: "Ir a sobre nosotros", text: "Nosotros" },
  { href: "#contacto", id: "contacto", label: "Ir a contacto", text: "Contacto" },
] as const;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showWelcome } = useAnimation();

  const handleNavClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    scrollTo(id)(e);
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: showWelcome ? 1.5 : 0.2 }}
      className="sticky top-0 z-50 bg-base-white dark:bg-base-black"
    >
      <section className="flex justify-between items-center max-w-[95%] mx-auto text-base-black dark:text-base-white">
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

      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="menu"
          className="md:hidden px-4 pt-2 pb-4 bg-base-black dark:bg-base-white text-base-white dark:text-base-black"
        >
          {navItems.map(({ href, id, label, text }) => (
            <a
              key={id}
              href={href}
              role="menuitem"
              onClick={handleNavClick(id)}
              className="block px-3 py-3 rounded-md text-base font-medium font-montserrat hover:bg-white/10 dark:hover:bg-black/10"
              aria-label={label}
            >
              {text}
            </a>
          ))}
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
