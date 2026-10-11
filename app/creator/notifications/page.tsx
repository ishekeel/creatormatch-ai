'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Bell,
  CheckCheck,
  Sparkles,
  Trophy,
  Coins,
  ArrowRight,
} from 'lucide-react';

export default function CreatorNotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Creator Notifications</h2>
          <p className="text-xs text-slate-400">Campaign invitations, AI quality scores, and Creator Credits payouts.</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={markAllNotificationsAsRead}
          leftIcon={<CheckCheck className="w-4 h-4" />}
        >
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 text-xs bg-slate-900/60 border-slate-800">
            No notifications yet.
          </Card>
        ) : (
          notifications.map(n => (
            <Card
              key={n.id}
              className={`p-4 transition-all flex items-start justify-between gap-4 border ${
                n.read
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                  : 'bg-slate-900 border-pink-500/40 text-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-pink-500" />}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-500 block pt-1">{n.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.actionUrl && (
                  <Link href={n.actionUrl}>
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View
                    </Button>
                  </Link>
                )}
                {!n.read && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
