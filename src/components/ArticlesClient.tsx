"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ArticleMetadata } from '@/lib/mdx';

interface ArticlesClientProps {
  articles: ArticleMetadata[];
}

export default function ArticlesClient({ articles }: ArticlesClientProps) {
  const { language, t } = useLanguage();

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const isEnglish = article.slug.endsWith('-en');
      return language === 'en' ? isEnglish : !isEnglish;
    });
  }, [articles, language]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary pt-32 pb-24 relative transition-colors duration-300">
        {/* Red Thread vertical detail */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-burgundy-primary/20"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Header */}
          <div className="mb-16 text-center">
            <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-burgundy-primary uppercase block mb-3">
              {t('articles.badge')}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary mb-4 relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-[1px] after:bg-burgundy-primary">
              {t('articles.title')}
            </h1>
            <p className="text-sm text-text-secondary max-w-xl mx-auto mt-4 font-light leading-relaxed">
              {t('articles.subtitle')}
            </p>
          </div>

          {/* Grid Layout */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <div 
                  key={article.slug} 
                  className="border border-burgundy-primary/10 bg-bg-primary rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-stone-950/20 hover:shadow-md hover:border-burgundy-primary/30 transition-all duration-300 flex flex-col group overflow-hidden"
                >
                  <div className="relative h-48 w-full overflow-hidden border-b border-burgundy-primary/10">
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill
                      sizes="(max-w-768px) 100vw, 384px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center text-[0.65rem] text-text-muted mb-3 font-sans font-medium uppercase tracking-wider">
                      <span className="text-burgundy-primary">{article.category}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(article.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-semibold text-text-primary mb-3 leading-snug group-hover:text-burgundy-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[0.75rem] text-text-secondary font-light leading-relaxed mb-6 flex-grow">
                      {article.excerpt}
                    </p>
                    <Link 
                      href={`/makaleler/${article.slug}`} 
                      className="text-[0.7rem] font-sans font-semibold tracking-wider text-burgundy-primary uppercase flex items-center gap-1 mt-auto"
                    >
                      {t('articles.detailBtn')} <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-burgundy-primary/10 rounded-sm">
              <p className="text-sm text-text-secondary font-light">Henüz makale yayınlanmamıştır.</p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
