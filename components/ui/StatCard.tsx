import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'brand' | 'accent';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon,
  variant = 'default',
}) => {
  return (
    <Card hover className="relative overflow-hidden group">
      {/* Background glow on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            {value}
          </h4>
        </div>
        {icon && (
          <div className="p-3 bg-slate-800/90 text-brand-400 rounded-2xl border border-slate-700/50 shadow-sm group-hover:text-brand-300 group-hover:scale-105 transition-all">
            {icon}
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
          {change && (
            <span
              className={`flex items-center gap-0.5 font-bold ${
                isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};
