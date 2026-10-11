'use client';

import React from 'react';
import Link from 'next/link';
import { Campaign } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Sparkles, Calendar, Coins, ArrowRight, Video } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateMatchScore } from '@/services/matchingService';

export interface CampaignMarketplaceCardProps {
  campaign: Campaign;
}

export const CampaignMarketplaceCard: React.FC<CampaignMarketplaceCardProps> = ({ campaign }) => {
  const { activeCreator } = useApp();
  const match = calculateMatchScore(campaign, activeCreator);

  return (
    <Card hover className="flex flex-col justify-between bg-slate-900/90 border-slate-800">
      <div>
        {/* Brand & AI Match Top Bar */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Avatar src={campaign.brandLogo} name={campaign.brandName} size="sm" />
            <div>
              <h5 className="text-xs font-bold text-white">{campaign.brandName}</h5>
              <p className="text-[10px] text-slate-400">{campaign.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-brand-600/20 to-pink-600/20 border border-brand-500/30 text-white font-extrabold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>{match.overallScore}% Match</span>
          </div>
        </div>

        {/* Campaign Title & Description */}
        <h4 className="text-base font-bold text-white mb-1.5 leading-snug">{campaign.name}</h4>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {campaign.description}
        </p>

        {/* Deliverables Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {campaign.deliverables.map(del => (
            <Badge key={del.id} variant="neutral" size="sm" icon={<Video className="w-3 h-3 text-slate-400" />}>
              {del.quantity}x {del.type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Rewards, Timeline & CTA */}
      <div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reward</span>
            <span className="font-extrabold text-emerald-400 text-sm flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              {campaign.rewardDisplay}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Deadline</span>
            <span className="font-semibold text-slate-200 flex items-center justify-end gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {campaign.deadlineDisplay}
            </span>
          </div>
        </div>

        <Link href={`/creator/campaigns/${campaign.id}`}>
          <Button variant="primary" size="sm" className="w-full">
            View Campaign Brief <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
