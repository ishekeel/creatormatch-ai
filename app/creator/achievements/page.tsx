'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export default function CreatorAchievementsPage() {
  const { achievements } = useApp();

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Reputation Milestones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Achievements & Badges
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Unlock trophies to increase your platform Creator Score and attract enterprise brand sponsors.
          </p>
        </div>

        <Badge variant="brand" size="md">
          {unlockedCount} of {achievements.length} Unlocked
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(ach => {
          return (
            <Card
              key={ach.id}
              className={`p-6 transition-all border flex flex-col justify-between space-y-4 ${
                ach.unlocked
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 border-amber-500/40 shadow-md shadow-amber-500/5'
                  : 'bg-slate-900/50 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{ach.icon}</span>
                  {ach.unlocked ? (
                    <Badge variant="accent" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                      Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="sm" icon={<Lock className="w-3 h-3" />}>
                      Locked
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{ach.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Progress</span>
                  <span className="font-semibold text-white">
                    {ach.progress} / {ach.maxProgress}
                  </span>
                </div>
                <Progress
                  value={(ach.progress / ach.maxProgress) * 100}
                  color={ach.unlocked ? 'amber' : 'brand'}
                  size="sm"
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
