'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import {
  Megaphone,
  PlusCircle,
  Users,
  Eye,
  Activity,
  ShoppingCart,
  Coins,
  ArrowRight,
  ArrowLeft,
  Video,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Film,
  Trophy,
  Flame,
} from 'lucide-react';
import { CampaignApplication, Challenge } from '@/types';

export default function BrandCampaignsPage() {
  const {
    campaigns,
    campaignApplications,
    challenges,
    acceptCampaignApplication,
    declineCampaignApplication,
    activeBrand,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('active');
  const [selectedVideoApp, setSelectedVideoApp] = useState<CampaignApplication | null>(null);

  const brandApplications = campaignApplications.filter(
    app => app.brandId === activeBrand.id || campaigns.some(c => c.id === app.campaignId)
  );

  const pendingApps = brandApplications.filter(a => a.status === 'pending');

  const tabs = [
    { id: 'active', label: 'Active Campaigns', badge: campaigns.filter(c => c.status === 'active').length },
    {
      id: 'requests',
      label: 'Creator Requests & Pitch Videos',
      badge: pendingApps.length > 0 ? pendingApps.length : undefined,
    },
    {
      id: 'challenges',
      label: 'Meme & Creative Challenges',
      badge: challenges.length > 0 ? challenges.length : undefined,
    },
    { id: 'completed', label: 'Completed', badge: 1 },
  ];

  const filteredCampaigns = campaigns.filter(c => {
    if (activeTab === 'active') return c.status === 'active';
    if (activeTab === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Campaign &amp; Challenge Management
            </h2>
            {pendingApps.length > 0 && (
              <Badge variant="brand" size="md" className="animate-pulse">
                {pendingApps.length} New Pitch {pendingApps.length === 1 ? 'Request' : 'Requests'}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track active creator collaborations, review incoming pitch videos &amp; deliverables, and manage viral meme challenges.
          </p>
        </div>

        {/* Dual Actions: Standard Campaign + Meme Challenge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/brand/campaigns/new?type=challenge">
            <Button size="md" variant="secondary" leftIcon={<Sparkles className="w-4 h-4 text-amber-400" />}>
              + Create Meme Challenge
            </Button>
          </Link>
          <Link href="/brand/campaigns/new">
            <Button size="md" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
              + Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab: Creator Requests & Pitch Videos */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-950 to-pink-950/40 border border-brand-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-brand-400" />
                Incoming Creator Campaign Applications &amp; Pitches
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Creators submit authentic pitch videos and concepts for your review. Accept a pitch to automatically hire them and unlock direct messaging.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-300">
              Total Proposals: <strong className="text-white">{brandApplications.length}</strong>
            </div>
          </div>

          {brandApplications.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/60 border-slate-800 space-y-3">
              <Video className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Creator Requests Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                When content creators discover your campaigns and submit their deliverable concepts &amp; pitch videos, they will appear here for instant review and hiring.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {brandApplications.map(app => (
                <Card
                  key={app.id}
                  className={`p-6 bg-slate-900/90 border transition-all ${
                    app.status === 'pending'
                      ? 'border-brand-500/40 shadow-lg shadow-brand-500/5'
                      : app.status === 'accepted'
                      ? 'border-emerald-500/30'
                      : 'border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Creator & Proposal Details */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <Avatar
                        src={app.creatorAvatar}
                        alt={app.creatorName}
                        name={app.creatorName}
                        size="lg"
                        className="border border-slate-700 shrink-0"
                      />

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-white">{app.creatorName}</h4>
                          <span className="text-xs text-slate-400 font-mono">@{app.creatorHandle}</span>
                          <Badge variant="brand" size="sm">
                            {app.deliverableType}
                          </Badge>
                          <Badge
                            variant={
                              app.status === 'accepted'
                                ? 'emerald'
                                : app.status === 'declined'
                                ? 'neutral'
                                : 'accent'
                            }
                            size="sm"
                          >
                            {app.status === 'pending'
                              ? 'Pending Review'
                              : app.status === 'accepted'
                              ? 'Accepted & Hired'
                              : 'Declined'}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-300">
                          Applied for campaign:{' '}
                          <strong className="text-white">{app.campaignName}</strong>
                        </p>

                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider">
                            Proposed Concept &amp; Pitch
                          </span>
                          <p className="text-xs text-slate-300 font-medium">
                            &quot;{app.pitchVideoTitle}&quot;
                          </p>
                          <p className="text-xs text-slate-400 italic">
                            &quot;{app.conceptPitch}&quot;
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions & Video Pitch CTA */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0 w-full lg:w-auto">
                      <div className="flex items-center gap-2">
                        <Badge variant="brand" size="md">
                          {app.matchScore}% AI Fit
                        </Badge>
                        <span className="text-[11px] text-slate-500">{app.appliedAt}</span>
                      </div>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setSelectedVideoApp(app)}
                        leftIcon={<Play className="w-3.5 h-3.5" />}
                      >
                        Watch Pitch Video 🎥
                      </Button>

                      <div className="flex items-center gap-2 pt-1">
                        {app.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => declineCampaignApplication(app.id)}
                              leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-400" />}
                            >
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acceptCampaignApplication(app.id)}
                              leftIcon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                            >
                              Accept &amp; Hire
                            </Button>
                          </>
                        ) : app.status === 'accepted' ? (
                          <Link href="/brand/messages">
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                            >
                              Message Creator
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-500 italic text-center">
                            Application archived
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Meme & Creative Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-pink-950/40 border border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Active Viral Meme &amp; Creative Challenges ({challenges.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Run viral video and meme contests where hundreds of creators compete for prize pool rewards.
              </p>
            </div>
            <Link href="/brand/campaigns/new?type=challenge">
              <Button size="sm" variant="primary" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                + New Challenge
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map(chal => (
              <Card key={chal.id} className="p-6 bg-slate-900/90 border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{chal.name}</h4>
                      <Badge variant="warning" size="sm">Active Contest 🔥</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Brand: {chal.brandName} • Product: {chal.product}
                    </p>
                  </div>

                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                    Prize: {chal.prizePool.totalDisplay}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {chal.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20">
                    {chal.hashtag}
                  </span>
                  <span className="text-xs text-slate-400">
                    Format: <strong className="text-white">{chal.submissionType}</strong>
                  </span>
                </div>

                {/* Prize Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">1st Place</span>
                    <span className="font-bold text-white">₹{chal.prizePool.first.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">2nd Place</span>
                    <span className="font-bold text-white">₹{chal.prizePool.second.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">3rd Place</span>
                    <span className="font-bold text-white">₹{chal.prizePool.third.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">
                    Active Participants: <strong className="text-emerald-400">{chal.participantsCount} creators</strong>
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      addToast({
                        title: 'Challenge Dashboard',
                        message: `Inspecting entries for ${chal.name}`,
                        type: 'info',
                      });
                    }}
                  >
                    View Entries ({chal.participantsCount})
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns Grid for Active/Completed */}
      {activeTab !== 'requests' && activeTab !== 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map(camp => {
            const campApps = brandApplications.filter(a => a.campaignId === camp.id);
            const pendingCampApps = campApps.filter(a => a.status === 'pending');

            return (
              <Card key={camp.id} hover className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={camp.productImage}
                      alt={camp.product}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white leading-tight">{camp.name}</h4>
                        <Badge variant="success" size="sm">Active</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Product: {camp.product} • {camp.category}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {camp.rewardDisplay}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {camp.description}
                </p>

                {/* Incoming Requests Banner */}
                {pendingCampApps.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-brand-950/40 border border-brand-800/40 flex items-center justify-between text-xs">
                    <span className="font-semibold text-brand-300 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-brand-400" />
                      {pendingCampApps.length} Creator Pitch {pendingCampApps.length === 1 ? 'Video' : 'Videos'} Pending
                    </span>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="text-xs font-bold text-white hover:text-brand-300 underline"
                    >
                      Review Pitches →
                    </button>
                  </div>
                )}

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Creators</span>
                    <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-slate-400" />
                      {camp.acceptedCreatorIds.length + (camp.invitedCreatorIds.length > 0 ? 1 : 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Reach</span>
                    <span className="font-bold text-brand-400 flex items-center justify-center gap-1 mt-0.5">
                      <Eye className="w-3 h-3 text-brand-400" />
                      {camp.reach}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Engagement</span>
                    <span className="font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                      <Activity className="w-3 h-3 text-emerald-400" />
                      {camp.engagement}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Conversions</span>
                    <span className="font-bold text-pink-400 flex items-center justify-center gap-1 mt-0.5">
                      <ShoppingCart className="w-3 h-3 text-pink-400" />
                      {camp.conversions}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Deadline: <strong className="text-slate-200">{camp.deadlineDisplay}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <Link href={`/brand/campaigns/${camp.id}`}>
                      <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Details &amp; Brief
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pitch Video Watch Modal with HTML5 Playback */}
      {selectedVideoApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-brand-400" />
                  {selectedVideoApp.pitchVideoTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  Pitch Video by {selectedVideoApp.creatorName} (@{selectedVideoApp.creatorHandle}) for{' '}
                  <strong className="text-white">{selectedVideoApp.campaignName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedVideoApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
                {(selectedVideoApp.pitchVideoUrl || '').startsWith('data:video') || (selectedVideoApp.pitchVideoUrl || '').endsWith('.mp4') ? (
                  <video
                    src={selectedVideoApp.pitchVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedVideoApp.pitchVideoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'}
                      alt={selectedVideoApp.pitchVideoTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-slate-700 text-center max-w-sm">
                        <Play className="w-10 h-10 text-brand-400 mx-auto mb-2 animate-pulse" />
                        <h4 className="text-sm font-bold text-white">{selectedVideoApp.pitchVideoTitle}</h4>
                        <p className="text-xs text-slate-300 mt-1">Creator Deliverable Concept</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                    Creative Pitch &amp; Angle
                  </span>
                  <Badge variant="brand" size="sm">
                    {selectedVideoApp.matchScore}% AI Score
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedVideoApp.conceptPitch}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400">
                  Deliverable format: <strong className="text-white">{selectedVideoApp.deliverableType}</strong>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedVideoApp(null)}
                  >
                    Close
                  </Button>
                  {selectedVideoApp.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        acceptCampaignApplication(selectedVideoApp.id);
                        setSelectedVideoApp(null);
                      }}
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                    >
                      Accept Pitch &amp; Hire Creator
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
