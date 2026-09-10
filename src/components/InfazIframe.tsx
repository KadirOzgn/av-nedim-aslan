"use client";

import { useEffect, useState, useRef } from 'react';

export default function InfazIframe({ versionInfo, lang = 'tr' }: { versionInfo?: string | null, lang?: 'tr' | 'en' }) {
  const [iframeHeight, setIframeHeight] = useState('1000px'); // Fallback height
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    
    const updateIframeTheme = (dark: boolean) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'theme', theme: dark ? 'dark' : 'light' }, '*');
        
        if (versionInfo) {
          iframeRef.current.contentWindow.postMessage({ type: 'versionInfo', versionInfo }, '*');
        }
      }
    };

    // Delay initial message slightly to ensure iframe is ready
    setTimeout(() => updateIframeTheme(isDark), 500);

    // Setup an observer to watch for class changes on html
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          updateIframeTheme(isDarkNow);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Check if the message is from our iframe and contains height info
      if (e.data && e.data.type === 'resize' && e.data.height) {
        setIframeHeight(`${e.data.height}px`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full flex-grow bg-bg-primary">
      <iframe
        ref={iframeRef}
        src={lang === 'en' ? "/araclar/infaz-hesaplama-en.html" : "/araclar/infaz-hesaplama.html"}
        className="w-full border-0 transition-all duration-300 ease-in-out bg-transparent"
        style={{ height: iframeHeight }}
        title={lang === 'en' ? "Execution Calculator" : "İnfaz Hesaplama Aracı"}
      />
    </div>
  );
}
