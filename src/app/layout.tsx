import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_NAME = "Tio Bar e Restaurante";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `Avaliações do Google e depoimentos dos clientes do ${SITE_NAME}.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <Link href="/" className="brand" aria-label={SITE_NAME}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt={SITE_NAME} className="brand-logo" />
            <span className="brand-name">{SITE_NAME}</span>
          </Link>
          <nav>
            <Link href="/#avaliar">Deixar avaliação</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>{SITE_NAME}</p>
        </footer>
      </body>
    </html>
  );
}
