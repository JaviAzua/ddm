"use client";

import { useActionState } from "react";
import { loginAdmin } from "../actions";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return loginAdmin(_prev ?? null, formData);
    },
    null,
  );

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border bg-[hsl(var(--card))] p-6 shadow-sm dark:border-base-gray"
    >
      <h2 className="font-montserrat text-xl font-semibold text-base-black dark:text-base-white">
        Acceso administrador
      </h2>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="admin-user"
          className="text-sm font-medium text-base-black/80 dark:text-base-white/80"
        >
          Usuario
        </label>
        <input
          id="admin-user"
          name="user"
          type="text"
          autoComplete="username"
          required
          disabled={isPending}
          className="rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white placeholder:text-base-gray focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] disabled:opacity-50"
          placeholder="Usuario"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="admin-password"
          className="text-sm font-medium text-base-black/80 dark:text-base-white/80"
        >
          Contraseña
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white placeholder:text-base-gray focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] disabled:opacity-50"
          placeholder="Contraseña"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md bg-base-black px-4 py-2 font-medium text-base-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-base-white dark:text-base-black"
      >
        {isPending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
