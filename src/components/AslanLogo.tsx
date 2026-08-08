import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function AslanLogo({ className = '', size = 56 }: LogoProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        maskImage: "url('/aslan-logo.png')",
        WebkitMaskImage: "url('/aslan-logo.png')",
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        backgroundColor: 'currentColor',
        display: 'inline-block'
      }}
      className={className}
      aria-hidden="true"
    />
  );
}
