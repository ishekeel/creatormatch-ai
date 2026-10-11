'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Tag,
  Calendar,
} from 'lucide-react';
import { Submission } from '@/types';

export default function BrandSubmissionsPage() {
  const { submissions, approveSubmission, requestChangesSubmission } = useApp();
  const [filter, setFilter] = useState<'all' | 'submitted' | 'approved' | 'changes_requested'>('all');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(submissions[0] || null);

  const filtered = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
          <FileCheck className="w-4 h-4" />
          <span>Quality Assurance & Deliverable Review</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Content Submissions Review
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Evaluate creator deliverables with automated AI Creative Evaluation, brand safety audits, and 1-click approvals.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
        {(['all', 'submitted', 'approved', 'changes_requested'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.replace('_', ' ')} ({tab === 'all' ? submissions.length : submissions.filter(s => s.status === tab).length})
          </button>
        ))}
      </div>

      {/* Submissions List & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 text-xs bg-slate-900/60 border-slate-800">
              No submissions found for this filter.
            </Card>
          ) : (
            filtered.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <Card
                  key={sub.id}
                  hover
                  onClick={() => setSelectedSub(sub)}
                  className={`p-4 cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-brand-500 shadow-md shadow-brand-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.thumbnail}
                      alt={sub.caption}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">{sub.creatorName}</span>
                        <Badge
                          variant={
                            sub.status === 'approved'
                              ? 'emerald'
                              : sub.status === 'changes_requested'
                              ? 'warning'
                              : 'brand'
                          }
                          size="sm"
                        >
                          {sub.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1">&quot;{sub.caption}&quot;</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>{sub.campaignName}</span>
                        <span className="font-bold text-brand-300">AI {sub.aiQualityScore}/100</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Right Detail / AI Evaluation Card */}
        <div className="lg:col-span-7">
          {selectedSub ? (
            <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
              {/* Creator & Status Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Avatar src={selectedSub.creatorAvatar} name={selectedSub.creatorName} size="lg" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedSub.creatorName}</h3>
                    <p className="text-xs text-slate-400">
                      Campaign: <strong className="text-white">{selectedSub.campaignName}</strong> • {selectedSub.submissionDate}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    selectedSub.status === 'approved'
                      ? 'emerald'
                      : selectedSub.status === 'changes_requested'
                      ? 'warning'
                      : 'brand'
                  }
                  size="md"
                >
                  Status: {selectedSub.status.toUpperCase()}
                </Badge>
              </div>

              {/* Media Preview & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video sm:aspect-square flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedSub.mediaUrl}
                    alt={selectedSub.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] text-white font-medium flex items-center gap-1">
                    <span>4K 60fps Reel Preview</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Caption & Copy</span>
                  <p className="text-slate-200 leading-relaxed italic">
                    &quot;{selectedSub.caption}&quot;
                  </p>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Product Mentioned</span>
                    <span className="font-semibold text-brand-300 block">{selectedSub.productMention}</span>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedSub.hashtags.map(h => (
                        <span key={h} className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Creative Evaluation (Section 16 requirement) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-950 to-pink-950/20 border border-brand-800/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      AI Creative Quality Evaluation
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-brand-300">{selectedSub.aiQualityScore} / 100</span>
                    <span className="text-[10px] text-slate-400 block">Automated Multi-Metric Score</span>
                  </div>
                </div>

                {/* 6 AI Quality Factors */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <Progress label="Content Relevance" value={selectedSub.aiBreakdown.contentRelevance} showValue size="sm" color="brand" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <Progress label="Brand Fit" value={selectedSub.aiBreakdown.brandFit} showValue size="sm" color="brand" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <Progress label="Creative Quality" value={selectedSub.aiBreakdown.creativeQuality} showValue size="sm" color="accent" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <Progress label="Originality" value={selectedSub.aiBreakdown.originality} showValue size="sm" color="accent" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <Progress label="Product Visibility" value={selectedSub.aiBreakdown.productVisibility} showValue size="sm" color="emerald" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <Progress label="Brand Safety" value={selectedSub.aiBreakdown.brandSafety} showValue size="sm" color="emerald" />
                  </div>
                </div>

                {/* AI Rationale */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white">AI Diagnostic Summary:</strong> {selectedSub.aiFeedback}
                </p>
              </div>

              {/* Action Buttons: Approve, Request Changes, Reject */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => requestChangesSubmission(selectedSub.id, 'Please adjust product lighting in the intro 3 seconds')}
                  leftIcon={<AlertCircle className="w-4 h-4 text-amber-400" />}
                >
                  Request Changes
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => approveSubmission(selectedSub.id)}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Approve Deliverable (+100 Creator Credits)
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 text-xs bg-slate-900/60 border-slate-800">
              Select a submission from the list to inspect AI evaluation and approve.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
