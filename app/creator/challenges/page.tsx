'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Flame,
  Trophy,
  Coins,
  Clock,
  Hash,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function CreatorChallengesDiscoveryPage() {
  const { challenges } = useApp();

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-4 h-4" />
          <span>Viral UGC Arena</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Live Meme & Creative Challenges
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Create viral humor and original UGC videos. Win cash prizes and earn reputation Creator Credits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map(chal => (
          <Card
            key={chal.id}
            hover
            className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-pink-400 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  {chal.hashtag}
                </span>
                <Badge variant="accent" size="sm">
                  {chal.daysRemaining} Days Left 🔥
                </Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                  {chal.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {chal.description}
                </p>
              </div>

              {/* Challenge Stats Snapshot (Section 28 requirements) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Prize Pool</span>
                  <span className="text-xs font-bold text-emerald-300">{chal.prizePool.totalDisplay}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Participants</span>
                  <span className="text-xs font-bold text-white">{chal.participantsCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Submissions</span>
                  <span className="text-xs font-bold text-white">{chal.submissionsCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Credits</span>
                  <span className="text-xs font-bold text-amber-300">+{chal.creditsAward.winner}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href={`/creator/challenges/${chal.id}`} className="block">
                <Button variant="accent" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Participate & View Leaderboard
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
