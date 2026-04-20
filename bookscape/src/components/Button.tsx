import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-medium text-sm backdrop-blur-md transition-all duration-200 disabled:opacity-50';
  const variantClasses =
    variant === 'primary'
      ? 'bg-white/10 hover:bg-white/16 active:bg-white/8 border border-white/10 hover:border-white/20 text-white/90'
      : 'bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/14 text-white/75';

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
