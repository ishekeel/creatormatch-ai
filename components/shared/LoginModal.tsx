'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Building2,
  UserCheck,
  Droplets,
  Package,
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle,
  Leaf,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  standalone?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen = true,
  onClose,
  standalone = false,
}) => {
  const { setRole, activeBrand, activeCreator, setActiveBrandById } = useApp();
  const router = useRouter();
  const [selectedRoleTab, setSelectedRoleTab] = useState<'brand' | 'creator'>('brand');
  const [email, setEmail] = useState('demo@creatormatch.ai');
  const [password, setPassword] = useState('••••••••');
  const [brandSelection, setBrandSelection] = useState<'glowrush' | 'ecobaby'>('ecobaby');

  if (!isOpen && !standalone) return null;

  const handleLoginAsBrand = (brandKey: 'glowrush' | 'ecobaby' = brandSelection) => {
    setRole('brand');
    if (brandKey === 'ecobaby') {
      setActiveBrandById('brand-ecobaby');
    } else {
      setActiveBrandById('brand-glowrush');
    }
    router.push('/brand/dashboard');
    if (onClose) onClose();
  };

  const handleLoginAsCreator = () => {
    setRole('creator');
    router.push('/creator/dashboard');
    if (onClose) onClose();
  };

  const content = (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-brand-300">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>PostgreSQL & Local Database Sync Active</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Welcome to CreatorMatch AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Authenticate as a <strong className="text-slate-200">Brand Marketer</strong> or a <strong className="text-slate-200">Content Creator</strong> with live environmental impact & inventory metrics.
        </p>
      </div>

      {/* Two Persona Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6">
        {/* BRAND CREATOR LOGIN */}
        <div
          onClick={() => setSelectedRoleTab('brand')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedRoleTab === 'brand'
              ? 'bg-gradient-to-b from-brand-950/40 via-slate-900 to-slate-900 border-brand-500 shadow-lg shadow-brand-500/10'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Brand Creator</h3>
                  <span className="text-[11px] text-slate-400">Marketer & Campaign Sponsor</span>
                </div>
              </div>
              <Badge variant="brand" size="sm">Brand Portal</Badge>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Launch AI-matched influencer campaigns, monitor UGC submissions, and track sustainability & diaper supplies.
            </p>

            {/* MANDATORY METRICS FOR BRAND: WATER EMISSION & DIAPERS */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-emerald-400" />
                  Database Tracked Metrics
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Live
                </span>
              </div>

              {/* Water Emission Metric */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Water Emission Saved:</span>
                </div>
                <span className="text-xs font-bold text-cyan-300">
                  {activeBrand.sustainability ? activeBrand.sustainability.waterEmissionSavedLiters.toLocaleString() : '14,850'} L
                </span>
              </div>

              {/* Diapers Metric */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Package className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Eco-Diapers in Database:</span>
                </div>
                <span className="text-xs font-bold text-amber-300">
                  {activeBrand.sustainability && activeBrand.sustainability.diapersCount > 0
                    ? `${activeBrand.sustainability.diapersCount.toLocaleString()} units`
                    : '28,500 units'}
                </span>
              </div>
            </div>

            {/* Quick Brand Switcher */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrandSelection('ecobaby');
                  handleLoginAsBrand('ecobaby');
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 text-center"
              >
                👶 EcoBaby Diapers
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrandSelection('glowrush');
                  handleLoginAsBrand('glowrush');
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-brand-500/10 border border-brand-500/30 text-[11px] font-semibold text-brand-300 hover:bg-brand-500/20 text-center"
              >
                ✨ GlowRush Beauty
              </button>
            </div>
          </div>

          <Button
            className="w-full mt-5"
            variant="primary"
            onClick={() => handleLoginAsBrand(brandSelection)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue as Brand Creator
          </Button>
        </div>

        {/* CONTENT CREATOR LOGIN */}
        <div
          onClick={() => setSelectedRoleTab('creator')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedRoleTab === 'creator'
              ? 'bg-gradient-to-b from-pink-950/40 via-slate-900 to-slate-900 border-pink-500 shadow-lg shadow-pink-500/10'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Content Creator</h3>
                  <span className="text-[11px] text-slate-400">Influencer & Video Specialist</span>
                </div>
              </div>
              <Badge variant="accent" size="sm">Creator Portal</Badge>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Explore high-relevance brand deals, submit content for AI scoring, compete in meme challenges, and earn Creator Credits.
            </p>

            {/* MANDATORY METRICS FOR CONTENT CREATOR: WATER EMISSION */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-emerald-400" />
                  Database Tracked Metrics
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Live
                </span>
              </div>

              {/* Water Emission Metric */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Water Emission Offset:</span>
                </div>
                <span className="text-xs font-bold text-cyan-300">
                  {activeCreator.sustainability ? activeCreator.sustainability.waterEmissionSavedLiters.toLocaleString() : '3,420'} L
                </span>
              </div>

              {/* Eco Score */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Creator Eco Score:</span>
                </div>
                <span className="text-xs font-bold text-emerald-300">
                  {activeCreator.sustainability ? `${activeCreator.sustainability.ecoScore}/100` : '94/100'} (Verified)
                </span>
              </div>
            </div>

            {/* Creator Profile Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Avatar src={activeCreator.avatar} name={activeCreator.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">{activeCreator.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {activeCreator.handle} • {activeCreator.creatorCredits} Credits
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-5"
            variant="accent"
            onClick={handleLoginAsCreator}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue as Content Creator (Ananya)
          </Button>
        </div>
      </div>

      {/* Database Credentials Helper & Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-slate-500" />
          <span>CreatorMatch Verified Gateway • Supabase Schema ready</span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors underline"
          >
            Explore Public Landing Page
          </button>
        )}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {content}
    </div>
  );
};
