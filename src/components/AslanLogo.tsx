import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function AslanLogo({ className = '', size }: LogoProps) {
  const style: React.CSSProperties = {
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
  };

  if (size !== undefined) {
    style.width = size;
    style.height = size;
  }

  return (
    <div
      style={style}
      className={className}
      aria-hidden="true"
    />
  );
}
