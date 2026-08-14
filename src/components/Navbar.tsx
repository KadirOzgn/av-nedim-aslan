"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import AslanLogo from './AslanLogo';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (pathname === '/') {
        const sections = ['home', 'about', 'practice', 'articles', 'contact'];
        const scrollPosition = window.scrollY + 120;

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }
    };

    // Close language dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pathname]);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setMobileMenuOpen(false);

    if (pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleLangSelect = (lang: 'tr' | 'en') => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-3 sm:px-4 md:px-6 ${scrolled
        ? 'bg-bg-primary/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-navy-primary/10 shadow-sm'
        : 'bg-transparent py-3 sm:py-4 md:py-5'
      }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12 flex justify-between items-center">
        {/* Custom Symmetrical Circular Crest Logo */}
        <Link
          href="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="flex items-center gap-2 sm:gap-3 group min-w-0"
        >
          <AslanLogo className="w-9 h-9 sm:w-11 sm:h-11 text-navy-primary transition-transform duration-300 group-hover:scale-105 shrink-0" />
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm sm:text-base md:text-lg font-serif font-extrabold tracking-widest text-text-primary leading-none mb-0.5 sm:mb-1">ASLAN</span>
            <span className="text-[0.45rem] sm:text-[0.5rem] md:text-[0.55rem] font-sans font-bold tracking-[0.2em] sm:tracking-[0.25em] text-navy-primary uppercase leading-none truncate max-w-[120px] sm:max-w-none">
              {t('nav.lawFirm')}
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            <li>
              <Link
                href="/"
                onClick={(e) => handleLinkClick(e, 'home')}
                className={`text-xs font-sans font-semibold tracking-widest uppercase py-1 border-b transition-all duration-200 ${pathname === '/' && activeSection === 'home'
                    ? 'text-navy-primary border-navy-primary'
                    : 'text-text-secondary border-transparent hover:text-navy-primary'
                  }`}
              >
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link
                href="/hakkimizda"
                className={`text-xs font-sans font-semibold tracking-widest uppercase py-1 border-b transition-all duration-200 ${pathname === '/hakkimizda'
                    ? 'text-navy-primary border-navy-primary'
                    : 'text-text-secondary border-transparent hover:text-navy-primary'
                  }`}
              >
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link
                href="/faaliyet-alanlari"
                className={`text-xs font-sans font-semibold tracking-widest uppercase py-1 border-b transition-all duration-200 ${pathname === '/faaliyet-alanlari'
                    ? 'text-navy-primary border-navy-primary'
                    : 'text-text-secondary border-transparent hover:text-navy-primary'
                  }`}
              >
                {t('nav.practice')}
              </Link>
            </li>
            <li>
              <Link
                href="/hukuk-notlari"
                className={`text-xs font-sans font-semibold tracking-widest uppercase py-1 border-b transition-all duration-200 ${pathname === '/hukuk-notlari' || pathname.startsWith('/hukuk-notlari/')
                    ? 'text-navy-primary border-navy-primary'
                    : 'text-text-secondary border-transparent hover:text-navy-primary'
                  }`}
              >
                {t('nav.articles')}
              </Link>
            </li>
            <li>
              <Link
                href="/sozluk"
                className={`text-xs font-sans font-semibold tracking-widest uppercase py-1 border-b transition-all duration-200 ${pathname === '/sozluk'
                    ? 'text-navy-primary border-navy-primary'
                    : 'text-text-secondary border-transparent hover:text-navy-primary'
                  }`}
              >
                {t('nav.sozluk')}
              </Link>
            </li>
            <li>
              <Link
                href="/iletisim"
                className={`text-xs font-sans font-semibold tracking-widest uppercase py-1 border-b transition-all duration-200 ${pathname === '/iletisim'
                    ? 'text-navy-primary border-navy-primary'
                    : 'text-text-secondary border-transparent hover:text-navy-primary'
                  }`}
              >
                {t('nav.contact')}
              </Link>
            </li>
          </ul>

          {/* Premium Language Dropdown Menu */}
          <div className="relative border-l border-navy-primary/20 pl-4" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-sans font-semibold tracking-wider text-text-secondary hover:text-navy-primary transition-colors focus:outline-none cursor-pointer"
              aria-label="Dil Değiştir"
            >
              <span>{language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-28 bg-bg-primary border border-navy-primary/10 rounded-sm shadow-md py-1 animate-fade-in">
                <button
                  onClick={() => handleLangSelect('tr')}
                  className={`w-full text-left px-4 py-2 text-xs font-sans font-medium tracking-wider hover:bg-navy-primary/5 transition-colors flex items-center gap-2 ${language === 'tr' ? 'text-navy-primary font-bold bg-navy-primary/5' : 'text-text-secondary'}`}
                >
                  <span>🇹🇷</span> Türkçe
                </button>
                <button
                  onClick={() => handleLangSelect('en')}
                  className={`w-full text-left px-4 py-2 text-xs font-sans font-medium tracking-wider hover:bg-navy-primary/5 transition-colors flex items-center gap-2 ${language === 'en' ? 'text-navy-primary font-bold bg-navy-primary/5' : 'text-text-secondary'}`}
                >
                  <span>🇬🇧</span> English
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle - Okuma Modu */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-xs font-sans font-semibold tracking-wider text-text-secondary hover:text-navy-primary transition-colors focus:outline-none cursor-pointer"
            aria-label="Okuma Modu Değiştir"
          >
            {theme === 'light' ? (
              <>
                <Moon size={14} />
                <span>{t('nav.nightMode')}</span>
              </>
            ) : (
              <>
                <Sun size={14} />
                <span>{t('nav.dayMode')}</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Hamburger Button & Theme Toggle & Language */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden shrink-0">
          {/* Language Selector for mobile (rotates between tr/en) */}
          <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="text-xs font-sans font-semibold tracking-wider text-text-secondary focus:outline-none"
            aria-label="Dili değiştir"
          >
            {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
          </button>

          <button
            onClick={toggleTheme}
            className="text-text-secondary focus:outline-none"
            aria-label="Okuma Modu Değiştir"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={toggleMobileMenu}
            className="text-text-primary focus:outline-none"
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`fixed top-0 right-0 w-[min(100vw,20rem)] sm:w-80 md:w-96 h-[100dvh] bg-bg-primary border-l border-navy-primary/10 shadow-lg p-6 sm:p-8 z-[60] transform transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex justify-end mb-8">
          <button onClick={toggleMobileMenu} className="text-text-primary">
            <X size={24} />
          </button>
        </div>

        <ul className="flex flex-col gap-6 list-none pl-0">
          <li>
            <Link
              href="/"
              onClick={(e) => handleLinkClick(e, 'home')}
              className={`block text-xs font-sans font-semibold tracking-widest uppercase transition-colors ${pathname === '/' && activeSection === 'home' ? 'text-navy-primary' : 'text-text-secondary'
                }`}
            >
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <Link
              href="/hakkimizda"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs font-sans font-semibold tracking-widest uppercase transition-colors ${pathname === '/hakkimizda' ? 'text-navy-primary' : 'text-text-secondary'
                }`}
            >
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <Link
              href="/faaliyet-alanlari"
              className={`block text-xs font-sans font-semibold tracking-widest uppercase transition-colors ${pathname === '/faaliyet-alanlari' ? 'text-navy-primary' : 'text-text-secondary'
                }`}
            >
              {t('nav.practice')}
            </Link>
          </li>
          <li>
            <Link
              href="/hukuk-notlari"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs font-sans font-semibold tracking-widest uppercase transition-colors ${pathname === '/hukuk-notlari' || pathname.startsWith('/hukuk-notlari/') ? 'text-navy-primary' : 'text-text-secondary'
                }`}
            >
              {t('nav.articles')}
            </Link>
          </li>
          <li>
            <Link
              href="/sozluk"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs font-sans font-semibold tracking-widest uppercase transition-colors ${pathname === '/sozluk' ? 'text-navy-primary' : 'text-text-secondary'
                }`}
            >
              {t('nav.sozluk')}
            </Link>
          </li>
          <li>
            <Link
              href="/iletisim"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs font-sans font-semibold tracking-widest uppercase transition-colors ${pathname === '/iletisim' ? 'text-navy-primary' : 'text-text-secondary'
                }`}
            >
              {t('nav.contact')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
