'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import {
  Eye,
  Activity,
  Trophy,
  CheckCircle,
  ShoppingCart,
  DollarSign,
  Droplets,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export default function CreatorAnalyticsPage() {
  const { activeCreator } = useApp();

  const reachTimeData = [
    { month: 'Jan', reach: 180, engagement: 6.2 },
    { month: 'Feb', reach: 240, engagement: 6.8 },
    { month: 'Mar', reach: 410, engagement: 7.1 },
    { month: 'Apr', reach: 680, engagement: 7.4 },
    { month: 'May', reach: 950, engagement: 7.6 },
    { month: 'Jun', reach: 1400, engagement: 7.8 },
  ];

  const campaignPerfData = [
    { name: 'GlowRush Summer', reach: 420, conversions: 1840, roas: 5.4 },
    { name: 'StyleWear Drop', reach: 310, conversions: 1250, roas: 4.8 },
    { name: 'EcoBaby Diapers', reach: 280, conversions: 980, roas: 5.1 },
    { name: 'TechNova ANC', reach: 190, conversions: 620, roas: 4.2 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Creator Growth & Attribution</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Audience & Campaign Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detailed metrics quantifying deliverable reach, viewer engagement, conversions, and ecological footprint.
        </p>
      </div>

      {/* 6 Key Metrics (Section 34 requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Reach" value={activeCreator.totalReach} change="+16.4%" icon={<Eye className="w-3.5 h-3.5" />} />
        <StatCard title="Avg Engagement" value={activeCreator.engagementDisplay} change="+0.9%" icon={<Activity className="w-3.5 h-3.5" />} />
        <StatCard title="Completed" value={activeCreator.completedCampaigns} subtitle="100% On-time" icon={<CheckCircle className="w-3.5 h-3.5" />} />
        <StatCard title="Campaign Wins" value={activeCreator.campaignWins} subtitle="Trophies" icon={<Trophy className="w-3.5 h-3.5" />} />
        <StatCard title="Conversions" value="4,690" change="+22.8%" icon={<ShoppingCart className="w-3.5 h-3.5" />} />
        <StatCard title="Revenue" value="₹3.85L" change="+34.2%" icon={<DollarSign className="w-3.5 h-3.5" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Reach Over Time (Thousands)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reachTimeData}>
                <defs>
                  <linearGradient id="cReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="reach" stroke="#ec4899" strokeWidth={2.5} fill="url(#cReach)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Engagement Rate Trend (%)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reachTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[5, 9]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Campaign Performance Bar Chart */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Campaign Conversion Performance</h3>
            <p className="text-xs text-slate-400">Total attributed sales orders per campaign partner</p>
          </div>
          <Badge variant="brand" size="sm">Top Influencer</Badge>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignPerfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="conversions" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
