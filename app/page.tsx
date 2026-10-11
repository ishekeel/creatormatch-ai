import React from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { OpeningAuthGateway } from '@/components/landing/OpeningAuthGateway';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { EcosystemFeatures } from '@/components/landing/EcosystemFeatures';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 overflow-y-auto">
      <LandingNav />
      
      {/* 1. Hero Section First for clear brand presentation */}
      <Hero />

      {/* 2. Interactive Role Gateway & Verified Portal */}
      <div id="get-started">
        <OpeningAuthGateway />
      </div>

      {/* 3. Problem Statement & Comparison */}
      <div id="how-it-works">
        <ProblemSection />
      </div>

      {/* 4. Complete Ecosystem & AI Matching Showcase */}
      <div id="ecosystem">
        <EcosystemFeatures />
      </div>

      {/* 5. Footer */}
      <LandingFooter />
    </div>
  );
}
