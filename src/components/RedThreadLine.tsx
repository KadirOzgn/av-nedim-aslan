"use client";

import { useEffect, useState } from 'react';

export default function RedThreadLine() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial call
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full pointer-events-none z-0 hidden md:block">
      {/* Background track line */}
      <div className="w-full h-full bg-burgundy-primary/5"></div>
      
      {/* Scroll-animated filled line */}
      <div 
        className="absolute top-0 left-0 w-full bg-burgundy-primary transition-all duration-75 ease-out"
        style={{ height: `${scrollProgress}%` }}
      ></div>
    </div>
  );
}
