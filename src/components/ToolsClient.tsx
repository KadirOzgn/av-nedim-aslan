"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

interface Tool {
  id: number;
  title: string;
  description: string | null;
  slug: string;
}

export default function ToolsClient({ tools }: { tools: Tool[] }) {
  const { language, t } = useLanguage();

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const isEnglish = tool.slug.endsWith('-en');
      return language === 'en' ? isEnglish : !isEnglish;
    });
  }, [tools, language]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24 sm:pt-28 md:pt-32 pb-16 relative">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary mb-4">
              {t('nav.tools')}
            </h1>
          </div>

          {filteredTools.length === 0 ? (
            <p className="text-center text-text-secondary">
              {language === 'en' ? 'No tools available yet.' : 'Henüz aktif bir araç bulunmamaktadır.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="bg-bg-secondary p-6 rounded-xl border border-border-primary shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <h2 className="text-xl font-serif font-bold text-text-primary mb-3">
                    {tool.title}
                  </h2>
                  <p className="text-text-secondary mb-6 text-sm flex-grow">
                    {tool.description}
                  </p>
                  <Link
                    href={`/araclar/${tool.slug}`}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-navy-primary hover:bg-navy-secondary transition-colors"
                  >
                    {language === 'en' ? 'Use Tool' : 'Aracı Kullan'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
