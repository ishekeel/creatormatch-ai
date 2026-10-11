'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Building2,
  UserCheck,
  Flame,
  Coins,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const EcosystemFeatures: React.FC = () => {
  return (
    <div className="space-y-24 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* 1. For Brands Section */}
      <section id="for-brands" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Badge variant="brand" size="sm">Brand Experience</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Discover High-Relevance Creators in Seconds.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Stop scrolling through endless profiles. Input your campaign objective, product details, and target demographic—our AI will calculate multi-factor compatibility scores across 6 strict criteria.
          </p>

          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Multi-step campaign builder with automated creator requirements</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Instant AI quality evaluation on all submitted content & reels</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>End-to-end conversion funnel & creator ROI tracking</span>
            </li>
          </ul>

          <Link href="/brand/campaigns/new">
            <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create a Brand Campaign
            </Button>
          </Link>
        </div>

        {/* Visual Brand Card */}
        <Card className="p-6 bg-slate-900 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold text-white">GlowRush Beauty Campaign</span>
            </div>
            <span className="text-xs font-extrabold text-brand-400">94% AI Match</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Ananya Rao</p>
                <p className="text-[10px] text-slate-400">Beauty • 7.8% Engagement • Hyderabad</p>
              </div>
              <Badge variant="brand" size="sm">Invited ✓</Badge>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Rahul Varma</p>
                <p className="text-[10px] text-slate-400">Lifestyle • 6.2% Engagement • Bangalore</p>
              </div>
              <Badge variant="neutral" size="sm">88% Match</Badge>
            </div>
          </div>
        </Card>
      </section>

      {/* 2. For Creators Section */}
      <section id="for-creators" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Card className="p-6 bg-slate-900 border-slate-800 space-y-4 order-2 lg:order-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Creator Credits Ledger</span>
            </div>
            <span className="text-xs font-extrabold text-amber-400">2,450 Credits</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">1st Place Challenge Winner — Glow-Up</span>
              <span className="text-emerald-400 font-bold">+500 Credits</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Campaign Completed — Summer Glow</span>
              <span className="text-emerald-400 font-bold">+100 Credits</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">High Performance ROI Bonus</span>
              <span className="text-emerald-400 font-bold">+300 Credits</span>
            </div>
          </div>
        </Card>

        <div className="space-y-6 order-1 lg:order-2">
          <Badge variant="accent" size="sm">Creator Experience</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Get Matched With Brands That Value Your Craft.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            No more lowball offers or out-of-niche spam briefs. Receive opportunities matched precisely to your audience demographics, earn Creator Credits with each successful delivery, and unlock verified proof on your portfolio.
          </p>

          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>Instant AI match scores explaining why a campaign fits you</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>Real-time AI Creative Quality feedback (93/100) before publication</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>Gamified achievements: 🏆 Campaign Winner & 🔥 Creative Master</span>
            </li>
          </ul>

          <Link href="/creator/campaigns">
            <Button size="md" variant="accent" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Campaign Marketplace
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Creative & Meme Challenges Section */}
      <section id="challenges" className="p-8 sm:p-12 bg-gradient-to-br from-pink-950/30 via-slate-900 to-amber-950/20 border border-slate-800 rounded-3xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="warning" size="sm">Viral UGC Engine</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Open Meme & Creative Challenges
          </h2>
          <p className="text-sm text-slate-400">
            Brands sponsor open creative competitions with cash prize pools. Creators submit skits and memes evaluated by AI Creativity + community engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-950/80 border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Live Challenge
              </span>
              <span className="text-xs text-slate-400 font-semibold">4 Days Remaining</span>
            </div>
            <h4 className="text-lg font-bold text-white">GlowRush Glow-Up Challenge</h4>
            <p className="text-xs text-slate-400">#GlowRushChallenge • Morning transition humor & glow transformation</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-300">Prize Pool: <strong className="text-emerald-400">₹17,500</strong></span>
              <span className="text-slate-400">1,248 Creators Participated</span>
            </div>
          </Card>

          <Card className="bg-slate-950/80 border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Live Challenge
              </span>
              <span className="text-xs text-slate-400 font-semibold">11 Days Remaining</span>
            </div>
            <h4 className="text-lg font-bold text-white">StyleWear Drip Check Meme Battle</h4>
            <p className="text-xs text-slate-400">#DripCheckStyleWear • Streetwear vs Indian parents & monsoon styling</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-300">Prize Pool: <strong className="text-emerald-400">₹26,000</strong></span>
              <span className="text-slate-400">890 Creators Participated</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Analytics Section Preview */}
      <section id="analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Badge variant="brand" size="sm">Full-Funnel Attribution</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Real Analytics Beyond Likes and Comments.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Track the entire conversion progression from initial video impression through link clicks, product landing visits, and purchase revenue.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block font-semibold">Average Campaign ROI</span>
              <span className="text-xl font-bold text-emerald-400">4.8x</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block font-semibold">Total Verified Reach</span>
              <span className="text-xl font-bold text-brand-400">2.4M</span>
            </div>
          </div>

          <Link href="/brand/analytics">
            <Button size="md" variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Live Brand Analytics
            </Button>
          </Link>
        </div>

        <Card className="p-6 bg-slate-900 border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversion Funnel Breakdown</h4>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>Impressions</span>
              <span className="font-bold text-brand-400">420,000 (100%)</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>Engagement</span>
              <span className="font-bold text-indigo-400">32,800 (7.8%)</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>Link Clicks</span>
              <span className="font-bold text-pink-400">14,200 (43.3%)</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>Product Visits</span>
              <span className="font-bold text-amber-400">6,800 (47.8%)</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>Verified Conversions</span>
              <span className="font-bold text-emerald-400">1,840 (27.1%)</span>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. Final CTA */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-brand-900/60 via-purple-950/50 to-pink-900/60 border border-brand-500/30 rounded-3xl space-y-6 shadow-2xl">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto">
          Ready to experience AI-powered creator partnerships?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Launch your first campaign in 3 minutes or claim your verified creator media kit.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/roles">
            <Button size="lg" variant="primary">
              Launch Free Demo
            </Button>
          </Link>
          <Link href="/creator/dashboard">
            <Button size="lg" variant="outline">
              Continue as Creator
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
