import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AppNavbar } from '@/components/shared/AppNavbar';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'CreatorMatch AI | Precision AI Creator Matching & Discovery Platform',
  description:
    'AI-powered creator discovery, campaigns, and creative challenges built around relevance, creativity, and proven performance—not just follower count.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white min-h-screen flex flex-col">
        <AppProvider>
          {/* Persistent Top Navigation Bar */}
          <AppNavbar />
          
          <main className="flex-1 flex flex-col">{children}</main>

          {/* Real-time Global Toasts */}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
