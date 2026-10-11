'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { CreatorCard } from '@/components/brand/CreatorCard';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { calculateBrandCreatorMatch } from '@/services/matchingService';
import {
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  ArrowRightLeft,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

export default function CreatorDiscoveryPage() {
  const { creators, campaigns, activeBrand } = useApp();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [minEngagement, setMinEngagement] = useState(0);

  // Locked strictly to the authenticated brand
  const currentBrand = activeBrand;

  // Campaigns belonging to this brand
  const brandCampaigns = useMemo(() => {
    return campaigns.filter(c => c.brandId === currentBrand.id);
  }, [campaigns, currentBrand.id]);

  const activeCampaign = useMemo(() => {
    if (selectedCampaignId === 'all') return brandCampaigns[0] || null;
    return brandCampaigns.find(c => c.id === selectedCampaignId) || brandCampaigns[0] || null;
  }, [brandCampaigns, selectedCampaignId]);

  const niches = ['All', 'Beauty', 'Fashion', 'Lifestyle', 'Technology', 'Comedy', 'Food', 'Gaming', 'Fitness', 'Parenting'];
  const locations = ['All', 'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Pune'];

  // Match each creator dynamically against the selected Brand & Campaign
  const creatorsWithMatches = useMemo(() => {
    return creators.map(c => ({
      creator: c,
      match: calculateBrandCreatorMatch(currentBrand, c, activeCampaign),
    }));
  }, [creators, currentBrand, activeCampaign]);

  // Filter
  const filtered = useMemo(() => {
    return creatorsWithMatches.filter(({ creator, match }) => {
      const matchesSearch =
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.niche.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesNiche = selectedNiche === 'All' || creator.niche.includes(selectedNiche);
      const matchesLocation = selectedLocation === 'All' || creator.location.includes(selectedLocation);
      const matchesEngagement = creator.engagementRate >= minEngagement;

      return matchesSearch && matchesNiche && matchesLocation && matchesEngagement;
    });
  }, [creatorsWithMatches, searchQuery, selectedNiche, selectedLocation, minEngagement]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'match') return b.match.overallScore - a.match.overallScore;
      if (sortBy === 'engagement') return b.creator.engagementRate - a.creator.engagementRate;
      if (sortBy === 'experience') return b.creator.completedCampaigns - a.creator.completedCampaigns;
      if (sortBy === 'score') return b.creator.creatorScore - a.creator.creatorScore;
      return 0;
    });
  }, [filtered, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedNiche('All');
    setSelectedLocation('All');
    setSortBy('match');
    setMinEngagement(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Context Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Creator Discovery Engine</span>
            <Badge variant="brand" size="sm" icon={<Sparkles className="w-3 h-3" />}>
              Multi-Signal AI Active
            </Badge>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover verified creators scored deterministically against <strong className="text-white">{currentBrand.name}</strong> ({currentBrand.industry}).
          </p>
        </div>

        {/* Authenticated Brand Profile Identity */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <Avatar src={currentBrand.logo} name={currentBrand.name} size="sm" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Your Brand Account</span>
            <span className="text-xs font-bold text-white block">{currentBrand.name}</span>
            <span className="text-[10px] text-brand-300">{currentBrand.industry}</span>
          </div>
        </div>
      </div>

      {/* Brand Context & Active Campaign Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
          <span>
            Evaluating creators for <strong className="text-white">{currentBrand.name}</strong>. Top match:{' '}
            <strong className="text-emerald-400">{sorted[0]?.creator.name || 'Creator'}</strong> with{' '}
            <strong className="text-brand-300">{sorted[0]?.match.overallScore || 90}% AI Fit</strong>!
          </span>
        </div>

        {brandCampaigns.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-400 hidden sm:inline">Active Brief:</span>
            <select
              value={selectedCampaignId}
              onChange={e => setSelectedCampaignId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Campaigns (Brand Overview)</option>
              {brandCampaigns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="w-full md:flex-1">
            <Input
              placeholder="Search creators by name, niche, bio keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="w-1/2 md:w-48">
              <Select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                options={[
                  { value: 'match', label: 'Highest AI Match Fit' },
                  { value: 'engagement', label: 'Highest Engagement' },
                  { value: 'experience', label: 'Most Experienced' },
                  { value: 'score', label: 'Creator Score' },
                ]}
              />
            </div>

            <div className="w-1/2 md:w-40">
              <Select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                options={locations.map(loc => ({ value: loc, label: loc === 'All' ? 'All Locations' : loc }))}
              />
            </div>

            <button
              onClick={resetFilters}
              className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Niche Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Niche:
          </span>
          {niches.map(niche => {
            const isSelected = selectedNiche === niche;
            return (
              <button
                key={niche}
                onClick={() => setSelectedNiche(niche)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {niche}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{sorted.length}</strong> verified creators scored for{' '}
          <strong className="text-brand-300">{currentBrand.name}</strong>
        </span>
        <span className="text-slate-500 hidden sm:inline">
          Ranked by 9-Factor Multi-Signal Neural Matching Matrix
        </span>
      </div>

      {/* Creator Cards Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(({ creator, match }) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              matchScore={match}
              campaignId={activeCampaign?.id || brandCampaigns[0]?.id || 'camp-glowrush-summer'}
              isInvited={activeCampaign ? activeCampaign.invitedCreatorIds.includes(creator.id) : false}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Creators Found"
          description="Try clearing your search query or adjusting your niche and location filters."
          actionText="Reset Filters"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}
