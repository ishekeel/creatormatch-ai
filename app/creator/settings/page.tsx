'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Settings,
  Bell,
  Lock,
  Database,
  CheckCircle,
  RefreshCw,
  LogOut,
  ShieldCheck,
  CreditCard,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';

export default function CreatorSettingsPage() {
  const router = useRouter();
  const { activeCreator, logoutUser, resetDemoData, addToast } = useApp();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleSignOut = () => {
    logoutUser();
    addToast({
      title: 'Signed Out Successfully',
      message: 'You have been logged out of your Creator session.',
      type: 'info',
    });
    router.push('/');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in pb-12">
      <div>
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Account Controls &amp; Security</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Creator Settings &amp; Sign Out
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your active login session, payout preferences, notification alerts, and database cache.
        </p>
      </div>

      {/* Prominent Sign Out Card (User Requirement) */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-950 border-rose-500/30 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-rose-500/20">
          <div className="flex items-center gap-4">
            <Avatar src={activeCreator.avatar} name={activeCreator.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{activeCreator.name}</h3>
                <Badge variant="emerald" size="sm">Active Session</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeCreator.handle} • {activeCreator.email || `${activeCreator.handle.replace('@', '')}@creator.io`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-slate-300 font-medium">
                  Sector: {activeCreator.niche.join(', ')} • End-to-End Encrypted Session
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            {!showConfirmLogout ? (
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto border-rose-500/40 text-rose-400 hover:bg-rose-500/20 hover:text-white"
                leftIcon={<LogOut className="w-4 h-4" />}
                onClick={() => setShowConfirmLogout(true)}
              >
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  leftIcon={<LogOut className="w-4 h-4" />}
                  onClick={handleSignOut}
                >
                  Confirm Sign Out
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfirmLogout(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Session ID</span>
            <span className="font-mono text-slate-200 truncate block">sess_cr_{activeCreator.id}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Role Privileges</span>
            <span className="font-semibold text-pink-400 block">Verified Content Creator</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Security Standard</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Token Authenticated
            </span>
          </div>
        </div>
      </Card>

      {/* Payout & Bank Credentials */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <CreditCard className="w-5 h-5 text-brand-400" />
          <h3>Payout &amp; Banking Information</h3>
        </div>
        <p className="text-xs text-slate-400">
          Direct escrow deposits for completed brand campaigns and sponsored collaborations.
        </p>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Linked UPI ID:</span>
            <span className="font-mono text-emerald-400 font-semibold">{activeCreator.handle.replace('@', '')}@oksbi (Verified ✓)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Payout Currency:</span>
            <span className="text-slate-200 font-medium">INR (₹) / USD ($) via Escrow Gateway</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Instant Release:</span>
            <span className="text-brand-300 font-semibold">Enabled upon brand deliverable approval</span>
          </div>
        </div>
      </Card>

      {/* Collaboration Notification Preferences */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3>Notification Preferences</h3>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-white">AI High-Priority Match Alerts</p>
              <p className="text-slate-400 text-[11px]">Notify me when a brand with &gt;90% sector synergy posts a new campaign</p>
            </div>
            <span className="text-emerald-400 font-bold">Enabled</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-white">Direct Connection Requests</p>
              <p className="text-slate-400 text-[11px]">Notify me when verified brand sponsors send connection invites</p>
            </div>
            <span className="text-emerald-400 font-bold">Enabled</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-white">Campaign Application Updates</p>
              <p className="text-slate-400 text-[11px]">Instant alerts when brand approves or reviews your video pitch submission</p>
            </div>
            <span className="text-emerald-400 font-bold">Enabled</span>
          </div>
        </div>
      </Card>

      {/* Platform Cache Reset */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Reset Demo Session Cache
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Re-initialize all mock data, notifications, and connection states to fresh defaults.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={resetDemoData} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Reset Cache
          </Button>
        </div>
      </Card>
    </div>
  );
}
