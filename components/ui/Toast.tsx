'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-brand-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
        };

        const borderClasses = {
          success: 'border-emerald-500/30 bg-slate-900/95',
          info: 'border-brand-500/30 bg-slate-900/95',
          warning: 'border-amber-500/30 bg-slate-900/95',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md animate-scale-in transition-all ${borderClasses[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 pr-2">
              <h5 className="text-sm font-bold text-white leading-snug">{toast.title}</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
