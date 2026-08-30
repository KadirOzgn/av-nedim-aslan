"use client";

import { useEffect, useState } from 'react';

export default function InfazIframe() {
  const [iframeHeight, setIframeHeight] = useState('1000px'); // Fallback height

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
        src="/araclar/infaz-hesaplama.html"
        className="w-full border-0 transition-all duration-300 ease-in-out"
        style={{ height: iframeHeight }}
        title="İnfaz Hesaplama Aracı"
      />
    </div>
  );
}
