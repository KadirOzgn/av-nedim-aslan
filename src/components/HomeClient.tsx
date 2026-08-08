"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Gavel, Heart, Briefcase, Phone, Mail, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NavyThreadLine from '@/components/NavyThreadLine';
import AslanLogo from '@/components/AslanLogo';
import { useLanguage } from '@/context/LanguageContext';
import { LinkedInIcon, InstagramIcon, WhatsAppIcon } from '@/components/Icons';
import { ArticleMetadata } from '@/lib/mdx';

interface HomeClientProps {
  articles: ArticleMetadata[];
}

const keyPractices = [
  {
    id: 1,
    titleKey: "practice.list.0.title",
    briefKey: "practice.list.0.brief",
    icon: Gavel
  },
  {
    id: 2,
    titleKey: "practice.list.1.title",
    briefKey: "practice.list.1.brief",
    icon: Heart
  },
  {
    id: 3,
    titleKey: "practice.list.2.title",
    briefKey: "practice.list.2.brief",
    icon: Briefcase
  }
];

export default function HomeClient({ articles }: HomeClientProps) {
  const { language, t } = useLanguage();
  



  
  const recentArticles = useMemo(() => {
    return articles
      .filter(article => {
        const isEnglish = article.slug.endsWith('-en');
        return language === 'en' ? isEnglish : !isEnglish;
      })
      .slice(0, 3);
  }, [articles, language]);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      {/* Dynamic Navy Thread Progress Line */}
      <NavyThreadLine />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[100dvh] flex items-center pt-20 sm:pt-24 bg-bg-primary overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-[10%] w-[1px] h-full bg-navy-primary/5 hidden lg:block"></div>
        <div className="absolute top-1/3 left-0 w-16 sm:w-32 h-[1px] bg-navy-primary/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center py-10 sm:py-12 md:py-16 relative z-10">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-navy-primary/10 bg-softWhite rounded-full mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 bg-navy-primary rounded-full animate-pulse shadow-sm"></span>
              <span className="text-[0.55rem] sm:text-[0.6rem] font-sans font-semibold tracking-wider text-navy-primary uppercase">
                {t('hero.badge')}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-text-primary leading-tight mb-4 sm:mb-6">
              {t('hero.titleFirst')} <br />
              <span className="text-navy-primary relative">
                {t('hero.titleHighlight')}
                <span className="absolute bottom-1 left-0 w-full h-[1px] bg-navy-primary"></span>
              </span> {t('hero.titleLast')}
            </h1>

            <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-xl mb-6 sm:mb-8 px-1 sm:px-0">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
              <Link 
                href="/iletisim"
                className="text-xs font-sans font-semibold tracking-widest uppercase px-6 py-3 bg-navy-primary text-white hover:bg-navy-secondary transition-all duration-300 rounded-sm shadow-sm text-center"
              >
                {t('hero.ctaContact')}
              </Link>
              <Link 
                href="/faaliyet-alanlari"
                className="text-xs font-sans font-semibold tracking-widest uppercase px-6 py-3 border border-navy-primary/30 text-text-primary hover:border-navy-primary hover:bg-navy-primary/5 transition-all duration-300 rounded-lg text-center"
              >
                {t('hero.ctaPractice')}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative w-full">
            <div className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[384px] aspect-[4/5] border border-navy-primary/20 p-2 bg-bg-primary shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl dark:shadow-stone-950/50">
              <div className="relative w-full h-full">
                <Image 
                  src="/hero-scales.png" 
                  alt="Adalet Terazisi - Aslan Hukuk" 
                  fill
                  sizes="(max-w-768px) 320px, 384px"
                  priority
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-lg"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-navy-primary"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-navy-primary"></div>

            </div>
          </div>
        </div>
      </section>

      {/* Profile Overview (Hakkımızda Özet) */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-bg-primary relative border-t border-navy-primary/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-none">
              <div className="relative w-full max-w-[240px] sm:max-w-[288px] md:max-w-[320px] aspect-[3/4] border border-navy-primary/20 p-2 bg-bg-primary shadow-lg rounded-xl">
                <div className="relative w-full h-full">
                  <Image 
                    src="/nedim-aslan-2.jpg" 
                    alt="Av. Nedim Aslan" 
                    fill
                    sizes="(max-w-768px) 288px, 320px"
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-navy-primary"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-navy-primary"></div>
              </div>
            </div>
            
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-none">
              <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-navy-primary uppercase block mb-3">
                {t('about.badge')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4 sm:mb-6">
                Av. Nedim Aslan
              </h2>
              <p className="text-sm text-text-secondary font-light leading-relaxed mb-6 text-justify max-w-2xl">
                {t('about.bio1')}
              </p>
              <Link 
                href="/hakkimizda"
                className="text-xs font-sans font-semibold tracking-widest uppercase px-5 py-3 border border-navy-primary text-navy-primary hover:bg-navy-primary hover:text-white transition-all duration-300 rounded-lg w-full sm:w-auto text-center"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Overview (Faaliyet Alanları Özet) */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-bg-primary relative border-t border-navy-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-navy-primary uppercase block mb-3">
              {t('practice.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4 relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-[1px] after:bg-navy-primary">
              Öne Çıkan Çalışma Alanları
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {keyPractices.map((practice) => {
              const Icon = practice.icon;
              return (
                <Link 
                  href="/faaliyet-alanlari"
                  key={practice.id} 
                  className="p-6 sm:p-8 border border-navy-primary/10 bg-bg-primary hover:border-navy-primary/30 hover:shadow-md transition-all duration-300 group flex flex-col items-start relative rounded-xl"
                >
                  <div className="absolute top-0 left-0 w-[2px] h-0 bg-navy-primary group-hover:h-full transition-all duration-300"></div>
                  <div className="w-12 h-12 bg-navy-primary/5 text-navy-primary flex items-center justify-center rounded-lg mb-6 group-hover:bg-navy-primary group-hover:text-white transition-all duration-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-text-primary mb-3">
                    {t(practice.titleKey)}
                  </h3>
                  <p className="text-xs text-text-secondary font-light leading-relaxed mb-6">
                    {t(practice.briefKey)}
                  </p>
                  <span className="text-[0.7rem] font-sans font-semibold tracking-wider text-navy-primary uppercase flex items-center gap-1 mt-auto">
                    {t('practice.detailBtn')} <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link 
              href="/faaliyet-alanlari"
              className="text-xs font-sans font-semibold tracking-widest uppercase px-6 py-3 border border-navy-primary text-navy-primary hover:bg-navy-primary hover:text-white transition-all duration-300 rounded-lg inline-block"
            >
              Tüm Faaliyet Alanları
            </Link>
          </div>
        </div>
      </section>

      {/* Publications Overview (Makaleler Özet) */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-bg-primary relative border-t border-navy-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-navy-primary uppercase block mb-3">
              {t('articles.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4 relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-[1px] after:bg-navy-primary">
              Son Yayınlar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {recentArticles.map((article) => (
              <div 
                key={article.slug} 
                className="border border-navy-primary/10 bg-bg-primary rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-stone-950/20 hover:shadow-md hover:border-navy-primary/30 transition-all duration-300 flex flex-col group overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden border-b border-navy-primary/10">
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
                    <span className="text-navy-primary">{article.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(article.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-base font-serif font-semibold text-text-primary mb-3 leading-snug group-hover:text-navy-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[0.75rem] text-text-secondary font-light leading-relaxed mb-6 flex-grow">
                    {article.excerpt}
                  </p>
                  <Link 
                    href={`/makaleler/${article.slug}`} 
                    className="text-[0.7rem] font-sans font-semibold tracking-wider text-navy-primary uppercase flex items-center gap-1 mt-auto"
                  >
                    {t('articles.detailBtn')} <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/makaleler"
              className="text-xs font-sans font-semibold tracking-widest uppercase px-6 py-3 border border-navy-primary text-navy-primary hover:bg-navy-primary hover:text-white transition-all duration-300 rounded-sm inline-block"
            >
              Tüm Makaleler
            </Link>
          </div>
        </div>
      </section>

      {/* Info Overview (İletişim Bilgileri Özet) */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-bg-primary relative border-t border-navy-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
            <div className="flex flex-col gap-4 sm:gap-6">
              <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-navy-primary uppercase block">
                {t('contact.badge')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary">
                Hukuki Danışmanlık ve Temsil
              </h2>
              <p className="text-sm text-text-secondary font-light leading-relaxed mb-2 sm:mb-4">
                Sorularınız, dosyalarınız veya dava süreçleriniz için bizimle irtibata geçebilir, ofisimizden randevu alarak hukuki yardım talep edebilirsiniz.
              </p>

              <div className="flex flex-col gap-4 text-sm font-light">
                <div className="flex gap-3 items-center">
                  <Phone size={16} className="text-navy-primary" />
                  <span>0546 263 8990</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail size={16} className="text-navy-primary" />
                  <span>info@nedimaslan.av.tr</span>
                </div>
                <div className="flex gap-3 items-start">
                  <MapPin size={16} className="text-navy-primary mt-1" />
                  <span>Göztepe Mahallesi, Bosna Caddesi No: 242, Kemeroğulları İş Merkezi, Bağcılar / İstanbul</span>
                </div>
                <div className="flex gap-3 items-center mt-2">
                  <a 
                    href="https://www.linkedin.com/in/av-nedim-aslan-a5bb49200/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-navy-primary/10 hover:bg-navy-primary hover:text-white transition-all duration-300 flex items-center justify-center text-navy-primary"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon size={16} />
                  </a>
                  <a 
                    href="https://www.instagram.com/av.nedimaslan?utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-navy-primary/10 hover:bg-navy-primary hover:text-white transition-all duration-300 flex items-center justify-center text-navy-primary"
                    aria-label="Instagram"
                  >
                    <InstagramIcon size={16} />
                  </a>
                  <a 
                    href="https://wa.me/qr/NIZTP7IGZ24SP1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-navy-primary/10 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center text-navy-primary hover:border-emerald-500"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5 w-full">
              <div className="h-52 sm:h-60 md:h-64 border border-stone-200/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm w-full relative group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.689626359556!2d28.824578115439408!3d41.04278997929729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa35d8869c9b5%3A0xcdcd56b0c20a9a14!2zR8O2enRlcGUsIEJvc25hIENkLiBObzoyNDIsIDM0MjE4IEJhxJ9jModeslarL8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1680000000000!5m2!1str!2str" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location Summary"
                  className="pointer-events-none"
                ></iframe>
                
                {/* Custom Pin Overlay with Lion Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20 mt-[-20px]">
                  {/* Glowing pulse ring */}
                  <div className="absolute w-12 h-12 rounded-full bg-navy-primary/25 animate-ping"></div>
                  
                  {/* Pin Container */}
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-navy-primary border-2 border-white dark:border-stone-900 shadow-[0_4px_15px_rgba(0,0,0,0.35)]">
                    <AslanLogo size={24} className="text-white" />
                    
                    {/* Pin point tail */}
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-navy-primary border-r-2 border-b-2 border-white dark:border-stone-900"></div>
                  </div>
                </div>

                {/* Floating Logo Badge on Map */}
                <div className="absolute top-4 left-4 bg-bg-primary/95 dark:bg-stone-950/95 backdrop-blur-md border border-stone-200/60 dark:border-white/10 px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 pointer-events-none z-30 transition-all duration-300 group-hover:-translate-y-0.5">
                  <AslanLogo size={18} className="text-navy-primary" />
                  <span className="text-[0.6rem] font-sans font-bold text-text-primary tracking-widest uppercase">Konumumuz</span>
                </div>

                {/* Clickable Overlay Link to Google Maps */}
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=G%C3%B6ztepe+Mahallesi%2C+Bosna+Caddesi+No%3A+242%2C+Kemero%C4%9Fullar%C4%B1+%C4%B0%C5%9F+Merkezi%2C+Ba%C4%9Fc%C4%B1lar+%2F+%C4%B0stanbul"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-transparent z-10 cursor-pointer"
                  aria-label="Google Haritalarda Aç"
                >
                  {/* Hover Indicator */}
                  <div className="absolute bottom-4 right-4 bg-bg-primary/95 dark:bg-stone-950/95 backdrop-blur-md border border-stone-200/60 dark:border-white/10 px-3 py-1.5 rounded-xl shadow-lg text-[0.6rem] font-sans font-bold tracking-widest text-text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Haritada Aç
                  </div>
                </a>
              </div>
              <div className="flex justify-start lg:justify-end">
                <Link 
                  href="/iletisim"
                  className="text-[0.65rem] font-sans font-semibold tracking-widest uppercase px-5 sm:px-6 py-3 sm:py-3.5 bg-navy-primary text-white hover:bg-navy-secondary transition-all duration-300 rounded-xl shadow-md cursor-pointer w-full sm:w-auto text-center"
                >
                  Detaylı İletişim Formu ve Harita
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
