'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Building2,
  UserCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const OpeningAuthGateway: React.FC = () => {
  const router = useRouter();
  const { brands, creators, registerNewBrand, registerNewCreator, validateAndLogin } = useApp();

  const [selectedRole, setSelectedRole] = useState<'brand' | 'creator'>('brand');
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCategory, setRegCategory] = useState('');
  const [regLocation, setRegLocation] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      const res = await validateAndLogin(email, password, selectedRole);
      if (res.success) {
        router.push(selectedRole === 'brand' ? '/brand/dashboard' : '/creator/dashboard');
      } else {
        setAuthError(res.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Login failed. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setAuthError('Please enter your name.');
      return;
    }
    if (!regEmail.trim()) {
      setAuthError('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (selectedRole === 'brand') {
        await registerNewBrand({
          name: regName,
          industry: regCategory || 'Fashion & Apparel',
          operatingDuration: '1 Year',
          location: regLocation || 'India',
          website: `https://${regName.toLowerCase().replace(/\s+/g, '')}.com`,
          description: `${regName} specializes in ${regCategory || 'consumer products'}.`,
          targetAudience: 'Engaged consumers and trendsetters aged 18-35',
          products: [],
          email: regEmail,
          password: regPassword || 'password123',
        });
        router.push('/brand/dashboard');
      } else {
        await registerNewCreator({
          name: regName,
          email: regEmail,
          password: regPassword || 'password123',
          handle: `@${regName.toLowerCase().replace(/\s+/g, '')}`,
          bio: `Verified creator specializing in ${regCategory || 'Lifestyle & Visual Arts'}.`,
          location: regLocation || 'India',
          languages: ['English', 'Hindi'],
          niche: regCategory ? [regCategory] : ['Lifestyle'],
          categories: ['Reels', 'Shorts'],
          socialUrls: { instagram: 'https://instagram.com' },
          highestFollowers: 10000,
          highestFollowersDisplay: '10K',
          engagementRate: 5.0,
          portfolio: [],
        });
        router.push('/creator/dashboard');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 py-12 px-4 sm:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Gateway Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-brand-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Authentication Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Sign In to CreatorMatch AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Choose your account type below to log in as a <strong className="text-white">Brand Sponsor</strong> or a <strong className="text-white">Content Creator</strong>.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="flex items-center justify-center gap-3 max-w-md mx-auto p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('brand');
              setAuthError('');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'brand'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-1 ring-brand-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Brand Creator / Sponsor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('creator');
              setAuthError('');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'creator'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 ring-1 ring-pink-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Content Creator</span>
          </button>
        </div>

        {/* Main Authentication Card */}
        <Card className="p-6 sm:p-8 bg-slate-900/95 border-slate-800 space-y-6 max-w-xl mx-auto shadow-2xl">
          {/* Sign In vs Register Tabs */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {selectedRole === 'brand' ? (
                  <>
                    <Building2 className="w-5 h-5 text-brand-400" />
                    <span>Brand Creator Portal</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 text-pink-400" />
                    <span>Content Creator Portal</span>
                  </>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {authMode === 'signin' ? 'Sign in with your User ID and password' : 'Create your verified account profile'}
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  authMode === 'signin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  authMode === 'register' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Error banner */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {authError}
            </div>
          )}

          {/* SIGN IN FORM */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  User ID or Email
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={selectedRole === 'brand' ? 'brand@company.com' : 'creator@handle.com'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                variant={selectedRole === 'brand' ? 'primary' : 'accent'}
                className="w-full text-xs font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Authenticating...' : `Sign In to ${selectedRole === 'brand' ? 'Brand Dashboard' : 'Creator Dashboard'}`}
              </Button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {selectedRole === 'brand' ? 'Brand Company Name' : 'Full Name / Creator Name'}
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder={selectedRole === 'brand' ? 'e.g. Aura Luxe Apparel' : 'e.g. Priya Sharma'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">User ID / Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="user@creatormatch.ai"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {selectedRole === 'brand' ? 'Industry / Sector' : 'Content Niche'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regCategory}
                    onChange={e => setRegCategory(e.target.value)}
                    placeholder={selectedRole === 'brand' ? 'e.g. Fashion, Gaming, Tech' : 'e.g. Fashion, Tech, Food'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    required
                    value={regLocation}
                    onChange={e => setRegLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Bangalore"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                variant={selectedRole === 'brand' ? 'primary' : 'accent'}
                className="w-full text-xs font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account & Enter Platform'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
