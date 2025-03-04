"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WhatsAppLogo from "./whatsapp-logo";
import { InstagramLogo } from "./instagram-logo";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 min-h-[30vh] flex flex-col justify-between">
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
          <nav className="flex-col gap-2 flex">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center md:justify-end gap-6 items-center"
            >
              <Link
                href="/trabajos"
                className="hover:text-gray-300 transition-colors"
              >
                Trabajos
              </Link>
              {" | "}
              <Link
                href="/#contacto"
                className="hover:text-gray-300 transition-colors"
              >
                Contacto
              </Link>
            </motion.div>

            <a
              target="_blank"
              href="mailto:mail@mail.com"
              className="hover:underline text-center md:text-right font-inter text-sm"
            >
              ddmueblesventas@gmail.com
            </a>
            <a
              target="_blank"
              href="tel:+5492944696969"
              className="hover:underline text-center md:text-right font-inter text-sm"
            >
              +54 9 294 4 69 69 69
            </a>

            <div className="flex gap-4 justify-center md:justify-end">
              <a
                href="https://www.instagram.com/ddmbariloche/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-all"
                aria-label="Instagram"
              >
                <InstagramLogo />
              </a>
              <a
                href="https://www.instagram.com/ddmbariloche/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-all"
                aria-label="WhatsApp"
              >
                <WhatsAppLogo />
              </a>
            </div>
          </nav>
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
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
