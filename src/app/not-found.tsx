import Link from "next/link";
import Footer from "../components/footer/footer";

export default function NotFound() {
  return (
    <main className="grid place-items-center px-6 lg:px-8 bg-base-black min-h-full">
      <div className="text-center">
        <p className="text-base font-semibold text-base-white">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-base-white sm:text-7xl">
          Página no encontrada
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-base-white px-3.5 py-2.5 text-sm font-semibold text-base-black shadow-xs hover:bg-base-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-black"
          >
            Volver a la página principal
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
