"use client";

import Image from 'next/image';
import { Shield, Eye, Award } from 'lucide-react';
import { LinkedInIcon, InstagramIcon } from '@/components/Icons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 relative transition-colors duration-300">
        {/* Red Thread vertical detail */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-navy-primary/20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          {/* Header */}
          <div className="mb-10 sm:mb-12 md:mb-16 text-center">
            <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-navy-primary uppercase block mb-3">
              {t('about.badge')}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-text-primary mb-4 relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-[1px] after:bg-navy-primary">
              {t('nav.about')}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center mb-16 sm:mb-20 md:mb-24">
            
            {/* Left Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[240px] sm:max-w-[288px] md:max-w-[320px] aspect-[3/4] border border-navy-primary/20 p-2 bg-bg-primary shadow-lg rounded-xl transition-all duration-300">
                <div className="relative w-full h-full">
                  <Image 
                    src="/nedim-aslan-2.jpg" 
                    alt="Av. Nedim Aslan" 
                    fill
                    sizes="(max-w-768px) 288px, 320px"
                    className="object-cover rounded-lg"
                  />
                </div>
                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-navy-primary"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-navy-primary"></div>
              </div>
            </div>

            {/* Right Biography Column */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">
                Av. Nedim Aslan
              </h2>
              
              <p className="text-sm text-text-secondary font-light leading-relaxed mb-6 text-justify">
                {t('about.bio1')}
              </p>
              
              <p className="text-sm text-text-secondary font-light leading-relaxed text-justify">
                {t('about.bio2')}
              </p>

              {/* Social Channels */}
              <div className="flex gap-4 mt-8 border-t border-navy-primary/10 pt-6 w-full justify-center lg:justify-start">
                <a 
                  href="https://www.linkedin.com/in/av-nedim-aslan-a5bb49200/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-wider text-text-secondary hover:text-navy-primary transition-colors cursor-pointer"
                >
                  <LinkedInIcon size={16} className="text-navy-primary" />
                  LinkedIn
                </a>
                <span className="text-navy-primary/20">|</span>
                <a 
                  href="https://www.instagram.com/av.nedimaslan?utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-wider text-text-secondary hover:text-navy-primary transition-colors cursor-pointer"
                >
                  <InstagramIcon size={16} className="text-navy-primary" />
                  Instagram
                </a>
              </div>
            </div>

          </div>

          {/* Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-navy-primary/10 bg-navy-bg/40 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-stone-950/20 flex flex-col items-center text-center hover:border-navy-primary/30 transition-all duration-300">
              <div className="w-10 h-10 bg-navy-primary/5 text-navy-primary flex items-center justify-center rounded-lg mb-4">
                <Shield size={20} />
              </div>
              <h4 className="font-sans font-semibold text-xs tracking-wider text-text-primary uppercase mb-2">{t('about.value1Title')}</h4>
              <p className="text-xs text-text-secondary font-light leading-relaxed">{t('about.value1Desc')}</p>
            </div>

            <div className="p-6 border border-navy-primary/10 bg-navy-bg/40 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-stone-950/20 flex flex-col items-center text-center hover:border-navy-primary/30 transition-all duration-300">
              <div className="w-10 h-10 bg-navy-primary/5 text-navy-primary flex items-center justify-center rounded-lg mb-4">
                <Eye size={20} />
              </div>
              <h4 className="font-sans font-semibold text-xs tracking-wider text-text-primary uppercase mb-2">{t('about.value2Title')}</h4>
              <p className="text-xs text-text-secondary font-light leading-relaxed">{t('about.value2Desc')}</p>
            </div>

            <div className="p-6 border border-navy-primary/10 bg-navy-bg/40 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-stone-950/20 flex flex-col items-center text-center hover:border-navy-primary/30 transition-all duration-300">
              <div className="w-10 h-10 bg-navy-primary/5 text-navy-primary flex items-center justify-center rounded-lg mb-4">
                <Award size={20} />
              </div>
              <h4 className="font-sans font-semibold text-xs tracking-wider text-text-primary uppercase mb-2">{t('about.value3Title')}</h4>
              <p className="text-xs text-text-secondary font-light leading-relaxed">{t('about.value3Desc')}</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
