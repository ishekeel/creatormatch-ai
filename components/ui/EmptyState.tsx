import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 ${className}`}
    >
      {icon && (
        <div className="p-4 bg-slate-800/80 text-brand-400 rounded-3xl mb-4 border border-slate-700/50">
          {icon}
        </div>
      )}
      <h4 className="text-lg font-bold text-white tracking-tight">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mt-1.5">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm" className="mt-5">
          {actionText}
        </Button>
      )}
    </div>
  );
};
