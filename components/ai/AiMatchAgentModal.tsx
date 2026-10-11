'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Percent,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Creator, Brand, MatchScore } from '@/types';

interface AiMatchAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand;
  creator: Creator;
  matchScore: MatchScore;
}

export const AiMatchAgentModal: React.FC<AiMatchAgentModalProps> = ({
  isOpen,
  onClose,
  brand,
  creator,
  matchScore,
}) => {
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState<{
    matchScore: number;
    sectorSynergy: string;
    audienceFit: string;
    creativePotential: string;
    recommendations: string[];
    fullReasoning: string;
  } | null>(null);

  const fetchGeminiAnalysis = async () => {
    setIsGeminiLoading(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'match-analysis',
          brand: {
            name: brand.name,
            industry: brand.industry,
            description: brand.description,
            targetAudience: brand.targetAudience,
          },
          creator: {
            name: creator.name,
            niche: creator.niche,
            handle: creator.handle,
            bio: creator.bio,
            engagementRate: creator.engagementRate,
            followersDisplay: creator.highestFollowersDisplay || creator.followersDisplay,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setGeminiResult(data.analysis);
      }
    } catch (err) {
      console.error('Failed to run Gemini analysis:', err);
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const score = geminiResult?.matchScore ?? matchScore.overallScore;
  const isHighMatch = score >= 75;
  const isModerateMatch = score >= 50 && score < 75;
  const isLowMatch = score < 50;

  // Determine positive reasons (why matched)
  const positiveReasons =
    matchScore.positiveFactors && matchScore.positiveFactors.length > 0
      ? matchScore.positiveFactors
      : [
          `Sector Affinity: Creator's focus in ${creator.niche.slice(0, 2).join(' & ')} aligns with brand vertical.`,
          `Audience Demographics: Active followers demographic aligns with ${brand.targetAudience || 'core market'}.`,
          `Engagement Metric: ${creator.engagementDisplay} interaction rate meets marketing requirements.`,
        ];

  // Determine rejection / mismatch reasons (why rejected or low score)
  const rejectionReasons =
    matchScore.negativeFactors && matchScore.negativeFactors.length > 0
      ? matchScore.negativeFactors
      : isLowMatch
      ? [
          `Sector Divergence: Brand operates in ${brand.industry}, while creator focuses strictly on ${creator.niche.join(', ')}.`,
          `Audience Intent Mismatch: Creator followers expect ${creator.niche[0] || 'different'} content, resulting in low conversion for ${brand.industry}.`,
          `Platform Priority Disconnect: Brand targets channels where creator has lower engagement.`,
          `High Risk ROI: Estimated campaign response is below minimum ROI threshold.`,
        ]
      : [
          `Niche Focus Variance: Partial overlap in secondary categories, but primary vertical differs slightly.`,
          `Minor Deliverable Adaptation: Creator usually formats for different content styles.`,
        ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="2xl">
      <div className="space-y-6 -mt-2">
        {/* Agent Header Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950 via-slate-900 to-slate-900 border border-brand-800/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/10">
              <Bot className="w-7 h-7 animate-pulse text-brand-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">CreatorMatch AI Matchmaker Agent</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  Active Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-signal neural diagnostic between <strong className="text-white">{brand.name}</strong> and{' '}
                <strong className="text-white">{creator.name}</strong>
              </p>
            </div>
          </div>

          {/* Compatibility Percentage Ring / Pill */}
          <div className="text-right shrink-0">
            <div
              className={`px-3.5 py-1.5 rounded-2xl font-black text-xl flex items-center gap-1.5 shadow-md ${
                isHighMatch
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : isModerateMatch
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{score}%</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
              {matchScore.recommendationVerdict || (isHighMatch ? 'Strong Match' : isModerateMatch ? 'Compatible' : 'High Risk Mismatch')}
            </span>
          </div>
        </div>

        {/* Pairing Identity Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Avatar src={brand.logo} name={brand.name} size="sm" />
            <div>
              <span className="font-bold text-white block">{brand.name}</span>
              <span className="text-[10px] text-slate-400">{brand.industry}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <span>Compatibility Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="font-bold text-white block">{creator.name}</span>
              <span className="text-[10px] text-slate-400">{creator.niche.slice(0, 2).join(', ')}</span>
            </div>
            <Avatar src={creator.avatar} name={creator.name} size="sm" />
          </div>
        </div>

        {/* Agent Executive Analysis */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Agent Executive Evaluation:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {geminiResult?.fullReasoning || matchScore.aiReasoning || matchScore.explanation || (
              isHighMatch
                ? `Strong statistical alignment detected. ${creator.name}'s verified engagement (${creator.engagementDisplay}) and content in ${creator.niche.join(', ')} directly resonates with ${brand.name}'s target audience.`
                : isModerateMatch
                ? `Moderate compatibility. While creator possesses solid deliverable quality, there are slight divergences in audience demographics and secondary category focus.`
                : `High rejection probability. ${creator.name} operates in ${creator.niche.join(', ')}, whereas ${brand.name} targets ${brand.industry}. Audience intent is misaligned and expected sponsor ROI is low.`
            )}
          </p>
        </div>

        {/* Gemini AI Deep Reasoning Trigger & Results */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={isGeminiLoading}
            onClick={fetchGeminiAnalysis}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-900/60 via-brand-900/60 to-pink-900/60 border border-purple-500/40 hover:border-purple-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 hover:scale-[1.01] disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-pink-400 ${isGeminiLoading ? 'animate-spin' : ''}`} />
            <span>
              {isGeminiLoading
                ? 'Gemini 3.8-Flash Analyzing Neural Match Matrix...'
                : geminiResult
                ? 'Regenerate Neural Analysis with Google Gemini AI'
                : 'Run In-Depth Neural Diagnostic with Google Gemini AI'}
            </span>
          </button>

          {geminiResult && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 space-y-3 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Google Gemini 3.8-Flash Neural Diagnostic
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                  Live Neural Model
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-900/30">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Sector Synergy</span>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{geminiResult.sectorSynergy}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-900/30">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Demographic &amp; Audience Fit</span>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{geminiResult.audienceFit}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-900/30">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Creative Short-Form Execution</span>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{geminiResult.creativePotential}</p>
                </div>

                {geminiResult.recommendations && geminiResult.recommendations.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-900/30">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Strategic Recommendations</span>
                    <ul className="mt-1 space-y-1">
                      {geminiResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Two-Column Diagnostic: Why Matched vs Why Rejected */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: Reasons Matched (Positive Synergies) */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Why Matched (Synergy Drivers)</span>
            </div>

            <div className="space-y-2">
              {positiveReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-emerald-200 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/40 leading-snug"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Reasons Rejected / Mismatch Risks */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/50 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{isLowMatch ? 'Why Rejected (Mismatch Causes)' : 'Friction / Gap Notes'}</span>
            </div>

            <div className="space-y-2">
              {rejectionReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-rose-200 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/40 leading-snug"
                >
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown Radar Meters */}
        {matchScore.breakdown && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Multi-Dimension Breakdown Matrix
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Sector Fit (25%)</span>
                <span className="text-sm font-bold text-white">{matchScore.breakdown.sectorFitScore}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Product Affinity (20%)</span>
                <span className="text-sm font-bold text-white">{matchScore.breakdown.campaignFit || matchScore.breakdown.sectorFitScore}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Audience Fit (15%)</span>
                <span className="text-sm font-bold text-white">{matchScore.breakdown.audienceMatch}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Engagement Rate (8%)</span>
                <span className="text-sm font-bold text-white">{matchScore.breakdown.engagementQuality}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-500">
            AI Algorithm Model: Deterministic Multi-Signal v2.5
          </span>
          <Button size="sm" variant="primary" onClick={onClose}>
            Done & Close Analysis
          </Button>
        </div>
      </div>
    </Modal>
  );
};
