'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import {
  UserCheck,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Video,
  Upload,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  Instagram,
  Youtube,
  KeyRound,
} from 'lucide-react';
import { PortfolioItem } from '@/types';

export default function CreatorAuthPage() {
  const router = useRouter();
  const { registerNewCreator, validateAndLogin, creators } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regForm, setRegForm] = useState<{
    name: string;
    email: string;
    password: string;
    avatar: string;
    handle: string;
    bio: string;
    location: string;
    languages: string;
    niche: string;
    categories: string;
    instagramUrl: string;
    youtubeUrl: string;
    highestFollowers: string;
    engagementRate: string;
    hasWorkedWithBrands: boolean;
    pastBrands: string;
    portfolioPosts: PortfolioItem[];
  }>({
    name: '',
    email: '',
    password: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    handle: '',
    bio: '',
    location: '',
    languages: '',
    niche: '',
    categories: '',
    instagramUrl: '',
    youtubeUrl: '',
    highestFollowers: '',
    engagementRate: '',
    hasWorkedWithBrands: false,
    pastBrands: '',
    portfolioPosts: [],
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setRegForm(prev => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPortfolioPost = () => {
    setRegForm(prev => ({
      ...prev,
      portfolioPosts: [
        ...prev.portfolioPosts,
        {
          id: `post-${Date.now()}`,
          title: 'Featured Reel Video',
          type: 'reel',
          url: 'https://instagram.com/reel/sample',
          thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
          views: 65000,
          engagement: 7.8,
        },
      ],
    }));
  };

  const handleRemovePortfolioPost = (idx: number) => {
    setRegForm(prev => ({
      ...prev,
      portfolioPosts: prev.portfolioPosts.filter((_, i) => i !== idx),
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await validateAndLogin(loginEmail, loginPassword, 'creator');
      if (res.success) {
        router.push('/creator/dashboard');
      } else {
        setErrorMsg(res.message || 'Invalid creator credentials. Please verify your email and password.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regForm.name.trim()) {
      setErrorMsg('Please enter your creator name.');
      return;
    }
    if (!regForm.email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await registerNewCreator({
        name: regForm.name,
        email: regForm.email,
        password: regForm.password || 'password123',
        avatar: regForm.avatar,
        handle: regForm.handle.startsWith('@') ? regForm.handle : `@${regForm.handle || regForm.name.toLowerCase().replace(/\s+/g, '')}`,
        bio: regForm.bio || `Content creator specializing in ${regForm.niche || 'Content Creation'}.`,
        location: regForm.location || 'India',
        languages: regForm.languages ? regForm.languages.split(',').map(l => l.trim()) : ['English'],
        niche: regForm.niche ? regForm.niche.split(',').map(n => n.trim()) : ['Lifestyle'],
        categories: regForm.categories ? regForm.categories.split(',').map(c => c.trim()) : ['Reels'],
        socialUrls: {
          instagram: regForm.instagramUrl || 'https://instagram.com',
          youtube: regForm.youtubeUrl || undefined,
        },
        highestFollowers: Number(regForm.highestFollowers) || 10000,
        highestFollowersDisplay: regForm.highestFollowers ? `${(Number(regForm.highestFollowers) / 1000).toFixed(0)}K` : '10K',
        engagementRate: Number(regForm.engagementRate) || 5.0,
        portfolio: regForm.portfolioPosts,
        pastBrandsWorkedWith: regForm.hasWorkedWithBrands && regForm.pastBrands
          ? regForm.pastBrands.split(',').map(b => b.trim())
          : [],
      });

      router.push('/creator/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-53px)] bg-slate-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto space-y-6 relative z-10 py-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-800/60 text-xs text-pink-300 font-semibold shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-pink-400" />
            <span>Content Creator Authentication Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Creator Sign In &amp; Join
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Manage your sponsorships, apply with pitch videos, and discover brand campaigns matched by AI.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center justify-center gap-2 max-w-sm mx-auto p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              mode === 'signin'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Sign In as Creator
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Create Creator Account
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium max-w-xl mx-auto flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MODE: SIGN IN */}
        {mode === 'signin' && (
          <Card className="p-6 sm:p-8 bg-slate-900/95 border-slate-800 space-y-6 max-w-xl mx-auto shadow-2xl">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Sign In to Your Creator Account
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to access your creator dashboard and applications.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                label="Creator Email or Handle"
                type="text"
                placeholder="creator@example.com or @handle"
                value={loginEmail}
                onChange={e => {
                  setLoginEmail(e.target.value);
                  setErrorMsg('');
                }}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => {
                  setLoginPassword(e.target.value);
                  setErrorMsg('');
                }}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In & Launch Creator Dashboard'}
              </Button>
            </form>
          </Card>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <Card className="p-6 sm:p-8 bg-slate-900/95 border-slate-800 space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Build Your Professional Creator Profile
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your profile will be indexed into CreatorMatch AI matching and surfaced to high-budget brands.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Profile Avatar Upload */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={regForm.avatar}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-500 shrink-0"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white block">Creator Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">Upload your headshot or creator avatar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name / Creator Name *"
                  type="text"
                  placeholder="e.g. Rohan Kapoor"
                  value={regForm.name}
                  onChange={e => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Input
                  label="Primary Handle *"
                  type="text"
                  placeholder="@rohankapoor"
                  value={regForm.handle}
                  onChange={e => setRegForm(prev => ({ ...prev, handle: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="rohan@creator.io"
                  value={regForm.email}
                  onChange={e => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Input
                  label="Password *"
                  type="password"
                  placeholder="Create a password"
                  value={regForm.password}
                  onChange={e => setRegForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Content Niche / Primary Vertical *"
                  type="text"
                  placeholder="Fashion, Lifestyle, Streetwear"
                  value={regForm.niche}
                  onChange={e => setRegForm(prev => ({ ...prev, niche: e.target.value }))}
                  required
                />
                <Input
                  label="Location *"
                  type="text"
                  placeholder="Delhi NCR, India"
                  value={regForm.location}
                  onChange={e => setRegForm(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Followers (Highest Platform) *"
                  type="number"
                  placeholder="120000"
                  value={regForm.highestFollowers}
                  onChange={e => setRegForm(prev => ({ ...prev, highestFollowers: e.target.value }))}
                  required
                />
                <Input
                  label="Engagement Rate (%) *"
                  type="number"
                  step="0.1"
                  placeholder="7.5"
                  value={regForm.engagementRate}
                  onChange={e => setRegForm(prev => ({ ...prev, engagementRate: e.target.value }))}
                  required
                />
              </div>

              <Textarea
                label="Creator Bio & Storytelling Style"
                placeholder="Share your creative mission, video formats, and typical audience vibe..."
                rows={2}
                value={regForm.bio}
                onChange={e => setRegForm(prev => ({ ...prev, bio: e.target.value }))}
              />

              {/* Past Brands Worked With */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pastBrandsCheck"
                    checked={regForm.hasWorkedWithBrands}
                    onChange={e => setRegForm(prev => ({ ...prev, hasWorkedWithBrands: e.target.checked }))}
                    className="w-4 h-4 text-pink-600 rounded bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="pastBrandsCheck" className="text-xs font-bold text-white cursor-pointer">
                    Have you previously collaborated with brands?
                  </label>
                </div>
                {regForm.hasWorkedWithBrands && (
                  <Input
                    label="Previous Brand Collaborations (comma separated)"
                    placeholder="e.g. Puma, Myntra, BoAt, Fastrack"
                    value={regForm.pastBrands}
                    onChange={e => setRegForm(prev => ({ ...prev, pastBrands: e.target.value }))}
                  />
                )}
              </div>

              {/* Sample Portfolio Entries */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">Video Samples &amp; Portfolio Reels</h3>
                    <p className="text-[10px] text-slate-400">Add sample reels to showcase to brands</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPortfolioPost}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Reel
                  </Button>
                </div>

                {regForm.portfolioPosts.length > 0 && (
                  <div className="space-y-2">
                    {regForm.portfolioPosts.map((post, idx) => (
                      <div key={post.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-pink-400" />
                          <span className="font-semibold text-white">{post.title}</span>
                          <span className="text-slate-400 text-[10px]">({post.type})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioPost(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Complete Registration &amp; Open Creator Dashboard
              </Button>
            </form>
          </Card>
        )}

        {/* Footer Link to Brand Portal */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Looking for the brand sponsor login?{' '}
            <Link
              href="/login/brand"
              className="text-brand-400 hover:text-brand-300 font-bold underline inline-flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5 inline" /> Go to Brand Portal &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
