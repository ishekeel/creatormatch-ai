import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name = 'User',
  size = 'md',
  online,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || name}
          className={`${sizeClasses[size]} rounded-full object-cover border border-slate-700/60 ring-2 ring-slate-800`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-brand-600 to-pink-500 text-white flex items-center justify-center font-medium border border-slate-700/60 ring-2 ring-slate-800`}
        >
          {getInitials(name)}
        </div>
      )}

      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-slate-900 ${
            online ? 'bg-emerald-500' : 'bg-slate-500'
          } ${size === 'lg' || size === 'xl' ? 'w-4 h-4' : 'w-2.5 h-2.5'}`}
        />
      )}
    </div>
  );
};
