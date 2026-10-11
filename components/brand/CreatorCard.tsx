'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Creator, MatchScore } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Sparkles, MapPin, CheckCircle, Trophy, UserPlus, Clock, UserCheck, ChevronDown, ChevronUp, AlertCircle, Check, Bot } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AiMatchAgentModal } from '@/components/ai/AiMatchAgentModal';

export interface CreatorCardProps {
  creator: Creator;
  matchScore?: MatchScore;
  campaignId?: string;
  onInvite?: () => void;
  isInvited?: boolean;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  matchScore,
  campaignId = 'camp-glowrush-summer',
  onInvite,
  isInvited = false,
}) => {
  const { inviteCreatorToCampaign, getConnectionStatus, sendConnectionRequest, role, activeBrand } = useApp();
  const [showFactors, setShowFactors] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const handleInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInvite) {
      onInvite();
    } else {
      inviteCreatorToCampaign(campaignId, creator.id);
    }
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendConnectionRequest(creator.id);
  };

  const score = matchScore ? matchScore.overallScore : creator.creatorScore;
  const verdict = matchScore?.recommendationVerdict || (score >= 80 ? 'Strong Match' : score >= 60 ? 'Compatible' : 'Low Synergy');
  const connStatus = getConnectionStatus(creator.id);

  return (
    <Card hover className="flex flex-col justify-between group relative overflow-hidden bg-slate-900/90 border-slate-800 transition-all">
      <div>
        {/* Top Banner with AI Match Highlight & Realistic Verdict */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-700 text-white font-extrabold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>{score}% AI Fit</span>
            </div>
            <Badge
              variant={score >= 80 ? 'brand' : score >= 60 ? 'accent' : 'warning'}
              size="sm"
            >
              {verdict}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">{creator.engagementDisplay}</span>
            <span>Eng.</span>
          </div>
        </div>

        {/* Creator Info Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <Avatar src={creator.avatar} name={creator.name} size="lg" online={creator.verified} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-bold text-white truncate">{creator.name}</h4>
              {creator.verified && (
                <span title="Verified Creator">
                  <CheckCircle className="w-4 h-4 text-brand-400 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">{creator.handle}</p>

            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{creator.location}</span>
            </div>
          </div>
        </div>

        {/* Niches & Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {creator.niche.map(n => (
            <Badge key={n} variant="neutral" size="sm">
              {n}
            </Badge>
          ))}
        </div>

        {/* Sector & Deliverables Preview */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sector Fit</span>
            <span className="text-xs font-semibold text-brand-300">
              {matchScore?.sectorFitScore || score}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Wins</span>
            <span className="text-xs font-semibold text-amber-300 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" />
              {creator.campaignWins}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Followers</span>
            <span className="text-xs font-semibold text-slate-300">
              {creator.highestFollowersDisplay || creator.followersDisplay}
            </span>
          </div>
        </div>

        {/* Explainable AI Factors Drawer */}
        {showFactors && matchScore && (
          <div className="mb-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in text-xs">
            {/* AI Reasoning Summary */}
            <div className="text-[11px] text-slate-300 leading-relaxed bg-brand-950/30 p-2.5 rounded-lg border border-brand-900/40">
              <span className="font-bold text-brand-300 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-400" /> AI Compatibility Breakdown
              </span>
              {matchScore.aiReasoning || matchScore.explanation}
            </div>

            {/* Positive Factors */}
            {matchScore.positiveFactors && matchScore.positiveFactors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  ✓ Strengths & Alignments:
                </span>
                <div className="space-y-1">
                  {matchScore.positiveFactors.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/40 leading-snug"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negative / Gap Factors */}
            {matchScore.negativeFactors && matchScore.negativeFactors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  ⚠ Gap / Divergence Notes:
                </span>
                <div className="space-y-1">
                  {matchScore.negativeFactors.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5 text-[11px] text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/40 leading-snug"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Dimension Scores */}
            {matchScore.breakdown && (
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Sector Fit:</span>
                  <span className="font-bold text-brand-300">{matchScore.breakdown.sectorFitScore}%</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Audience:</span>
                  <span className="font-bold text-brand-300">{matchScore.breakdown.audienceMatch}%</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Skill/Format:</span>
                  <span className="font-bold text-brand-300">{matchScore.breakdown.skillFitScore}%</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Engagement:</span>
                  <span className="font-bold text-brand-300">{matchScore.breakdown.engagementQuality}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons: LinkedIn Connection System + Profile Link + Why Toggle */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Link href={`/brand/creators/${creator.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Inspect Profile
            </Button>
          </Link>

          {matchScore && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAgentModalOpen(true)}
                className="text-xs px-2.5 text-brand-300 hover:text-white hover:bg-slate-800 border border-slate-800 shrink-0"
                title="Consult AI Match Agent for Deep Analysis"
              >
                <Bot className="w-3.5 h-3.5 text-brand-400 mr-1" />
                <span>AI Agent</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFactors(!showFactors)}
                className="text-xs px-2.5 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 shrink-0"
                title="Explain Match Factors"
              >
                <span>{showFactors ? 'Hide' : 'Why?'}</span>
                {showFactors ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
              </Button>
            </>
          )}

          {/* Connection Button */}
          {connStatus === 'connected' ? (
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1 shrink-0">
              <UserCheck className="w-3.5 h-3.5" /> Connected
            </span>
          ) : connStatus === 'pending_sent' ? (
            <Button variant="secondary" size="sm" disabled className="text-xs shrink-0" leftIcon={<Clock className="w-3 h-3 text-amber-400" />}>
              Pending ⏳
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnect}
              className="text-xs shrink-0 hover:border-brand-500"
              leftIcon={<UserPlus className="w-3.5 h-3.5 text-brand-400" />}
            >
              Connect
            </Button>
          )}
        </div>

        <Button
          variant={isInvited ? 'secondary' : 'primary'}
          size="sm"
          className="w-full text-xs"
          onClick={handleInvite}
          disabled={isInvited}
        >
          {isInvited ? 'Invitation Sent ✓' : 'Invite to Campaign'}
        </Button>
      </div>

      {/* AI Match Agent Modal */}
      {isAgentModalOpen && matchScore && (
        <AiMatchAgentModal
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
          brand={activeBrand}
          creator={creator}
          matchScore={matchScore}
        />
      )}
    </Card>
  );
};
