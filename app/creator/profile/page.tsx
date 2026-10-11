'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input, Textarea } from '@/components/ui/Input';
import {
  User,
  ShieldCheck,
  Instagram,
  Youtube,
  Globe,
  MapPin,
  Mail,
  Camera,
  Sparkles,
  Briefcase,
  Layers,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Video,
  Award,
  Link as LinkIcon,
  Copy,
  Check,
  Share2,
} from 'lucide-react';

const AVAILABLE_SECTORS = [
  'Food & Cooking',
  'Fashion & Modeling',
  'Gaming & Esports',
  'Technology & Gadgets',
  'Health & Fitness',
  'Beauty & Skincare',
  'Parenting & Baby',
  'Travel & Lifestyle',
];

export default function CreateCreatorProfilePage() {
  const { activeCreator, updateCreatorProfile, addToast } = useApp();

  const [name, setName] = useState(activeCreator.name || '');
  const [handle, setHandle] = useState(activeCreator.handle || '');
  const [email, setEmail] = useState(activeCreator.email || `${activeCreator.handle?.replace('@', '') || 'creator'}@gmail.com`);
  const [avatar, setAvatar] = useState(activeCreator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
  const [bio, setBio] = useState(activeCreator.bio || '');
  const [location, setLocation] = useState(activeCreator.location || '');
  const [primarySector, setPrimarySector] = useState(activeCreator.niche?.[0] || 'Lifestyle');
  const [secondaryNiches, setSecondaryNiches] = useState<string[]>(
    activeCreator.niche?.slice(1) || []
  );
  const [newNicheInput, setNewNicheInput] = useState('');

  // Socials
  const igSocial = activeCreator.socialPlatforms?.find(s => s.platform === 'instagram');
  const ytSocial = activeCreator.socialPlatforms?.find(s => s.platform === 'youtube');
  const [instagramHandle, setInstagramHandle] = useState(igSocial?.handle || `@${activeCreator.handle?.replace('@', '') || 'creator'}`);
  const [instagramFollowers, setInstagramFollowers] = useState(igSocial?.followers || activeCreator.followers || 0);
  const [youtubeHandle, setYoutubeHandle] = useState(ytSocial?.handle || '');
  const [youtubeFollowers, setYoutubeFollowers] = useState(ytSocial?.followers || 0);

  // Social Profile Link & Creator ID Discovery Feature
  const [socialLinkInput, setSocialLinkInput] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleResolveSocialLink = (inputUrl: string) => {
    setSocialLinkInput(inputUrl);
    const trimmed = inputUrl.trim();
    if (!trimmed) return;

    if (trimmed.includes('instagram.com/')) {
      const match = trimmed.match(/instagram\.com\/([a-zA-Z0-9_.]+)/);
      if (match && match[1]) {
        const extracted = `@${match[1].replace(/\/$/, '')}`;
        setInstagramHandle(extracted);
        addToast({
          title: 'Instagram Link Mapped! 📸',
          message: `Identified handle ${extracted} and linked with Creator ID: ${activeCreator.id || 'cre-verified'}.`,
          type: 'success',
        });
        return;
      }
    }

    if (trimmed.includes('youtube.com/') || trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/youtube\.com\/(?:@|c\/|channel\/)?([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const extracted = `@${match[1].replace(/\/$/, '')}`;
        setYoutubeHandle(extracted);
        addToast({
          title: 'YouTube Channel Mapped! 🎬',
          message: `Identified channel ${extracted} and linked with Creator ID: ${activeCreator.id || 'cre-verified'}.`,
          type: 'success',
        });
        return;
      }
    }

    addToast({
      title: 'Social Link Recorded! 🌐',
      message: `Profile link connected with Creator ID: ${activeCreator.id || 'cre-verified'}.`,
      type: 'info',
    });
  };

  // Brand Collaborations
  const [pastBrands, setPastBrands] = useState<string[]>(
    activeCreator.pastBrandsWorkedWith || []
  );
  const [newBrandInput, setNewBrandInput] = useState('');

  // Video pitch or portfolio sample
  const [videoPitchUrl, setVideoPitchUrl] = useState(
    activeCreator.portfolio?.[0]?.url || ''
  );

  const handleAddNiche = () => {
    if (!newNicheInput.trim()) return;
    if (!secondaryNiches.includes(newNicheInput.trim())) {
      setSecondaryNiches([...secondaryNiches, newNicheInput.trim()]);
    }
    setNewNicheInput('');
  };

  const handleRemoveNiche = (niche: string) => {
    setSecondaryNiches(secondaryNiches.filter(n => n !== niche));
  };

  const handleAddBrand = () => {
    if (!newBrandInput.trim()) return;
    if (!pastBrands.includes(newBrandInput.trim())) {
      setPastBrands([...pastBrands, newBrandInput.trim()]);
    }
    setNewBrandInput('');
  };

  const handleRemoveBrand = (brandName: string) => {
    setPastBrands(pastBrands.filter(b => b !== brandName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const maxFollowers = Math.max(Number(instagramFollowers) || 0, Number(youtubeFollowers) || 0);
    const followersDisplay = maxFollowers >= 1000000
      ? `${(maxFollowers / 1000000).toFixed(1)}M`
      : maxFollowers >= 1000
      ? `${(maxFollowers / 1000).toFixed(0)}K`
      : `${maxFollowers}`;

    const updatedNicheList = [primarySector, ...secondaryNiches];

    updateCreatorProfile({
      name,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      email,
      avatar,
      bio,
      location,
      niche: updatedNicheList,
      categories: updatedNicheList,
      followers: maxFollowers,
      followersDisplay,
      pastBrandsWorkedWith: pastBrands,
      socialPlatforms: [
        {
          platform: 'instagram',
          handle: instagramHandle,
          followers: Number(instagramFollowers) || 0,
          engagement: 7.2,
          url: `https://instagram.com/${instagramHandle.replace('@', '')}`,
        },
        ...(youtubeHandle ? [{
          platform: 'youtube' as const,
          handle: youtubeHandle,
          followers: Number(youtubeFollowers) || 0,
          engagement: 6.5,
          url: `https://youtube.com/@${youtubeHandle.replace('@', '')}`,
        }] : []),
      ],
      socialUrls: {
        instagram: `https://instagram.com/${instagramHandle.replace('@', '')}`,
        ...(youtubeHandle ? { youtube: `https://youtube.com/@${youtubeHandle.replace('@', '')}` } : {}),
      },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Creator Identity &amp; AI Matching Setup</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Create &amp; Manage Creator Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete your creator portfolio, primary industry niche, social reach, and past brand sponsorships. This powers AI matching to recommend your profile as #1 priority to brands in your sector.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card & Avatar */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar src={avatar} name={name} size="xl" />
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{name || 'Creator Name'}</h3>
                  <Badge variant="emerald" size="sm">
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                    Verified Creator
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {handle || '@handle'} • {primarySector}
                </p>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile
            </Button>
          </div>

          {/* Form Fields: Name, Handle, Email, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Chef Kabir Sen"
              required
            />
            <Input
              label="Creator Handle (@)"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              placeholder="e.g. @chefkabir"
              required
            />
            <Input
              label="Contact Email ID"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. kabir@culinarysen.com"
              required
            />
            <Input
              label="Location / Base City"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, Maharashtra, India"
              required
            />
          </div>

          <Input
            label="Profile Photo / Avatar Image URL"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            placeholder="https://..."
            helperText="Enter a high-resolution headshot image URL or portfolio photo."
          />

          <Textarea
            label="Creator Bio & Brand Pitch"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            placeholder="Introduce yourself, your content style, audience demographics, and what makes your collaborations stand out..."
            required
          />
        </Card>

        {/* Primary Sector & AI Recommendation Taxonomy */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3>Industry Sector &amp; AI Matching Taxonomy</h3>
          </div>
          <p className="text-xs text-slate-400">
            Select your exact industry sector. CreatorMatch AI uses this as a deterministic gatekeeper to suggest brands in your sector as #1 First Priority (95%+ match).
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Primary Industry Sector
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_SECTORS.map(sector => (
                <button
                  type="button"
                  key={sector}
                  onClick={() => setPrimarySector(sector)}
                  className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                    primarySector.toLowerCase().includes(sector.toLowerCase().split(' ')[0])
                      ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Sub-Niches */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Sub-Niches &amp; Specialties
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {secondaryNiches.map(niche => (
                <span
                  key={niche}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <span>{niche}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNiche(niche)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNicheInput}
                onChange={e => setNewNicheInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNiche();
                  }
                }}
                placeholder="Add sub-niche (e.g. Artisan Baking, Cold-Pressed Cooking, Restaurant Vlogs)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddNiche} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </div>
          </div>
        </Card>

        {/* Creator ID & Social Media Link Discovery Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950/25 border-pink-500/30 space-y-5 shadow-lg shadow-pink-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                <LinkIcon className="w-4 h-4" />
                <span>Creator ID &amp; Social Platform Link Discovery</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Paste your Instagram, YouTube, or other social media platform profile link below to connect your accounts, discover your unique Creator ID, and generate your shareable public profile URL.
              </p>
            </div>
            <Badge variant="brand" size="md">
              ID: {activeCreator.id || 'cre-verified'}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Paste Social Profile Link (Instagram, YouTube, etc.)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={socialLinkInput}
                  onChange={e => handleResolveSocialLink(e.target.value)}
                  placeholder="Paste link: https://instagram.com/yourhandle or https://youtube.com/@channel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => handleResolveSocialLink(socialLinkInput)}
              >
                Resolve ID &amp; Link
              </Button>
            </div>
          </div>

          {/* Resolved Creator ID & Shareable Public Profile URL */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Your Official Creator ID
              </span>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono font-bold text-pink-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 select-all">
                  {activeCreator.id || 'cre-verified'}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeCreator.id || 'cre-verified');
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                    addToast({
                      title: 'Creator ID Copied! 📋',
                      message: `Creator ID ${activeCreator.id || 'cre-verified'} copied to clipboard.`,
                      type: 'success',
                    });
                  }}
                  leftIcon={copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copiedId ? 'Copied' : 'Copy ID'}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Shareable Creator ID Profile Link
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/brand/creators?id=${activeCreator.id}` : `https://creatormatch.ai/creator/${activeCreator.id}`}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono select-all focus:outline-none truncate"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/brand/creators?id=${activeCreator.id}` : `https://creatormatch.ai/creator/${activeCreator.id}`;
                    navigator.clipboard?.writeText(shareUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                    addToast({
                      title: 'Profile Link Copied! 🔗',
                      message: 'Share this link with brands to discover and hire your Creator ID.',
                      type: 'success',
                    });
                  }}
                  leftIcon={copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                >
                  {copiedLink ? 'Copied' : 'Copy Link'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media Details & Highest Followers */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-slate-800">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3>Social Media Handles &amp; Verified Follower Counts</h3>
          </div>
          <p className="text-xs text-slate-400">
            Enter your active social channels. The highest follower count across your channels determines your platform reach tier.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                <Instagram className="w-4 h-4" />
                <span>Instagram Profile</span>
              </div>
              <Input
                label="Instagram Handle"
                value={instagramHandle}
                onChange={e => setInstagramHandle(e.target.value)}
                placeholder="@username"
              />
              <Input
                label="Followers Count"
                type="number"
                value={instagramFollowers}
                onChange={e => setInstagramFollowers(Number(e.target.value))}
                placeholder="150000"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs">
                <Youtube className="w-4 h-4" />
                <span>YouTube Channel</span>
              </div>
              <Input
                label="YouTube Channel / Handle"
                value={youtubeHandle}
                onChange={e => setYoutubeHandle(e.target.value)}
                placeholder="@channel"
              />
              <Input
                label="Subscribers Count"
                type="number"
                value={youtubeFollowers}
                onChange={e => setYoutubeFollowers(Number(e.target.value))}
                placeholder="220000"
              />
            </div>
          </div>
        </Card>

        {/* Past Brand Collaborations (User Requirement) */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-slate-800">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <h3>Previously Worked With Brands</h3>
          </div>
          <p className="text-xs text-slate-400">
            List brands and corporate sponsors you have previously collaborated with. Brands value verified past partnership experience.
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {pastBrands.map(b => (
              <span
                key={b}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{b}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBrand(b)}
                  className="text-amber-400 hover:text-rose-400 ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBrandInput}
              onChange={e => setNewBrandInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddBrand();
                }
              }}
              placeholder="Add previously collaborated brand (e.g. FreshPlate Gourmet, Cult.fit, Nike)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <Button type="button" size="sm" variant="outline" onClick={handleAddBrand} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Brand
            </Button>
          </div>
        </Card>

        {/* Portfolio & Video Pitch Sample */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-slate-800">
            <Video className="w-5 h-5 text-emerald-400" />
            <h3>Signature Portfolio Reel / Video Pitch Link</h3>
          </div>
          <p className="text-xs text-slate-400">
            Provide a direct public link to your top-performing reel, video review, or showcase post. Brands review this when inspecting your applications.
          </p>

          <Input
            label="Video Post / Portfolio Reel URL"
            value={videoPitchUrl}
            onChange={e => setVideoPitchUrl(e.target.value)}
            placeholder="https://instagram.com/reel/... or https://youtube.com/shorts/..."
            leftIcon={<LinkIcon className="w-4 h-4 text-slate-500" />}
          />
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 py-3 font-bold"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save &amp; Update Creator Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
