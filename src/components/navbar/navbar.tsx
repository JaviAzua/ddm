"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import DDMLogo from "../ddm-logo";
import { useAnimation } from "@/context/animation-context";

const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
};

const Navbar = () => {
  const { showWelcome } = useAnimation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: showWelcome ? 1.5 : 0.2 }}
    >
      <section className="flex justify-between items-center max-w-[95%] mx-auto text-base-black">
        <Link href="/" aria-label="Ir al inicio" className="flex gap-2 items-center">
          <DDMLogo className="w-32" />
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-inter font-bold">DDM Bariloche</span>
            <span className="text-sm font-inter">Muebles a medida</span>
          </div>
        </Link>
        <a
          href="#contacto"
          onClick={scrollToContact}
          className="relative font-montserrat cursor-pointer tracking-wide py-2 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-[width] after:duration-300 hover:after:w-full"
          aria-label="Ir a contacto"
        >
          Contacto
        </a>
      </section>
    </motion.nav>
  );
};

export default Navbar;
