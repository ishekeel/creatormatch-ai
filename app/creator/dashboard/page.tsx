'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { AiMatchAgentModal } from '@/components/ai/AiMatchAgentModal';
import { calculateCreatorBrandMatch } from '@/services/matchingService';
import { CampaignApplication, Brand, MatchScore } from '@/types';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Briefcase,
  Play,
  Film,
  Building2,
  Send,
  Video,
  Bot,
  UserCheck,
  Clock,
  CheckCircle2,
  Copy,
  Link as LinkIcon,
} from 'lucide-react';

export default function CreatorDashboardPage() {
  const {
    activeCreator,
    brands,
    campaigns,
    campaignApplications,
    connections,
    sendConnectionRequest,
    addToast,
  } = useApp();

  // Watch Pitch Reel Modal State
  const [activePitchModal, setActivePitchModal] = useState<CampaignApplication | null>(null);

  // AI Agent Modal State
  const [selectedAgentBrand, setSelectedAgentBrand] = useState<{
    brand: Brand;
    match: MatchScore;
  } | null>(null);

  // Creator's applications
  const myApplications = campaignApplications.filter(
    app => app.creatorId === activeCreator.id || app.creatorName === activeCreator.name
  );
  const acceptedApplications = myApplications.filter(a => a.status === 'accepted');

  // Connected brands count
  const connectedBrandsCount = connections.filter(
    c => (c.senderId === activeCreator.id || c.receiverId === activeCreator.id) && c.status === 'accepted'
  ).length;

  // Top recommended brands for this creator
  const recommendedBrands = brands
    .map(brand => ({
      brand,
      match: calculateCreatorBrandMatch(activeCreator, brand, campaigns),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* 1. Clean Creator Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-4">
          <Avatar src={activeCreator.avatar} name={activeCreator.name} size="lg" online={activeCreator.verified} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Welcome back, {activeCreator.name} 👋
              </h2>
              <Badge variant="brand" size="sm">
                Verified Creator
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeCreator.handle} • {activeCreator.niche.join(', ')} • {activeCreator.location}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-pink-300">
                Creator ID: {activeCreator.id || 'cre-verified'}
              </span>
              <button
                type="button"
                onClick={() => {
                  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/brand/creators?id=${activeCreator.id}` : `https://creatormatch.ai/creator/${activeCreator.id}`;
                  navigator.clipboard?.writeText(shareUrl);
                  addToast({
                    title: 'Creator Profile Link Copied! 📋',
                    message: `Share this link with brands to discover and hire your Creator ID.`,
                    type: 'success',
                  });
                }}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-slate-800"
              >
                <Copy className="w-3 h-3" />
                <span>Copy ID Link</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/creator/portfolio">
            <Button size="md" variant="outline" leftIcon={<Film className="w-4 h-4 text-pink-400" />}>
              + Upload Reel
            </Button>
          </Link>
          <Link href="/creator/my-campaigns">
            <Button size="md" variant="primary" leftIcon={<Layers className="w-4 h-4" />}>
              My Campaigns Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Simple 4-Card Overview Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Applied Campaigns"
          value={`${myApplications.length}`}
          subtitle="Pitches submitted"
          icon={<Briefcase className="w-4 h-4 text-brand-400" />}
        />
        <StatCard
          title="Active Partnerships"
          value={`${acceptedApplications.length}`}
          subtitle="Hired & participating"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        />
        <StatCard
          title="Connected Brands"
          value={`${connectedBrandsCount}`}
          subtitle="Direct chat unlocked"
          icon={<Building2 className="w-4 h-4 text-cyan-400" />}
        />
        <StatCard
          title="Audience Reach"
          value={activeCreator.highestFollowersDisplay || activeCreator.followersDisplay || '0'}
          subtitle="Verified follower base"
          icon={<Sparkles className="w-4 h-4 text-pink-400" />}
        />
      </div>

      {/* 3. My Applied Campaigns & Pitches Section */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              My Applied Campaigns & Submitted Pitches
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track the campaigns you applied for, inspect your submitted pitch videos, and monitor sponsor responses.
            </p>
          </div>
          <Link href="/creator/my-campaigns">
            <Button size="sm" variant="ghost" className="text-xs text-brand-300">
              View All in My Campaigns →
            </Button>
          </Link>
        </div>

        {myApplications.length > 0 ? (
          <div className="space-y-3">
            {myApplications.slice(0, 3).map(app => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {app.brandName ? app.brandName[0] : 'B'}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white truncate">{app.campaignName}</h4>
                      <Badge variant="brand" size="sm">
                        {app.brandName}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {app.deliverableType}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      &quot;{app.conceptPitch}&quot;
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span>Match Fit: <strong className="text-emerald-400">{app.matchScore}%</strong></span>
                      <span>•</span>
                      <span>Applied: {app.appliedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Pitch Video & Status */}
                <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
                  {app.pitchVideoUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActivePitchModal(app)}
                      className="text-xs"
                      leftIcon={<Play className="w-3.5 h-3.5 text-pink-400" />}
                    >
                      Watch My Pitch Reel
                    </Button>
                  )}

                  {app.status === 'accepted' ? (
                    <Badge variant="emerald" size="md">
                      Hired by Brand ✓
                    </Badge>
                  ) : app.status === 'declined' ? (
                    <Badge variant="neutral" size="md">
                      Declined
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="md">
                      Under Review ⏳
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            You haven&apos;t applied to any campaigns yet. Browse available campaigns and submit your first pitch video!
          </div>
        )}
      </Card>

      {/* 4. Top Matched Brand Sponsors for this Creator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Top AI-Matched Brand Sponsors for You
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Brands looking for creators in {activeCreator.niche.join(', ')} with verified audience synergy.
            </p>
          </div>

          <Link href="/creator/find-brands">
            <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Find More Brands
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedBrands.map(({ brand, match }) => {
            const brandCamp = campaigns.find(c => c.brandId === brand.id);
            return (
              <Card
                key={brand.id}
                className="p-5 bg-slate-900/90 border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-brand-300">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                      <span>{match.overallScore}% AI Fit</span>
                    </div>
                    <Badge variant={match.overallScore >= 80 ? 'brand' : 'accent'} size="sm">
                      {match.recommendationVerdict || 'Strong Fit'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <Avatar src={brand.logo} name={brand.name} size="md" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{brand.name}</h4>
                      <p className="text-xs text-slate-400">{brand.industry}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedAgentBrand({ brand, match })}
                      className="text-xs flex-1 text-brand-300 border border-slate-800"
                    >
                      <Bot className="w-3.5 h-3.5 mr-1" />
                      Consult AI Agent
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendConnectionRequest(brand.id)}
                      className="text-xs shrink-0"
                    >
                      Connect
                    </Button>
                  </div>

                  {brandCamp && (
                    <Link href={`/creator/campaigns/${brandCamp.id}`}>
                      <Button size="sm" variant="primary" className="w-full text-xs">
                        Apply with Pitch Video
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Watch Pitch Reel Modal */}
      {activePitchModal && (
        <Modal
          isOpen={!!activePitchModal}
          onClose={() => setActivePitchModal(null)}
          title={`My Submitted Pitch Video for ${activePitchModal.campaignName}`}
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
                  <div className="relative z-10 w-16 h-16 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-xl animate-pulse mb-3">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <h4 className="relative z-10 text-base font-bold text-white max-w-sm">
                    {activePitchModal.pitchVideoTitle || 'My Video Reel Submission'}
                  </h4>
                  <p className="relative z-10 text-xs text-slate-300 mt-1">
                    Deliverable Format: <span className="text-pink-300 font-bold">{activePitchModal.deliverableType}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                My Creative Concept Pitch
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activePitchModal.conceptPitch}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Sponsor Brand: <strong className="text-white">{activePitchModal.brandName}</strong>
              </span>

              <Button variant="outline" size="sm" onClick={() => setActivePitchModal(null)}>
                Close Video Player
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Match Agent Modal */}
      {selectedAgentBrand && (
        <AiMatchAgentModal
          isOpen={!!selectedAgentBrand}
          onClose={() => setSelectedAgentBrand(null)}
          brand={selectedAgentBrand.brand}
          creator={activeCreator}
          matchScore={selectedAgentBrand.match}
        />
      )}
    </div>
  );
}
