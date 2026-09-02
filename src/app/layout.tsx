import type { Metadata } from "next";
import Link from "next/link";
import { Kaushan_Script, Barlow_Condensed, Barlow } from "next/font/google";
import { HeaderEdge } from "@/components/HeaderEdge";
import { InstagramModal } from "@/components/InstagramModal";
import { fetchInstagramPosts } from "@/lib/instagram";
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
const INSTAGRAM_URL = "https://www.instagram.com/tiobarerestaurante_/";
const INSTAGRAM_USER = "tiobarerestaurante_";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `Cardápio, avaliações do Google e Instagram do ${SITE_NAME}.`,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const insta = await fetchInstagramPosts();

  return (
    <html lang="pt-BR" className={`${display.variable} ${condensed.variable} ${body.variable}`}>
      <body>
        <header className="site-header">
          <nav className="nav-side nav-left">
            <Link href="/#cardapio">Cardápio</Link>
          </nav>
          <Link href="/" className="brand" aria-label={SITE_NAME}>
            <span className="brand-badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt={SITE_NAME} />
            </span>
          </Link>
          <nav className="nav-side nav-right">
            <Link href="/#avaliar">Avaliar</Link>
          </nav>
          <HeaderEdge />
        </header>

        {children}

        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="brand-logo" />
              <div>
                <p>
                  <strong>{SITE_NAME}</strong>
                  <br />
                  Comida caseira, música ao vivo e cerveja gelada.
                </p>
                <InstagramModal
                  url={INSTAGRAM_URL}
                  username={INSTAGRAM_USER}
                  posts={insta.posts}
                />
              </div>
            </div>
            <nav className="footer-nav">
              <Link href="/#cardapio">Cardápio</Link>
              <Link href="/#avaliar">Avaliar no Google</Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                Instagram
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
