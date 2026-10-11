'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  MessageSquare,
  Send,
  Sparkles,
  Paperclip,
  CheckCheck,
  Video,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { calculateBrandCreatorMatch } from '@/services/matchingService';

export default function BrandMessagesPage() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    sendMessage,
    currentUser,
    activeBrand,
    creators,
    campaigns,
  } = useApp();
  const [inputText, setInputText] = useState('');
  const [showAiBreakdown, setShowAiBreakdown] = useState(false);

  // Filter conversations relevant to brand
  const brandConversations = conversations.filter(c =>
    !c.brandId || c.brandId === activeBrand.id || c.participantRole === 'creator'
  );

  const currentConv = brandConversations.find(c => c.id === activeConversationId) || brandConversations[0];
  const currentMessages = currentConv ? messages[currentConv.id] || [] : [];

  // Compute partner Creator details safely
  const partnerCreatorId = currentConv?.creatorId || (currentConv?.participantRole === 'creator' ? currentConv?.participantId : '');
  const partnerCreatorName = currentConv?.creatorName || currentConv?.participantName || 'Content Creator';
  const partnerCreatorAvatar = currentConv?.creatorAvatar || currentConv?.participantAvatar || '';

  const currentPartnerCreator = currentConv
    ? creators.find(
        c =>
          c.id === partnerCreatorId ||
          c.name.toLowerCase() === partnerCreatorName.toLowerCase()
      ) || {
        id: partnerCreatorId || 'creator',
        name: partnerCreatorName,
        handle: `@${partnerCreatorName.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: partnerCreatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Verified Creator Partner',
        niche: ['General'],
        categories: ['General'],
        location: 'India',
        languages: ['English'],
        socialPlatforms: [],
        followers: 50000,
        followersDisplay: '50K',
        avgViews: '12K',
        engagementRate: 5.5,
        engagementDisplay: '5.5%',
        creatorScore: 88,
        creatorCredits: 100,
        campaignWins: 0,
        completedCampaigns: 1,
        totalReach: '50K',
        verified: true,
        audience: { ageBreakdown: {}, topLocations: [], genderSplit: { female: 50, male: 50, other: 0 }, topInterests: [] },
        portfolio: [],
        verifiedCampaigns: [],
      }
    : null;

  const currentMatchScore = currentPartnerCreator
    ? calculateBrandCreatorMatch(activeBrand, currentPartnerCreator)
    : null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConv) return;
    sendMessage(currentConv.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Direct Brand-Creator Chat &amp; AI Synergy</h2>
            <Badge variant="emerald" size="sm">Mutual Connections Only</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Communication grounded in AI compatibility scores and verified creator portfolios.
          </p>
        </div>
        <Link href="/brand/connections" className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
          Manage Network &amp; Connections →
        </Link>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        {/* Left: Conversation List */}
        <Card className="md:col-span-4 p-4 bg-slate-900/90 border-slate-800 flex flex-col min-h-0">
          <div className="pb-3 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Collaborations ({brandConversations.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 pt-2 space-y-1">
            {brandConversations.map(conv => {
              const isSelected = conv.id === currentConv?.id;
              const cId = conv.creatorId || (conv.participantRole === 'creator' ? conv.participantId : '');
              const cName = conv.creatorName || conv.participantName || 'Content Creator';
              const cAvatar = conv.creatorAvatar || conv.participantAvatar || '';
              const partnerCreator = creators.find(
                c =>
                  c.id === cId ||
                  c.name.toLowerCase() === cName.toLowerCase()
              );
              const match = partnerCreator
                ? calculateBrandCreatorMatch(activeBrand, partnerCreator)
                : null;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-brand-600/15 border border-brand-500/40 shadow-sm'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  <Avatar src={cAvatar} name={cName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{cName}</span>
                      <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                    </div>

                    {/* AI Match Score Pill */}
                    {match && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            match.overallScore >= 90
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : match.overallScore >= 65
                              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          ⚡ {match.overallScore}% AI Match
                        </span>
                      </div>
                    )}

                    {conv.campaignContext && (
                      <span className="text-[10px] font-semibold text-brand-300 block truncate mt-0.5">
                        🏷️ {conv.campaignContext.name}
                      </span>
                    )}

                    <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right: Chat Window */}
        <Card className="md:col-span-8 p-0 bg-slate-900/90 border-slate-800 flex flex-col min-h-0 overflow-hidden">
          {currentConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={partnerCreatorAvatar} name={partnerCreatorName} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{partnerCreatorName}</span>
                      <Badge variant="accent" size="sm">Creator</Badge>
                      {currentMatchScore && (
                        <Badge
                          variant={currentMatchScore.overallScore >= 90 ? 'emerald' : 'brand'}
                          size="sm"
                        >
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          {currentMatchScore.overallScore}% AI Fit
                        </Badge>
                      )}
                    </div>
                    {currentConv.campaignContext && (
                      <p className="text-[11px] text-slate-400">
                        Context: <strong className="text-brand-300">{currentConv.campaignContext.name}</strong>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="emerald" size="sm">Connected ✓</Badge>
                </div>
              </div>

              {/* AI Matchmaker Insight Banner */}
              {currentMatchScore && (
                <div className="bg-slate-950/95 border-b border-slate-800/80 p-3 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">
                            AI Compatibility Prediction: {currentMatchScore.overallScore}% [{currentMatchScore.recommendationVerdict}]
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                          {currentMatchScore.explanation}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAiBreakdown(!showAiBreakdown)}
                      className="text-[11px] text-brand-400 hover:text-brand-300 shrink-0 flex items-center gap-1 font-semibold"
                    >
                      <span>{showAiBreakdown ? 'Hide Breakdown' : 'View Breakdown'}</span>
                      {showAiBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {showAiBreakdown && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-slate-400 block font-medium">Algorithmic Positive Signals:</span>
                        {(currentMatchScore.positiveFactors || []).slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 block font-medium">Detailed Scoring Matrix:</span>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sector Fit:</span>
                            <span className="font-bold text-brand-300">{currentMatchScore.sectorFitScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Deliverable / Skill Fit:</span>
                            <span className="font-bold text-brand-300">{currentMatchScore.skillFitScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map(msg => {
                  const isMe = msg.senderRole === 'brand';
                  return (
                    <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && <Avatar src={msg.senderAvatar} name={msg.senderName} size="sm" />}
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-600/20'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`text-[10px] flex items-center justify-end gap-1 ${isMe ? 'text-brand-200' : 'text-slate-400'}`}>
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                      {isMe && <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />}
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message or brief requirement..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
                <Button type="submit" size="sm" variant="primary" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Select a conversation to begin chatting.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
