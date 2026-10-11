'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { PortfolioItem } from '@/types';
import {
  ShieldCheck,
  Trophy,
  Coins,
  Sparkles,
  ExternalLink,
  Play,
  Eye,
  Activity,
  Droplets,
  Share2,
  Calendar,
  PlusCircle,
  Instagram,
  Youtube,
  Globe,
  CheckCircle2,
  Film,
  Building,
  Video,
  Upload,
} from 'lucide-react';

export default function CreatorPortfolioPage() {
  const { activeCreator, addCreatorPortfolioItem } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  // Add Portfolio Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'reel' | 'ugc' | 'meme' | 'review'>('reel');
  const [newBrandName, setNewBrandName] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80');
  const [newViews, setNewViews] = useState('185000');
  const [newEngagement, setNewEngagement] = useState('7.8');
  const [newDescription, setNewDescription] = useState('');
  const [videoFileUploading, setVideoFileUploading] = useState(false);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFileUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewVideoUrl(reader.result);
          setNewThumbnail('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80');
          setVideoFileUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Watch Video Modal state
  const [activeVideoModal, setActiveVideoModal] = useState<PortfolioItem | null>(null);

  const filteredPortfolio = activeCreator.portfolio.filter(p => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addCreatorPortfolioItem({
      title: newTitle,
      type: newType,
      brandName: newBrandName || 'Self-Produced UGC',
      thumbnail: newThumbnail || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      url: newVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoUrl: newVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: Number(newViews) || 100000,
      engagement: Number(newEngagement) || 5.0,
      description: newDescription || 'High-conversion organic video asset created for brand partnership.',
      date: 'Just now',
    });

    // Reset and close
    setNewTitle('');
    setNewBrandName('');
    setNewVideoUrl('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Professional Creator Portfolio (LinkedIn for Creators)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Proof-of-Work Media Kit &amp; Video Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build your verifiable track record of video reels, brand collaborations, views, and audience engagement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            + Add Video Post / Work
          </Button>
          <Button variant="outline" size="md" leftIcon={<Share2 className="w-4 h-4" />}>
            Share Portfolio
          </Button>
        </div>
      </div>

      {/* Creator Profile Summary & Social Media Hub */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={activeCreator.avatar} name={activeCreator.name} size="xl" online={activeCreator.verified} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-white">{activeCreator.name}</h3>
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <Badge variant="brand" size="sm">Verified Partner</Badge>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {activeCreator.handle} • {activeCreator.location}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {activeCreator.niche.map(n => (
                  <Badge key={n} variant="neutral" size="sm">{n}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Social Media Channels & Highest Followers */}
          <div className="flex flex-col sm:items-end gap-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Highest Follower Base:
            </span>
            <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-pink-400">
              {activeCreator.highestFollowersDisplay || activeCreator.followersDisplay}
            </div>

            {/* Social Profile Links */}
            <div className="flex items-center gap-2 pt-1">
              {activeCreator.socialUrls?.instagram && (
                <a
                  href={`https://${activeCreator.socialUrls.instagram.replace(/^https?:\/\//, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-semibold hover:bg-pink-500/20 transition-all"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram
                </a>
              )}
              {activeCreator.socialUrls?.youtube && (
                <a
                  href={`https://${activeCreator.socialUrls.youtube.replace(/^https?:\/\//, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-all"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  YouTube
                </a>
              )}
              {(!activeCreator.socialUrls || (!activeCreator.socialUrls.instagram && !activeCreator.socialUrls.youtube)) && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Instagram className="w-3.5 h-3.5 text-pink-400" /> @{activeCreator.handle.replace('@', '')}</span>
                  <span className="flex items-center gap-1"><Youtube className="w-3.5 h-3.5 text-red-400" /> Channel</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Past Brands Worked With */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="text-slate-400 font-bold uppercase text-[10px]">Past Brand Collaborations:</span>
            <div className="flex flex-wrap gap-1.5">
              {(activeCreator.pastBrandsWorkedWith || ['Nike', 'Puma', 'GlowRush', 'Mamaearth', 'Minimalist']).map(b => (
                <span key={b} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 6 Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-center">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Followers</span>
            <span className="text-base font-bold text-white">{activeCreator.followersDisplay}</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Views</span>
            <span className="text-base font-bold text-white">{activeCreator.avgViews}</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Engagement</span>
            <span className="text-base font-bold text-emerald-400">{activeCreator.engagementDisplay}</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Creator Score</span>
            <span className="text-base font-bold text-brand-300">{activeCreator.creatorScore}/100</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Credits</span>
            <span className="text-base font-bold text-amber-300">{activeCreator.creatorCredits}</span>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Wins</span>
            <span className="text-base font-bold text-pink-300">{activeCreator.campaignWins} 🏆</span>
          </div>
        </div>

        {/* Water Emission Savings in Portfolio */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-semibold">
              Verified Sustainable Creator: {activeCreator.sustainability?.waterEmissionSavedLiters.toLocaleString() || '3,420'}L Water Offset Recorded in Database
            </span>
          </div>
          <Badge variant="emerald" size="sm">Eco-Audited</Badge>
        </div>
      </Card>

      {/* Content Portfolio Gallery (Reels, Videos, Memes, Reviews) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">
              Video Posts &amp; Portfolio Deliverables ({activeCreator.portfolio.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {(['all', 'reel', 'ugc', 'meme', 'review'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                    filterType === f
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<PlusCircle className="w-3.5 h-3.5 text-brand-400" />}
            >
              Add Video
            </Button>
          </div>
        </div>

        {/* Video Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPortfolio.map(item => (
            <Card
              key={item.id}
              className="p-0 overflow-hidden bg-slate-900/90 border-slate-800 group hover:border-brand-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className="relative aspect-video bg-black overflow-hidden cursor-pointer"
                  onClick={() => setActiveVideoModal(item)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="brand" size="sm">{item.type.toUpperCase()}</Badge>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur text-[10px] text-white font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-300" />
                    {item.views.toLocaleString()} views
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white line-clamp-2">{item.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-300">
                      Brand: <span className="text-white font-bold">{item.brandName || 'Organic UGC'}</span>
                    </span>
                    <span className="text-emerald-400 font-bold">{item.engagement}% Eng.</span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 pt-1">{item.description}</p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveVideoModal(item)}
                  leftIcon={<Play className="w-3.5 h-3.5 text-brand-400" />}
                >
                  Watch Video Post
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Verified Campaign Experience */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Verified Brand Track Record
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCreator.verifiedCampaigns.map(vcamp => (
            <Card key={vcamp.id} className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar src={vcamp.brandLogo} name={vcamp.brandName} size="md" />
                  <div>
                    <h4 className="text-base font-bold text-white">{vcamp.brandName}</h4>
                    <span className="text-xs text-slate-400">{vcamp.campaignName}</span>
                  </div>
                </div>
                <Badge variant="accent" size="sm">{vcamp.badge}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Audited Reach</span>
                  <span className="font-bold text-white">{vcamp.reach}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Verified Engagement</span>
                  <span className="font-bold text-emerald-400">{vcamp.engagement}</span>
                </div>
              </div>

              {vcamp.testimonial && (
                <p className="text-xs text-slate-300 italic border-l-2 border-brand-500 pl-3">
                  &quot;{vcamp.testimonial}&quot;
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Add Portfolio Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Video Post to Portfolio"
        maxWidth="lg"
      >
        <form onSubmit={handleAddPortfolio} className="space-y-4">
          <p className="text-xs text-slate-400">
            Showcase your past video reels, brand collaborations, views, and engagement metrics to verified brand creators.
          </p>

          <Input
            label="Video Title / Concept"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="e.g. 60-second Glass Skin Routine with Natural Sunlight"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deliverable Format
              </label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="reel">Instagram Reel</option>
                <option value="ugc">UGC Product Video</option>
                <option value="review">In-Depth Review</option>
                <option value="meme">Viral Meme Challenge</option>
              </select>
            </div>

            <Input
              label="Brand Worked With"
              value={newBrandName}
              onChange={e => setNewBrandName(e.target.value)}
              placeholder="e.g. Nike, GlowRush, Puma"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Real-Time Video Upload (Stored in Platform)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-md shadow-pink-600/20">
                <Upload className="w-3.5 h-3.5" />
                <span>{videoFileUploading ? 'Processing File...' : 'Upload Video File (.mp4)'}</span>
                <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
              </label>
              <span className="text-xs text-slate-500">or paste direct link below</span>
            </div>

            {newVideoUrl && newVideoUrl.startsWith('data:video') && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Video file loaded and ready to be stored in the platform database!</span>
              </div>
            )}
          </div>

          <Input
            label="Video Post URL (or leave uploaded video)"
            value={newVideoUrl.startsWith('data:video') ? '[Uploaded Local Video File]' : newVideoUrl}
            onChange={e => {
              if (!newVideoUrl.startsWith('data:video')) {
                setNewVideoUrl(e.target.value);
              }
            }}
            placeholder="e.g. https://www.instagram.com/reel/xyz123"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Views Delivered"
              type="number"
              value={newViews}
              onChange={e => setNewViews(e.target.value)}
              placeholder="185000"
            />

            <Input
              label="Engagement Rate (%)"
              type="number"
              step="0.1"
              value={newEngagement}
              onChange={e => setNewEngagement(e.target.value)}
              placeholder="7.8"
            />
          </div>

          <Input
            label="Cover Image / Thumbnail URL"
            value={newThumbnail}
            onChange={e => setNewThumbnail(e.target.value)}
            placeholder="https://..."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Description / Results Achieved
            </label>
            <textarea
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="Describe creative angle, hook, audience sentiment, and conversion results..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500 min-h-[70px]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Post Video &amp; Store in Platform
            </Button>
          </div>
        </form>
      </Modal>

      {/* Watch Video Post Modal */}
      {activeVideoModal && (
        <Modal
          isOpen={!!activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          title={activeVideoModal.title}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              {activeVideoModal.videoUrl && (activeVideoModal.videoUrl.startsWith('data:video') || activeVideoModal.videoUrl.includes('.mp4') || activeVideoModal.videoUrl.startsWith('blob:')) ? (
                <video
                  src={activeVideoModal.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeVideoModal.thumbnail}
                    alt={activeVideoModal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-xl animate-pulse mb-3">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <h4 className="text-base font-bold text-white max-w-md">{activeVideoModal.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Brand Collaboration: {activeVideoModal.brandName || 'Organic UGC'}
                    </p>
                    {activeVideoModal.videoUrl && (
                      <a
                        href={activeVideoModal.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                      >
                        Watch on Social Media <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Deliverable Format</span>
                <span className="text-sm font-bold text-white uppercase">{activeVideoModal.type}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Audited Views</span>
                <span className="text-sm font-bold text-brand-300">{activeVideoModal.views.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Engagement Rate</span>
                <span className="text-sm font-bold text-emerald-400">{activeVideoModal.engagement}%</span>
              </div>
            </div>

            {activeVideoModal.description && (
              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {activeVideoModal.description}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setActiveVideoModal(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
