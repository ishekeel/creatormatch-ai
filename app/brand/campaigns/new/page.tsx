'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Campaign, Deliverable, CampaignObjective, Challenge } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { AiMatchingAnimationModal } from '@/components/brand/AiMatchingAnimationModal';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Plus,
  Trash2,
  Video,
  Target,
  Users,
  Calendar,
  Layers,
  Flame,
  Trophy,
} from 'lucide-react';

function CreateCampaignForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get('type') === 'challenge' ? 'challenge' : 'standard';

  const { addCampaign, createChallenge, activeBrand, addToast } = useApp();

  const [campaignType, setCampaignType] = useState<'standard' | 'challenge'>(initialMode);
  const [step, setStep] = useState(1);
  const [isLaunched, setIsLaunched] = useState(false);
  const [isAiMatchingOpen, setIsAiMatchingOpen] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState('');

  // Form State for Standard Campaign
  const [formData, setFormData] = useState({
    name: `${activeBrand.name} Product Showcase Campaign`,
    product: activeBrand.products?.[0]?.name || `${activeBrand.name} Signature Line`,
    category: activeBrand.industry || 'Fashion & Lifestyle',
    description: `Creator collaboration for ${activeBrand.name}. Looking for authentic content creators to showcase product features, styling, and real-world results.`,
    productImage:
      activeBrand.products?.[0]?.image ||
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
    objective: 'Product Launch' as CampaignObjective,
    // Step 2
    age: '18–32',
    gender: 'All Demographic Groups',
    location: activeBrand.location || 'India (Tier 1 & Tier 2)',
    language: 'English, Hindi',
    interests: 'Fashion, Lifestyle, Modern Aesthetics',
    // Step 3
    niche: activeBrand.industry || 'Fashion, Lifestyle',
    platforms: 'Instagram, YouTube',
    minFollowers: 30000,
    minEngagement: 5.0,
    budget: 15000,
    // Step 4
    deliverables: [
      { id: '1', type: 'Instagram Reel', quantity: 1, reward: 10000 },
      { id: '2', type: 'UGC Video', quantity: 1, reward: 5000 },
    ] as Deliverable[],
    // Step 5
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    submissionDeadline: '7 days',
  });

  // Meme Challenge Form State
  const [challengeData, setChallengeData] = useState({
    name: `${activeBrand.name} Viral Transition & Meme Challenge`,
    product: activeBrand.products?.[0]?.name || `${activeBrand.name} Collection`,
    theme: 'Best 15-second creative styling transformation & hook',
    hashtag: `#${activeBrand.name.replace(/\s+/g, '')}ViralDrop`,
    description: `Showcase ${activeBrand.name} in the most creative, high-energy transition or meme format. High engagement and viral humor win top cash prizes.`,
    rules: '1. Must include the official hashtag\n2. Must show authentic product styling\n3. High-definition vertical format (9:16)\n4. Original audio or trending licensed sound',
    prizePoolFirst: 15000,
    prizePoolSecond: 7500,
    prizePoolThird: 2500,
    submissionType: 'Instagram Reel / Short Video',
  });

  const objectives: CampaignObjective[] = [
    'Awareness',
    'Engagement',
    'Sales',
    'Conversions',
    'Product Launch',
  ];

  const deliverableTypes: Deliverable['type'][] = [
    'Instagram Reel',
    'YouTube Short',
    'YouTube Video',
    'Instagram Story',
    'Product Review',
    'UGC Video',
    'Image Post',
  ];

  const handleAddDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        {
          id: `${Date.now()}`,
          type: 'Instagram Reel',
          quantity: 1,
          reward: 5000,
        },
      ],
    }));
  };

  const handleRemoveDeliverable = (id: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter(d => d.id !== id),
    }));
  };

  const [isDraftingAi, setIsDraftingAi] = useState(false);

  const handleGenerateAiDraft = async () => {
    setIsDraftingAi(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'campaign-draft',
          brandName: activeBrand.name,
          industry: formData.category || activeBrand.industry,
          productName: formData.product,
          objective: formData.objective,
        }),
      });
      const data = await res.json();
      if (data.success && data.draft) {
        setFormData(prev => ({
          ...prev,
          description: data.draft.briefSummary || prev.description,
          interests: data.draft.suggestedTargeting?.interests?.join(', ') || prev.interests,
          deliverables: data.draft.deliverables?.map((d: any, idx: number) => ({
            id: `${Date.now()}-${idx}`,
            type: d.format || 'Instagram Reel',
            quantity: 1,
            reward: 8000,
          })) || prev.deliverables,
        }));
        addToast({
          title: 'Campaign Drafted with Gemini AI! ✨',
          message: 'AI brief, deliverables, and audience targeting generated.',
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Failed to generate AI campaign draft:', err);
    } finally {
      setIsDraftingAi(false);
    }
  };

  const handleLaunch = () => {
    const newId = `camp-${Date.now()}`;
    const newCampaign: Campaign = {
      id: newId,
      brandId: activeBrand.id,
      brandName: activeBrand.name,
      brandLogo: activeBrand.logo,
      name: formData.name,
      product: formData.product,
      category: formData.category,
      description: formData.description,
      productImage: formData.productImage,
      objective: formData.objective,
      targetAudience: {
        age: formData.age,
        gender: formData.gender,
        location: formData.location,
        language: formData.language,
        interests: formData.interests.split(',').map(i => i.trim()),
      },
      requirements: {
        niche: formData.niche.split(',').map(n => n.trim()),
        platforms: formData.platforms.split(',').map(p => p.trim()),
        minFollowers: Number(formData.minFollowers),
        minEngagement: Number(formData.minEngagement),
        location: formData.location,
        language: formData.language,
        budget: Number(formData.budget),
      },
      deliverables: formData.deliverables,
      timeline: {
        startDate: formData.startDate,
        endDate: formData.endDate,
        submissionDeadline: formData.submissionDeadline,
      },
      status: 'active',
      budget: Number(formData.budget),
      rewardDisplay: `₹${Number(formData.budget).toLocaleString()}`,
      deadlineDisplay: formData.submissionDeadline,
      invitedCreatorIds: [],
      acceptedCreatorIds: [],
      appliedCreatorIds: [],
      reach: '0K',
      engagement: '0.0%',
      conversions: 0,
    };

    addCampaign(newCampaign);
    setCreatedCampaignId(newId);
    setIsLaunched(true);
  };

  const handleLaunchChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const newChal: Challenge = {
      id: `chal-${Date.now()}`,
      brandId: activeBrand.id,
      brandName: activeBrand.name,
      brandLogo: activeBrand.logo,
      name: challengeData.name,
      product: challengeData.product,
      description: challengeData.description,
      theme: challengeData.theme,
      rules: challengeData.rules.split('\n').filter(Boolean),
      hashtag: challengeData.hashtag,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2025-07-15',
      submissionType: challengeData.submissionType,
      prizePool: {
        first: Number(challengeData.prizePoolFirst),
        second: Number(challengeData.prizePoolSecond),
        third: Number(challengeData.prizePoolThird),
        totalDisplay: `₹${(
          Number(challengeData.prizePoolFirst) +
          Number(challengeData.prizePoolSecond) +
          Number(challengeData.prizePoolThird)
        ).toLocaleString()}`,
      },
      creditsAward: {
        winner: 500,
        top10: 200,
        participation: 50,
      },
      participantsCount: 0,
      submissionsCount: 0,
      daysRemaining: 14,
      status: 'live',
    };

    createChallenge(newChal);
    addToast({
      title: 'Meme Challenge Launched! 🔥',
      message: `${newChal.name} is now live and accepting creator submissions.`,
      type: 'success',
    });
    router.push('/brand/campaigns');
  };

  const stepsList = [
    { num: 1, title: 'Details' },
    { num: 2, title: 'Target Audience' },
    { num: 3, title: 'Creator Criteria' },
    { num: 4, title: 'Deliverables' },
    { num: 5, title: 'Timeline' },
    { num: 6, title: 'Review & Launch' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Campaign or Challenge
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose whether to launch a standard creator deliverable campaign or a viral open meme challenge for <strong className="text-white">{activeBrand.name}</strong>.
          </p>
        </div>

        {/* Dual Mode Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setCampaignType('standard');
              setStep(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              campaignType === 'standard'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Standard Campaign
          </button>
          <button
            type="button"
            onClick={() => setCampaignType('challenge')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              campaignType === 'challenge'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-200" />
            + Meme Challenge
          </button>
        </div>
      </div>

      {/* MODE 2: Meme / Creative Challenge Form */}
      {campaignType === 'challenge' && (
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Viral Contest Builder</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Create Meme &amp; Creative Challenge</h3>
            <p className="text-xs text-slate-400 mt-1">
              Set up a viral video contest with a tiered prize pool. Creators submit entries and compete on a public leaderboard.
            </p>
          </div>

          <form onSubmit={handleLaunchChallenge} className="space-y-5">
            <Input
              label="Challenge Title"
              placeholder="e.g. Summer Glow Meme Challenge"
              value={challengeData.name}
              onChange={e => setChallengeData({ ...challengeData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Associated Product"
                placeholder="Product name"
                value={challengeData.product}
                onChange={e => setChallengeData({ ...challengeData, product: e.target.value })}
                required
              />
              <Input
                label="Official Viral Hashtag"
                placeholder="#GlowMemeDrop"
                value={challengeData.hashtag}
                onChange={e => setChallengeData({ ...challengeData, hashtag: e.target.value })}
                required
              />
            </div>

            <Input
              label="Challenge Theme & Hook"
              placeholder="e.g. Most hilarious 15-second skin routine fail & recovery"
              value={challengeData.theme}
              onChange={e => setChallengeData({ ...challengeData, theme: e.target.value })}
              required
            />

            <Textarea
              label="Challenge Description"
              placeholder="Brief explanation for participating creators..."
              rows={3}
              value={challengeData.description}
              onChange={e => setChallengeData({ ...challengeData, description: e.target.value })}
              required
            />

            <Textarea
              label="Contest Rules & Submission Guidelines (one per line)"
              placeholder="1. Must tag @brand\n2. Must feature product in frame..."
              rows={4}
              value={challengeData.rules}
              onChange={e => setChallengeData({ ...challengeData, rules: e.target.value })}
              required
            />

            {/* Prize Pool Configuration */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Cash Prize Pool Distribution
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="1st Place Winner (₹)"
                  type="number"
                  value={challengeData.prizePoolFirst}
                  onChange={e => setChallengeData({ ...challengeData, prizePoolFirst: Number(e.target.value) })}
                  required
                />
                <Input
                  label="2nd Place (₹)"
                  type="number"
                  value={challengeData.prizePoolSecond}
                  onChange={e => setChallengeData({ ...challengeData, prizePoolSecond: Number(e.target.value) })}
                  required
                />
                <Input
                  label="3rd Place (₹)"
                  type="number"
                  value={challengeData.prizePoolThird}
                  onChange={e => setChallengeData({ ...challengeData, prizePoolThird: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" leftIcon={<Flame className="w-4 h-4 text-amber-300" />}>
                Launch Meme Challenge 🔥
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* MODE 1: Standard Campaign Multi-Step Flow */}
      {campaignType === 'standard' && (
        <>
          {/* Step Indicators */}
          {!isLaunched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                    Step {step} of 6
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {stepsList[step - 1].title}
                  </h3>
                </div>
                <Badge variant="brand" size="md">
                  {Math.round((step / 6) * 100)}% Complete
                </Badge>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {stepsList.map(s => (
                  <div
                    key={s.num}
                    className={`h-1.5 rounded-full transition-all ${
                      s.num <= step ? 'bg-brand-500' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Form Content */}
          {!isLaunched ? (
            <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <Input
                    label="Campaign Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Product Name"
                      value={formData.product}
                      onChange={e => setFormData({ ...formData, product: e.target.value })}
                      required
                    />
                    <Input
                      label="Category"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Campaign Description &amp; Brief *
                      </label>
                      <button
                        type="button"
                        disabled={isDraftingAi}
                        onClick={handleGenerateAiDraft}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-950/70 border border-brand-700/60 text-brand-300 hover:text-white hover:bg-brand-900/80 text-[11px] font-semibold transition-all disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                        {isDraftingAi ? 'Gemini AI Drafting Brief...' : 'Auto-Draft Brief with Gemini AI'}
                      </button>
                    </div>
                    <Textarea
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Product Image URL"
                      value={formData.productImage}
                      onChange={e => setFormData({ ...formData, productImage: e.target.value })}
                      required
                    />
                    <Select
                      label="Campaign Objective"
                      options={objectives.map(o => ({ value: o, label: o }))}
                      value={formData.objective}
                      onChange={e =>
                        setFormData({ ...formData, objective: e.target.value as CampaignObjective })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Target Audience */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Target Age Range"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g. 18–30"
                      required
                    />
                    <Input
                      label="Target Gender / Persona"
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      placeholder="e.g. Women, Gen-Z"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Target Geographic Location"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. India (Tier 1 & Tier 2)"
                      required
                    />
                    <Input
                      label="Target Languages"
                      value={formData.language}
                      onChange={e => setFormData({ ...formData, language: e.target.value })}
                      placeholder="e.g. English, Telugu, Hindi"
                      required
                    />
                  </div>
                  <Input
                    label="Audience Interests (comma-separated)"
                    value={formData.interests}
                    onChange={e => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="e.g. Clean Skincare, Glass Skin, Makeup Tutorials"
                    required
                  />
                </div>
              )}

              {/* Step 3: Creator Criteria */}
              {step === 3 && (
                <div className="space-y-4">
                  <Input
                    label="Creator Niche / Category (comma-separated)"
                    value={formData.niche}
                    onChange={e => setFormData({ ...formData, niche: e.target.value })}
                    placeholder="e.g. Beauty, Skincare, Lifestyle"
                    required
                  />
                  <Input
                    label="Target Platforms (comma-separated)"
                    value={formData.platforms}
                    onChange={e => setFormData({ ...formData, platforms: e.target.value })}
                    placeholder="e.g. Instagram, YouTube"
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Min Followers"
                      type="number"
                      value={formData.minFollowers}
                      onChange={e => setFormData({ ...formData, minFollowers: Number(e.target.value) })}
                      required
                    />
                    <Input
                      label="Min Engagement (%)"
                      type="number"
                      step="0.1"
                      value={formData.minEngagement}
                      onChange={e => setFormData({ ...formData, minEngagement: Number(e.target.value) })}
                      required
                    />
                    <Input
                      label="Campaign Total Budget (₹)"
                      type="number"
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Deliverables */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Required Content Deliverables
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddDeliverable}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Add Deliverable
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.deliverables.map((deliv, idx) => (
                      <div
                        key={deliv.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-400 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <Select
                            options={deliverableTypes.map(t => ({ value: t, label: t }))}
                            value={deliv.type}
                            onChange={e => {
                              const updated = [...formData.deliverables];
                              updated[idx].type = e.target.value as Deliverable['type'];
                              setFormData({ ...formData, deliverables: updated });
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <span>Qty:</span>
                            <input
                              type="number"
                              min="1"
                              value={deliv.quantity}
                              onChange={e => {
                                const updated = [...formData.deliverables];
                                updated[idx].quantity = Number(e.target.value);
                                setFormData({ ...formData, deliverables: updated });
                              }}
                              className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs text-center"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <span>Reward (₹):</span>
                            <input
                              type="number"
                              value={deliv.reward}
                              onChange={e => {
                                const updated = [...formData.deliverables];
                                updated[idx].reward = Number(e.target.value);
                                setFormData({ ...formData, deliverables: updated });
                              }}
                              className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs text-center"
                            />
                          </div>

                          {formData.deliverables.length > 1 && (
                            <button
                              onClick={() => handleRemoveDeliverable(deliv.id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Timeline */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Deliverable Submission Window"
                    value={formData.submissionDeadline}
                    onChange={e => setFormData({ ...formData, submissionDeadline: e.target.value })}
                    placeholder="e.g. 5 days from sample arrival"
                    required
                  />
                </div>
              )}

              {/* Step 6: Review & Launch */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
                      Campaign Summary
                    </span>
                    <h4 className="text-base font-bold text-white">{formData.name}</h4>
                    <p className="text-xs text-slate-400">{formData.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                      <div>
                        <span className="text-slate-500 block">Product:</span>
                        <span className="text-white font-medium">{formData.product}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Category:</span>
                        <span className="text-white font-medium">{formData.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Budget:</span>
                        <span className="text-emerald-400 font-bold">₹{Number(formData.budget).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Deliverables:</span>
                        <span className="text-brand-300 font-bold">{formData.deliverables.length} Items</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Button
                  variant="outline"
                  size="md"
                  disabled={step === 1}
                  onClick={() => setStep(step - 1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                {step < 6 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setStep(step + 1)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleLaunch}
                    leftIcon={<Rocket className="w-4 h-4" />}
                  >
                    Launch Campaign 🚀
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            /* Post-Launch Celebration Card */
            <Card className="p-8 sm:p-12 text-center bg-slate-900 border-slate-800 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Campaign Successfully Launched!</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2">
                  &quot;{formData.name}&quot; is now published and active on the CreatorMatch platform.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => setIsAiMatchingOpen(true)}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Run AI Creator Matching Now ⚡
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => router.push('/brand/campaigns')}
                >
                  View in Campaigns
                </Button>
              </div>
            </Card>
          )}

          {/* AI Matching Animation Modal */}
          {isAiMatchingOpen && (
            <AiMatchingAnimationModal
              isOpen={isAiMatchingOpen}
              onClose={() => {
                setIsAiMatchingOpen(false);
                router.push('/brand/creators');
              }}
              campaignId={createdCampaignId || undefined}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function CreateCampaignPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading campaign editor...</div>}>
      <CreateCampaignForm />
    </Suspense>
  );
}
