'use client';

import React from 'react';
import { ChallengeEntry } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trophy, Sparkles, Heart, Eye, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export interface LeaderboardTableProps {
  entries: ChallengeEntry[];
  challengeId?: string;
  isBrandView?: boolean;
  onAwardWinner?: (entryId: string) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  challengeId,
  isBrandView = false,
  onAwardWinner,
}) => {
  const { activeCreator, awardChallengeWinner } = useApp();

  const handleAward = (entryId: string) => {
    const targetChallengeId = challengeId || entries[0]?.challengeId || 'chal-glowrush-glowup';
    if (onAwardWinner) {
      onAwardWinner(entryId);
    } else {
      awardChallengeWinner(targetChallengeId, entryId);
    }
  };

  const sortedEntries = [...entries].sort((a, b) => b.aiScore - a.aiScore);

  return (
    <div className="space-y-4">
      {/* Top 3 Podium (Visual) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {sortedEntries.slice(0, 3).map((entry, index) => {
          const podiumPositions = [
            { pos: 1, label: '1st Place', color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300', icon: '🥇' },
            { pos: 2, label: '2nd Place', color: 'from-slate-400/20 to-slate-500/10 border-slate-400/40 text-slate-300', icon: '🥈' },
            { pos: 3, label: '3rd Place', color: 'from-amber-700/20 to-yellow-800/10 border-amber-700/40 text-amber-400', icon: '🥉' },
          ];
          const pod = podiumPositions[index];

          const isCurrentCreator = entry.creatorId === activeCreator.id;

          return (
            <Card
              key={entry.id}
              className={`p-4 bg-gradient-to-b ${pod.color} border text-center relative overflow-hidden ${
                isCurrentCreator ? 'ring-2 ring-pink-500 shadow-xl' : ''
              }`}
            >
              {isCurrentCreator && (
                <div className="absolute top-2 right-2">
                  <Badge variant="accent" size="sm">You</Badge>
                </div>
              )}

              <span className="text-2xl mb-1 block">{pod.icon}</span>
              <Avatar src={entry.creatorAvatar} name={entry.creatorName} size="lg" className="mx-auto my-2" />
              <h5 className="text-sm font-bold text-white truncate">{entry.creatorName}</h5>
              <p className="text-xs text-slate-400 truncate mb-2">{entry.creatorHandle}</p>

              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="font-extrabold text-white bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-700">
                  {entry.aiScore} AI Score
                </span>
                <span className="text-pink-400 font-semibold">{entry.engagement}% Eng</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Complete Table List */}
      <Card className="p-0 overflow-hidden bg-slate-900/90 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Creator</th>
                <th className="py-3.5 px-4">AI Score</th>
                <th className="py-3.5 px-4">Community Votes</th>
                <th className="py-3.5 px-4">Engagement</th>
                <th className="py-3.5 px-4">Preview</th>
                {isBrandView && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedEntries.map((entry, idx) => {
                const rank = idx + 1;
                const isCurrentCreator = entry.creatorId === activeCreator.id;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isCurrentCreator
                        ? 'bg-pink-950/20 hover:bg-pink-950/30'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-extrabold text-sm">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          rank === 1
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-950 font-bold'
                            : rank === 3
                            ? 'bg-amber-700 text-white font-bold'
                            : 'text-slate-400 bg-slate-800'
                        }`}
                      >
                        #{rank}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={entry.creatorAvatar} name={entry.creatorName} size="sm" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{entry.creatorName}</span>
                            {isCurrentCreator && <Badge variant="accent" size="sm">You</Badge>}
                            {entry.isWinner && <Badge variant="warning" size="sm">Winner 🏆</Badge>}
                          </div>
                          <p className="text-[11px] text-slate-400">{entry.creatorHandle}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-300 font-extrabold text-xs">
                        {entry.aiScore} / 100
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-medium">
                      <span className="flex items-center gap-1 text-pink-400">
                        <Heart className="w-3.5 h-3.5" />
                        {entry.votes.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-emerald-400">
                      {entry.engagement}%
                    </td>

                    <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate">
                      &quot;{entry.caption}&quot;
                    </td>

                    {isBrandView && (
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant={entry.isWinner ? 'secondary' : 'accent'}
                          size="sm"
                          disabled={entry.isWinner}
                          onClick={() => handleAward(entry.id)}
                          leftIcon={<Award className="w-3.5 h-3.5" />}
                        >
                          {entry.isWinner ? 'Awarded 🏆' : 'Award 1st Place'}
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
