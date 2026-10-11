'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, Megaphone, Flame, ArrowRight, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { creators, campaigns, challenges, role } = useApp();
  const router = useRouter();

  const filteredCreators = creators.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.niche.some(n => n.toLowerCase().includes(query.toLowerCase())) ||
    c.location.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.product.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChallenges = challenges.filter(ch =>
    ch.name.toLowerCase().includes(query.toLowerCase()) ||
    ch.hashtag.toLowerCase().includes(query.toLowerCase()) ||
    ch.theme.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search creators, campaigns, challenges, niches..."
            className="w-full bg-slate-950 border border-slate-800 text-white pl-12 pr-4 py-3.5 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-500"
            autoFocus
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
          {/* Creators Section */}
          {filteredCreators.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-400" /> Creators
              </p>
              <div className="space-y-1.5">
                {filteredCreators.slice(0, 3).map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(role === 'brand' ? `/brand/creators/${c.id}` : `/creator/profile`)}
                    className="flex items-center justify-between p-2.5 bg-slate-800/40 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={c.avatar} name={c.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{c.name}</span>
                          <span className="text-xs text-slate-400">{c.handle}</span>
                        </div>
                        <p className="text-xs text-slate-400">{c.niche.join(' • ')} • {c.location}</p>
                      </div>
                    </div>
                    <Badge variant="brand" size="sm">{c.engagementDisplay} Eng</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaigns Section */}
          {filteredCampaigns.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-pink-400" /> Campaigns
              </p>
              <div className="space-y-1.5">
                {filteredCampaigns.slice(0, 3).map(camp => (
                  <div
                    key={camp.id}
                    onClick={() => handleSelect(role === 'brand' ? `/brand/campaigns/${camp.id}` : `/creator/campaigns/${camp.id}`)}
                    className="flex items-center justify-between p-2.5 bg-slate-800/40 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <h5 className="text-sm font-bold text-white">{camp.name}</h5>
                      <p className="text-xs text-slate-400">{camp.brandName} • Product: {camp.product}</p>
                    </div>
                    <Badge variant="accent" size="sm">{camp.rewardDisplay}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges Section */}
          {filteredChallenges.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Creative Challenges
              </p>
              <div className="space-y-1.5">
                {filteredChallenges.slice(0, 2).map(chal => (
                  <div
                    key={chal.id}
                    onClick={() => handleSelect(role === 'brand' ? `/brand/challenges/${chal.id}` : `/creator/challenges/${chal.id}`)}
                    className="flex items-center justify-between p-2.5 bg-slate-800/40 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <h5 className="text-sm font-bold text-white">{chal.name}</h5>
                      <p className="text-xs text-slate-400">{chal.hashtag} • {chal.daysRemaining} days left</p>
                    </div>
                    <Badge variant="warning" size="sm">Prize: {chal.prizePool.totalDisplay}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCreators.length === 0 && filteredCampaigns.length === 0 && filteredChallenges.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching creators, campaigns, or challenges found for &quot;{query}&quot;.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
