"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 h-[30vh] flex flex-col justify-between">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-0"
          >
            <Link href="/" aria-label="Home">
              <Image
                src="/logo.png"
                alt="DDM Logo"
                width={80}
                height={80}
                className="rounded-full invert"
              />
            </Link>
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center md:justify-end gap-6"
          >
            <Link
              href="/trabajos"
              className="hover:text-gray-300 transition-colors"
            >
              Trabajos
            </Link>
            <Link
              href="/#contacto"
              className="hover:text-gray-300 transition-colors"
            >
              Contacto
            </Link>
          </motion.nav>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm"
        >
          <p>
            &copy; {new Date().getFullYear()} DDM Bariloche Muebles a Medida.
            Todos los derechos reservados.
          </p>
          <p className="mt-2">
            <a href="/privacy-policy" className="hover:underline">
              Política de Privacidad
            </a>
            {" | "}
            <a href="/terms-of-service" className="hover:underline">
              Términos de Servicio
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
