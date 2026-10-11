'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import {
  Sparkles,
  Building2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Send,
  Video,
  ShieldCheck,
  Briefcase,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { calculateCreatorToBrandMatch } from '@/lib/ai/matchingEngine';

export default function FindBrandsForYouPage() {
  const {
    activeCreator,
    brands,
    campaigns,
    connections,
    sendConnectionRequest,
    addToast,
  } = useApp();

  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'match' | 'campaigns' | 'alpha'>('match');
  const [expandedBrandId, setExpandedBrandId] = useState<string | null>(null);
  const [savedBrandIds, setSavedBrandIds] = useState<string[]>([]);

  const industries = [
    'All',
    'Fashion & Apparel',
    'Gaming & Esports',
    'Technology',
    'Health & Fitness',
    'Food & Beverage',
    'Beauty & Skincare',
    'Baby Care & Sustainability',
  ];

  // Calculate dynamic reverse match for each brand against the active creator
  const matchedBrands = useMemo(() => {
    return brands.map(brand => {
      // Adapt brand to DB format
      const dbBrand: any = {
        id: brand.id,
        brand_name: brand.name,
        logo: brand.logo,
        description: brand.description,
        industry: brand.industry,
        sector_key: brand.industry.toLowerCase(),
        location: brand.location,
        target_audience: {
          age: '18-34',
          gender: 'All',
          description: brand.targetAudience,
        },
        products: brand.products,
        preferred_platforms: ['Instagram', 'YouTube'],
        preferred_creator_categories: [],
      };

      const dbCreator: any = {
        id: activeCreator.id,
        creator_name: activeCreator.name,
        niche: activeCreator.niche,
        primary_sector_key: activeCreator.niche[0]?.toLowerCase() || 'lifestyle',
        categories: activeCreator.categories,
        location: activeCreator.location,
        social_platforms: activeCreator.socialPlatforms || [],
        followers: activeCreator.followers,
        engagement_rate: activeCreator.engagementRate,
        audience_demographics: {
          age_breakdown: activeCreator.audience?.ageBreakdown || {},
          gender_split: activeCreator.audience?.genderSplit || { female: 50, male: 50, other: 0 },
        },
        skills: ['Video Creation', 'Storytelling'],
        portfolio: activeCreator.portfolio || [],
        past_brands_worked_with: activeCreator.pastBrandsWorkedWith || [],
        preferred_brand_categories: [],
      };

      const brandCampaigns: any[] = campaigns.filter(c => c.brandId === brand.id);
      const match = calculateCreatorToBrandMatch(dbCreator, dbBrand, brandCampaigns);
      const activeCamp = brandCampaigns.find(c => c.status === 'active') || brandCampaigns[0] || null;

      return {
        brand,
        activeCamp,
        match,
      };
    });
  }, [brands, activeCreator, campaigns]);

  // Filter & Sort
  const filteredBrands = useMemo(() => {
    return matchedBrands
      .filter(({ brand }) => {
        if (selectedIndustry !== 'All') {
          const ind = brand.industry.toLowerCase();
          const sel = selectedIndustry.toLowerCase();
          if (!ind.includes(sel.split(' ')[0]) && !sel.includes(ind.split(' ')[0])) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            brand.name.toLowerCase().includes(q) ||
            brand.industry.toLowerCase().includes(q) ||
            brand.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.match.overallScore - a.match.overallScore;
        if (sortBy === 'campaigns') return (b.brand.stats?.activeCampaigns || 0) - (a.brand.stats?.activeCampaigns || 0);
        return a.brand.name.localeCompare(b.brand.name);
      });
  }, [matchedBrands, selectedIndustry, searchQuery, sortBy]);

  const toggleSave = (brandId: string, brandName: string) => {
    if (savedBrandIds.includes(brandId)) {
      setSavedBrandIds(prev => prev.filter(id => id !== brandId));
      addToast({ title: 'Brand Removed', message: `${brandName} removed from saved sponsors.`, type: 'info' });
    } else {
      setSavedBrandIds(prev => [...prev, brandId]);
      addToast({ title: 'Brand Saved! ⭐', message: `${brandName} saved to your target sponsor list.`, type: 'success' });
    }
  };

  const getConnectionStatus = (brandId: string) => {
    const conn = connections.find(
      c =>
        (c.senderId === activeCreator.id && c.receiverId === brandId) ||
        (c.senderId === brandId && c.receiverId === activeCreator.id)
    );
    return conn?.status || 'not_connected';
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-950/60 via-slate-900 to-brand-950/50 border border-pink-800/40 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Reverse AI Recommendation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Find Brands For You
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Personalized brand recommendations dynamically ranked for <strong className="text-white">{activeCreator.name}</strong> based on your verified {activeCreator.niche.join('/')} niche, audience demographics, and creator skills.
            </p>
          </div>

          {/* Active Creator Identity Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeCreator.avatar}
              alt={activeCreator.name}
              className="w-12 h-12 rounded-xl object-cover border border-pink-500/40"
            />
            <div className="text-xs">
              <span className="font-bold text-white block">{activeCreator.name}</span>
              <span className="text-pink-400 font-semibold">{activeCreator.niche.join(', ')}</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">
                {activeCreator.followersDisplay} Followers • {activeCreator.engagementDisplay} Eng
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Synergy Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Brands Analyzed</span>
            <span className="text-base font-bold text-white">{brands.length} Verified Brands</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Top Sector Compatibility</span>
            <span className="text-base font-bold text-pink-400">
              {filteredBrands[0]?.match.overallScore || 90}% AI Fit
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Campaigns Available</span>
            <span className="text-base font-bold text-emerald-400">{campaigns.length} Live Briefs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Saved Target Brands</span>
            <span className="text-base font-bold text-amber-400">{savedBrandIds.length} Saved</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search brands by company name, products, industry..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
            >
              <option value="match">Highest AI Compatibility</option>
              <option value="campaigns">Most Active Campaigns</option>
              <option value="alpha">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Industry Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedIndustry === ind
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </Card>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBrands.map(({ brand, activeCamp, match }, index) => {
          const isExpanded = expandedBrandId === brand.id;
          const isSaved = savedBrandIds.includes(brand.id);
          const connStatus = getConnectionStatus(brand.id);

          return (
            <Card
              key={brand.id}
              className={`p-6 bg-slate-900/90 border transition-all ${
                match.overallScore >= 80
                  ? 'border-pink-500/40 shadow-lg shadow-pink-500/5'
                  : match.overallScore >= 60
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800/60 opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Brand Identity & Overview */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
                    />
                    <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center justify-center">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white hover:text-pink-300 transition-colors">
                        {brand.name}
                      </h3>
                      <Badge variant="brand" size="sm">
                        {brand.industry}
                      </Badge>
                      <Badge
                        variant={
                          match.overallScore >= 80
                            ? 'brand'
                            : match.overallScore >= 60
                            ? 'neutral'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {match.recommendationVerdict}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        • {brand.location}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {brand.description}
                    </p>

                    {/* Featured Products */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Featured Products:</span>
                      {brand.products.map(p => (
                        <span key={p.id} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Match Score Ring & Action Hub */}
                <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="text-center">
                    <ProgressRing score={match.overallScore} size={70} sublabel="Fit" />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[150px]">
                    {activeCamp ? (
                      <Link href={`/creator/campaigns/${activeCamp.id}`}>
                        <Button
                          size="sm"
                          variant="accent"
                          className="w-full"
                          leftIcon={<Video className="w-3.5 h-3.5" />}
                        >
                          Apply with Pitch
                        </Button>
                      </Link>
                    ) : connStatus === 'accepted' ? (
                      <Link href="/creator/messages">
                        <Button size="sm" variant="outline" className="w-full">
                          Message Sponsor
                        </Button>
                      </Link>
                    ) : connStatus === 'pending' ? (
                      <Button size="sm" variant="ghost" disabled className="w-full text-amber-400 border border-amber-500/30">
                        Invite Pending ⏳
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                          sendConnectionRequest(
                            brand.id,
                            `Hi ${brand.name}, I create authentic content in ${activeCreator.niche.join('/')} and noticed strong audience synergy with your brand!`
                          );
                          addToast({
                            title: 'Connection Dispatched! 🚀',
                            message: `Networking request sent to ${brand.name}.`,
                            type: 'success',
                          });
                        }}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Connect
                      </Button>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSave(brand.id, brand.name)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-colors ${
                          isSaved
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        onClick={() => setExpandedBrandId(isExpanded ? null : brand.id)}
                        className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-950 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center gap-1"
                      >
                        <span>Why?</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable "Why this brand?" Explainable AI Card */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fade-in">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Why {brand.name} matches your creator profile ({match.overallScore}%)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Sector Synergy: <strong className="text-white">{match.breakdown.sectorFit}%</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic">
                      &quot;{match.summary}&quot;
                    </p>

                    {/* Positive Signals */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-emerald-400 block">
                        Matching Strengths & Alignment:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {match.positiveFactors.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mismatch Signals if any */}
                    {match.negativeFactors.length > 0 && (
                      <div className="space-y-1.5 pt-1 border-t border-slate-900">
                        <span className="text-[11px] font-bold text-rose-400 block">
                          Potential Divergence / Considerations:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-400">
                          {match.negativeFactors.map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Active Campaign Spotlight */}
                  {activeCamp && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-brand-950/40 to-slate-950 border border-brand-800/40 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-brand-300 block">
                          Active Campaign: {activeCamp.name}
                        </span>
                        <span className="text-slate-400">
                          Product: {activeCamp.product} • Budget: <strong className="text-emerald-400">{activeCamp.rewardDisplay}</strong>
                        </span>
                      </div>
                      <Link href={`/creator/campaigns/${activeCamp.id}`}>
                        <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3 h-3" />}>
                          View Brief
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
