'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Coins,
  Trophy,
  CheckCircle,
  TrendingUp,
  Flame,
  ArrowUpRight,
  Gift,
  Sparkles,
  History,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function CreatorCreditsPage() {
  const { creatorCredits, creditsHistory } = useApp();

  const creditTrendData = [
    { month: 'Jan', credits: 800 },
    { month: 'Feb', credits: 1100 },
    { month: 'Mar', credits: 1450 },
    { month: 'Apr', credits: 1800 },
    { month: 'May', credits: 2150 },
    { month: 'Jun', credits: creatorCredits },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Coins className="w-4 h-4" />
          <span>Reputation & Rewards Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Creator Credits Ledger
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Credits quantify creator deliverable reliability, meme wins, and authentic engagement quality.
        </p>
      </div>

      {/* Hero Balance Card (Section 31 requirement) */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-amber-800/40 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block">
              TOTAL CREATOR CREDITS
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white mt-1 flex items-baseline gap-2">
              {creatorCredits.toLocaleString()}
              <span className="text-sm font-semibold text-slate-400">Reputation Points</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Top 3% Creator Tier • Unlocks Premium Brand Deals & Instant Payouts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button size="md" variant="primary" leftIcon={<Gift className="w-4 h-4" />}>
              Redeem Brand Perks
            </Button>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Credits Accumulation Over Time
          </span>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={creditTrendData}>
                <defs>
                  <linearGradient id="credGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="credits" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#credGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* History Timeline List (Section 31 requirements) */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Credits Transaction History</h3>
          </div>
          <span className="text-xs text-slate-400">Total Records: {creditsHistory.length}</span>
        </div>

        <div className="space-y-3">
          {creditsHistory.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.description}</h4>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{item.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.badge && <Badge variant="accent" size="sm">{item.badge}</Badge>}
                <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                  +{item.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
