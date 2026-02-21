"use client";

import { motion } from "framer-motion";
import { useAnimation } from "@/context/animation-context";
import { getTransition } from "@/utils";

const steps = [
  {
    number: "01",
    title: "Contacto",
    description: "Te escuchamos y coordinamos una visita",
  },
  {
    number: "02",
    title: "Tomamos medidas",
    description: "Vamos al lugar y medimos todo para que quede perfecto",
  },
  {
    number: "03",
    title: "Compramos y cortamos",
    description: "Elegimos el material y lo cortamos justo a tu medida",
  },
  {
    number: "04",
    title: "Instalamos",
    description: "Te llevamos el mueble y lo instalamos en tu casa",
  },
];

const viewport = { once: true, margin: "-40px" };

const variants = {
  initial: { opacity: 0, filter: "blur(10px)", y: -50 },
  postWelcome: { opacity: 1, filter: "blur(0px)", y: 0 },
  noWelcome: { opacity: 1, filter: "blur(0px)", y: 0 },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function HowSection() {
  const { showWelcome } = useAnimation();
  const baseTransition = getTransition(showWelcome, 2, 0.3);

  return (
    <section id="nosotros" className="bg-base-black py-[15vh] ">
      <div className="max-w-[90%] mx-auto">
        <motion.div
          className="mb-16"
          initial="initial"
          whileInView={showWelcome ? "postWelcome" : "noWelcome"}
          viewport={viewport}
          variants={variants}
          transition={baseTransition}
        >
          <h2 className="titles-text text-base-white">NOSOTROS</h2>
          <p className="subtitles-text py-6 w-full text-base-white">
            DDM Bariloche se dedica a la fabricación de muebles a medida.
            <br />
            Diseños personalizados, calidad y atención al detalle en cada
            proyecto en Bariloche y la región.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line for desktop — draws in when in view (stepper) */}
          <motion.div
            className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-background/20 origin-left"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={lineVariants}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative flex flex-col items-center text-center p-4 lg:p-6 rounded-xl border border-base-white/10 bg-base-gray/10 lg:bg-base-black shadow-[0_8px_30px_rgb(35,31,32,0.12)] w-[80%] lg:w-full mx-auto"
                initial="initial"
                whileInView={showWelcome ? "postWelcome" : "noWelcome"}
                viewport={viewport}
                variants={variants}
                transition={{
                  ...getTransition(showWelcome, 2, 0.3, 0.5, 0.3),
                  delay: baseTransition.delay + i * 0.12,
                }}
              >
                {/* Step circle */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-dark-blue mb-6">
                  <span className="text-2xl font-bold text-base-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-semibold text-lg lg:text-2xl text-background mb-3 font-inter">
                  {step.title}
                </h3>
                <p className="text-sm lg:text-base text-background/60 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowSection;
