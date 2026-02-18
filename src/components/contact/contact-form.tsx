"use client";

import type React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAnimation } from "@/context/animation-context";
import { getTransition } from "@/utils";
import DDMLogo from "../ddm-logo";

type Inputs = {
  name: string;
  email: string;
  message: string;
};

const variants = {
  initial: { opacity: 0, filter: "blur(10px)", y: -50 },
  postWelcome: { opacity: 1, filter: "blur(0px)", y: 0 },
  noWelcome: { opacity: 1, filter: "blur(0px)", y: 0 },
};

const ContactSection: React.FC = () => {
  const { showWelcome } = useAnimation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Mensaje enviado con éxito");
        reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error("Error al enviar el mensaje. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <section className="max-w-[90%] mx-auto pt-[15vh]" id="contacto">
      <motion.div
        initial="initial"
        whileInView={showWelcome ? "postWelcome" : "noWelcome"}
        variants={variants}
        viewport={{ once: true }}
        transition={getTransition(showWelcome, 2, 0.3)}
      >
        <h2 className="titles-text pb-4 md:pb-10">CONTACTO</h2>
      </motion.div>
      <div className="w-full flex gap-10 flex-wrap md:flex-nowrap">
        <motion.div
          className="w-full p-8 md:p-10 bg-base-white border border-base-black/10 shadow-[0_8px_30px_rgb(35,31,32,0.12)] rounded-xl mb-10 md:max-w-[70vw]"
          initial="initial"
          viewport={{ once: true }}
          whileInView={showWelcome ? "postWelcome" : "noWelcome"}
          variants={variants}
          transition={getTransition(showWelcome, 2, 0.3)}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-evenly h-full gap-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block mb-2 font-medium text-base-black tracking-tight"
              >
                Nombre
              </label>
              <input
                {...register("name", { required: "El nombre es requerido" })}
                id="name"
                type="text"
                className="w-full px-4 py-3 border border-base-black/20 rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-base-black/30 focus:border-base-black/40 transition-colors placeholder:text-base-gray/70"
                aria-invalid={errors.name ? "true" : "false"}
                placeholder="Tu nombre"
              />
              {errors.name && (
                <p role="alert" className="mt-1.5 text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-base-black tracking-tight"
              >
                Correo Electrónico
              </label>
              <input
                {...register("email", {
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "El formato del correo electrónico no es válido",
                  },
                })}
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-base-black/20 rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-base-black/30 focus:border-base-black/40 transition-colors placeholder:text-base-gray/70"
                aria-invalid={errors.email ? "true" : "false"}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p role="alert" className="mt-1.5 text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block mb-2 font-medium text-base-black tracking-tight"
              >
                Mensaje
              </label>
              <textarea
                {...register("message", {
                  required: "El mensaje es requerido",
                })}
                id="message"
                rows={4}
                className="w-full px-4 py-3 border border-base-black/20 rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-base-black/30 focus:border-base-black/40 transition-colors placeholder:text-base-gray/70 resize-none"
                aria-invalid={errors.message ? "true" : "false"}
                placeholder="Cuéntanos tu proyecto..."
              ></textarea>
              {errors.message && (
                <p role="alert" className="mt-1.5 text-red-500 text-sm">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="font-inter w-full py-3.5 px-6 bg-base-black text-base-white shadow-[0_2px_8px_rgb(35,31,32,0.25)] hover:shadow-[0_4px_12px_rgb(35,31,32,0.3)] hover:bg-base-black/90 transition-all duration-200 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </form>
        </motion.div>
        <motion.div
          className="section-20vh order-first md:order-last flex flex-col items-center justify-center md:justify-start md:items-end gap-6"
          initial="initial"
          viewport={{ once: true }}
          whileInView={showWelcome ? "postWelcome" : "noWelcome"}
          variants={variants}
          transition={getTransition(showWelcome, 2, 0.3, 0.7, 0.7)}
        >
          <p className="subtitles-text">
            Contactanos para que podamos crear{" "}
            <span className="bg-base-black text-base-white px-3 py-2 inline-block shadow-[0_2px_8px_rgb(35,31,32,0.2)]">
              tu mueble ideal.
            </span>
          </p>
          <div className="hidden md:flex flex-col items-end justify-center opacity-90 font-inter gap-1 text-base-black/80">
            <DDMLogo className="w-36" />
            <span className="font-bold text-base-black">DDM Bariloche</span>
            <span className="text-base-gray">Muebles a medida</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
