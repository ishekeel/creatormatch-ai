'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { LeaderboardTable } from '@/components/creator/LeaderboardTable';
import {
  ArrowLeft,
  Flame,
  Trophy,
  Coins,
  Send,
  UploadCloud,
  Hash,
  Sparkles,
  CheckCircle,
  Film,
  Image as ImageIcon,
} from 'lucide-react';

export default function CreatorChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = (params?.id as string) || '';
  const { challenges, challengeEntries, activeCreator, submitChallengeEntry } = useApp();

  const challenge = challenges.find(c => c.id === challengeId) || challenges[0];
  const entries = challenge ? challengeEntries[challenge.id] || [] : [];

  const [caption, setCaption] = useState('When you realize humidity is no match for this formula 😂');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80'
  );
  const [submissionType, setSubmissionType] = useState('Short Video Meme');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    submitChallengeEntry({
      challengeId: challenge.id,
      creatorId: activeCreator.id,
      creatorName: activeCreator.name,
      creatorAvatar: activeCreator.avatar,
      creatorHandle: activeCreator.handle,
      mediaUrl,
      caption,
      submissionType,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </button>

      {/* Hero Card */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-pink-400 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" /> {challenge.hashtag}
              </span>
              <Badge variant="accent" size="sm">{challenge.daysRemaining} Days Left</Badge>
              <Badge variant="brand" size="sm">{challenge.product}</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{challenge.name}</h2>
            <p className="text-xs text-slate-300 max-w-xl">{challenge.description}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/30 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Total Prize Pool</span>
            <span className="text-2xl font-black text-white">{challenge.prizePool.totalDisplay}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              1st: ₹{challenge.prizePool.first.toLocaleString()} • Winner +500 Credits
            </span>
          </div>
        </div>

        {/* Rules & Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white uppercase tracking-wider block">Theme & Guidelines</span>
            <p className="text-slate-300">
              Creative Theme: <strong className="text-pink-300">{challenge.theme}</strong>
            </p>
            <p className="text-slate-400">
              Format: Short vertical reels, hilarious memes, relatable sketches highlighting the product naturally.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 uppercase tracking-wider block">Creator Credits Award</span>
            <ul className="text-slate-300 space-y-1">
              <li>🏆 1st Place: <strong>+500 Credits</strong></li>
              <li>⭐ Top 10 Creators: <strong>+200 Credits</strong></li>
              <li>🎨 Every Participant: <strong>+50 Credits</strong> upon submission</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Entry Submission Form (Section 29) */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-bold text-white">Submit Your Challenge Entry</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Meme / Video Preview URL"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Paste public image or video reel URL"
              required
            />

            <Input
              label="Submission Format"
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value)}
              placeholder="e.g. Video Reel or Meme Graphic"
            />
          </div>

          <Textarea
            label="Meme Caption & Punchline"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
            placeholder="Write funny caption or script outline..."
            required
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Submitting awards instant +50 Creator Credits!
            </span>
            <Button type="submit" variant="accent" rightIcon={<Send className="w-4 h-4" />}>
              Submit Entry to Leaderboard 🔥
            </Button>
          </div>
        </form>
      </Card>

      {/* Live Challenge Leaderboard (Section 30) */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Live Viral Leaderboard
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked continuously by AI Creative Score, community votes, and verified engagement depth.
          </p>
        </div>

        <LeaderboardTable entries={entries} />
      </Card>
    </div>
  );
}
