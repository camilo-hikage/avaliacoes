import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avaliações",
  description: "Avaliações do Google e depoimentos dos clientes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            ★ Avaliações
          </Link>
          <nav>
            <Link href="/#avaliar">Deixar avaliação</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>Feito com Next.js + Supabase</p>
        </footer>
      </body>
    </html>
  );
}
