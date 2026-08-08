"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Scale, ShieldAlert } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import sozlukData from '@/data/sozluk.json';

interface SozlukTerm {
  slug: string;
  kavramTr: string;
  kavramEn: string;
  harfTr: string;
  harfEn: string;
  kategoriTr: string;
  kategoriEn: string;
  tanimTr: string;
  tanimEn: string;
  dayanakTr: string;
  dayanakEn: string;
}

const alphabet = ["TÜMÜ", "A", "B", "C", "Ç", "D", "E", "F", "G", "H", "I", "İ", "J", "K", "L", "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z"];
const alphabetEn = ["ALL", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('TÜMÜ');
  const { language, t } = useLanguage();

  const lettersList = language === 'tr' ? alphabet : alphabetEn;
  const allLabel = language === 'tr' ? 'TÜMÜ' : 'ALL';

  // Adjust active selected state if language switches
  const currentLetterFilter = useMemo(() => {
    if (selectedLetter === 'TÜMÜ' && language === 'en') return 'ALL';
    if (selectedLetter === 'ALL' && language === 'tr') return 'TÜMÜ';
    return selectedLetter;
  }, [selectedLetter, language]);

  // Extract set of uppercase letters that have terms based on active language
  const activeLetters = useMemo(() => {
    const set = new Set<string>();
    sozlukData.forEach(item => {
      const letter = language === 'tr' ? item.harfTr : item.harfEn;
      if (letter) {
        set.add(letter.toUpperCase());
      }
    });
    return set;
  }, [language]);

  const filteredData = useMemo(() => {
    return (sozlukData as SozlukTerm[]).filter((item) => {
      const kavram = language === 'tr' ? item.kavramTr : item.kavramEn;
      const tanim = language === 'tr' ? item.tanimTr : item.tanimEn;
      const kategori = language === 'tr' ? item.kategoriTr : item.kategoriEn;
      const harf = language === 'tr' ? item.harfTr : item.harfEn;

      const matchesSearch = 
        kavram.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tanim.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kategori.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesLetter = true;
      if (currentLetterFilter !== 'TÜMÜ' && currentLetterFilter !== 'ALL') {
        matchesLetter = harf.toUpperCase() === currentLetterFilter.toUpperCase();
      }

      return matchesSearch && matchesLetter;
    });
  }, [searchTerm, currentLetterFilter, language]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary pt-32 pb-24 relative transition-colors duration-300">
        {/* Red Thread vertical detail */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-navy-primary/20"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-wider text-navy-primary uppercase hover:translate-x-[-4px] transition-transform duration-200 mb-6"
            >
              <ArrowLeft size={14} /> {t('dictionary.backBtn')}
            </Link>

            <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-navy-primary uppercase block mb-3">
              {t('dictionary.badge')}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary mb-4">
              {t('dictionary.title')}
            </h1>
            <p className="text-sm text-text-secondary max-w-xl font-light leading-relaxed">
              {t('dictionary.subtitle')}
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className="mb-12 flex flex-col gap-6">
            {/* Search Input */}
            <div className="relative max-w-md w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                placeholder={t('dictionary.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] text-text-primary rounded-xl focus:outline-none focus:border-navy-primary focus:ring-1 focus:ring-navy-primary transition-all duration-200"
              />
            </div>

            {/* A-Z Alphabet Filter */}
            <div className="border-t border-b border-stone-200/60 dark:border-white/10 py-4">
              <div className="flex flex-wrap gap-1.5 items-center justify-start">
                <span className="text-[0.65rem] font-sans font-semibold tracking-wider text-text-muted uppercase mr-3">{t('dictionary.filterLabel')}</span>
                {lettersList.map((letter) => {
                  const isAll = letter === 'TÜMÜ' || letter === 'ALL';
                  const hasTerms = isAll || activeLetters.has(letter);
                  const isSelected = currentLetterFilter === letter;

                  if (!hasTerms) {
                    return (
                      <span
                        key={letter}
                        className="px-2 py-1 text-xs font-sans font-medium tracking-wider rounded-lg text-text-muted/40 cursor-not-allowed select-none"
                      >
                        {letter}
                      </span>
                    );
                  }

                  return (
                    <button
                      key={letter}
                      onClick={() => setSelectedLetter(letter)}
                      className={`px-2 py-1 text-xs font-sans font-semibold tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-navy-primary text-white shadow-sm' 
                          : 'text-text-secondary hover:text-navy-primary hover:bg-navy-primary/5 border border-stone-200/40 dark:border-white/5'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dictionary Grid */}
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.map((item) => {
                const kavram = language === 'tr' ? item.kavramTr : item.kavramEn;
                const tanim = language === 'tr' ? item.tanimTr : item.tanimEn;
                const kategori = language === 'tr' ? item.kategoriTr : item.kategoriEn;
                const dayanak = language === 'tr' ? item.dayanakTr : item.dayanakEn;
                const harf = language === 'tr' ? item.harfTr : item.harfEn;

                return (
                  <div 
                    key={item.slug} 
                    className="p-6 border border-stone-200/60 dark:border-white/10 bg-white/[0.02] dark:bg-white/[0.03] rounded-2xl hover:border-navy-primary/40 dark:hover:border-navy-primary/50 transition-all duration-300 shadow-sm flex flex-col justify-between group relative"
                  >
                    {/* Small red thread accent in the corner */}
                    <div className="absolute top-0 right-0 w-8 h-[1px] bg-navy-primary/20 group-hover:bg-navy-primary/50 transition-all duration-300"></div>
                    <div className="absolute top-0 right-0 w-[1px] h-8 bg-navy-primary/20 group-hover:bg-navy-primary/50 transition-all duration-300"></div>

                    <div>
                      {/* Top Row: Category Tag */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <span className="inline-flex px-2.5 py-1 bg-navy-primary/5 text-navy-primary dark:text-navy-light border border-navy-primary/10 rounded-full text-[0.62rem] font-sans font-bold tracking-wider uppercase">
                          {kategori}
                        </span>
                        <span className="text-[0.65rem] font-sans font-bold text-text-muted/65 tracking-widest uppercase">
                          {harf}
                        </span>
                      </div>

                      {/* Term Title */}
                      <h3 className="text-lg font-serif font-bold text-text-primary mb-3 leading-snug group-hover:text-navy-primary transition-colors duration-300">
                        {kavram}
                      </h3>

                      {/* Definition */}
                      <p className="text-xs text-text-secondary font-light leading-relaxed mb-6 text-justify">
                        {tanim}
                      </p>
                    </div>

                    {/* Bottom: Legal Source Badge */}
                    {dayanak && (
                      <div className="pt-4 border-t border-stone-200/60 dark:border-white/5 flex items-center gap-2 mt-auto">
                        <ShieldAlert size={12} className="text-navy-primary dark:text-navy-light flex-shrink-0" />
                        <span className="text-[0.62rem] font-sans font-medium text-text-muted leading-none">
                          {language === 'tr' ? 'Dayanak' : 'Basis'}: {dayanak}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-navy-primary/10 rounded-2xl bg-white/[0.01] dark:bg-white/[0.02]">
              <Scale size={32} className="mx-auto text-text-muted mb-4 animate-pulse" />
              <p className="text-sm text-text-secondary font-light">{t('dictionary.noResults')}</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedLetter(allLabel); }}
                className="text-xs text-navy-primary font-sans font-semibold tracking-wider uppercase mt-4 hover:underline cursor-pointer"
              >
                {t('dictionary.clearFilters')}
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
