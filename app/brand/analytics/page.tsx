'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import {
  TrendingUp,
  Eye,
  Activity,
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  Droplets,
  Package,
  Layers,
  ArrowDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export default function BrandAnalyticsPage() {
  const { activeBrand } = useApp();

  const reachTimeData = [
    { month: 'Jan', reach: 350, engagement: 4.8 },
    { month: 'Feb', reach: 520, engagement: 5.2 },
    { month: 'Mar', reach: 780, engagement: 5.9 },
    { month: 'Apr', reach: 1100, engagement: 6.4 },
    { month: 'May', reach: 1650, engagement: 7.1 },
    { month: 'Jun', reach: 2400, engagement: 7.8 },
  ];

  const funnelData = [
    { stage: '1. Impressions', count: 2400000, percentage: '100%', color: '#6366f1' },
    { stage: '2. Engagements', count: 187200, percentage: '7.8%', color: '#8b5cf6' },
    { stage: '3. Clicks', count: 64500, percentage: '2.7%', color: '#ec4899' },
    { stage: '4. Product Visits', count: 32100, percentage: '1.3%', color: '#f43f5e' },
    { stage: '5. Conversions', count: 8420, percentage: '0.35%', color: '#10b981' },
  ];

  const creatorPerfData = [
    { name: 'Ananya Rao', reach: 420, roas: 5.4, conversions: 1840 },
    { name: 'Rahul Varma', reach: 380, roas: 4.8, conversions: 1420 },
    { name: 'Priya Sharma', reach: 290, roas: 4.6, conversions: 1120 },
    { name: 'Arjun Mehta', reach: 510, roas: 5.1, conversions: 2150 },
    { name: 'Sneha Kulkarni', reach: 310, roas: 4.2, conversions: 980 },
  ];

  const waterDiaperImpactData = [
    { period: 'Week 1', waterSaved: 1800, diapersDistributed: 1500 },
    { period: 'Week 2', waterSaved: 3600, diapersDistributed: 3200 },
    { period: 'Week 3', waterSaved: 7200, diapersDistributed: 6400 },
    { period: 'Week 4', waterSaved: 11400, diapersDistributed: 9800 },
    { period: 'Week 5', waterSaved: 14850, diapersDistributed: 12400 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Real-time Campaign Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Performance & Attribution Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Omnichannel creator ROI, conversion funnels, and verified ESG environmental footprint metrics.
        </p>
      </div>

      {/* 7 Key Metrics Bar (Section 17 requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard title="Total Reach" value={activeBrand.stats.totalReach} change="+18.4%" icon={<Eye className="w-3.5 h-3.5" />} />
        <StatCard title="Engagement" value={activeBrand.stats.avgEngagement} change="+1.2%" icon={<Activity className="w-3.5 h-3.5" />} />
        <StatCard title="Clicks" value="64.5K" change="+14.2%" icon={<MousePointerClick className="w-3.5 h-3.5" />} />
        <StatCard title="Product Visits" value="32.1K" change="+21.0%" icon={<Layers className="w-3.5 h-3.5" />} />
        <StatCard title="Conversions" value={activeBrand.stats.conversions.toLocaleString()} change="+24.1%" icon={<ShoppingCart className="w-3.5 h-3.5" />} />
        <StatCard title="Revenue" value="₹12.4L" change="+28.5%" icon={<DollarSign className="w-3.5 h-3.5" />} />
        <StatCard title="Campaign ROI" value={activeBrand.stats.roi} change="+0.6x" icon={<TrendingUp className="w-3.5 h-3.5" />} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reach Over Time */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reach Over Time</h3>
              <p className="text-xs text-slate-400">Total impressions in thousands (k)</p>
            </div>
            <Badge variant="brand" size="sm">+210% H1 Growth</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reachTimeData}>
                <defs>
                  <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="middle" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#reachGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Engagement Over Time */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Engagement Rate Trend</h3>
              <p className="text-xs text-slate-400">Verified organic comment & share density (%)</p>
            </div>
            <Badge variant="emerald" size="sm">7.8% Peak</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reachTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="middle" />
                <YAxis stroke="#64748b" domain={[4, 9]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Conversion Funnel (Section 17 specific requirement) */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Full Conversion Funnel</h3>
          <p className="text-xs text-slate-400">
            Impressions → Engagement → Clicks → Product Visits → Attributed Sales Conversions
          </p>
        </div>

        <div className="space-y-3">
          {funnelData.map((stage, idx) => {
            const widthPct = Math.max(100 - idx * 18, 22);
            return (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    {stage.stage}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{stage.count.toLocaleString()}</span>
                    <span className="text-slate-400 font-mono text-[11px] w-12 text-right">({stage.percentage})</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 rounded-xl h-4 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-lg transition-all duration-1000 ease-out"
                    style={{ width: `${widthPct}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Creator Performance Comparison & Environmental ESG Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creator Performance */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Top Creator Performance (Attributed Sales)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creatorPerfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="conversions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Water Emissions & Diaper Distribution Ledger Chart */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Water Emissions Saved & Diaper Supply Log
            </h3>
            <Badge variant="emerald" size="sm">14,850L Saved</Badge>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterDiaperImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="waterSaved" name="Water Saved (L)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Area type="monotone" dataKey="diapersDistributed" name="Diapers Distributed" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
