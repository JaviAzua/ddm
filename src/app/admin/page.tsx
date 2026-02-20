import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1 className="font-montserrat text-2xl font-semibold text-base-black dark:text-base-white">
        Panel de administración
      </h1>
      <p className="mt-2 text-base-black/70 dark:text-base-white/70">
        Aquí podrás gestionar los productos. Esta sección se irá completando en
        los siguientes pasos.
      </p>
      <ul className="mt-6 flex flex-col gap-2">
        <li>
          <Link
            href="/admin/trabajos"
            className="inline-flex items-center gap-2 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-base-black hover:bg-[hsl(var(--accent))] dark:text-base-white dark:hover:bg-[hsl(var(--accent))]"
          >
            Trabajos
          </Link>
        </li>
      </ul>
    </div>
  );
}
