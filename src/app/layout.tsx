import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aslan Hukuk Bürosu | Hukuk & Danışmanlık",
  description: "Aslan Hukuk ve Danışmanlık Bürosu. Ceza Hukuku, Aile Hukuku, Ticaret Hukuku ve İş Hukuku alanlarında uzman hukuki danışmanlık ve savunma hizmetleri.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-FOUC script for Reading Mode theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              var lang = localStorage.getItem('language');
              document.documentElement.lang = lang === 'en' ? 'en' : 'tr';
            } catch (e) {}
          })();
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
