'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Users,
  UserPlus,
  UserCheck,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building2,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const ConnectionsHubView: React.FC = () => {
  const router = useRouter();
  const {
    role,
    activeBrand,
    activeCreator,
    connections,
    acceptConnectionRequest,
    declineConnectionRequest,
    startOrGetConversation,
  } = useApp();

  const currentUserId = role === 'brand' ? activeBrand.id : activeCreator.id;
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Incoming Pending Requests (where current user is the receiver)
  const incomingRequests = connections.filter(
    c => c.receiverId === currentUserId && c.status === 'pending'
  );

  // 2. Outgoing Pending Requests (where current user is the sender)
  const outgoingRequests = connections.filter(
    c => c.senderId === currentUserId && c.status === 'pending'
  );

  // 3. Accepted Active Connections (where either sender or receiver is current user and status is accepted)
  const activeConnections = connections.filter(
    c => (c.senderId === currentUserId || c.receiverId === currentUserId) && c.status === 'accepted'
  );

  const filteredConnections = activeConnections.filter(c => {
    const partnerName = c.senderId === currentUserId ? c.receiverName : c.senderName;
    return partnerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleStartMessage = (partnerId: string) => {
    const brandId = role === 'brand' ? activeBrand.id : partnerId;
    const creatorId = role === 'creator' ? activeCreator.id : partnerId;
    startOrGetConversation(brandId, creatorId);
    router.push(role === 'brand' ? '/brand/messages' : '/creator/messages');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Network Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>LinkedIn-Style Connection Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            My Network &amp; Verified Connections ({activeConnections.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Direct messaging is unlocked only between mutual connections. Connect with verified brands and creators before starting campaigns.
          </p>
        </div>

        <Link href={role === 'brand' ? '/brand/creators' : '/creator/find-brands'}>
          <Button variant="primary" size="md" leftIcon={<UserPlus className="w-4 h-4" />}>
            {role === 'brand' ? 'Discover Creators to Connect' : 'Find Matching Brands'}
          </Button>
        </Link>
      </div>

      {/* Incoming Connection Requests Section */}
      {incomingRequests.length > 0 && (
        <Card className="p-6 bg-slate-900/90 border-brand-500/40 space-y-4 shadow-lg shadow-brand-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pending Connection Requests Awaiting Your Approval ({incomingRequests.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">Accept to unlock mutual messaging</span>
          </div>

          <div className="space-y-3">
            {incomingRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <Avatar src={req.senderAvatar} name={req.senderName} size="md" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{req.senderName}</h4>
                      <Badge variant={req.senderRole === 'brand' ? 'brand' : 'accent'} size="sm">
                        {req.senderRole.toUpperCase()}
                      </Badge>
                      <span className="text-[11px] text-slate-500">• {req.createdAt}</span>
                    </div>
                    {req.note && (
                      <p className="text-xs text-slate-300 italic max-w-xl">
                        &quot;{req.note}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => acceptConnectionRequest(req.id)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Accept Connection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => declineConnectionRequest(req.id)}
                    leftIcon={<XCircle className="w-4 h-4" />}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Outgoing Requests Section */}
      {outgoingRequests.length > 0 && (
        <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Sent Requests ({outgoingRequests.length})
            </span>
            <span>Waiting for partner to accept</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {outgoingRequests.map(req => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={req.receiverAvatar} name={req.receiverName} size="sm" />
                  <div>
                    <h5 className="text-xs font-bold text-white">{req.receiverName}</h5>
                    <p className="text-[10px] text-slate-400">Request sent {req.createdAt}</p>
                  </div>
                </div>
                <Badge variant="warning" size="sm">Pending</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Active Connected Members Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            Connected Partners ({filteredConnections.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search connections..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {filteredConnections.length === 0 ? (
          <Card className="p-8 text-center bg-slate-900/60 border-slate-800 space-y-3">
            <UserPlus className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No active connections found</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Send connection requests to {role === 'brand' ? 'creators' : 'brands'}. Once accepted by both sides, direct messaging and campaign collaborations will be unlocked!
            </p>
            <Link href={role === 'brand' ? '/brand/creators' : '/creator/find-brands'}>
              <Button size="sm" variant="outline" className="mt-2">
                Browse Directory
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnections.map(c => {
              const isPartnerSender = c.senderId !== currentUserId;
              const partnerId = isPartnerSender ? c.senderId : c.receiverId;
              const partnerName = isPartnerSender ? c.senderName : c.receiverName;
              const partnerAvatar = isPartnerSender ? c.senderAvatar : c.receiverAvatar;
              const partnerRole = isPartnerSender ? c.senderRole : c.receiverRole;

              return (
                <Card
                  key={c.id}
                  className="p-5 bg-slate-900/90 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={partnerAvatar} name={partnerName} size="md" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white">{partnerName}</h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-400 capitalize">{partnerRole} Partner</p>
                      </div>
                    </div>

                    <Badge variant="emerald" size="sm">Connected</Badge>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      Connected {c.createdAt}
                    </span>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStartMessage(partnerId)}
                      leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                    >
                      Message
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
