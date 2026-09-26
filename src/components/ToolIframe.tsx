"use client";

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ToolIframe({ versionInfo, toolSlug }: { versionInfo?: string | null, toolSlug: string }) {
  const [iframeHeight, setIframeHeight] = useState('1000px'); // Fallback height
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { language } = useLanguage();

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

    // Send theme on iframe load + retries for reliability
    const iframe = iframeRef.current;
    const sendInitialTheme = () => {
      const currentDark = document.documentElement.classList.contains('dark');
      updateIframeTheme(currentDark);
      // Retry a few times for slow-loading iframes
      setTimeout(() => updateIframeTheme(currentDark), 300);
      setTimeout(() => updateIframeTheme(currentDark), 800);
      setTimeout(() => updateIframeTheme(currentDark), 1500);
    };
    
    if (iframe) {
      iframe.addEventListener('load', sendInitialTheme);
    }
    // Also send after a delay as fallback
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

    return () => {
      observer.disconnect();
      if (iframe) {
        iframe.removeEventListener('load', sendInitialTheme);
      }
    };
  }, [versionInfo, toolSlug]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Check if the message is from our iframe and contains height info
      if (e.data && e.data.type === 'resize' && e.data.height) {
        setIframeHeight(`${e.data.height}px`);
      }
      if (e.data && e.data.type === 'print') {
        window.print();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const vQuery = versionInfo ? `&v=${encodeURIComponent(versionInfo)}` : '';
  
  // infaz-hesaplama is in /araclar/, others are in /tools/
  const isInfaz = toolSlug === 'infaz-hesaplama' || toolSlug === 'infaz-hesaplama-en';
  let path = `/tools/${toolSlug}.html?embed=1${vQuery}&v=1.3`;
  
  if (isInfaz) {
    path = `/araclar/${language === 'en' ? 'infaz-hesaplama-en.html' : 'infaz-hesaplama.html'}?embed=1${vQuery}&v=1.3`;
  }

  const handleIframeLoad = () => {
    const currentDark = document.documentElement.classList.contains('dark');
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'theme', theme: currentDark ? 'dark' : 'light' }, '*');
      if (versionInfo) {
        iframeRef.current.contentWindow.postMessage({ type: 'versionInfo', versionInfo }, '*');
      }
    }
  };

  return (
    <div className="w-full flex-grow bg-bg-primary flex flex-col">
      {language !== 'tr' && !isInfaz && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 m-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                This legal calculator operates exclusively in Turkish as it strictly relies on Turkish Law (Turkish Civil Code, Labor Law, etc.). Translating legal terminology automatically may result in inaccurate calculations.
              </p>
            </div>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={path}
        onLoad={handleIframeLoad}
        className="w-full border-0 transition-all duration-300 ease-in-out bg-transparent flex-grow"
        style={{ height: iframeHeight }}
        title={`${toolSlug} Aracı`}
      />
    </div>
  );
}
