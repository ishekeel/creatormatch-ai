import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:border-slate-700 hover:shadow-xl hover:-translate-y-0.5' : ''
      } ${glow ? 'shadow-lg shadow-brand-500/10 border-brand-500/30' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
