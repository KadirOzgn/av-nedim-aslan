"use client";

import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AISummaryButton() {
  const { language } = useLanguage();

  const getGeminiUrl = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const basePrompt = language === 'en'
      ? `Please summarize this legal text in general terms and extract the key points: ${currentUrl}`
      : `Lütfen şu hukuki metni genel hatlarıyla özetle ve önemli noktalarını çıkar: ${currentUrl}`;
    return `https://gemini.google.com/app?prompt=${encodeURIComponent(basePrompt)}`;
  };

  const labels = {
    title: language === 'en' ? "Summarize with AI" : "Yapay Zekâ ile Özetle",
    desc: language === 'en' 
      ? "Extract the outline and legal summary of the article in seconds using Gemini AI."
      : "Gemini AI kullanarak makalenin ana hatlarını ve hukuki özetini saniyeler içinde çıkarın.",
    btn: language === 'en' ? "Summarize with Gemini" : "Gemini ile Özetle",
    note: language === 'en'
      ? "* Note: This is an external Google Gemini service. Clicking the link will generate the summary on the external platform."
      : "* Not: Bu harici bir Google Gemini hizmetidir. Bağlantıya tıkladığınızda metnin özeti harici platformda oluşturulacaktır."
  };

  return (
    <div className="p-5 border border-navy-primary/10 bg-navy-bg/40 rounded-sm">
      <h4 className="font-sans font-semibold text-xs tracking-wider text-text-primary uppercase mb-2">
        {labels.title}
      </h4>
      <p className="text-[0.65rem] text-text-secondary leading-normal mb-4 font-light">
        {labels.desc}
      </p>
      
      <a 
        href={getGeminiUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 px-4 bg-navy-primary text-white hover:bg-navy-secondary font-sans font-semibold tracking-widest text-[0.65rem] uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 cursor-pointer text-center"
      >
        <Sparkles size={12} />
        {labels.btn}
      </a>
      
      <span className="text-[0.55rem] text-text-muted mt-2 block font-light leading-normal text-justify">
        {labels.note}
      </span>
    </div>
  );
}
