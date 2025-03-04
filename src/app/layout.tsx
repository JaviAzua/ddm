import type { Metadata } from "next";
import "./globals.css";
import { config } from "../../env";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "DDM Bariloche | Muebles a medida",
  description:
    "Descubre los mejores muebles de madera y melamina con diseños personalizados. Calidad, estilo y funcionalidad en cada pieza. Contáctanos para más información.",
  keywords: [
    "ddm",
    "ddm bariloche",
    "bariloche",
    "muebles",
    "madera",
    "melamina",
    "muebles de madera",
    "muebles de melamina",
    "diseño de interiores",
    "fabricación de muebles",
    "muebles a medida",
    "decoración",
  ],
  openGraph: {
    title: "DDM Bariloche | Muebles a medida",
    description:
      "Descubre los mejores muebles de madera y melamina con diseños personalizados. Calidad, estilo y funcionalidad en cada pieza.",
    url: config.BASE_URL,
    siteName: "DDM Bariloche",
    images: [
      {
        url: `${config.BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "DDM Bariloche | Muebles a medida",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DDM Bariloche | Muebles a medida",
    description:
      "Explora nuestra colección de muebles de madera y melamina con diseños exclusivos.",
    images: [`${config.BASE_URL}/og-image.jpg`],
  },
  robots: "index, follow",
  alternates: {
    canonical: config.BASE_URL,
  },
  icons: [
    {
      url: `${config.BASE_URL}/ddmblack.ico`,
      media: "(prefers-color-scheme: light)",
      rel: "icon",
      sizes: "32x32",
      type: "image/x-icon",
    },
    {
      url: `${config.BASE_URL}/ddmwhite.ico`,
      media: "(prefers-color-scheme: dark)",
      rel: "icon",
      sizes: "32x32",
      type: "image/x-icon",
    },
    {
      url: `${config.BASE_URL}/favicon.svg`,
      type: "image/svg+xml",
    },
    {
      url: `${config.BASE_URL}/apple-touch-icon.png`,
      sizes: "180x180",
      rel: "apple-touch-icon",
    },
  ],
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DDM Bariloche",
      url: config.BASE_URL,
      logo: `${config.BASE_URL}/logo.png`,
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased flex flex-col min-h-screen overflow-x-hidden">
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
