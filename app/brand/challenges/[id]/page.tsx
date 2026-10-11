'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LeaderboardTable } from '@/components/creator/LeaderboardTable';
import {
  Flame,
  ArrowLeft,
  Coins,
  Trophy,
  Users,
  Video,
  Sparkles,
  Award,
} from 'lucide-react';

export default function BrandChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = (params?.id as string) || '';
  const { challenges, challengeEntries, awardChallengeWinner } = useApp();

  const challenge = challenges.find(c => c.id === challengeId) || challenges[0];
  const entries = challengeEntries[challenge.id] || [];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <button
        onClick={() => router.push('/brand/challenges')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </button>

      {/* Header Card */}
      <Card className="p-6 sm:p-8 bg-slate-900 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pink-400 flex items-center gap-1">
                <Flame className="w-4 h-4" /> Live Challenge
              </span>
              <Badge variant="warning" size="sm">{challenge.daysRemaining} Days Left</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">{challenge.name}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {challenge.hashtag} • Product: {challenge.product}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Prize Pool</span>
            <span className="text-2xl font-black text-emerald-400">{challenge.prizePool.totalDisplay}</span>
          </div>
        </div>

        {/* Challenge Brief & Rules */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Challenge Rules</h4>
          <ul className="space-y-1 text-xs text-slate-400">
            {challenge.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Live AI Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Live AI Creative Leaderboard
            </h3>
            <p className="text-xs text-slate-400">
              Ranked in real-time by AI Creative Evaluation Score (0-100) and verified community engagement.
            </p>
          </div>

          <Badge variant="brand" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            AI Scoring Active
          </Badge>
        </div>

        <LeaderboardTable
          entries={entries}
          challengeId={challenge.id}
          isBrandView={true}
          onAwardWinner={(entryId) => awardChallengeWinner(challenge.id, entryId)}
        />
      </div>
    </div>
  );
}
