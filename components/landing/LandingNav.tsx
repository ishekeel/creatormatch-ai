'use client';

import React from 'react';
import Link from 'next/link';
import { Handshake, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const LandingNav: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Handshake className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight">
            CreatorMatch <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-pink-400">AI</span>
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#for-brands" className="hover:text-white transition-colors">For Brands</a>
          <a href="#for-creators" className="hover:text-white transition-colors">For Creators</a>
          <a href="#challenges" className="hover:text-white transition-colors">Challenges</a>
          <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In / Register
            </Button>
          </Link>
          <a href="#get-started">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Get Started
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};
