'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CampaignMarketplaceCard } from '@/components/creator/CampaignMarketplaceCard';
import {
  Briefcase,
  Search,
  Filter,
  Sparkles,
  ArrowUpDown,
  Tag,
  DollarSign,
  Clock,
  Layers,
} from 'lucide-react';

export default function CreatorCampaignDiscoveryPage() {
  const { campaigns } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'match' | 'reward' | 'ending' | 'newest'>('match');

  const categories = ['All', 'Beauty', 'Fashion', 'Technology', 'Baby Care & Sustainability', 'Lifestyle'];

  const filtered = campaigns
    .filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.product.toLowerCase().includes(search.toLowerCase()) ||
        c.brandName.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || c.category.includes(selectedCategory);
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'reward') return b.budget - a.budget;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return 0; // default AI match order
    });

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>AI-Ranked Marketplace</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Discover Brand Campaigns
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore paid sponsorships matched to your exact creator niche, audience demographics, and creative style.
        </p>
      </div>

      {/* Search, Category & Sort Bar */}
      <Card className="p-4 sm:p-5 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns, brands, or products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option value="match">Highest AI Match</option>
              <option value="reward">Highest Reward</option>
              <option value="ending">Ending Soon</option>
              <option value="newest">Newest Campaigns</option>
            </select>
          </div>
        </div>

        {/* Categories horizontal list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Campaigns Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span>Showing {filtered.length} matched campaigns</span>
          <span>Sorted by {sortBy.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(camp => (
            <CampaignMarketplaceCard key={camp.id} campaign={camp} />
          ))}
        </div>
      </div>
    </div>
  );
}
