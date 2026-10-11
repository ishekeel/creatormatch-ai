import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'accent' | 'success' | 'emerald' | 'warning' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  const variantClasses = {
    brand: 'bg-brand-500/10 text-brand-300 border border-brand-500/20',
    accent: 'bg-pink-500/10 text-pink-300 border border-pink-500/20',
    success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
};
