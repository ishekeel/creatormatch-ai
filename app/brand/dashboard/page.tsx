'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { StatCard } from '@/components/ui/StatCard';
import { CreatorCard } from '@/components/brand/CreatorCard';
import { AiMatchAgentModal } from '@/components/ai/AiMatchAgentModal';
import { calculateBrandCreatorMatch } from '@/services/matchingService';
import { CampaignApplication, Creator, MatchScore } from '@/types';
import { Modal } from '@/components/ui/Modal';
import {
  Megaphone,
  Users,
  Eye,
  PlusCircle,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Video,
  Play,
  Check,
  X,
  Bot,
  UserCheck,
  Clock,
} from 'lucide-react';

export default function BrandDashboardPage() {
  const {
    activeBrand,
    campaigns,
    creators,
    campaignApplications,
    acceptCampaignApplication,
    declineCampaignApplication,
    connections,
  } = useApp();

  // Watch Pitch Video Modal State
  const [activePitchModal, setActivePitchModal] = useState<CampaignApplication | null>(null);

  // AI Agent Modal State
  const [selectedAgentCreator, setSelectedAgentCreator] = useState<{
    creator: Creator;
    match: MatchScore;
  } | null>(null);

  // Campaigns strictly belonging to the active brand
  const brandCampaigns = campaigns.filter(c => c.brandId === activeBrand.id);
  const activeCampaign = brandCampaigns.find(c => c.status === 'active') || brandCampaigns[0] || campaigns[0];

  // Applications for this brand
  const brandApplications = campaignApplications.filter(
    app => app.brandId === activeBrand.id || !app.brandId || app.campaignId.includes(activeBrand.id.replace('brand-', ''))
  );
  const pendingApplications = brandApplications.filter(a => a.status === 'pending');

  // Connected creators for this brand
  const connectedCreatorsCount = connections.filter(
    c => (c.senderId === activeBrand.id || c.receiverId === activeBrand.id) && c.status === 'accepted'
  ).length;

  // Calculate top AI matches specifically for the ACTIVE brand
  const recommendedCreators = creators
    .map(c => ({
      creator: c,
      match: calculateBrandCreatorMatch(activeBrand, c, activeCampaign),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* 1. Brand Overview Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-4">
          <Avatar src={activeBrand.logo} name={activeBrand.name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeBrand.name}
              </h2>
              <Badge variant="brand" size="sm">
                Verified Brand Sponsor
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeBrand.industry} • {activeBrand.location} • {brandCampaigns.length} Active Campaigns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/brand/creators">
            <Button size="md" variant="outline" leftIcon={<Sparkles className="w-4 h-4 text-brand-400" />}>
              Discover Creators
            </Button>
          </Link>
          <Link href="/brand/campaigns/new">
            <Button size="md" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
              + Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Simple 4-Card Overview Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Campaigns"
          value={`${brandCampaigns.length}`}
          subtitle="Currently running"
          icon={<Megaphone className="w-4 h-4 text-brand-400" />}
        />
        <StatCard
          title="Creator Pitches"
          value={`${pendingApplications.length}`}
          subtitle="Pending pitch review"
          icon={<Video className="w-4 h-4 text-pink-400" />}
        />
        <StatCard
          title="Connected Creators"
          value={`${connectedCreatorsCount}`}
          subtitle="Direct chat unlocked"
          icon={<UserCheck className="w-4 h-4 text-emerald-400" />}
        />
        <StatCard
          title="Total Audience Reach"
          value={activeBrand.stats?.totalReach || '0'}
          subtitle="Campaign impressions"
          icon={<Eye className="w-4 h-4 text-cyan-400" />}
        />
      </div>

      {/* 3. Creator Pitch Videos & Proposals Queue */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-pink-400" />
              Creator Pitch Proposals & Video Submissions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review video reels, concept pitches, and hire relevant creators with 1 click.
            </p>
          </div>
          <Link href="/brand/campaigns">
            <Button size="sm" variant="ghost" className="text-xs text-brand-300">
              View All Briefs →
            </Button>
          </Link>
        </div>

        {brandApplications.length > 0 ? (
          <div className="space-y-3">
            {brandApplications.slice(0, 3).map(app => {
              const appCreator = creators.find(c => c.id === app.creatorId);
              return (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-700"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Avatar src={app.creatorAvatar} name={app.creatorName} size="md" />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white truncate">{app.creatorName}</span>
                        <span className="text-xs text-slate-400">{app.creatorHandle}</span>
                        <Badge variant="brand" size="sm">
                          {app.matchScore}% AI Match
                        </Badge>
                        <Badge variant="neutral" size="sm">
                          {app.deliverableType}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2">
                        &quot;{app.conceptPitch}&quot;
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span>Campaign: <strong className="text-slate-300">{app.campaignName}</strong></span>
                        <span>•</span>
                        <span>Applied: {app.appliedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pitch Action Buttons */}
                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                    {app.pitchVideoUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActivePitchModal(app)}
                        className="text-xs"
                        leftIcon={<Play className="w-3.5 h-3.5 text-pink-400" />}
                      >
                        Watch Pitch Reel
                      </Button>
                    )}

                    {appCreator && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const match = calculateBrandCreatorMatch(activeBrand, appCreator, activeCampaign);
                          setSelectedAgentCreator({ creator: appCreator, match });
                        }}
                        className="text-xs text-brand-300 border border-slate-800"
                        title="Consult AI Match Agent"
                      >
                        <Bot className="w-3.5 h-3.5 mr-1" />
                        AI Agent
                      </Button>
                    )}

                    {app.status === 'accepted' ? (
                      <Badge variant="emerald" size="md">
                        Hired & Connected ✓
                      </Badge>
                    ) : app.status === 'declined' ? (
                      <Badge variant="neutral" size="md">
                        Declined
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => acceptCampaignApplication(app.id)}
                          className="text-xs"
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          Accept & Hire
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => declineCampaignApplication(app.id)}
                          className="text-xs text-slate-400 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            No pending creator pitches. Verified creators will submit campaign proposals here.
          </div>
        )}
      </Card>

      {/* 4. Top Recommended Creators for Active Brand */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Top AI-Matched Creators for {activeBrand.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked dynamically according to {activeBrand.industry} relevance, product fit, and audience demographics.
            </p>
          </div>

          <Link href="/brand/creators">
            <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Discover All ({creators.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedCreators.map(({ creator, match }) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              matchScore={match}
              campaignId={activeCampaign?.id || 'camp-1'}
              isInvited={activeCampaign?.invitedCreatorIds.includes(creator.id) || false}
            />
          ))}
        </div>
      </div>

      {/* Watch Pitch Video Modal */}
      {activePitchModal && (
        <Modal
          isOpen={!!activePitchModal}
          onClose={() => setActivePitchModal(null)}
          title={`Pitch Reel from ${activePitchModal.creatorName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 -mt-2">
            <div className="relative rounded-2xl overflow-hidden aspect-[9/14] max-h-[460px] mx-auto bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
              {(activePitchModal.pitchVideoUrl || '').startsWith('data:video') ? (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  src={activePitchModal.pitchVideoUrl}
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePitchModal.pitchVideoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80'}
                    alt={activePitchModal.pitchVideoTitle || 'Pitch Video'}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="relative z-10 w-16 h-16 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-xl animate-pulse mb-3">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <h4 className="relative z-10 text-base font-bold text-white max-w-sm">
                    {activePitchModal.pitchVideoTitle || 'Creator Campaign Pitch Reel'}
                  </h4>
                  <p className="relative z-10 text-xs text-slate-300 mt-1">
                    Format: <span className="text-brand-300 font-bold">{activePitchModal.deliverableType}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Creative Hook & Concept Pitch Notes
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activePitchModal.conceptPitch}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Compatibility: <strong className="text-emerald-400">{activePitchModal.matchScore}% AI Match</strong>
              </span>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActivePitchModal(null)}>
                  Close
                </Button>
                {activePitchModal.status !== 'accepted' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      acceptCampaignApplication(activePitchModal.id);
                      setActivePitchModal(null);
                    }}
                  >
                    Accept Pitch & Hire Creator
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Match Agent Modal */}
      {selectedAgentCreator && (
        <AiMatchAgentModal
          isOpen={!!selectedAgentCreator}
          onClose={() => setSelectedAgentCreator(null)}
          brand={activeBrand}
          creator={selectedAgentCreator.creator}
          matchScore={selectedAgentCreator.match}
        />
      )}
    </div>
  );
}
