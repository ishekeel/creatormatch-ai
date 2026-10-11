import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, CheckCircle2, TrendingDown, Users, Target, ShieldX, Sparkles } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="accent" size="sm">The Core Challenge</Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Why Followers Alone Aren’t Enough
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          The influencer marketing industry has been blinded by raw follower counts. Here is why vanity metrics fail both brands and creators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Old Way: Vanity Metrics */}
        <Card className="border-red-500/20 bg-slate-900/60 p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>The Broken Status Quo</span>
          </div>

          <h3 className="text-xl font-bold text-white">Vanity Follower Counts & Mismatched Deals</h3>

          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span><strong>Wasted Budgets:</strong> Brands pay massive fees to mega-creators whose audience has zero genuine interest in the product category.</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldX className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span><strong>Creator Burnout:</strong> Creators get flooded with irrelevant sponsorship briefs that alienate their organic followers.</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span><strong>Fake Engagement:</strong> Inflated counts mask low comment sentiment, bots, and disconnected demographic profiles.</span>
            </li>
          </ul>
        </Card>

        {/* The CreatorMatch AI Way */}
        <Card className="border-emerald-500/20 bg-slate-900/60 p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>The CreatorMatch AI Paradigm</span>
          </div>

          <h3 className="text-xl font-bold text-white">4-Pillar Precision Match Matrix</h3>

          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Right Brand</span>
              <span className="text-xs font-bold text-brand-400">GlowRush Beauty</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Right Creator</span>
              <span className="text-xs font-bold text-pink-400">Ananya (7.8% Engagement)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Right Audience</span>
              <span className="text-xs font-bold text-emerald-400">74% Female, Ages 18–30, Metro</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Right Campaign</span>
              <span className="text-xs font-bold text-amber-400">Dewy Summer Glow UGC Launch</span>
            </div>
          </div>

          <p className="text-xs text-emerald-300/90 font-medium">
            ✓ Delivers up to 4.8x higher verified conversion rates compared to follower-based selections.
          </p>
        </Card>
      </div>
    </section>
  );
};
