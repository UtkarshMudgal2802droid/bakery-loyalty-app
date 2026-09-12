import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'panel' | 'card';
}

export function BentoCard({ children, className = '', variant = 'card' }: BentoCardProps) {
  const baseClass = variant === 'panel' ? 'glass-panel' : 'glass-card';
  return (
    <div className={`${baseClass} p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}
