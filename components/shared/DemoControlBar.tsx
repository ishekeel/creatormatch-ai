'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Building2,
  UserCheck,
  Globe,
  ChevronDown,
  PlusCircle,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export const DemoControlBar: React.FC = () => {
  const { role, brands, creators, activeBrand, activeCreator, switchAccount } = useApp();
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                CreatorMatch <span className="text-brand-400">AI</span>
              </span>
            </Link>

            {/* Quick Browser Front & Back Navigation Controls */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => window.history.back()}
                title="Go Back (←)"
                className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={() => window.history.forward()}
                title="Go Forward (→)"
                className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Forward</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="h-4 w-[1px] bg-slate-800 hidden md:block" />

            <span className="text-xs text-slate-400 font-medium hidden md:inline">
              The Professional Network for Brands & Creators
            </span>
          </div>

          {/* Active Account Pill & Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSwitchModal(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all text-xs font-semibold group shadow-sm"
              title="Switch account or register a new brand/creator"
            >
              {role === 'brand' ? (
                <>
                  <Avatar src={activeBrand.logo} name={activeBrand.name} size="xs" />
                  <div className="flex items-center gap-1.5 text-left">
                    <span className="font-bold text-white max-w-[120px] sm:max-w-[160px] truncate">
                      {activeBrand.name}
                    </span>
                    <Badge variant="brand" size="sm" className="hidden sm:inline-flex text-[9px] py-0 px-1.5">
                      Brand
                    </Badge>
                  </div>
                </>
              ) : (
                <>
                  <Avatar src={activeCreator.avatar} name={activeCreator.name} size="xs" />
                  <div className="flex items-center gap-1.5 text-left">
                    <span className="font-bold text-white max-w-[120px] sm:max-w-[160px] truncate">
                      {activeCreator.name}
                    </span>
                    <Badge variant="accent" size="sm" className="hidden sm:inline-flex text-[9px] py-0 px-1.5">
                      Creator
                    </Badge>
                  </div>
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            {/* Quick Link to Portal Profile */}
            <Link
              href={role === 'brand' ? '/brand/profile' : '/creator/portfolio'}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 hover:bg-slate-800 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              {role === 'brand' ? 'Brand Profile' : 'My Portfolio'}
            </Link>

            {/* Public Platform Link */}
            <Link
              href="/"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Home / Public Network"
            >
              <Globe className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Account Switcher & Registration Modal */}
      <Modal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        title="Switch Account & Profiles"
        description="Select any registered Brand or Content Creator, or create a new profile."
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Brands Directory Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand-400" />
                Registered Brands ({brands.length})
              </span>
              <Link
                href="/login?tab=register-brand"
                onClick={() => setShowSwitchModal(false)}
                className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Register Brand
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {brands.map(b => {
                const isCurrent = role === 'brand' && activeBrand.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      switchAccount('brand', b.id);
                      setShowSwitchModal(false);
                      router.push('/brand/dashboard');
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-brand-600/20 border-brand-500/50 ring-1 ring-brand-500'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar src={b.logo} name={b.name} size="xs" />
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block truncate">{b.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{b.industry}</span>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Creators Directory Section */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-pink-400" />
                Content Creators ({creators.length})
              </span>
              <Link
                href="/login?tab=register-creator"
                onClick={() => setShowSwitchModal(false)}
                className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Register Creator
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {creators.map(c => {
                const isCurrent = role === 'creator' && activeCreator.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      switchAccount('creator', c.id);
                      setShowSwitchModal(false);
                      router.push('/creator/dashboard');
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-pink-600/20 border-pink-500/50 ring-1 ring-pink-500'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar src={c.avatar} name={c.name} size="xs" />
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {c.handle} • {c.followersDisplay}
                        </span>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <Link
              href="/login"
              onClick={() => setShowSwitchModal(false)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign in with credentials
            </Link>

            <Button size="sm" variant="secondary" onClick={() => setShowSwitchModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
