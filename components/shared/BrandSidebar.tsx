'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Megaphone,
  FileCheck2,
  MessageSquare,
  Bell,
  Building,
  Settings,
  Sparkles,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';

export const BrandSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { activeBrand, unreadNotificationCount, connections, logoutUser } = useApp();
  const pendingCount = connections.filter(c => c.receiverId === activeBrand.id && c.status === 'pending').length;

  const navItems = [
    { label: 'Dashboard', href: '/brand/dashboard', icon: LayoutDashboard },
    { label: 'Find Creators', href: '/brand/creators', icon: Users, badge: 'AI Match' },
    { label: 'Create Campaign', href: '/brand/campaigns/new', icon: PlusCircle },
    { label: 'Campaigns & Pitches', href: '/brand/campaigns', icon: Megaphone },
    { label: 'Submissions', href: '/brand/submissions', icon: FileCheck2 },
    { label: 'Connections', href: '/brand/connections', icon: UserCheck, count: pendingCount > 0 ? `${pendingCount}` : undefined },
    { label: 'Messages', href: '/brand/messages', icon: MessageSquare },
    { label: 'Notifications', href: '/brand/notifications', icon: Bell, count: unreadNotificationCount },
    { label: 'Brand Profile', href: '/brand/profile', icon: Building },
    { label: 'Settings', href: '/brand/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-[calc(100vh-53px)] sticky top-[53px] shrink-0">
      {/* Brand Header Snapshot */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <Avatar src={activeBrand.logo} name={activeBrand.name} size="md" />
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-white truncate">{activeBrand.name}</h4>
          <p className="text-xs text-slate-400 truncate">{activeBrand.industry}</p>
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
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
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
