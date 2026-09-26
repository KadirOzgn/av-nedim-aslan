"use client";

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import ToolIframe from '@/components/ToolIframe';
import Image from 'next/image';

interface Tool {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  versionInfo?: string | null;
  content?: string | null;
}

export default function ToolsClient({ tools }: { tools: Tool[] }) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolSlug = searchParams.get('tool');

  const activeTool = useMemo(() => {
    if (!toolSlug) return null;
    return tools.find(t => t.slug === toolSlug) || null;
  }, [toolSlug, tools]);

  const handleToolClick = (tool: Tool | null) => {
    if (tool) {
      router.push(`/araclar?tool=${tool.slug}`);
    } else {
      router.push('/araclar');
    }
  };

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      if (language === 'en') {
        // In English, show the tool if it's an English version
        if (tool.slug.endsWith('-en')) return true;
        // If it's a Turkish tool, only show it if an English version doesn't exist
        const hasEnglishVersion = tools.some(t => t.slug === `${tool.slug}-en`);
        return !hasEnglishVersion;
      } else {
        // In Turkish, only show non-English tools
        return !tool.slug.endsWith('-en');
      }
    });
  }, [tools, language]);

  const categories = {
    'Süre ve Ceza Araçları': ['infaz-hesaplama', 'sure-hesaplama', 'infaz-hesaplama-en'],
    'Alacak ve Tazminat Araçları': ['iscilik-hesaplama', 'faiz-hesaplama'],
    'Aile ve Miras Araçları': ['miras-hesaplama'],
    'Harç ve Gider Araçları': ['harc-hesaplama'],
    'Kurumsal Araçlar': ['vekalet-hesaplama', 'arabuluculuk-hesaplama'],
  };

  const groupedTools = useMemo(() => {
    const grouped: Record<string, Tool[]> = {};
    
    // Initialize groups
    Object.keys(categories).forEach(cat => {
      grouped[cat] = [];
    });
    grouped['Diğer Araçlar'] = [];

    // Assign tools to groups
    filteredTools.forEach(tool => {
      let assigned = false;
      const baseSlug = tool.slug.replace('-en', '');
      
      for (const [category, slugs] of Object.entries(categories)) {
        if (slugs.includes(baseSlug) || slugs.includes(tool.slug)) {
          grouped[category].push(tool);
          assigned = true;
          break;
        }
      }
      
      if (!assigned) {
        grouped['Diğer Araçlar'].push(tool);
      }
    });

    // Remove empty groups
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  }, [filteredTools]);

  const getToolImage = (slug: string) => {
    if (slug.includes('infaz')) return '/images/tools/process.jpg';
    if (slug.includes('sure')) return '/images/tools/time.jpg';
    if (slug.includes('iscilik')) return '/images/tools/labor.jpg';
    if (slug.includes('faiz')) return '/images/tools/finance.jpg';
    if (slug.includes('miras')) return '/images/tools/heritage.jpg';
    if (slug.includes('harc')) return '/images/tools/fees.jpg';
    return '/images/tools/process.jpg';
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24 sm:pt-28 md:pt-32 pb-16 relative">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {activeTool ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-7xl mx-auto">
              <button 
                onClick={() => handleToolClick(null)}
                className="mb-6 inline-flex items-center text-sm font-medium text-text-secondary hover:text-navy-primary transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {language === 'en' ? 'Back to Tools' : 'Araçlara Dön'}
              </button>

              <div className="bg-bg-primary rounded-2xl shadow-xl border border-navy-primary/10 overflow-hidden relative min-h-[800px]">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>
                
                <div className="relative z-10 h-full w-full">
                  <ToolIframe 
                    toolSlug={activeTool.slug}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-12 sm:mb-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4">
                  {t('nav.calculator')} {t('nav.practice')}
                </h1>
                <p className="text-sm sm:text-base text-text-secondary font-light max-w-2xl mx-auto">
                  {language === 'en' 
                    ? 'Calculate your legal periods, severances, interests and other legal computations accurately with our free tools.' 
                    : 'Hukuki süreler, işçilik alacakları, faiz ve diğer hukuki hesaplamalarınızı ücretsiz araçlarımızla kolayca yapın.'}
                </p>
              </div>

              <div className="space-y-12 sm:space-y-16">
                {Object.entries(groupedTools).map(([category, categoryTools]) => (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-xl sm:text-2xl font-serif font-semibold text-text-primary">
                        {category}
                      </h2>
                      <div className="h-[1px] flex-grow bg-navy-primary/10"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryTools.map((tool) => (
                        <div 
                          key={tool.id}
                          className="group bg-bg-primary border border-navy-primary/10 rounded-xl overflow-hidden hover:shadow-xl hover:border-navy-primary/30 transition-all duration-300 cursor-pointer flex flex-col h-full relative"
                          onClick={() => handleToolClick(tool)}
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-primary to-gold-primary opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                          
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image 
                              src={getToolImage(tool.slug)} 
                              alt={tool.title} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 to-transparent"></div>
                          </div>
                          
                          <div className="p-6 pt-2 flex-grow flex flex-col relative z-10">
                            <h3 className="text-lg font-serif font-semibold text-text-primary mb-2 group-hover:text-navy-primary transition-colors">
                              {tool.title}
                            </h3>
                            
                            <p className="text-sm text-text-secondary font-light line-clamp-3 mb-4 flex-grow">
                              {tool.description}
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-navy-primary/10 flex items-center justify-between text-xs font-medium text-navy-primary">
                              <span>{language === 'en' ? 'Start Calculation' : 'Hesapla'}</span>
                              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
