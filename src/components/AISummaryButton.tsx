"use client";

import { useState } from 'react';
import { Sparkles, MessageSquareCode } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AISummaryButtonProps {
  content: string;
  title: string;
}

export default function AISummaryButton({ content, title }: AISummaryButtonProps) {
  const { language } = useLanguage();
  const [copiedPlatform, setCopiedPlatform] = useState<'gemini' | 'chatgpt' | null>(null);

  const copyFallback = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleSummary = (platform: 'gemini' | 'chatgpt') => {
    const basePrompt = language === 'en'
      ? `Please summarize this legal article in general terms and extract the key points:\n\nTitle: ${title}\n\nContent:\n${content}`
      : `Lütfen şu hukuki makaleyi genel hatlarıyla özetle ve önemli noktalarını çıkar:\n\nBaşlık: ${title}\n\nİçerik:\n${content}`;

    const performCopy = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(basePrompt)
          .then(() => {
            setCopiedPlatform(platform);
            setTimeout(() => setCopiedPlatform(null), 3000);
          })
          .catch((err) => {
            console.error("Clipboard API failed, using fallback:", err);
            if (copyFallback(basePrompt)) {
              setCopiedPlatform(platform);
              setTimeout(() => setCopiedPlatform(null), 3000);
            }
          });
      } else {
        if (copyFallback(basePrompt)) {
          setCopiedPlatform(platform);
          setTimeout(() => setCopiedPlatform(null), 3000);
        }
      }
    };

    // Run copy block
    performCopy();

    // Synchronous redirect to bypass browser popup blockers (especially Safari/iOS)
    const url = platform === 'gemini'
      ? 'https://gemini.google.com/app'
      : 'https://chatgpt.com';

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const labels = {
    title: language === 'en' ? "Summarize with AI" : "Yapay Zekâ ile Özetle",
    desc: language === 'en' 
      ? "Select an AI service to summarize the article. The text and prompt will be copied to your clipboard automatically."
      : "Makaleyi özetlemek için bir yapay zekâ servisi seçin. Metin ve talimat otomatik olarak panonuza kopyalanacaktır.",
    geminiBtn: language === 'en' 
      ? (copiedPlatform === 'gemini' ? "Copied! Opening Gemini..." : "Summarize with Gemini")
      : (copiedPlatform === 'gemini' ? "Kopyalandı! Gemini Açılıyor..." : "Gemini ile Özetle"),
    chatgptBtn: language === 'en'
      ? (copiedPlatform === 'chatgpt' ? "Copied! Opening ChatGPT..." : "Summarize with ChatGPT")
      : (copiedPlatform === 'chatgpt' ? "Kopyalandı! ChatGPT Açılıyor..." : "ChatGPT ile Özetle"),
    note: language === 'en'
      ? "* Note: Clicking a button copies the text and instructions to your clipboard. Paste (Cmd+V / Ctrl+V) the text into the chat window of the selected platform."
      : "* Not: Butona tıkladığınızda metin ve özetleme talimatı panonuza kopyalanır. Açılan yapay zekâ penceresinde yapıştır (Cmd+V / Ctrl+V) yaparak özeti saniyeler içinde alabilirsiniz."
  };

  return (
    <div className="p-5 border border-navy-primary/10 bg-navy-bg/40 rounded-sm">
      <h4 className="font-sans font-semibold text-xs tracking-wider text-text-primary uppercase mb-2 flex items-center gap-1.5">
        <Sparkles size={13} className="text-navy-primary animate-pulse" />
        {labels.title}
      </h4>
      <p className="text-[0.65rem] text-text-secondary leading-normal mb-4 font-light">
        {labels.desc}
      </p>
      
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => handleSummary('gemini')}
          className="w-full py-2.5 px-4 bg-navy-primary hover:bg-navy-secondary text-white font-sans font-semibold tracking-widest text-[0.65rem] uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 cursor-pointer text-center border-none"
        >
          <Sparkles size={12} />
          {labels.geminiBtn}
        </button>

        <button 
          onClick={() => handleSummary('chatgpt')}
          className="w-full py-2.5 px-4 border border-navy-primary/20 hover:border-navy-primary bg-transparent text-text-primary hover:bg-navy-primary/5 font-sans font-semibold tracking-widest text-[0.65rem] uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <MessageSquareCode size={12} className="text-navy-primary" />
          {labels.chatgptBtn}
        </button>
      </div>
      
      <span className="text-[0.55rem] text-text-muted mt-3 block font-light leading-normal text-justify">
        {labels.note}
      </span>
    </div>
  );
}
