'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { LeaderboardTable } from '@/components/creator/LeaderboardTable';
import {
  Flame,
  PlusCircle,
  Trophy,
  Users,
  Coins,
  Clock,
  Sparkles,
  Share2,
  CheckCircle,
  Hash,
  Crown,
} from 'lucide-react';
import { Challenge } from '@/types';

export default function BrandChallengesPage() {
  const { challenges, challengeEntries, activeBrand, createChallenge, awardChallengeWinner } = useApp();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(challenges[0]?.id || '');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New challenge form state
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [theme, setTheme] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [description, setDescription] = useState('');
  const [firstPrize, setFirstPrize] = useState(10000);
  const [secondPrize, setSecondPrize] = useState(5000);
  const [thirdPrize, setThirdPrize] = useState(2500);

  const activeChallenge = challenges.find(c => c.id === selectedChallengeId) || challenges[0];
  const entries = activeChallenge ? challengeEntries[activeChallenge.id] || [] : [];

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChal: Challenge = {
      id: `chal-${Date.now()}`,
      brandId: activeBrand.id,
      brandName: activeBrand.name,
      brandLogo: activeBrand.logo,
      name,
      product: product || activeBrand.products[0]?.name || 'Glow Serum',
      description,
      theme: theme || 'Humor & Relatability',
      rules: [
        'Must feature product naturally or humorously in first 3 seconds',
        'Use official campaign hashtag in caption',
        'Content must be 100% original UGC meme or skit',
      ],
      hashtag: hashtag.startsWith('#') ? hashtag : `#${hashtag}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2025-07-15',
      submissionType: 'Short Video / Meme',
      prizePool: {
        first: Number(firstPrize),
        second: Number(secondPrize),
        third: Number(thirdPrize),
        totalDisplay: `₹${(Number(firstPrize) + Number(secondPrize) + Number(thirdPrize)).toLocaleString()}`,
      },
      creditsAward: {
        winner: 500,
        top10: 200,
        participation: 50,
      },
      participantsCount: 1,
      submissionsCount: 1,
      daysRemaining: 7,
      status: 'live',
    };

    createChallenge(newChal);
    setSelectedChallengeId(newChal.id);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Viral UGC & Meme Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Brand Meme & Creative Challenges
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Crowdsource high-engagement memes and authentic UGC with creator cash prizes and reputation credits.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Create Challenge
        </Button>
      </div>

      {/* Challenge Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map(chal => {
          const isSelected = chal.id === activeChallenge?.id;
          return (
            <Card
              key={chal.id}
              hover
              onClick={() => setSelectedChallengeId(chal.id)}
              className={`p-6 cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-slate-900 border-pink-500/80 shadow-lg shadow-pink-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" />
                  {chal.hashtag}
                </span>
                <Badge variant={chal.status === 'live' ? 'accent' : 'neutral'} size="sm">
                  {chal.status.toUpperCase()} • {chal.daysRemaining}d Left
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{chal.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4">{chal.description}</p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Prize Pool</span>
                  <span className="text-xs font-bold text-emerald-300">{chal.prizePool.totalDisplay}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Submissions</span>
                  <span className="text-xs font-bold text-white">{chal.submissionsCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Credits</span>
                  <span className="text-xs font-bold text-amber-300">+{chal.creditsAward.winner}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Challenge Detail & Live Leaderboard */}
      {activeChallenge && (
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-black text-white">{activeChallenge.name}</h3>
                <Badge variant="brand" size="sm">{activeChallenge.product}</Badge>
                <Badge variant="accent" size="sm">{activeChallenge.hashtag}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{activeChallenge.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/30 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Total Prize Pool</span>
              <span className="text-2xl font-black text-white">{activeChallenge.prizePool.totalDisplay}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                1st: ₹{activeChallenge.prizePool.first.toLocaleString()} • 2nd: ₹{activeChallenge.prizePool.second.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Rules & Creator Credits Rewards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Official Challenge Rules</span>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {activeChallenge.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Creator Credits Matrix</span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">1st Place</span>
                  <span className="text-sm font-bold text-amber-300">+{activeChallenge.creditsAward.winner} pts</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Top 10</span>
                  <span className="text-sm font-bold text-brand-300">+{activeChallenge.creditsAward.top10} pts</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Participate</span>
                  <span className="text-sm font-bold text-slate-300">+{activeChallenge.creditsAward.participation} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Entries & Leaderboard */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Live Challenge Leaderboard & Entries
                </h4>
                <p className="text-xs text-slate-400">
                  Ranked by AI Creative Quality Score, community votes, and organic engagement rate.
                </p>
              </div>

              {entries.length > 0 && !entries.some(e => e.isWinner) && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => awardChallengeWinner(activeChallenge.id, entries[0].id)}
                  leftIcon={<Crown className="w-4 h-4 text-amber-300" />}
                >
                  Award #1 as Winner (+500 Credits)
                </Button>
              )}
            </div>

            <LeaderboardTable entries={entries} />
          </div>
        </Card>
      )}

      {/* Create Challenge Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Launch a Creative Meme Challenge"
        description="Set up theme, hashtag, cash prizes, and Creator Credits to engage top viral creators."
      >
        <form onSubmit={handleCreateChallenge} className="space-y-4">
          <Input
            label="Challenge Name"
            placeholder="e.g. GlowRush Glow-Up Challenge"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Featured Product"
              placeholder="e.g. Glow Serum"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            <Input
              label="Official Hashtag"
              placeholder="#GlowRushGlowUp"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              required
            />
          </div>

          <Input
            label="Creative Theme"
            placeholder="e.g. Before vs After Humidity Test"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />

          <Textarea
            label="Challenge Description & Guidelines"
            placeholder="Explain the meme angle, format, and what makes a winning entry..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="1st Prize (₹)"
              type="number"
              value={firstPrize}
              onChange={(e) => setFirstPrize(Number(e.target.value))}
            />
            <Input
              label="2nd Prize (₹)"
              type="number"
              value={secondPrize}
              onChange={(e) => setSecondPrize(Number(e.target.value))}
            />
            <Input
              label="3rd Prize (₹)"
              type="number"
              value={thirdPrize}
              onChange={(e) => setThirdPrize(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Launch Challenge 🔥
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
