'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Handshake,
  Building2,
  UserCheck,
  LogOut,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  User,
  Settings,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export const AppNavbar: React.FC = () => {
  const { role, activeBrand, activeCreator, isAuthenticated, logoutUser, currentUser } = useApp();
  const router = useRouter();
  const pathname = usePathname() || '';

  const handleSignOut = () => {
    logoutUser();
    router.push('/');
  };

  const displayName = role === 'brand' ? activeBrand.name : activeCreator.name;
  const displayAvatar = role === 'brand' ? activeBrand.logo : activeCreator.avatar;
  const roleLabel = role === 'brand' ? 'Brand Sponsor' : 'Content Creator';
  const roleBadgeColor = role === 'brand' ? 'brand' : 'accent';
  const profileLink = role === 'brand' ? '/brand/profile' : '/creator/profile';
  const dashboardLink = role === 'brand' ? '/brand/dashboard' : '/creator/dashboard';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Brand / Logo & Quick Browser Navigation */}
        <div className="flex items-center gap-3">
          <Link href={isAuthenticated ? dashboardLink : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Handshake className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">
              CreatorMatch <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-pink-400">AI</span>
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
        </div>

        {/* Right: Authenticated Profile (Private) OR Guest Authentication Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            /* Authenticated User Session View - Private & Dedicated */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={profileLink}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                title="View your private profile"
              >
                <Avatar src={displayAvatar} name={displayName} size="xs" />
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white max-w-[130px] truncate">{displayName}</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">{roleLabel}</span>
                </div>
              </Link>

              {/* Dedicated Sign Out Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500/50 flex items-center gap-1.5"
                title="Sign out of your private account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            /* Guest / Unauthenticated Visitor View - Prompt Sign In or Register */
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-brand-400" />
                  <span>Sign In</span>
                </Button>
              </Link>

              <Link href="/login?tab=register-brand">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs font-bold flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
