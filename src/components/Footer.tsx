"use client";

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import AslanLogo from './AslanLogo';
import { useLanguage } from '@/context/LanguageContext';

import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from '@/components/Icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 dark:bg-stone-950 text-stone-400 border-t border-navy-primary/20 pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
        
        {/* Column 1: Logo & Disclaimer */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <AslanLogo size={40} className="text-navy-light" />
            <div className="flex flex-col items-start">
              <span className="text-base font-serif font-extrabold tracking-widest text-stone-100 leading-none mb-1">ASLAN</span>
              <span className="text-[0.5rem] font-sans font-bold tracking-[0.25em] text-navy-light uppercase leading-none">
                {t('nav.lawFirm')}
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed text-justify mt-4">
            {t('footer.disclaimer')}
          </p>
          
          {/* Social Links */}
          <div className="flex gap-3 mt-4">
            <a 
              href="https://www.linkedin.com/in/av-nedim-aslan-a5bb49200/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-stone-850 hover:bg-navy-light hover:text-stone-900 transition-all duration-300 flex items-center justify-center text-stone-400"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={15} />
            </a>
            <a 
              href="https://www.instagram.com/av.nedimaslan?utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-stone-850 hover:bg-navy-light hover:text-stone-900 transition-all duration-300 flex items-center justify-center text-stone-400"
              aria-label="Instagram"
            >
              <InstagramIcon size={15} />
            </a>
            <a 
              href="https://wa.me/qr/NIZTP7IGZ24SP1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-stone-850 hover:bg-emerald-500 hover:text-stone-900 transition-all duration-300 flex items-center justify-center text-stone-400"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={15} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-stone-200 text-xs md:text-sm font-sans font-semibold tracking-widest uppercase mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:height-[1px] after:bg-navy-light">
            {t('footer.quickMenu')}
          </h3>
          <ul className="list-none pl-0 flex flex-col gap-3 m-0">
            <li>
              <Link href="/" className="text-sm hover:text-stone-100 hover:translate-x-1 transition-all duration-200 inline-block">
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="text-sm hover:text-stone-100 hover:translate-x-1 transition-all duration-200 inline-block">
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link href="/faaliyet-alanlari" className="text-sm hover:text-stone-100 hover:translate-x-1 transition-all duration-200 inline-block">
                {t('nav.practice')}
              </Link>
            </li>
            <li>
              <Link href="/makaleler" className="text-sm hover:text-stone-100 hover:translate-x-1 transition-all duration-200 inline-block">
                {t('nav.articles')}
              </Link>
            </li>
            <li>
              <Link href="/sozluk" className="text-sm hover:text-stone-100 hover:translate-x-1 transition-all duration-200 inline-block">
                {t('nav.sozluk')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="text-stone-200 text-xs font-sans font-semibold tracking-widest uppercase mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:height-[1px] after:bg-navy-light">
            {t('footer.contactInfo')}
          </h3>
          <ul className="list-none pl-0 flex flex-col gap-4 text-sm m-0">
            <li className="flex gap-3 items-start">
              <Phone size={16} className="text-navy-light mt-0.5 flex-shrink-0" />
              <span>0546 263 8990</span>
            </li>
            <li className="flex gap-3 items-start">
              <Mail size={16} className="text-navy-light mt-0.5 flex-shrink-0" />
              <span>info@nedimaslan.av.tr</span>
            </li>
            <li className="flex gap-3 items-start">
              <MapPin size={16} className="text-navy-light mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">Göztepe Mahallesi, Bosna Caddesi No: 242, Kemeroğulları İş Merkezi, Bağcılar / İstanbul</span>
            </li>
          </ul>
        </div>

      </div>

      <hr className="border-stone-850 dark:border-stone-900 my-8 max-w-7xl mx-auto px-6" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600 gap-4 text-center md:text-left">
        <div>
          © {currentYear} {t('footer.copyright')}
        </div>
        <div className="flex gap-6">
          <Link href="/#disclaimer" className="hover:text-stone-400">{t('footer.terms')}</Link>
          <Link href="/#privacy" className="hover:text-stone-400">{t('footer.privacy')}</Link>
        </div>
      </div>
    </footer>
  );
}
