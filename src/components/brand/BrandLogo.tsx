import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'gold';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'light',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-7xl md:text-8xl',
  };

  const subtitleSizes = {
    sm: 'text-sm -mt-2',
    md: 'text-lg -mt-3 md:-mt-4',
    lg: 'text-2xl -mt-4 md:-mt-6',
    xl: 'text-3xl md:text-4xl -mt-6 md:-mt-8',
  };

  const textColors = {
    light: 'text-[#171717]',
    dark: 'text-[#111111]',
    gold: 'text-[#B08D57]',
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <h1
        className={`font-editorial-serif font-bold tracking-[0.24em] leading-none ${sizeClasses[size]} ${textColors[variant]}`}
      >
        PRESTIGE
      </h1>
      <span
        className={`font-functional text-[#B08D57] tracking-[0.2em] uppercase self-end pr-2 font-semibold ${subtitleSizes[size]}`}
      >
        Moda de lujo
      </span>
    </div>
  );
};
