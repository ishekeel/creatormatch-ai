import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-sm">CreatorMatch AI</span>
          <span className="text-slate-500">• Precision Creator & Brand Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-white transition-colors">Sign In / Register</Link>
          <Link href="/brand/dashboard" className="hover:text-white transition-colors">Brand Dashboard</Link>
          <Link href="/creator/dashboard" className="hover:text-white transition-colors">Creator Command Center</Link>
          <Link href="/creator/portfolio" className="hover:text-white transition-colors">Verified Portfolio</Link>
        </div>

        <p className="text-slate-500">
          Built for modern creators & data-driven brands.
        </p>
      </div>
    </footer>
  );
};
