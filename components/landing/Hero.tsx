'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Building2,
  Megaphone,
  Cpu,
  UserCheck,
  Video,
  BarChart3,
  Award,
  ChevronDown,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const [activeConceptIndex, setActiveConceptIndex] = useState(2);

  const conceptStages = [
    { label: 'Brand', desc: 'GlowRush Beauty', icon: Building2, color: 'text-brand-400 bg-brand-500/10 border-brand-500/20' },
    { label: 'Campaign', desc: 'Summer Glow Serum', icon: Megaphone, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { label: 'AI Matching', desc: '94% Demographic Fit', icon: Cpu, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
    { label: 'Creator', desc: 'Ananya (Beauty Specialist)', icon: UserCheck, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { label: 'Content', desc: '4K Dewy Morning Routine', icon: Video, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Performance', desc: '420K Reach • 4.8x ROI', icon: BarChart3, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Reputation', desc: '+500 Credits • Verified Win', icon: Award, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  ];

  return (
    <section id="hero" className="relative pt-12 pb-20 md:py-24 px-4 sm:px-8 overflow-hidden">
      {/* Background radial gradient halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-600/20 via-pink-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold shadow-inner">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Don&apos;t choose creators by followers alone. Choose by relevance.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Connect the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-pink-400">
            Right Brand
          </span>{' '}
          with the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
            Right Creator
          </span>
          .
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          AI-powered creator discovery, campaigns and creative challenges built around true audience
          relevance, engagement quality, and proven performance—not vanity follower counts.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <a href="#get-started">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Find Your Match
            </Button>
          </a>

          <a href="#how-it-works">
            <Button size="lg" variant="outline">
              Explore How It Works
            </Button>
          </a>
        </div>

        {/* Interactive Hero Visual: End-to-End Matching Pipeline */}
        <div className="pt-16 max-w-5xl mx-auto">
          <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
              <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                The CreatorMatch AI Continuum
              </span>
              <span>Interactive Pipeline Architecture</span>
            </div>

            {/* Pipeline flowchart nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {conceptStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isSelected = activeConceptIndex === idx;

                return (
                  <div
                    key={stage.label}
                    onClick={() => setActiveConceptIndex(idx)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-brand-500 shadow-lg scale-105'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center mb-2 border ${stage.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white block">{stage.label}</span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">{stage.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Active stage summary */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div>
                <Badge variant="brand" size="sm" className="mb-1.5">
                  Stage {activeConceptIndex + 1}: {conceptStages[activeConceptIndex].label}
                </Badge>
                <p className="text-sm font-semibold text-white">
                  {activeConceptIndex === 2
                    ? 'AI 6-Factor Matching: Evaluating demographic overlap, engagement authenticity, and past ROI.'
                    : activeConceptIndex === 6
                    ? 'Reputation & Creator Credits: High-performing submissions earn permanent verified proof on portfolio.'
                    : `Connecting verified ${conceptStages[activeConceptIndex].label.toLowerCase()} data directly with campaign objectives.`}
                </p>
              </div>

              <Link href="/brand/dashboard">
                <Button size="sm" variant="outline" className="whitespace-nowrap">
                  Test in Sandbox
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
