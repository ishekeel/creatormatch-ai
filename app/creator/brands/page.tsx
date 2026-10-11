'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Building2,
  Search,
  Calendar,
  Package,
  Globe,
  MapPin,
  Megaphone,
  Droplets,
  ExternalLink,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  UserPlus,
  Clock,
  UserCheck,
} from 'lucide-react';

export default function CreatorExploreBrandsPage() {
  const { brands, campaigns, getConnectionStatus, sendConnectionRequest } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const industries = ['all', 'Beauty', 'Eco-Friendly & Baby Care', 'Health & Fitness', 'Fashion', 'Tech'];

  const filteredBrands = brands.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesIndustry =
      selectedIndustry === 'all' ||
      b.industry.toLowerCase().includes(selectedIndustry.toLowerCase());

    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Company Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Explore Verified Brands &amp; Sponsors ({brands.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Like LinkedIn for Creators: browse companies actively collaborating with creators, inspect their product line, and find campaigns.
          </p>
        </div>

        <Link href="/creator/campaigns">
          <Button size="md" variant="primary" leftIcon={<Briefcase className="w-4 h-4" />}>
            View Open Campaigns
          </Button>
        </Link>
      </div>

      {/* Search & Industry Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search brands by company name, product or niche..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedIndustry === ind
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {ind === 'all' ? 'All Industries' : ind}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map(b => {
          const brandCampaigns = campaigns.filter(
            c => c.brandName.toLowerCase() === b.name.toLowerCase()
          );

          return (
            <Card
              key={b.id}
              className="p-6 bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Brand Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={b.logo} name={b.name} size="lg" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-white tracking-tight">{b.name}</h3>
                        <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-400">{b.industry}</p>
                    </div>
                  </div>

                  <Badge variant="brand" size="sm">
                    {brandCampaigns.length > 0 ? `${brandCampaigns.length} Campaigns` : 'Verified Brand'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {b.description}
                </p>

                {/* Operating Duration & Location */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand-400" />
                      In Business
                    </span>
                    <span className="font-bold text-white mt-0.5 block">
                      {b.operatingDuration || (b.establishedYear ? `${2026 - parseInt(b.establishedYear, 10)}+ years` : '3+ years')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pink-400" />
                      Location
                    </span>
                    <span className="font-bold text-white mt-0.5 block truncate">
                      {b.location}
                    </span>
                  </div>
                </div>

                {/* Products Sold (Catalog Overview) */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Package className="w-3 h-3 text-amber-400" />
                    Brand Products ({b.products.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {b.products.slice(0, 3).map(prod => (
                      <span
                        key={prod.id}
                        className="px-2 py-0.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-[11px] text-slate-300"
                      >
                        {prod.name}
                      </span>
                    ))}
                    {b.products.length > 3 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800/40 text-[11px] text-slate-400">
                        +{b.products.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Sustainability / Water Emission Highlight */}
                {b.sustainability && (
                  <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-cyan-300 text-[11px]">
                      <Droplets className="w-3.5 h-3.5" />
                      {b.sustainability.waterEmissionSavedLiters.toLocaleString()}L Water Offset
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Eco {b.sustainability.ecoScore}/100
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  href={b.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </Link>

                <div className="flex items-center gap-2">
                  {getConnectionStatus(b.id) === 'connected' ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : getConnectionStatus(b.id) === 'pending_sent' ? (
                    <Button variant="secondary" size="sm" disabled leftIcon={<Clock className="w-3.5 h-3.5 text-amber-400" />}>
                      Pending ⏳
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendConnectionRequest(b.id)}
                      leftIcon={<UserPlus className="w-3.5 h-3.5 text-brand-400" />}
                    >
                      Connect
                    </Button>
                  )}

                  <Link href="/creator/campaigns">
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Campaigns
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
