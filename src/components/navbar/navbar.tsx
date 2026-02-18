"use client";

import { motion } from "framer-motion";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DDMLogo from "../ddm-logo";
import BurguerMenuIcon from "./burguer-menu-icon";
import { useAnimation } from "@/context/animation-context";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showWelcome } = useAnimation();
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: showWelcome ? 1.5 : 0.2 }}
    >
      <section className="flex justify-between items-center max-w-[95%] mx-auto text-base-black">
        <Link href="/" aria-label="Home" className="flex gap-2 items-center">
          <DDMLogo className="w-32" />
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-inter font-bold">DDM Bariloche</span>
            <span className="text-sm font-inter">Muebles a medida</span>
          </div>
        </Link>
        <section className="flex items-center justify-evenly gap-10 group md:min-w-[30vh]">
          <span
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="hidden md:inline-block font-montserrat cursor-pointer tracking-wide relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-[width] after:duration-300 group-hover:after:w-full"
          >
            MENU
          </span>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="sr-only">
              {isMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
            </span>
            <BurguerMenuIcon className="w-10" />
          </button>
        </section>
      </section>

      {/* Dropdown menu 
      
      {isMenuOpen && (
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80">
          <Link
            href="/trabajos"
            className={`text-white block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/trabajos" ? "border-b-2 border-white/50" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
            aria-current={pathname === "/trabajos" ? "page" : undefined}
          >
            Trabajos
          </Link>
          <Link
            href="/#contacto"
            className="text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Contacto
          </Link>
        </div>
      )}
      
      */}
    </motion.nav>
  );
};

export default Navbar;
