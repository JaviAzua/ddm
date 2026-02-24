import Link from "next/link";
import { logoutAdmin } from "../actions";

const adminNav = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/trabajos", label: "Trabajos" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[60vh]">
      <header className="sticky top-0 z-10 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-4">
            {adminNav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-montserrat font-semibold text-base-black dark:text-base-white hover:opacity-80"
              >
                {label}
              </Link>
            ))}
          </nav>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="text-sm text-base-black/70 underline hover:text-base-black dark:text-base-white/70 dark:hover:text-base-white"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
