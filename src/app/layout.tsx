import type { Metadata } from "next";
import Link from "next/link";
import { Kaushan_Script, Barlow_Condensed, Barlow } from "next/font/google";
import { HeaderEdge } from "@/components/HeaderEdge";
import "./globals.css";

const display = Kaushan_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const condensed = Barlow_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-condensed",
  display: "swap",
});
const body = Barlow({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE_NAME = "Tio Bar e Restaurante";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `Avaliações do Google e depoimentos dos clientes do ${SITE_NAME}.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${condensed.variable} ${body.variable}`}>
      <body>
        <header className="site-header">
          <nav className="nav-side nav-left">
            <Link href="/#avaliar">Deixar avaliação</Link>
          </nav>
          <Link href="/" className="brand" aria-label={SITE_NAME}>
            <span className="brand-badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt={SITE_NAME} />
            </span>
          </Link>
          <nav className="nav-side nav-right">
            <Link href="/admin">Admin</Link>
          </nav>
          <HeaderEdge />
        </header>

        {children}

        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="brand-logo" />
              <p>
                <strong>{SITE_NAME}</strong>
                <br />
                Comida caseira, música ao vivo e cerveja gelada.
              </p>
            </div>
            <nav className="footer-nav">
              <Link href="/">Avaliações</Link>
              <Link href="/#avaliar">Deixar avaliação</Link>
              <a href="https://www.google.com/maps" target="_blank" rel="noreferrer">
                Como chegar
              </a>
            </nav>
          </div>
          <p className="footer-legal">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </footer>
      </body>
    </html>
  );
}
