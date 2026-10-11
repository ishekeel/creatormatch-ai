'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, MessageSquare, Menu, X, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { GlobalSearchModal } from './GlobalSearchModal';

export interface AppHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleMobileMenu }) => {
  const pathname = usePathname() || '';
  const { role, currentUser, activeBrand, activeCreator, unreadNotificationCount } = useApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname.includes('/brand/dashboard')) return 'Brand Dashboard';
    if (pathname.includes('/brand/creators')) return 'Creator Discovery';
    if (pathname.includes('/brand/campaigns/new')) return 'Create New Campaign';
    if (pathname.includes('/brand/campaigns')) return 'Campaign Management';
    if (pathname.includes('/brand/challenges')) return 'Meme Challenges';
    if (pathname.includes('/brand/submissions')) return 'Content Submissions';
    if (pathname.includes('/brand/analytics')) return 'Performance Analytics';
    if (pathname.includes('/brand/connections')) return 'Brand Network & Connections';
    if (pathname.includes('/brand/brands')) return 'Registered Brands Directory';
    if (pathname.includes('/brand/messages')) return 'Messages';
    if (pathname.includes('/brand/notifications')) return 'Notifications';
    if (pathname.includes('/brand/profile')) return 'Brand Profile';
    if (pathname.includes('/brand/settings')) return 'Settings';

    if (pathname.includes('/creator/dashboard')) return 'Creator Overview';
    if (pathname.includes('/creator/campaigns')) return 'Campaign Marketplace';
    if (pathname.includes('/creator/my-campaigns')) return 'My Campaigns';
    if (pathname.includes('/creator/challenges')) return 'Meme Challenges';
    if (pathname.includes('/creator/submissions')) return 'Content Submissions';
    if (pathname.includes('/creator/achievements')) return 'Achievements';
    if (pathname.includes('/creator/credits')) return 'Creator Credits';
    if (pathname.includes('/creator/portfolio')) return 'Verified Portfolio';
    if (pathname.includes('/creator/connections')) return 'Creator Network & Connections';
    if (pathname.includes('/creator/brands')) return 'Explore Brands';
    if (pathname.includes('/creator/analytics')) return 'Creator Analytics';
    if (pathname.includes('/creator/messages')) return 'Messages';
    if (pathname.includes('/creator/notifications')) return 'Notifications';
    if (pathname.includes('/creator/profile')) return 'Creator Profile';

    return 'CreatorMatch AI';
  };

  return (
    <>
      <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-[53px] z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Quick Front / Back Navigation Controls */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => window.history.back()}
              title="Go Back (←)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => window.history.forward()}
              title="Go Forward (→)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Search bar button */}
        <div className="flex items-center gap-2 sm:gap-3">


          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 rounded-xl text-xs transition-all w-36 sm:w-56 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search platform...</span>
            </div>
            <kbd className="hidden sm:inline text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Messages */}
          <Link
            href={role === 'brand' ? '/brand/messages' : '/creator/messages'}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors relative"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
          </Link>

          {/* Notifications */}
          <Link
            href={role === 'brand' ? '/brand/notifications' : '/creator/notifications'}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            )}
          </Link>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <Avatar
              src={role === 'brand' ? activeBrand.logo : activeCreator.avatar}
              name={role === 'brand' ? activeBrand.name : activeCreator.name}
              size="sm"
            />
            <span className="text-xs font-semibold text-slate-200 hidden lg:inline">
              {role === 'brand' ? activeBrand.name : activeCreator.name}
            </span>
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
