'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import {
  Layers,
  Clock,
  Sparkles,
  Play,
  UploadCloud,
  CheckCircle2,
  Film,
  Image as ImageIcon,
  ExternalLink,
  PlusCircle,
  Video,
  FileCheck,
  Send,
  Building2,
  Trophy,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { CampaignApplication, Submission } from '@/types';

export default function CreatorMyCampaignsPage() {
  const {
    campaigns,
    campaignApplications,
    submissions,
    activeCreator,
    applyToCampaign,
    submitContent,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('applications');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const [selectedVideoDescription, setSelectedVideoDescription] = useState<string>('');

  // Submit Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<'pitch' | 'deliverable'>('pitch');
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');
  const [deliverableType, setDeliverableType] = useState('Instagram Reel');
  const [pitchTitle, setPitchTitle] = useState('');
  const [conceptPitch, setConceptPitch] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  // Filter creator-specific items
  const myApplications = campaignApplications.filter(
    app => app.creatorId === activeCreator.id || app.creatorHandle === activeCreator.handle
  );

  const myAccepted = campaigns.filter(c => c.acceptedCreatorIds.includes(activeCreator.id));
  const myInvited = campaigns.filter(c => c.invitedCreatorIds.includes(activeCreator.id));
  const mySubmissions = submissions.filter(
    s => s.creatorId === activeCreator.id || s.creatorName === activeCreator.name
  );

  const tabs = [
    {
      id: 'applications',
      label: `Applied & Pitch Videos (${myApplications.length})`,
      icon: <Video className="w-4 h-4 text-brand-400" />,
      badge: myApplications.length > 0 ? myApplications.length : undefined,
    },
    {
      id: 'active',
      label: `Active Collaborations (${myAccepted.length})`,
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
      badge: myAccepted.length > 0 ? myAccepted.length : undefined,
    },
    {
      id: 'submissions',
      label: `Submitted Pictures & Videos (${mySubmissions.length})`,
      icon: <FileCheck className="w-4 h-4 text-pink-400" />,
      badge: mySubmissions.length > 0 ? mySubmissions.length : undefined,
    },
    {
      id: 'invitations',
      label: `Brand Invitations (${myInvited.length})`,
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      badge: myInvited.length > 0 ? myInvited.length : undefined,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedPreview(reader.result);
          setMediaUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenPitchVideo = (url: string, title: string, desc: string) => {
    setSelectedVideoUrl(url);
    setSelectedVideoTitle(title);
    setSelectedVideoDescription(desc);
    setIsVideoModalOpen(true);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    const camp = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];
    const finalMedia = mediaUrl || uploadedPreview || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80';

    if (submissionMode === 'pitch') {
      applyToCampaign(camp.id, activeCreator.id, {
        deliverableType,
        pitchVideoUrl: finalMedia,
        pitchVideoTitle: pitchTitle || `${deliverableType} Proposal for ${camp.name}`,
        conceptPitch: conceptPitch || 'High-relevance authentic creator pitch aligned with brand requirements.',
      });
      setActiveTab('applications');
    } else {
      submitContent({
        campaignId: camp.id,
        campaignName: camp.name,
        brandName: camp.brandName,
        creatorId: activeCreator.id,
        creatorName: activeCreator.name,
        creatorAvatar: activeCreator.avatar,
        type: deliverableType.toLowerCase().includes('picture') || deliverableType.toLowerCase().includes('image') ? 'image' : 'video',
        mediaUrl: finalMedia,
        thumbnail: finalMedia,
        caption: conceptPitch || `Content deliverable submitted for ${camp.name}`,
        hashtags: ['#CreatorMatch', `#${camp.brandName.replace(/\s+/g, '')}`, '#BrandCollab'],
        productMention: camp.product,
      });
      setActiveTab('submissions');
    }

    setIsSubmitModalOpen(false);
    setPitchTitle('');
    setConceptPitch('');
    setMediaUrl('');
    setUploadedPreview(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in pb-16">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Partnership Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            My Campaigns &amp; Brand Deliverables
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your applied campaigns, review active collaborations, inspect submitted pictures/videos, and send video pitches directly to brands.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setSubmissionMode('pitch');
            setIsSubmitModalOpen(true);
          }}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Submit Video Pitch / Content
        </Button>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 block">Applied Campaigns</span>
          <span className="text-2xl font-black text-white mt-1 block">{myApplications.length}</span>
          <span className="text-[11px] text-slate-400">Pitches in brand review queue</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">Active Collaborations</span>
          <span className="text-2xl font-black text-white mt-1 block">{myAccepted.length}</span>
          <span className="text-[11px] text-slate-400">Hired &amp; in production</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 block">Submitted Deliverables</span>
          <span className="text-2xl font-black text-white mt-1 block">{mySubmissions.length}</span>
          <span className="text-[11px] text-slate-400">Pictures &amp; videos evaluated by AI</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">Brand Invitations</span>
          <span className="text-2xl font-black text-white mt-1 block">{myInvited.length}</span>
          <span className="text-[11px] text-slate-400">Direct invitations from brands</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: Applied Campaigns & Pitches */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/80 border-slate-800 space-y-3">
              <Video className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Campaign Applications Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Explore open marketplace campaigns or click &quot;Submit Video Pitch&quot; to pitch your creative ideas to leading brands.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <Link href="/creator/campaigns">
                  <Button size="sm" variant="outline">Discover Open Campaigns</Button>
                </Link>
                <Button size="sm" variant="primary" onClick={() => setIsSubmitModalOpen(true)}>
                  Submit Pitch Now
                </Button>
              </div>
            </Card>
          ) : (
            myApplications.map(app => (
              <Card
                key={app.id}
                className="p-6 bg-slate-900/90 border-slate-800 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-start gap-4">
                    {/* Media Thumbnail with Watch Button */}
                    <div
                      onClick={() => handleOpenPitchVideo(app.pitchVideoUrl || '', app.pitchVideoTitle, app.conceptPitch)}
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black border border-slate-700 shrink-0 group cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={app.pitchVideoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80'}
                        alt={app.pitchVideoTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white">{app.campaignName}</h4>
                        <Badge
                          variant={app.status === 'accepted' ? 'emerald' : app.status === 'declined' ? 'neutral' : 'accent'}
                          size="sm"
                        >
                          {app.status === 'accepted'
                            ? 'Accepted / Hired 🎉'
                            : app.status === 'declined'
                            ? 'Application Declined'
                            : 'Under Brand Review ⏳'}
                        </Badge>
                        <Badge variant="brand" size="sm">
                          {app.matchScore}% AI Fit
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-400">
                        Brand: <strong className="text-white">{app.brandName}</strong> • Deliverable: <span className="text-pink-300 font-semibold">{app.deliverableType}</span>
                      </p>

                      <p className="text-xs font-semibold text-white pt-1">
                        &quot;{app.pitchVideoTitle}&quot;
                      </p>

                      <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mt-1">
                        &quot;{app.conceptPitch}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                    <span className="text-[11px] text-slate-400">Applied: {app.appliedAt}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenPitchVideo(app.pitchVideoUrl || '', app.pitchVideoTitle, app.conceptPitch)}
                      leftIcon={<Play className="w-3.5 h-3.5 text-pink-400" />}
                    >
                      Watch Video Pitch
                    </Button>
                    <Link href={`/creator/campaigns/${app.campaignId}`}>
                      <Button size="sm" variant="ghost">
                        View Campaign Brief
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Active Collaborations & Participating */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {myAccepted.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/80 border-slate-800 space-y-3">
              <Clock className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Active Collaborations Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Once a brand accepts your application or invitation, the campaign will appear here with production deadlines and submission portals.
              </p>
            </Card>
          ) : (
            myAccepted.map(camp => (
              <Card key={camp.id} className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={camp.productImage}
                      alt={camp.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{camp.name}</h4>
                        <Badge variant="emerald" size="sm">Active Deliverable</Badge>
                      </div>
                      <p className="text-xs text-slate-400">Brand: {camp.brandName} • Product: {camp.product}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedCampaignId(camp.id);
                        setSubmissionMode('deliverable');
                        setIsSubmitModalOpen(true);
                      }}
                      leftIcon={<UploadCloud className="w-4 h-4" />}
                    >
                      Submit Pictures / Content
                    </Button>
                    <Link href={`/creator/campaigns/${camp.id}`}>
                      <Button size="sm" variant="outline">
                        Brief
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Reward</span>
                    <span className="text-emerald-400 font-bold">{camp.rewardDisplay}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Deliverable</span>
                    <span className="text-white font-semibold">1x Reel + 1x Photo Post</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Deadline</span>
                    <span className="text-amber-400 font-bold">{camp.deadlineDisplay}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Submitted Pictures & Videos */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {mySubmissions.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/80 border-slate-800 space-y-3">
              <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Deliverables Submitted Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Submit high-definition pictures and videos for brand review and AI quality evaluation.
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setSubmissionMode('deliverable');
                  setIsSubmitModalOpen(true);
                }}
              >
                Submit Finished Content
              </Button>
            </Card>
          ) : (
            mySubmissions.map(sub => (
              <Card key={sub.id} className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-start gap-4">
                    <div
                      onClick={() => handleOpenPitchVideo(sub.mediaUrl, sub.campaignName, sub.caption)}
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black border border-slate-700 shrink-0 group cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sub.thumbnail || sub.mediaUrl}
                        alt={sub.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          {sub.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white">{sub.campaignName}</h4>
                        <Badge
                          variant={sub.status === 'approved' ? 'emerald' : sub.status === 'changes_requested' ? 'warning' : 'accent'}
                          size="sm"
                        >
                          {sub.status === 'approved' ? 'Approved by Brand ✓' : sub.status === 'changes_requested' ? 'Changes Requested' : 'Submitted & Under Review'}
                        </Badge>
                        <Badge variant="brand" size="sm">
                          AI Quality: {sub.aiQualityScore}/100
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-400">
                        Brand: <strong className="text-white">{sub.brandName}</strong> • Submitted: <span>{sub.submissionDate}</span>
                      </p>

                      <p className="text-xs text-slate-200 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                        {sub.caption}
                      </p>

                      {sub.aiFeedback && (
                        <p className="text-xs text-cyan-300 italic">
                          AI Evaluator: &quot;{sub.aiFeedback}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenPitchVideo(sub.mediaUrl, sub.campaignName, sub.caption)}
                      leftIcon={sub.type === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-pink-400" /> : <Play className="w-3.5 h-3.5 text-pink-400" />}
                    >
                      {sub.type === 'image' ? 'View Picture' : 'Watch Video'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Brand Invitations */}
      {activeTab === 'invitations' && (
        <div className="space-y-4">
          {myInvited.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/80 border-slate-800 space-y-3">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Pending Brand Invitations</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                When brands review your portfolio and send custom direct invitations, they will appear here.
              </p>
            </Card>
          ) : (
            myInvited.map(camp => (
              <Card key={camp.id} className="p-6 bg-slate-900/90 border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <Badge variant="accent" size="sm" className="mb-2">Brand Invitation 💌</Badge>
                  <h4 className="text-base font-bold text-white">{camp.name}</h4>
                  <p className="text-xs text-slate-400">{camp.brandName} invited you with custom brief • Reward: {camp.rewardDisplay}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/creator/campaigns/${camp.id}`}>
                    <Button size="sm" variant="primary">
                      Review &amp; Accept Invitation
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* MODAL: Submit Video Pitch / Pictures to Brand */}
      {isSubmitModalOpen && (
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title="Submit Content or Video Pitch to Brand"
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmitModal} className="space-y-5">
            {/* Mode Selector */}
            <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setSubmissionMode('pitch')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  submissionMode === 'pitch'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎥 Video Pitch / Campaign Proposal
              </button>
              <button
                type="button"
                onClick={() => setSubmissionMode('deliverable')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  submissionMode === 'deliverable'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📸 Final Pictures / Video Deliverable
              </button>
            </div>

            {/* Campaign Select */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Target Campaign &amp; Brand
              </label>
              <select
                value={selectedCampaignId}
                onChange={e => setSelectedCampaignId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none cursor-pointer"
              >
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.brandName} - {c.name} ({c.rewardDisplay})
                  </option>
                ))}
              </select>
            </div>

            {/* Deliverable Format */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Content / Deliverable Format
              </label>
              <select
                value={deliverableType}
                onChange={e => setDeliverableType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="Instagram Reel">Instagram Reel (Vertical 9:16)</option>
                <option value="YouTube Short">YouTube Short</option>
                <option value="Picture / Photo Post">Picture / Photo Post (High-Res Image)</option>
                <option value="UGC Video">UGC Video / Product Demonstration</option>
                <option value="Video Pitch">Creative Video Pitch &amp; Walkthrough</option>
              </select>
            </div>

            {/* Title / Heading */}
            <Input
              label={submissionMode === 'pitch' ? 'Pitch Video Title' : 'Deliverable Title'}
              placeholder="e.g. Cinematic Streetwear Transition Walk / Glass Skin Morning Routine"
              value={pitchTitle}
              onChange={e => setPitchTitle(e.target.value)}
              required
            />

            {/* Concept Pitch / Caption */}
            <Textarea
              label={submissionMode === 'pitch' ? 'Concept Pitch & Talking Points' : 'Post Caption & Creator Notes'}
              placeholder="Explain how you will represent the brand, lighting setup, angles, and key call-to-actions..."
              rows={3}
              value={conceptPitch}
              onChange={e => setConceptPitch(e.target.value)}
              required
            />

            {/* File Upload or Media URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Attach Video / Picture File or URL
              </label>
              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/70 hover:border-pink-500/50 transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Supports MP4, MOV, WebM videos, and JPG/PNG photos. Files are converted into live playback preview.
                </span>
              </div>

              {uploadedPreview && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-700 mt-2">
                  {uploadedPreview.startsWith('data:video') ? (
                    <video src={uploadedPreview} controls className="w-full h-full object-contain" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={uploadedPreview} alt="Preview" className="w-full h-full object-contain" />
                  )}
                </div>
              )}

              <Input
                label="Or enter Media URL"
                placeholder="https://..."
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                {submissionMode === 'pitch' ? 'Submit Pitch to Brand 🚀' : 'Submit Final Content 🎬'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Watch Video Pitch / Picture Playback */}
      {isVideoModalOpen && (
        <Modal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          title={`Observing Deliverable: ${selectedVideoTitle || 'Pitch Video'}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
              {selectedVideoUrl && (selectedVideoUrl.endsWith('.mp4') || selectedVideoUrl.startsWith('data:video')) ? (
                <video
                  src={selectedVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="relative w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedVideoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'}
                    alt={selectedVideoTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-slate-700 text-center max-w-sm">
                      <Film className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-white">{selectedVideoTitle}</h4>
                      <p className="text-xs text-slate-300 mt-1">High-Definition Pitch Presentation</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedVideoDescription && (
              <p className="text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                {selectedVideoDescription}
              </p>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <Button size="sm" variant="outline" onClick={() => setIsVideoModalOpen(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
