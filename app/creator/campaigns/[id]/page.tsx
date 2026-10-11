'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Coins,
  Video,
  FileCheck,
  ShieldCheck,
  Tag,
  AlertCircle,
  Share2,
  Upload,
  Play,
  Copy,
  Check,
  Camera,
  Film,
  Hash,
  AtSign,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { calculateMatchScore } from '@/services/matchingService';

export default function CreatorCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || '';
  const {
    campaigns,
    activeCreator,
    acceptCampaignInvitation,
    applyToCampaign,
    campaignApplications,
    addToast,
  } = useApp();

  const campaign = campaigns.find(c => c.id === campaignId) || campaigns[0];
  const match = calculateMatchScore(campaign, activeCreator);

  // Application state
  const isInvited = campaign.invitedCreatorIds.includes(activeCreator.id);
  const isAccepted = campaign.acceptedCreatorIds.includes(activeCreator.id);
  const existingApp = campaignApplications.find(
    a => a.campaignId === campaign.id && a.creatorId === activeCreator.id
  );
  const isApplied = Boolean(existingApp) || campaign.appliedCreatorIds.includes(activeCreator.id);

  // Modal State for Pitch Video & Proposal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [deliverableType, setDeliverableType] = useState<string>(campaign.deliverables[0]?.type || 'Instagram Reel');
  const [pitchTitle, setPitchTitle] = useState('');
  const [conceptPitch, setConceptPitch] = useState('');
  const [pitchVideoUrl, setPitchVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGeneratingAiPitch, setIsGeneratingAiPitch] = useState(false);

  const handleGenerateAiPitch = async () => {
    setIsGeneratingAiPitch(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pitch-generator',
          creator: {
            name: activeCreator.name,
            handle: activeCreator.handle,
            niche: activeCreator.niche,
          },
          campaign: {
            name: campaign.name,
            brandName: campaign.brandName,
            category: campaign.category,
            description: campaign.description,
            guidelines: campaign.guidelines,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.proposal) {
        setPitchTitle(`[Hook] ${data.proposal.hook}`);
        setConceptPitch(
          `${data.proposal.conceptDescription}\n\nDeliverable Breakdown:\n${data.proposal.deliverableBreakdown.map((d: string) => `• ${d}`).join('\n')}\n\nEstimated Performance: ${data.proposal.estimatedPerformance}\nHashtags: ${data.proposal.suggestedHashtags.join(' ')}`
        );
        addToast({
          title: 'Gemini AI Pitch Generated! 🎬',
          message: 'Personalized video hook & deliverable breakdown generated.',
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Failed to generate AI pitch:', err);
    } finally {
      setIsGeneratingAiPitch(false);
    }
  };

  // Handle local video/media file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPitchVideoUrl(reader.result as string);
      setIsUploading(false);
      addToast({
        title: 'Pitch Deliverable Loaded! 🎬',
        message: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB) attached to proposal.`,
        type: 'success',
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      addToast({
        title: 'Upload Error',
        message: 'Could not read video file. Please try a different format or URL.',
        type: 'warning',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast({
      title: 'Copied to Clipboard!',
      message: `"${text}" copied.`,
      type: 'info',
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptPitch.trim()) {
      addToast({
        title: 'Pitch Notes Required',
        message: 'Please provide a brief creative concept pitch for the brand.',
        type: 'warning',
      });
      return;
    }

    applyToCampaign(campaign.id, activeCreator.id, {
      deliverableType,
      pitchVideoTitle: pitchTitle.trim() || `${activeCreator.name} - ${campaign.name} Pitch`,
      conceptPitch: conceptPitch.trim(),
      pitchVideoUrl: pitchVideoUrl.trim() || activeCreator.portfolio[0]?.thumbnail || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    });

    setIsApplyModalOpen(false);
  };

  const guidelines = campaign.guidelines;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-16">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        <button
          onClick={() => router.forward()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          Forward <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Card */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.productImage}
              alt={campaign.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-700 shadow-lg shadow-black/40"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {campaign.brandName}
                </span>
                <Badge variant="brand" size="sm">{campaign.category}</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{campaign.name}</h2>
              <p className="text-xs text-slate-400">
                Featured Product: <strong className="text-white">{campaign.product}</strong> • Objective: <strong className="text-brand-300">{campaign.objective}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <span className="text-2xl font-black text-emerald-400">{campaign.rewardDisplay}</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Deadline: {campaign.deadlineDisplay}
            </span>

            {isAccepted ? (
              <Badge variant="emerald" size="md">
                ✓ Accepted & Active Collaborator
              </Badge>
            ) : isInvited ? (
              <Button
                size="md"
                variant="primary"
                onClick={() => acceptCampaignInvitation(campaign.id, activeCreator.id)}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Accept Campaign Invitation
              </Button>
            ) : isApplied ? (
              <div className="flex flex-col items-end gap-1">
                <Badge variant="neutral" size="md">
                  Application & Pitch Under Review
                </Badge>
                {existingApp && (
                  <span className="text-[11px] text-brand-400 font-medium">
                    Deliverable: {existingApp.deliverableType}
                  </span>
                )}
              </div>
            ) : (
              <Button
                size="md"
                variant="accent"
                onClick={() => setIsApplyModalOpen(true)}
                leftIcon={<Video className="w-4 h-4" />}
              >
                Apply with Pitch Video
              </Button>
            )}
          </div>
        </div>

        {/* AI Match Callout Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/50 via-slate-950 to-pink-950/40 border border-brand-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Match Analysis & Category Fit</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Why you match this campaign ({match.overallScore}%)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              &quot;{match.explanation}&quot;
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <ProgressRing score={match.overallScore} size={90} sublabel="Match" />
          </div>
        </div>
      </Card>

      {/* Deliverables & Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deliverables Card */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-brand-400" />
            Required Deliverables & Compensation
          </h3>

          <div className="space-y-3">
            {campaign.deliverables.map(del => (
              <div key={del.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{del.type}</span>
                  <span className="text-[11px] text-slate-400">{del.quantity} item required with product integration</span>
                </div>
                <span className="text-sm font-bold text-emerald-400">₹{del.reward.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-xs font-bold text-white block">Audience Target Requirements:</span>
            <p className="text-[11px] text-slate-400">
              Cohorts: {campaign.targetAudience.age} • Languages: {campaign.targetAudience.language} • Location: {campaign.targetAudience.location}
            </p>
          </div>
        </Card>

        {/* Technical Specs Card */}
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-brand-400" />
            Production & Technical Specifications
          </h3>

          {guidelines ? (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aspect Ratio</span>
                <span className="font-bold text-white mt-0.5 block">{guidelines.technicalSpecs.aspectRatio}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Resolution</span>
                <span className="font-bold text-white mt-0.5 block">{guidelines.technicalSpecs.resolution}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                <span className="font-bold text-white mt-0.5 block">{guidelines.technicalSpecs.minDurationSeconds}s – {guidelines.technicalSpecs.maxDurationSeconds}s</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lighting</span>
                <span className="font-bold text-white mt-0.5 block truncate">{guidelines.technicalSpecs.lighting}</span>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Audio Spec</span>
                <span className="font-semibold text-slate-300 mt-0.5 block">{guidelines.technicalSpecs.audio}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">High-resolution standard vertical 9:16 specs required.</p>
          )}
        </Card>
      </div>

      {/* Comprehensive Campaign Guidelines Section */}
      {guidelines && (
        <div className="space-y-6">
          {/* Aesthetic & Talking Points */}
          <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-400" />
              Creative Aesthetic & Key Talking Points
            </h3>

            <div className="p-3.5 rounded-xl bg-brand-950/30 border border-brand-800/40 text-xs space-y-1">
              <span className="font-bold text-brand-300 block">Visual Aesthetic Brief:</span>
              <p className="text-slate-300 leading-relaxed">{guidelines.visualAesthetic}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">Key Talking Points (Must be covered in pitch & video):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {guidelines.keyTalkingPoints.map((point, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Do's and Don'ts Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Do's */}
            <Card className="p-6 bg-emerald-950/20 border-emerald-800/40 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Content Do&apos;s
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {guidelines.contentDos.map((doItem, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{doItem}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Don'ts */}
            <Card className="p-6 bg-rose-950/20 border-rose-800/40 space-y-3">
              <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Content Don&apos;ts
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {guidelines.contentDonts.map((dontItem, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{dontItem}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Mandatory Mentions, Hashtags & Promo Code */}
          <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-brand-400" />
              Mandatory Hashtags, Mentions & Discount Code
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mentions */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-brand-400" /> Required Mentions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {guidelines.mandatoryMentions.map(mention => (
                    <button
                      key={mention}
                      onClick={() => handleCopy(mention, mention)}
                      className="text-xs font-semibold px-2 py-1 rounded bg-slate-900 border border-slate-700 text-brand-300 hover:text-white hover:border-brand-500 transition-colors flex items-center gap-1"
                      title="Click to copy"
                    >
                      {mention}
                      {copiedKey === mention ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-brand-400" /> Required Hashtags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {guidelines.mandatoryTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleCopy(tag, tag)}
                      className="text-xs font-semibold px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-brand-500 transition-colors flex items-center gap-1"
                      title="Click to copy"
                    >
                      {tag}
                      {copiedKey === tag ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-400" /> Campaign Promo Code
                </span>
                {guidelines.promoDiscountCode ? (
                  <button
                    onClick={() => handleCopy(guidelines.promoDiscountCode!, 'promo')}
                    className="w-full text-xs font-mono font-bold px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/40 transition-colors flex items-center justify-between"
                    title="Click to copy promo code"
                  >
                    <span>{guidelines.promoDiscountCode}</span>
                    {copiedKey === 'promo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">No promo code required</span>
                )}
              </div>
            </div>

            {/* Brand Safety */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                Brand Safety & Compliance Rules
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                {guidelines.brandSafetyRules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* Apply Modal with Real-time Pitch Video Upload */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-brand-400" />
                  Apply with Campaign Pitch Video
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submit your creative concept, deliverable format, and video sample directly to {campaign.brandName}.
                </p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-5">
              {/* AI Fit Callout */}
              <div className="p-3.5 rounded-xl bg-brand-950/40 border border-brand-800/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">AI Match Compatibility: {match.overallScore}%</span>
                  <span className="text-slate-400">High relevance match based on your creator portfolio and niche.</span>
                </div>
                <Badge variant="brand" size="md">{match.overallScore}% Fit</Badge>
              </div>

              {/* Deliverable Format */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Deliverable Format *
                </label>
                <select
                  value={deliverableType}
                  onChange={e => setDeliverableType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Instagram Reel">Instagram Reel (9:16 Vertical Video)</option>
                  <option value="YouTube Short">YouTube Short (60s Vertical)</option>
                  <option value="YouTube Video">YouTube Dedicated Product Review (16:9)</option>
                  <option value="UGC Video">UGC Video / Organic Testimonial</option>
                  <option value="Product Review">In-depth Unboxing & Review</option>
                </select>
              </div>

              {/* Pitch Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pitch Headline / Working Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Glow Routine: 30-Second Radiant Transformation"
                  value={pitchTitle}
                  onChange={e => setPitchTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 placeholder-slate-600"
                />
              </div>

              {/* Creative Concept Pitch */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Creative Concept &amp; Hook Pitch *
                  </label>
                  <button
                    type="button"
                    disabled={isGeneratingAiPitch}
                    onClick={handleGenerateAiPitch}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-950/70 border border-pink-700/60 text-pink-300 hover:text-white hover:bg-pink-900/80 text-[11px] font-semibold transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                    {isGeneratingAiPitch ? 'Gemini AI Generating Pitch...' : 'Auto-Generate with Gemini AI'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain how you will showcase the product, your hook in the first 3 seconds, natural lighting setup, and audience call to action..."
                  value={conceptPitch}
                  onChange={e => setConceptPitch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 placeholder-slate-600"
                />
              </div>

              {/* Real-Time Pitch Video Deliverable Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Upload Pitch Video or Sample Deliverable *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Box */}
                  <label className="border-2 border-dashed border-slate-800 hover:border-brand-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50">
                    <Upload className="w-6 h-6 text-brand-400 mb-1.5" />
                    <span className="text-xs font-bold text-white">Upload Video File</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">MP4, WebM, MOV (Max 50MB)</span>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Or Video URL input */}
                  <div className="flex flex-col justify-center gap-1.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                    <span className="text-xs font-semibold text-slate-300">Or Paste Video / Post URL</span>
                    <input
                      type="url"
                      placeholder="https://instagram.com/reel/... or video link"
                      value={pitchVideoUrl.startsWith('data:') ? '' : pitchVideoUrl}
                      onChange={e => setPitchVideoUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                    />
                    <span className="text-[10px] text-slate-500">Supports direct URLs or hosted previews</span>
                  </div>
                </div>

                {isUploading && (
                  <p className="text-xs text-brand-400 animate-pulse font-medium">
                    Processing and embedding your video deliverable...
                  </p>
                )}

                {/* Video Deliverable Preview */}
                {pitchVideoUrl && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Pitch Deliverable Attached
                    </span>
                    {pitchVideoUrl.startsWith('data:video') ? (
                      <video
                        src={pitchVideoUrl}
                        controls
                        className="w-full max-h-48 rounded-lg object-contain bg-black"
                      />
                    ) : (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center border border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pitchVideoUrl}
                          alt="Deliverable preview"
                          className="w-full h-full object-cover opacity-80"
                          onError={e => {
                            // Fallback if URL is raw video or unrenderable image
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="w-8 h-8 text-white drop-shadow" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsApplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Submit Application & Pitch Video
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
