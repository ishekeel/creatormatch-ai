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
  CheckCheck,
  ShieldCheck,
  Lock,
  UserPlus,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { calculateCreatorBrandMatch } from '@/services/matchingService';

export default function CreatorMessagesPage() {
  const {
    conversations,
    activeCreator,
    activeConversationId,
    setActiveConversationId,
    messages,
    sendMessage,
    currentUser,
    brands,
    campaigns,
  } = useApp();
  const [inputText, setInputText] = useState('');
  const [showAiBreakdown, setShowAiBreakdown] = useState(false);

  // Strictly isolate only this creator's private conversations
  const creatorOnlyConversations = conversations.filter(c =>
    !c.creatorId || c.creatorId === activeCreator.id || c.participantRole === 'brand' || c.participantId === activeCreator.id
  );

  const currentConv = creatorOnlyConversations.find(c => c.id === activeConversationId) || creatorOnlyConversations[0];
  const currentMessages = currentConv ? messages[currentConv.id] || [] : [];

  // Find partner brand and compute AI match intelligence
  const partnerBrandId = currentConv?.brandId || (currentConv?.participantRole === 'brand' ? currentConv?.participantId : '');
  const partnerBrandName = currentConv?.brandName || (currentConv?.participantRole === 'brand' ? currentConv?.participantName : 'Brand Sponsor');
  const partnerBrandLogo = currentConv?.brandLogo || (currentConv?.participantRole === 'brand' ? currentConv?.participantAvatar : 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80');

  const currentPartnerBrand = currentConv
    ? brands.find(
        b =>
          b.id === partnerBrandId ||
          b.name.toLowerCase() === partnerBrandName.toLowerCase()
      ) || {
        id: partnerBrandId || 'brand',
        name: partnerBrandName,
        logo: partnerBrandLogo,
        description: 'Verified Partner Brand',
        website: '',
        industry: 'General',
        location: 'India',
        targetAudience: 'General',
        products: [],
        stats: {
          activeCampaigns: 1,
          creatorsCollaborating: 1,
          totalReach: '100K',
          avgEngagement: '4.5%',
          conversions: 0,
          roi: '2.5x',
        },
      }
    : null;

  const currentMatchScore = currentPartnerBrand
    ? calculateCreatorBrandMatch(activeCreator, currentPartnerBrand, campaigns)
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
            <h2 className="text-2xl font-black text-white tracking-tight">Brand Direct Messages &amp; AI Synergy</h2>
            <Badge variant="emerald" size="sm">Private Channel • {activeCreator.name}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end verified messaging grounded in CreatorMatch AI sector alignment and collaboration history.
          </p>
        </div>
        <Link href="/creator/connections" className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1">
          Manage Network &amp; Connections →
        </Link>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        {/* Left: Private Inboxes with AI Match Pill */}
        <Card className="md:col-span-4 p-4 bg-slate-900/90 border-slate-800 flex flex-col min-h-0">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>My Inboxes ({creatorOnlyConversations.length})</span>
            <span className="text-[10px] text-pink-400 flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3" /> Private
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 pt-2 space-y-1">
            {creatorOnlyConversations.length === 0 ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-400">
                  No active brand conversations yet. Connect with verified brands to unlock messaging.
                </p>
                <Link href="/creator/find-brands">
                  <Button size="sm" variant="accent" className="w-full" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
                    Find Matching Brands
                  </Button>
                </Link>
              </div>
            ) : (
              creatorOnlyConversations.map(conv => {
                const isSelected = conv.id === currentConv?.id;
                const bId = conv.brandId || (conv.participantRole === 'brand' ? conv.participantId : '');
                const bName = conv.brandName || (conv.participantRole === 'brand' ? conv.participantName : 'Brand Sponsor');
                const bLogo = conv.brandLogo || (conv.participantRole === 'brand' ? conv.participantAvatar : 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80');
                const partnerBrand = brands.find(
                  b =>
                    b.id === bId ||
                    b.name.toLowerCase() === bName.toLowerCase()
                );
                const match = partnerBrand
                  ? calculateCreatorBrandMatch(activeCreator, partnerBrand, campaigns)
                  : null;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-pink-600/15 border border-pink-500/40 shadow-sm'
                        : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <Avatar
                      src={bLogo}
                      name={bName}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{bName}</span>
                        <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                      </div>

                      {/* AI Match Pill */}
                      {match && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              match.overallScore >= 90
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : match.overallScore >= 65
                                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            ⚡ {match.overallScore}% AI Match
                          </span>
                        </div>
                      )}

                      {conv.campaignContext && (
                        <span className="text-[10px] font-semibold text-pink-300 block truncate mt-0.5">
                          🏷️ {conv.campaignContext.name}
                        </span>
                      )}

                      <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right: Chat Window with AI Matchmaker Bar */}
        <Card className="md:col-span-8 p-0 bg-slate-900/90 border-slate-800 flex flex-col min-h-0 overflow-hidden">
          {currentConv ? (
            <>
              {/* Header */}
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={partnerBrandLogo}
                    name={partnerBrandName}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{partnerBrandName}</span>
                      <Badge variant="brand" size="sm">Brand Sponsor</Badge>
                      {currentMatchScore && (
                        <Badge
                          variant={currentMatchScore.overallScore >= 90 ? 'emerald' : 'brand'}
                          size="sm"
                        >
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          {currentMatchScore.overallScore}% AI Synergy
                        </Badge>
                      )}
                    </div>
                    {currentConv.campaignContext && (
                      <p className="text-[11px] text-slate-400">
                        Campaign: <strong className="text-brand-300">{currentConv.campaignContext.name}</strong>
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
                      <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">
                            AI Sector Match: {currentMatchScore.overallScore}% [{currentMatchScore.recommendationVerdict}]
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                          {currentMatchScore.explanation}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAiBreakdown(!showAiBreakdown)}
                      className="text-[11px] text-pink-400 hover:text-pink-300 shrink-0 flex items-center gap-1 font-semibold"
                    >
                      <span>{showAiBreakdown ? 'Hide Fit' : 'View Fit'}</span>
                      {showAiBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {showAiBreakdown && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-slate-400 block font-medium">Positive Fit Highlights:</span>
                        {(currentMatchScore.positiveFactors || []).slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 block font-medium">Algorithmic Factors:</span>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sector Affinity:</span>
                            <span className="font-bold text-pink-300">{currentMatchScore.sectorFitScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Content / Skill:</span>
                            <span className="font-bold text-pink-300">{currentMatchScore.skillFitScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Body with Hover Tooltips */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map(msg => {
                  const isMe = msg.senderRole === 'creator';
                  return (
                    <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && <Avatar src={msg.senderAvatar} name={msg.senderName} size="sm" />}
                      <div className="relative group max-w-md">
                        {/* Hover Tooltip */}
                        <div
                          className={`absolute -top-9 ${
                            isMe ? 'right-0' : 'left-0'
                          } hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/95 border border-slate-700/80 text-[10px] text-slate-200 shadow-xl pointer-events-none z-30 whitespace-nowrap animate-fade-in`}
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>
                            {isMe ? 'You (Verified Creator)' : msg.senderName} • {msg.timestamp} • Encrypted Channel
                          </span>
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 transition-all ${
                            isMe
                              ? 'bg-pink-600 text-white rounded-br-none shadow-md shadow-pink-600/20 group-hover:brightness-105'
                              : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60 group-hover:border-slate-600'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div className={`text-[10px] flex items-center justify-end gap-1 ${isMe ? 'text-pink-200' : 'text-slate-400'}`}>
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                      {isMe && <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />}
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Message the brand coordinator..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
                <Button type="submit" size="sm" variant="accent" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 text-slate-600" />
              <span>Select a private conversation to begin chatting.</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
