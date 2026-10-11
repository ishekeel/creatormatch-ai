'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Compass,
  Briefcase,
  Layers,
  UploadCloud,
  ShieldCheck,
  MessageSquare,
  Bell,
  User,
  Settings,
  Sparkles,
  Play,
  LogOut,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';

export const CreatorSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { activeCreator, unreadNotificationCount, connections, logoutUser } = useApp();
  const pendingCount = connections.filter(c => c.receiverId === activeCreator.id && c.status === 'pending').length;

  const navItems = [
    { label: 'Home', href: '/creator/dashboard', icon: Compass },
    { label: 'Find Brands', href: '/creator/find-brands', icon: Sparkles, badge: 'AI Match' },
    { label: 'Discover Campaigns', href: '/creator/campaigns', icon: Briefcase, badge: 'Marketplace' },
    { label: 'My Campaigns', href: '/creator/my-campaigns', icon: Layers, badge: 'Applications' },
    { label: 'Connections', href: '/creator/connections', icon: ShieldCheck, count: pendingCount > 0 ? `${pendingCount}` : undefined },
    { label: 'Portfolio Entries', href: '/creator/portfolio', icon: Play, badge: 'Reels' },
    { label: 'Notifications', href: '/creator/notifications', icon: Bell, count: unreadNotificationCount ? `${unreadNotificationCount}` : undefined },
    { label: 'Create Creator Profile', href: '/creator/profile', icon: User },
    { label: 'Settings', href: '/creator/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-[calc(100vh-53px)] sticky top-[53px] shrink-0">
      {/* Creator Profile Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <Avatar src={activeCreator.avatar} name={activeCreator.name} size="md" />
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-white truncate">{activeCreator.name}</h4>
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          </div>
          <p className="text-xs text-slate-400 truncate">{activeCreator.handle} • {activeCreator.niche[0] || 'Creator'}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {item.badge}
                </span>
              )}

              {item.count ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-pink-500 text-white">
                  {item.count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Action */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/10 border border-rose-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
