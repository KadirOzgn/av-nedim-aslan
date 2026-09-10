import type { Metadata } from "next";
import Script from "next/script";
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
  title: "Av. Nedim Aslan | Aslan Hukuk Bürosu",
  description: "Avukat Nedim Aslan - Aslan Hukuk ve Danışmanlık Bürosu. Ceza Hukuku, Aile Hukuku, Ticaret Hukuku ve İş Hukuku alanlarında uzman hukuki danışmanlık ve savunma hizmetleri.",
  keywords: ["Avukat Nedim Aslan", "Nedim Aslan", "Aslan Hukuk Bürosu", "Hukuk", "Danışmanlık", "Avukatlık Bürosu", "Ceza Avukatı", "Boşanma Avukatı", "İnfaz Hesaplama"],
  openGraph: {
    title: "Av. Nedim Aslan | Aslan Hukuk Bürosu",
    description: "Avukat Nedim Aslan - Ceza Hukuku, Aile Hukuku ve Ticaret Hukuku uzmanı.",
    url: "https://www.avnedimaslan.com",
    siteName: "Aslan Hukuk Bürosu",
    images: [
      {
        url: "https://www.avnedimaslan.com/icon.png",
        width: 800,
        height: 800,
        alt: "Aslan Hukuk Bürosu Logosu",
      }
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Av. Nedim Aslan | Aslan Hukuk Bürosu",
    description: "Avukat Nedim Aslan - Ceza Hukuku, Aile Hukuku ve Ticaret Hukuku uzmanı.",
    images: ["https://www.avnedimaslan.com/icon.png"],
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var lang = localStorage.getItem('language');
                  document.documentElement.lang = lang === 'en' ? 'en' : 'tr';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">

        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
