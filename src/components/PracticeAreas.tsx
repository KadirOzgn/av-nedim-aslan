"use client";

import { useState } from 'react';
import { Gavel, Heart, Briefcase, FileText, Home, FileCheck, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PracticeItem {
  id: number;
  title: string;
  brief: string;
  description: string;
  items: string[];
}

const iconMap: Record<number, any> = {
  1: Gavel,
  2: Heart,
  3: Briefcase,
  4: FileText,
  5: Home,
  6: FileCheck
};

export default function PracticeAreas() {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<PracticeItem | null>(null);

  const practices = (t('practice.list') || []) as PracticeItem[];

  const openModal = (practice: PracticeItem) => {
    setActiveModal(practice);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <section id="practice" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-bg-primary relative border-t border-navy-primary/10">
      {/* Decorative Red Thread line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-navy-primary/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-navy-primary uppercase block mb-3">
            {t('practice.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4 relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-[1px] after:bg-navy-primary">
            {t('practice.title')}
          </h2>
          <p className="text-sm text-text-secondary max-w-xl mx-auto mt-4 font-light leading-relaxed px-2 sm:px-0">
            {t('practice.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {practices.map((practice) => {
            const Icon = iconMap[practice.id] || Gavel;
            return (
              <div 
                key={practice.id} 
                className="p-6 sm:p-8 border border-navy-primary/10 bg-bg-primary hover:border-navy-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col items-start relative rounded-xl"
                onClick={() => openModal(practice)}
              >
                {/* Thin vertical indicator represent red thread on hover */}
                <div className="absolute top-0 left-0 w-[2px] h-0 bg-navy-primary group-hover:h-full transition-all duration-300"></div>
                
                <div className="w-12 h-12 bg-navy-primary/5 text-navy-primary flex items-center justify-center rounded-lg mb-6 group-hover:bg-navy-primary group-hover:text-white transition-all duration-300">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-serif font-semibold text-text-primary mb-3">
                  {practice.title}
                </h3>
                <p className="text-xs text-text-secondary font-light leading-relaxed mb-6">
                  {practice.brief}
                </p>
                <div className="text-[0.7rem] font-sans font-semibold tracking-wider text-navy-primary uppercase flex items-center gap-1 mt-auto">
                  {t('practice.detailBtn')} <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={closeModal}>
          <div className="bg-bg-primary border border-navy-primary/20 w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto p-6 sm:p-8 relative rounded-t-2xl sm:rounded-xl shadow-xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-secondary hover:text-navy-primary transition-colors" onClick={closeModal} aria-label="Kapat">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-navy-primary/5 text-navy-primary flex items-center justify-center rounded-lg">
                {(() => {
                  const Icon = iconMap[activeModal.id] || Gavel;
                  return <Icon size={20} />;
                })()}
              </div>
              <h3 className="text-2xl font-serif font-bold text-text-primary">
                {activeModal.title}
              </h3>
            </div>
            <div className="text-sm text-text-secondary font-light leading-relaxed mb-6">
              <p className="mb-4">{activeModal.description}</p>
              <h4 className="font-sans font-semibold text-xs tracking-wider text-text-primary uppercase mb-3">
                {t('practice.modalTitle')}
              </h4>
              <ul className="list-none pl-0 flex flex-col gap-2">
                {activeModal.items.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-text-secondary">
                    <span className="text-navy-primary font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
