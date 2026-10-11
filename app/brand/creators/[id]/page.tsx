'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { MatchScoreBreakdown } from '@/components/brand/MatchScoreBreakdown';
import { AiMatchAgentModal } from '@/components/ai/AiMatchAgentModal';
import { calculateBrandCreatorMatch } from '@/services/matchingService';
import { PortfolioItem } from '@/types';
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Globe,
  Coins,
  Trophy,
  Activity,
  Eye,
  MessageSquare,
  ShieldCheck,
  Share2,
  Calendar,
  Instagram,
  Youtube,
  Play,
  ArrowLeft,
  ExternalLink,
  Building,
  Film,
  UserPlus,
  Clock,
  UserCheck,
  Bot,
} from 'lucide-react';

export default function CreatorProfileBrandViewPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = (params?.id as string) || '';
  const {
    getCreatorById,
    campaigns,
    inviteCreatorToCampaign,
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    connections,
    activeBrand,
    addToast,
  } = useApp();
  const [activeTab, setActiveTab] = useState('match');
  const [activeVideoModal, setActiveVideoModal] = useState<PortfolioItem | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const creator = getCreatorById(creatorId) || getCreatorById('creator-maya') || getCreatorById('creator-ananya')!;
  const brandCampaign = campaigns.find(c => c.brandId === activeBrand.id) || campaigns[0];
  const match = calculateBrandCreatorMatch(activeBrand, creator, brandCampaign);
  const isInvited = brandCampaign?.invitedCreatorIds.includes(creator.id);

  const tabs = [
    { id: 'match', label: 'AI Match Analysis', icon: <Sparkles className="w-4 h-4 text-brand-400" /> },
    { id: 'portfolio', label: `Verified Portfolio & Reels (${creator.portfolio.length})`, icon: <Play className="w-4 h-4" /> },
    { id: 'audience', label: 'Audience Demographics', icon: <Eye className="w-4 h-4" /> },
    { id: 'campaigns', label: 'Verified Brand Track Record', icon: <Trophy className="w-4 h-4" /> },
  ];

  const handleInvite = () => {
    if (brandCampaign) {
      inviteCreatorToCampaign(brandCampaign.id, creator.id);
    }
  };

  const handleMessage = () => {
    router.push('/brand/messages');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Back to discovery button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Creator Discovery
      </button>

      {/* Profile Header Hero Card */}
      <Card className="bg-slate-900/90 border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <Avatar src={creator.avatar} name={creator.name} size="xl" online={creator.verified} />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {creator.name}
                </h2>
                {creator.verified && (
                  <Badge variant="brand" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                    Verified Partner
                  </Badge>
                )}
                <Badge variant={match.overallScore >= 80 ? 'accent' : 'warning'} size="sm">
                  {match.overallScore}% AI Match
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {creator.handle} • {creator.niche.join(' • ')}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {creator.location}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {creator.languages.join(', ')}
                </span>
              </div>

              {/* Creator Social Profiles & Highest Follower Count */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Highest Follower Base:
                </span>
                <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-pink-400">
                  {creator.highestFollowersDisplay || creator.followersDisplay}
                </span>

                {creator.socialUrls?.instagram && (
                  <a
                    href={`https://${creator.socialUrls.instagram.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-semibold hover:bg-pink-500/20 transition-all"
                  >
                    <Instagram className="w-3 h-3" />
                    Instagram Profile
                  </a>
                )}
                {creator.socialUrls?.youtube && (
                  <a
                    href={`https://${creator.socialUrls.youtube.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-all"
                  >
                    <Youtube className="w-3 h-3" />
                    YouTube Channel
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs: LinkedIn Connection System + Campaign Invite */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
            {getConnectionStatus(creator.id) === 'connected' ? (
              <Button
                variant="outline"
                size="md"
                onClick={handleMessage}
                leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}
              >
                Message (Connected ✓)
              </Button>
            ) : getConnectionStatus(creator.id) === 'pending_sent' ? (
              <Button
                variant="secondary"
                size="md"
                disabled
                leftIcon={<Clock className="w-4 h-4 text-amber-400" />}
              >
                Connection Pending ⏳
              </Button>
            ) : getConnectionStatus(creator.id) === 'pending_received' ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const req = connections.find(c => c.senderId === creator.id && c.receiverId === activeBrand.id);
                  if (req) acceptConnectionRequest(req.id);
                }}
                leftIcon={<UserCheck className="w-4 h-4" />}
              >
                Accept Connection
              </Button>
            ) : (
              <Button
                variant="outline"
                size="md"
                onClick={() => sendConnectionRequest(creator.id)}
                leftIcon={<UserPlus className="w-4 h-4 text-brand-400" />}
              >
                Connect with Creator
              </Button>
            )}

            <Button
              variant={isInvited ? 'secondary' : 'primary'}
              size="md"
              onClick={handleInvite}
              disabled={isInvited}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              {isInvited ? 'Invitation Sent ✓' : 'Invite to Campaign'}
            </Button>
          </div>
        </div>

        {/* Past Brands Collaborations */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="text-slate-400 font-bold uppercase text-[10px]">Past Brand Collaborations:</span>
            <div className="flex flex-wrap gap-1.5">
              {(creator.pastBrandsWorkedWith || ['Calvin Fashion', 'Zara International', 'StyleWear', 'H&M Studio']).map(b => (
                <span key={b} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 6 Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-center">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Followers</span>
            <span className="text-lg font-bold text-white">{creator.followersDisplay}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Views</span>
            <span className="text-lg font-bold text-white">{creator.avgViews}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Engagement</span>
            <span className="text-lg font-bold text-emerald-400">{creator.engagementDisplay}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Creator Score</span>
            <span className="text-lg font-bold text-brand-400">{creator.creatorScore} / 100</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Creator Credits</span>
            <span className="text-lg font-bold text-amber-400">{creator.creatorCredits}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Campaign Wins</span>
            <span className="text-lg font-bold text-pink-400">{creator.campaignWins} 🏆</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: AI Match Analysis */}
      {activeTab === 'match' && (
        <div className="space-y-6">
          {/* AI Matchmaker Bot Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-900 to-pink-950/40 border border-brand-800/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-400" />
                <h4 className="text-base font-bold text-white">
                  Explainable AI Matchmaker Agent
                </h4>
                <Badge variant={match.overallScore >= 80 ? 'emerald' : 'warning'} size="sm">
                  {match.overallScore}% Synergy
                </Badge>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                Get an objective audit of why {creator.name} matches {activeBrand.name}, including synergy drivers and potential mismatch reasons.
              </p>
            </div>

            <Button
              size="md"
              variant="primary"
              onClick={() => setIsAgentModalOpen(true)}
              leftIcon={<Bot className="w-4 h-4" />}
            >
              Ask AI Agent Bot 🤖
            </Button>
          </div>

          <MatchScoreBreakdown match={match} creatorName={creator.name} />
        </div>
      )}

      {/* Tab 2: Verified Portfolio & Video Reels */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-brand-400" />
              Verified Content Portfolio ({creator.portfolio.length} Deliverables)
            </h3>
            <span className="text-xs text-slate-400">Click any reel or video to watch and inspect delivery metrics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {creator.portfolio.map(item => (
              <Card
                key={item.id}
                hover
                className="p-0 overflow-hidden bg-slate-900 border-slate-800 space-y-0 group cursor-pointer hover:border-brand-500/50 transition-all flex flex-col justify-between"
                onClick={() => setActiveVideoModal(item)}
              >
                <div>
                  <div className="relative rounded-t-xl overflow-hidden aspect-[9/14] bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] uppercase font-bold text-white px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700">
                        {item.type}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 space-y-1">
                      <p className="text-xs font-bold text-white line-clamp-2">{item.title}</p>
                      <p className="text-[11px] text-brand-300 font-semibold">
                        Brand: {item.brandName || 'Organic UGC'}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5">
                        <span className="font-bold text-white">{item.views.toLocaleString()} views</span>
                        <span className="text-emerald-400 font-bold">{item.engagement}% eng</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border-t border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveVideoModal(item);
                    }}
                    leftIcon={<Play className="w-3.5 h-3.5 text-brand-400" />}
                  >
                    Watch Video Post
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Audience Demographics */}
      {activeTab === 'audience' && (
        <Card className="bg-slate-900 border-slate-800 p-6 space-y-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Audience Demographics &amp; Top Resonance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Age Distribution</span>
              <div className="space-y-2 text-xs">
                {Object.entries(creator.audience.ageBreakdown).map(([age, pct]) => (
                  <div key={age} className="flex items-center justify-between">
                    <span className="text-slate-400">{age} years</span>
                    <span className="font-bold text-white">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Gender Split</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Female</span>
                  <span className="font-bold text-white">{creator.audience.genderSplit.female}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Male</span>
                  <span className="font-bold text-white">{creator.audience.genderSplit.male}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Top Locations</span>
              <div className="space-y-2 text-xs">
                {creator.audience.topLocations.map(loc => (
                  <div key={loc} className="flex items-center justify-between">
                    <span className="text-slate-400">{loc}</span>
                    <span className="font-bold text-white">Dominant Region</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Verified Campaign Experience */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Verified Brand Campaigns &amp; Testimonials
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {creator.verifiedCampaigns.map(vcamp => (
              <Card key={vcamp.id} className="p-5 bg-slate-900 border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={vcamp.brandLogo} name={vcamp.brandName} size="sm" />
                    <div>
                      <h5 className="text-sm font-bold text-white">{vcamp.brandName}</h5>
                      <p className="text-[11px] text-slate-400">{vcamp.campaignName}</p>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm">{vcamp.badge}</Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300 py-2 border-y border-slate-800/80">
                  <span>Reach: <strong className="text-white">{vcamp.reach}</strong></span>
                  <span>Engagement: <strong className="text-emerald-400">{vcamp.engagement}</strong></span>
                  <span>Year: <strong>{vcamp.year}</strong></span>
                </div>

                {vcamp.testimonial && (
                  <p className="text-xs text-slate-400 italic">
                    &quot;{vcamp.testimonial}&quot;
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Watch Video Post Modal with HTML5 Playback Controls */}
      {activeVideoModal && (
        <Modal
          isOpen={!!activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          title={`Observing Content: ${activeVideoModal.title}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              {(activeVideoModal.videoUrl || '').startsWith('data:video') || (activeVideoModal.videoUrl || '').endsWith('.mp4') ? (
                <video
                  src={activeVideoModal.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="relative w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeVideoModal.thumbnail}
                    alt={activeVideoModal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-xl animate-pulse mb-3">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <h4 className="text-base font-bold text-white max-w-md">{activeVideoModal.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Brand Collaboration: <span className="text-brand-300 font-bold">{activeVideoModal.brandName || 'Organic UGC'}</span>
                    </p>
                    {activeVideoModal.videoUrl && (
                      <a
                        href={activeVideoModal.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                      >
                        Inspect Post on Social Media <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Deliverable Format</span>
                <span className="text-sm font-bold text-white uppercase">{activeVideoModal.type}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivered Views</span>
                <span className="text-sm font-bold text-brand-300">{activeVideoModal.views.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Engagement</span>
                <span className="text-sm font-bold text-emerald-400">{activeVideoModal.engagement}%</span>
              </div>
            </div>

            {activeVideoModal.description && (
              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {activeVideoModal.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Verified Creator: <strong className="text-white">{creator.name}</strong>
              </span>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveVideoModal(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setActiveVideoModal(null);
                    handleInvite();
                  }}
                  disabled={isInvited}
                >
                  {isInvited ? 'Invited ✓' : 'Invite Creator to Campaign'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Matchmaker Agent Bot Modal */}
      {isAgentModalOpen && (
        <AiMatchAgentModal
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
          creator={creator}
          brand={activeBrand}
          matchScore={match}
        />
      )}
    </div>
  );
}
