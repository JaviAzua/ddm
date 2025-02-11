"use client";

import type React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

type Inputs = {
  name: string;
  email: string;
  message: string;
};

const ContactForm: React.FC = () => {
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
    <section
      className="h-screen flex flex-col overflow-hidden relative container mx-auto"
      id="contacto"
    >
      <motion.h1
        className="text-5xl md:text-6xl xl:text-7xl py-4 font-bold font-hindMadurai mt-20"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Contacto
      </motion.h1>
      <motion.div
        className="w-full p-8 bg-white shadow-md border flex-grow mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-evenly h-full"
        >
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Nombre
            </label>
            <input
              {...register("name", { required: "El nombre es requerido" })}
              id="name"
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p role="alert" className="mt-1 text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
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
              className="w-full px-3 py-2 border rounded-md"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-medium">
              Mensaje
            </label>
            <textarea
              {...register("message", { required: "El mensaje es requerido" })}
              id="message"
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
              aria-invalid={errors.message ? "true" : "false"}
            ></textarea>
            {errors.message && (
              <p role="alert" className="mt-1 text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-black/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactForm;
