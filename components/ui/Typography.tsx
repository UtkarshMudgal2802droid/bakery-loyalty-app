import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'label' | 'caption';
  className?: string;
}

export function Typography({ children, variant = 'p', className = '' }: TypographyProps) {
  const baseStyle = 'text-editorial';
  
  switch (variant) {
    case 'h1':
      return <h1 className={`${baseStyle} text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-4 ${className}`}>{children}</h1>;
    case 'h2':
      return <h2 className={`${baseStyle} text-2xl md:text-3xl font-medium tracking-tight text-white mb-3 ${className}`}>{children}</h2>;
    case 'h3':
      return <h3 className={`${baseStyle} text-xl font-medium tracking-tight text-[var(--foreground)] mb-2 ${className}`}>{children}</h3>;
    case 'label':
      return <label className={`${baseStyle} block text-xs uppercase tracking-widest text-[var(--color-copper)] mb-2 opacity-90 ${className}`}>{children}</label>;
    case 'caption':
      return <p className={`${baseStyle} text-xs text-zinc-400 opacity-75 ${className}`}>{children}</p>;
    case 'p':
    default:
      return <p className={`${baseStyle} text-base md:text-lg text-[var(--foreground)] leading-relaxed mb-4 opacity-85 ${className}`}>{children}</p>;
  }
}
