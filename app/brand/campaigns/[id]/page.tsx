'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import {
  ArrowLeft,
  ArrowRight,
  Megaphone,
  Users,
  Eye,
  Activity,
  Calendar,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Video,
  FileCheck,
  Settings,
  Droplets,
  Package,
  Play,
  Film,
  MessageSquare,
  ShieldCheck,
  Camera,
  Hash,
  AtSign,
  Gift,
} from 'lucide-react';
import { CampaignApplication } from '@/types';

export default function BrandCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || '';
  const {
    campaigns,
    creators,
    submissions,
    approveSubmission,
    campaignApplications,
    acceptCampaignApplication,
    declineCampaignApplication,
  } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVideoApp, setSelectedVideoApp] = useState<CampaignApplication | null>(null);

  const campaign = campaigns.find(c => c.id === campaignId) || campaigns[0];

  const campaignSubmissions = submissions.filter(
    s => s.campaignId === campaign?.id || s.brandName === campaign?.brandName
  );
  const acceptedCreators = creators.filter(
    c => campaign?.acceptedCreatorIds?.includes(c.id) || campaign?.invitedCreatorIds?.includes(c.id)
  );

  const campaignProposals = campaignApplications.filter(a => a.campaignId === campaign?.id);
  const pendingProposals = campaignProposals.filter(a => a.status === 'pending');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Megaphone className="w-4 h-4" /> },
    {
      id: 'proposals',
      label: `Pitch Proposals (${campaignProposals.length})`,
      icon: <Video className="w-4 h-4" />,
    },
    { id: 'creators', label: `Hired Creators (${acceptedCreators.length})`, icon: <Users className="w-4 h-4" /> },
    { id: 'submissions', label: `Content Deliverables (${campaignSubmissions.length})`, icon: <FileCheck className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const guidelines = campaign?.guidelines;

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Campaign Not Found</h2>
        <p className="text-xs text-slate-400">The campaign you are looking for does not exist or is loading.</p>
        <button
          onClick={() => router.push('/brand/campaigns')}
          className="text-xs text-brand-400 hover:underline"
        >
          ← Back to All Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-16">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/brand/campaigns')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Campaigns
        </button>

        <button
          onClick={() => router.forward()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          Forward <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Header Banner */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.productImage}
              alt={campaign.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {campaign.name}
                </h2>
                <Badge variant={campaign.status === 'active' ? 'emerald' : 'neutral'} size="sm">
                  {campaign.status.toUpperCase()}
                </Badge>
                <Badge variant="brand" size="sm">
                  {campaign.category}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Product: <strong className="text-white">{campaign.product}</strong> • Objective:{' '}
                <strong className="text-brand-300">{campaign.objective}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/brand/campaigns/new?clone=${campaign.id}`}>
              <Button variant="outline" size="sm">
                Duplicate Campaign
              </Button>
            </Link>
            <Link href="/brand/creators">
              <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
                Find More Creators
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-center">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Budget</span>
            <span className="text-lg font-bold text-white">{campaign.rewardDisplay}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Reach</span>
            <span className="text-lg font-bold text-brand-300">{campaign.reach}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Engagement</span>
            <span className="text-lg font-bold text-emerald-400">{campaign.engagement}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Conversions</span>
            <span className="text-lg font-bold text-pink-400">{campaign.conversions.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {pendingProposals.length > 0 && (
            <div className="p-4 rounded-2xl bg-brand-950/50 border border-brand-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-brand-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {pendingProposals.length} Creator Pitch {pendingProposals.length === 1 ? 'Proposal' : 'Proposals'} Awaiting Review
                  </h4>
                  <p className="text-xs text-slate-400">
                    Review creative sample videos, hook pitches, and hire relevant creators.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="accent" onClick={() => setActiveTab('proposals')}>
                View Pitches & Videos
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 bg-slate-900/90 border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Campaign Brief & Description</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {campaign.description}
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Audience</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Age Range</span>
                    <span className="font-semibold text-white">
                      {typeof campaign?.targetAudience === 'object' ? campaign.targetAudience?.age || 'All Ages' : 'All Ages'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Gender Split</span>
                    <span className="font-semibold text-white">
                      {typeof campaign?.targetAudience === 'object' ? campaign.targetAudience?.gender || 'All' : 'All'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Geography</span>
                    <span className="font-semibold text-white truncate">
                      {typeof campaign?.targetAudience === 'object' ? campaign.targetAudience?.location || 'India' : (typeof campaign?.targetAudience === 'string' ? campaign.targetAudience : 'India')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Languages</span>
                    <span className="font-semibold text-white truncate">
                      {typeof campaign?.targetAudience === 'object' ? campaign.targetAudience?.language || 'English' : 'English'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Interests</h4>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(campaign?.targetAudience?.interests) && campaign.targetAudience.interests.length > 0 ? (
                    campaign.targetAudience.interests.map(i => (
                      <Badge key={i} variant="neutral" size="sm">{i}</Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">General Audience</span>
                  )}
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white">Deliverables & Rewards</h3>
                <div className="space-y-2.5">
                  {(campaign?.deliverables || []).map(del => (
                    <div key={del.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-brand-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">{del.type}</span>
                          <span className="text-[10px] text-slate-400">{del.quantity} item required</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">₹{(del.reward || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white">Campaign Timeline</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Start Date:</span>
                    <span className="font-semibold text-white">{campaign?.timeline?.startDate || 'Immediate'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">End Date:</span>
                    <span className="font-semibold text-white">{campaign?.timeline?.endDate || '30 Days'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Submission Deadline:</span>
                    <span className="font-semibold text-brand-300">{campaign?.timeline?.submissionDeadline || '15 Days'}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Guidelines Section in Detail */}
          {guidelines && (
            <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                Active Campaign Guidelines & Creative Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white block">Visual Aesthetic & Tone:</span>
                  <p className="text-xs text-slate-300">{guidelines.visualAesthetic || 'Authentic & Creative'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white block">Technical Specs:</span>
                  <p className="text-xs text-slate-300">
                    {guidelines.technicalSpecs
                      ? `${guidelines.technicalSpecs.aspectRatio || '9:16'} • ${guidelines.technicalSpecs.resolution || '1080p'} • ${guidelines.technicalSpecs.minDurationSeconds || 15}s-${guidelines.technicalSpecs.maxDurationSeconds || 60}s duration`
                      : '9:16 • 1080p • 15s-60s duration'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">Content Do&apos;s:</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {(guidelines.contentDos || []).map((d, i) => (
                      <li key={i}>✓ {d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                  <span className="text-xs font-bold text-rose-400 block">Content Don&apos;ts:</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {(guidelines.contentDonts || []).map((d, i) => (
                      <li key={i}>✕ {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Pitch Proposals */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Creator Proposals for &quot;{campaign.name}&quot;
              </h3>
              <p className="text-xs text-slate-400">
                Creators submit authentic pitch deliverables and concepts for your campaign.
              </p>
            </div>
            <Badge variant="brand" size="md">
              {campaignProposals.length} Total Applications
            </Badge>
          </div>

          {campaignProposals.length === 0 ? (
            <Card className="p-12 text-center bg-slate-900/60 border-slate-800 space-y-3">
              <Video className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Proposals Submitted Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Invite relevant creators from the &quot;Find More Creators&quot; tab or wait for creators to apply with pitch videos.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {campaignProposals.map(app => (
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
                          <Badge variant="brand" size="sm">{app.deliverableType}</Badge>
                          <Badge
                            variant={
                              app.status === 'accepted'
                                ? 'emerald'
                                : app.status === 'declined'
                                ? 'neutral'
                                : 'brand'
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

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 mt-2">
                          <span className="font-bold text-brand-300 block">
                            Pitch: &quot;{app.pitchVideoTitle}&quot;
                          </span>
                          <p className="text-slate-300 leading-relaxed italic">
                            &quot;{app.conceptPitch}&quot;
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto justify-between lg:justify-end">
                      <div className="text-center">
                        <ProgressRing score={app.matchScore} size={65} sublabel="Fit" />
                      </div>

                      <button
                        onClick={() => setSelectedVideoApp(app)}
                        className="relative group w-28 h-20 rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center shrink-0 hover:border-brand-500 transition-all cursor-pointer shadow-md"
                        title="Click to play pitch video"
                      >
                        {(app.pitchVideoUrl || '').startsWith('data:video') ? (
                          <video
                            src={app.pitchVideoUrl}
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={app.pitchVideoUrl}
                            alt="Pitch thumbnail"
                            className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform"
                            onError={e => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                      </button>

                      <div className="flex flex-col gap-2 min-w-[140px]">
                        {app.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => acceptCampaignApplication(app.id)}
                              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                            >
                              Accept & Hire
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => declineCampaignApplication(app.id)}
                              className="text-slate-400 hover:text-rose-400"
                            >
                              Decline
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
                            Archived
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

      {/* Tab: Hired Creators */}
      {activeTab === 'creators' && (
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Collaborating Creators ({acceptedCreators.length})
            </h3>
            <Link href="/brand/creators">
              <Button size="sm" variant="outline" leftIcon={<Sparkles className="w-4 h-4" />}>
                Invite Creators
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedCreators.map(c => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={c.avatar} alt={c.name} name={c.name} size="md" />
                  <div>
                    <span className="text-xs font-bold text-white block">{c.name}</span>
                    <span className="text-[10px] text-slate-400">
                      @{c.handle} • {c.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="emerald" size="sm">Active</Badge>
                  <Link href="/brand/messages">
                    <Button size="sm" variant="ghost" className="p-2">
                      <MessageSquare className="w-4 h-4 text-brand-400" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: Submissions */}
      {activeTab === 'submissions' && (
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">
            Creator Deliverables ({campaignSubmissions.length})
          </h3>

          {campaignSubmissions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No final content deliverables submitted yet for this campaign.
            </p>
          ) : (
            <div className="space-y-3">
              {campaignSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.thumbnail}
                      alt={sub.caption}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{sub.creatorName}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{sub.type} Deliverable</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sub.status !== 'approved' && (
                      <Button size="sm" variant="primary" onClick={() => approveSubmission(sub.id)}>
                        Approve Content
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab: Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-2 text-center">
            <span className="text-xs text-slate-400 uppercase font-bold">Impressions Generated</span>
            <div className="text-3xl font-black text-white">1,420,800</div>
            <span className="text-xs text-emerald-400 font-semibold">+22% over benchmark</span>
          </Card>
          <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-2 text-center">
            <span className="text-xs text-slate-400 uppercase font-bold">Click-Through Rate</span>
            <div className="text-3xl font-black text-brand-300">4.8%</div>
            <span className="text-xs text-emerald-400 font-semibold">High purchase intent</span>
          </Card>
          <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-2 text-center">
            <span className="text-xs text-slate-400 uppercase font-bold">Return on Ad Spend (ROAS)</span>
            <div className="text-3xl font-black text-pink-400">5.2x</div>
            <span className="text-xs text-emerald-400 font-semibold">₹78,000 attributed revenue</span>
          </Card>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-white">Campaign Controls</h3>
          <p className="text-xs text-slate-400">
            Pause, complete, or adjust budget and creator invitation criteria.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Button variant="outline" size="sm">Pause Campaign</Button>
            <Button variant="secondary" size="sm">Export Analytics CSV</Button>
          </div>
        </Card>
      )}

      {/* Pitch Video Watch Modal */}
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
                  Pitch Video by {selectedVideoApp.creatorName} (@{selectedVideoApp.creatorHandle})
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
                {(selectedVideoApp.pitchVideoUrl || '').startsWith('data:video') ? (
                  <video
                    src={selectedVideoApp.pitchVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedVideoApp.pitchVideoUrl}
                    alt={selectedVideoApp.pitchVideoTitle}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                    Creative Pitch & Angle
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
                      Accept Pitch & Hire Creator
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
