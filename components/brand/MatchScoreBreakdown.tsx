import React from 'react';
import { MatchScore } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Sparkles, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export interface MatchScoreBreakdownProps {
  match: MatchScore;
  creatorName?: string;
}

export const MatchScoreBreakdown: React.FC<MatchScoreBreakdownProps> = ({
  match,
  creatorName = 'Creator',
}) => {
  const { breakdown, overallScore, aiReasoning, explanation, recommendationVerdict } = match;

  const verdict = recommendationVerdict || (overallScore >= 80 ? 'Strong AI Match' : overallScore >= 60 ? 'Compatible Sector' : 'Low Compatibility');

  return (
    <Card className="space-y-6 bg-slate-900/90 border-slate-800">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
              AI Sector &amp; Skill Agent Analysis
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-extrabold text-white">Relevance &amp; Sector Compatibility</h3>
            <Badge
              variant={verdict === 'Strong AI Match' ? 'brand' : verdict === 'Compatible Sector' ? 'accent' : 'warning'}
              size="md"
            >
              {verdict}
            </Badge>
          </div>

          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Evaluated by the CreatorMatch AI Agent comparing sector domains (e.g. Clothing Brand ⟷ Fashion/Modeling Creator), verified lookbook skills, and demographic synergy.
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <ProgressRing score={overallScore} size={110} sublabel="Overall Score" />
        </div>
      </div>

      {/* Realistic Sector & Skill Criteria Breakdown */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          Multi-Factor Compatibility Analysis
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Sector Alignment */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Progress
              label="Sector & Domain Synergy (40% weight)"
              value={breakdown.sectorFitScore || breakdown.nicheMatch}
              showValue
              color={breakdown.sectorFitScore >= 80 ? 'brand' : breakdown.sectorFitScore >= 50 ? 'accent' : 'amber'}
            />
            <p className="text-[11px] text-slate-400">Direct alignment between brand product line and creator domain</p>
          </div>

          {/* 2. Deliverable Skill Fit */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Progress
              label="Deliverable Skill Match (25% weight)"
              value={breakdown.skillFitScore || breakdown.campaignFit}
              showValue
              color={breakdown.skillFitScore >= 80 ? 'emerald' : 'accent'}
            />
            <p className="text-[11px] text-slate-400">Demonstrated capability in required formats (lookbook, try-on, UGC)</p>
          </div>

          {/* 3. Audience Demographic Overlap */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Progress
              label="Audience Demographics (15% weight)"
              value={breakdown.audienceMatch}
              showValue
              color="brand"
            />
            <p className="text-[11px] text-slate-400">Follower gender split and target age cohort alignment</p>
          </div>

          {/* 4. Engagement Quality */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Progress
              label="Engagement Quality (10% weight)"
              value={breakdown.engagementQuality}
              showValue
              color="emerald"
            />
            <p className="text-[11px] text-slate-400">Audited comment authenticity &amp; interaction consistency</p>
          </div>

          {/* 5. Geographic & Language */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Progress
              label="Geographic & Language (5% weight)"
              value={breakdown.locationLanguageMatch}
              showValue
              color="amber"
            />
            <p className="text-[11px] text-slate-400">Target audience language fluency and local market presence</p>
          </div>

          {/* 6. Past Campaign Track Record */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <Progress
              label="Verified Track Record (5% weight)"
              value={breakdown.pastPerformance}
              showValue
              color="emerald"
            />
            <p className="text-[11px] text-slate-400">Delivered ROI and reliability across audited collaborations</p>
          </div>
        </div>
      </div>

      {/* AI Agent Reasoning & Sector Breakdown */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-900 to-pink-950/20 border border-brand-800/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-300">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>AI Agent Verdict: Compatibility Analysis for {creatorName}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {aiReasoning || explanation}
        </p>
      </div>

      {/* Compliance / Predictive Disclaimer */}
      <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          AI matching computes genuine sector synergy and content relevance. Scores are not artificially elevated—they reflect actual demographic and industry alignment.
        </span>
      </div>
    </Card>
  );
};
