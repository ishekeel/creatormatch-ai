import React from 'react';
import { SubmissionAiBreakdown } from '@/types';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface AiCreativeScoreCardProps {
  score: number; // e.g. 93
  breakdown: SubmissionAiBreakdown;
  feedback: string;
}

export const AiCreativeScoreCard: React.FC<AiCreativeScoreCardProps> = ({
  score = 93,
  breakdown,
  feedback,
}) => {
  return (
    <Card className="bg-slate-900/90 border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Creative Evaluation</span>
          </div>
          <h3 className="text-xl font-extrabold text-white mt-1">Content Quality Analysis</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Automated evaluation of production value, storytelling originality, and product integration.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-tr from-pink-950/40 via-slate-900 to-brand-950/40 border border-pink-500/30">
          <div className="text-center">
            <span className="text-3xl font-black text-white tracking-tight">{score}</span>
            <span className="text-xs text-slate-400 font-bold"> / 100</span>
            <span className="block text-[10px] text-pink-300 font-bold uppercase tracking-wider mt-0.5">
              Overall Quality
            </span>
          </div>
        </div>
      </div>

      {/* 6-Part Evaluation Criteria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <Progress label="Creativity" value={breakdown.creativeQuality} showValue color="accent" size="sm" />
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <Progress label="Product Relevance" value={breakdown.contentRelevance} showValue color="brand" size="sm" />
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <Progress label="Originality" value={breakdown.originality} showValue color="amber" size="sm" />
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <Progress label="Brand Fit" value={breakdown.brandFit} showValue color="accent" size="sm" />
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <Progress label="Product Visibility" value={breakdown.productVisibility} showValue color="emerald" size="sm" />
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <Progress label="Brand Safety" value={breakdown.brandSafety} showValue color="emerald" size="sm" />
        </div>
      </div>

      {/* Narrative AI Feedback */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-900 to-pink-950/30 border border-brand-800/40 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>AI Feedback Summary</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {feedback}
        </p>
      </div>
    </Card>
  );
};
