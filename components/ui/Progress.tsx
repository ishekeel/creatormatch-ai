import React from 'react';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'brand' | 'accent' | 'emerald' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'brand',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colorClasses = {
    brand: 'bg-gradient-to-r from-brand-500 to-indigo-400',
    accent: 'bg-gradient-to-r from-pink-500 to-rose-400',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-400',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-slate-300">
          {label && <span className="font-medium">{label}</span>}
          {showValue && <span className="font-semibold text-slate-100">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export interface ProgressRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: 'brand' | 'accent' | 'emerald' | 'gradient';
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 110,
  strokeWidth = 10,
  label,
  sublabel,
  color = 'gradient',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color === 'gradient' ? 'url(#ringGradient)' : color === 'emerald' ? '#10b981' : '#6366f1'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-white tracking-tight">{score}%</span>
        {sublabel && <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{sublabel}</span>}
      </div>
      {label && <span className="text-xs text-slate-300 font-semibold mt-2">{label}</span>}
    </div>
  );
};
