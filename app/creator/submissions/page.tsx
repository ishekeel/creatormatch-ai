'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import {
  UploadCloud,
  Sparkles,
  CheckCircle,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Film,
  Send,
  Eye,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Submission } from '@/types';

export default function CreatorSubmissionsPage() {
  const { campaigns, submissions, activeCreator, submitContent } = useApp();

  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');
  const [submissionType, setSubmissionType] = useState<'video' | 'image' | 'meme' | 'url'>('video');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
  );
  const [caption, setCaption] = useState(
    'Morning glow routine testing the new GlowRush Glow Serum under direct natural light! Truly weightless hydration.'
  );
  const [hashtags, setHashtags] = useState('#GlowRushSummer #GlassSkin #MorningRoutine');
  const [productMention, setProductMention] = useState('Glow Serum with Niacinamide');

  const [recentResult, setRecentResult] = useState<Submission | null>(submissions[0] || null);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newSub = submitContent({
      campaignId: selectedCampaign.id,
      campaignName: selectedCampaign.name,
      brandName: selectedCampaign.brandName,
      creatorId: activeCreator.id,
      creatorName: activeCreator.name,
      creatorAvatar: activeCreator.avatar,
      type: submissionType,
      mediaUrl,
      thumbnail: mediaUrl,
      caption,
      hashtags: hashtags.split(' ').map(h => h.trim()).filter(Boolean),
      productMention: productMention || selectedCampaign.product,
    });

    setRecentResult(newSub);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
          <UploadCloud className="w-4 h-4" />
          <span>Deliverable Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Content Deliverable Submission & AI Scoring
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload creative assets or URLs for real-time AI Creative Quality Evaluation before final brand review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submission Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Select Associated Campaign
                </label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.brandName} - {c.name} ({c.rewardDisplay})
                    </option>
                  ))}
                </select>
              </div>

              {/* Submission Type Buttons */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Asset Format
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['video', 'image', 'meme', 'url'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSubmissionType(t)}
                      className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all flex flex-col items-center gap-1 ${
                        submissionType === t
                          ? 'bg-pink-600 border-pink-400 text-white shadow-md shadow-pink-600/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t === 'video' && <Film className="w-4 h-4" />}
                      {t === 'image' && <ImageIcon className="w-4 h-4" />}
                      {t === 'meme' && <Sparkles className="w-4 h-4" />}
                      {t === 'url' && <LinkIcon className="w-4 h-4" />}
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Media Asset URL or Social Link (Reel / YouTube)"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://instagram.com/reel/... or image URL"
                required
              />

              <Input
                label="Product Integration Mention"
                value={productMention}
                onChange={(e) => setProductMention(e.target.value)}
                placeholder="e.g. Glow Serum with Niacinamide"
                required
              />

              <Textarea
                label="Post Caption & Copy"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                placeholder="Enter caption text as published..."
                required
              />

              <Input
                label="Official Campaign Hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#BrandName #Campaign"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Content for AI Evaluation 🚀
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Real-Time AI Creative Score Card (Section 27 requirements) */}
        <div className="lg:col-span-5">
          {recentResult ? (
            <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <h3 className="text-base font-bold text-white">AI Creative Evaluation</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">{recentResult.aiQualityScore} / 100</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">Grade: Excellent</span>
                </div>
              </div>

              {/* Asset Preview */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recentResult.mediaUrl}
                  alt={recentResult.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="emerald" size="sm">
                    {recentResult.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* 6 AI Quality Metrics Breakdown */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  AI Metric Breakdown
                </span>

                <div className="space-y-2 text-xs">
                  <Progress label="Creativity" value={recentResult.aiBreakdown.creativeQuality} showValue size="sm" color="brand" />
                  <Progress label="Product Relevance" value={recentResult.aiBreakdown.contentRelevance} showValue size="sm" color="brand" />
                  <Progress label="Originality" value={recentResult.aiBreakdown.originality} showValue size="sm" color="accent" />
                  <Progress label="Brand Fit" value={recentResult.aiBreakdown.brandFit} showValue size="sm" color="accent" />
                  <Progress label="Product Visibility" value={recentResult.aiBreakdown.productVisibility} showValue size="sm" color="emerald" />
                  <Progress label="Brand Safety" value={recentResult.aiBreakdown.brandSafety} showValue size="sm" color="emerald" />
                </div>
              </div>

              {/* AI Diagnostic Explanation */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">AI Diagnostic Summary:</strong>
                &quot;{recentResult.aiFeedback}&quot;
              </div>

              <div className="pt-2 text-center text-xs text-slate-400">
                Deliverable submitted to brand team for instant payout approval.
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 text-xs bg-slate-900/60 border-slate-800">
              Submit a deliverable on the left to see instant AI Creative Quality diagnostics.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
