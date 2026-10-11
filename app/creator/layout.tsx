'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CreatorSidebar } from '@/components/shared/CreatorSidebar';
import { AppHeader } from '@/components/shared/AppHeader';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAuthReady, role } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isAuthReady) {
      if (!isAuthenticated) {
        router.replace('/login/creator');
      } else if (role !== 'creator') {
        router.replace('/brand/dashboard');
      }
    }
  }, [isAuthReady, isAuthenticated, role, router]);

  // Loading state while checking session from local persistent DB
  if (!isAuthReady) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-53px)] bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not logged in or incorrect role -> Auth guard redirects
  if (!isAuthenticated || role !== 'creator') {
    return null;
  }

  return (
    <div className="flex-1 flex min-h-[calc(100vh-53px)] bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <CreatorSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-xs bg-slate-950 border-r border-slate-800">
            <CreatorSidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
