'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoleSelectionPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 min-h-[60vh] text-center text-slate-400">
      <p className="animate-pulse text-sm">Redirecting to CreatorMatch Sign In &amp; Registration Portal...</p>
    </div>
  );
}
