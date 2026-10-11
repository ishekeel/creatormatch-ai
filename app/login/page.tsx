'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PortfolioItem } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Building2,
  UserCheck,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Video,
  CheckCircle2,
  Calendar,
  Globe,
  Instagram,
  Youtube,
  Layers,
  ShoppingBag,
  Mail,
  Upload,
  Image,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  const { brands, creators, registerNewBrand, registerNewCreator, validateAndLogin } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'brand' | 'creator'>(
    tabParam === 'register-brand' ? 'brand' : tabParam === 'register-creator' ? 'creator' : 'signin'
  );

  // Credential Sign In State
  const [loginRole, setLoginRole] = useState<'brand' | 'creator'>('brand');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tabParam === 'register-brand') setActiveTab('brand');
    else if (tabParam === 'register-creator') setActiveTab('creator');
  }, [tabParam]);

  // Brand Form State
  const [brandForm, setBrandForm] = useState({
    name: '',
    industry: 'Beauty & Skincare',
    operatingDuration: '',
    location: '',
    website: '',
    description: '',
    targetAudience: '',
    products: [] as Array<{ name: string; category: string; description: string; image: string }>,
  });

  // Creator Form State (Clean, non-prefilled initial state)
  const [creatorForm, setCreatorForm] = useState<{
    name: string;
    email: string;
    avatar: string;
    handle: string;
    bio: string;
    location: string;
    languages: string;
    niche: string;
    categories: string;
    instagramUrl: string;
    youtubeUrl: string;
    highestFollowers: number | string;
    highestFollowersDisplay: string;
    engagementRate: number | string;
    hasWorkedWithBrands: boolean;
    pastBrands: string;
    portfolioPosts: PortfolioItem[];
  }>({
    name: '',
    email: '',
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
    highestFollowersDisplay: '',
    engagementRate: '',
    hasWorkedWithBrands: false,
    pastBrands: '',
    portfolioPosts: [],
  });

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCreatorForm(prev => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    setBrandForm(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          name: '',
          category: 'General',
          description: '',
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80',
        },
      ],
    }));
  };

  const handleRemoveProduct = (index: number) => {
    setBrandForm(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleAddPortfolioPost = () => {
    setCreatorForm(prev => ({
      ...prev,
      portfolioPosts: [
        ...prev.portfolioPosts,
        {
          id: `post-${Date.now()}`,
          title: 'New Video Reel',
          type: 'reel',
          url: '',
          thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
          views: 50000,
          engagement: 6.5,
        },
      ],
    }));
  };

  const handleRemovePortfolioPost = (index: number) => {
    setCreatorForm(prev => ({
      ...prev,
      portfolioPosts: prev.portfolioPosts.filter((_, i) => i !== index),
    }));
  };

  // Submit Brand Registration
  const handleSubmitBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return;

    try {
      setIsSubmitting(true);
      await registerNewBrand({
        name: brandForm.name,
        industry: brandForm.industry,
        operatingDuration: brandForm.operatingDuration || '1 Year',
        location: brandForm.location || 'India',
        website: brandForm.website,
        description: brandForm.description || `${brandForm.name} specializes in ${brandForm.industry}.`,
        targetAudience: brandForm.targetAudience,
        products: brandForm.products.filter(p => p.name.trim()),
      });

      router.push('/brand/dashboard');
    } catch (err: any) {
      setLoginError(err?.message || 'Brand registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Creator Registration
  const handleSubmitCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorForm.name.trim()) return;

    try {
      setIsSubmitting(true);
      await registerNewCreator({
        name: creatorForm.name,
        email: creatorForm.email || `${creatorForm.name.toLowerCase().replace(/\s+/g, '')}@creatormatch.ai`,
        avatar: creatorForm.avatar,
        handle: creatorForm.handle.startsWith('@') ? creatorForm.handle : `@${creatorForm.handle || creatorForm.name.toLowerCase().replace(/\s+/g, '')}`,
        bio: creatorForm.bio || `Content creator specializing in ${creatorForm.niche || 'Lifestyle'}.`,
        location: creatorForm.location || 'India',
        languages: creatorForm.languages ? creatorForm.languages.split(',').map(l => l.trim()) : ['English'],
        niche: creatorForm.niche ? creatorForm.niche.split(',').map(n => n.trim()) : ['Lifestyle'],
        categories: creatorForm.categories ? creatorForm.categories.split(',').map(c => c.trim()) : ['Reels'],
        socialUrls: {
          instagram: creatorForm.instagramUrl,
          youtube: creatorForm.youtubeUrl,
        },
        highestFollowers: Number(creatorForm.highestFollowers) || 10000,
        highestFollowersDisplay: creatorForm.highestFollowers ? `${(Number(creatorForm.highestFollowers) / 1000).toFixed(0)}K` : '10K',
        engagementRate: Number(creatorForm.engagementRate) || 5.0,
        portfolio: creatorForm.portfolioPosts,
        pastBrandsWorkedWith: creatorForm.hasWorkedWithBrands && creatorForm.pastBrands
          ? creatorForm.pastBrands.split(',').map(b => b.trim())
          : [],
      });

      router.push('/creator/dashboard');
    } catch (err: any) {
      setLoginError(err?.message || 'Creator registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-53px)] bg-slate-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto space-y-6 relative z-10 py-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-brand-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Professional Network for Brands & Creators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome to CreatorMatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Sign in as an existing brand or content creator, or create your professional profile below.
          </p>
        </div>

        {/* Dedicated Portals Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link
            href="/login/creator"
            className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/40 to-slate-900 border border-pink-500/30 hover:border-pink-500 transition-all group flex items-start gap-3.5 shadow-lg shadow-pink-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white group-hover:text-pink-300 flex items-center gap-1.5">
                Content Creator Portal
                <ArrowRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Dedicated sign in &amp; profile builder for creators and influencers.
              </p>
            </div>
          </Link>

          <Link
            href="/login/brand"
            className="p-4 rounded-2xl bg-gradient-to-br from-brand-950/40 to-slate-900 border border-brand-500/30 hover:border-brand-500 transition-all group flex items-start gap-3.5 shadow-lg shadow-brand-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white group-hover:text-brand-300 flex items-center gap-1.5">
                Brand Sponsor Portal
                <ArrowRight className="w-3.5 h-3.5 text-brand-400 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Dedicated sign in &amp; registration for marketing teams and brands.
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'signin'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Quick Sign In
          </button>
          <button
            onClick={() => setActiveTab('brand')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'brand'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Register Brand
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'creator'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Register Creator
          </button>
        </div>

        {/* TAB 1: Fast Sign In to Existing Profile with Credentials */}
        {activeTab === 'signin' && (
          <Card className="p-6 sm:p-8 bg-slate-900/95 border-slate-800 space-y-6 max-w-xl mx-auto animate-fade-in">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Sign In to CreatorMatch
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your registered credentials below to access your account.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('brand');
                  setLoginError('');
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  loginRole === 'brand'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Brand Creator
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('creator');
                  setLoginError('');
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  loginRole === 'creator'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Content Creator
              </button>
            </div>

            {/* Error banner */}
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {loginError}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={async e => {
                e.preventDefault();
                setLoginError('');
                setIsSubmitting(true);
                try {
                  const res = await validateAndLogin(loginEmail, loginPassword, loginRole);
                  if (res.success) {
                    const targetRole = res.role || loginRole;
                    if (targetRole === 'brand') {
                      router.push('/brand/dashboard');
                    } else {
                      router.push('/creator/dashboard');
                    }
                  } else {
                    setLoginError(res.message || 'Invalid credentials. Please verify your email and password.');
                  }
                } catch (err: any) {
                  setLoginError(err?.message || 'Login failed. Please check your network connection.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <Input
                label="User ID or Email"
                type="text"
                placeholder={loginRole === 'brand' ? 'brand@company.com' : 'creator@example.com'}
                value={loginEmail}
                onChange={e => {
                  setLoginEmail(e.target.value);
                  setLoginError('');
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
                  setLoginError('');
                }}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Authenticating...' : `Sign In as ${loginRole === 'brand' ? 'Brand Sponsor' : 'Content Creator'}`}
              </Button>
            </form>
          </Card>
        )}

        {/* TAB 2: Brand Questionnaire & Registration */}
        {activeTab === 'brand' && (
          <Card className="p-6 sm:p-8 bg-slate-900/95 border-slate-800 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-400" />
                  Brand Creator Registration Questionnaire
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set up your brand profile so content creators can discover your brand and inspect your campaigns.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitBrand} className="space-y-5">
              {/* Question 1: What is my brand name? */}
              <div className="space-y-1">
                <Input
                  label="1. What is your Brand Name?"
                  placeholder="e.g. Aura Botanicals, GlowRush Beauty, UrbanPulse"
                  value={brandForm.name}
                  onChange={e => setBrandForm({ ...brandForm, name: e.target.value })}
                  required
                />
              </div>

              {/* Question 2: What is my brand related to? */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="2. What is your Brand Related To? (Industry / Niche)"
                  placeholder="e.g. Clean Skincare, Streetwear Fashion, Audio Wearables"
                  value={brandForm.industry}
                  onChange={e => setBrandForm({ ...brandForm, industry: e.target.value })}
                  required
                />

                {/* Question 3: How long that my brand is going on? */}
                <Input
                  label="3. How Long has your Brand been Operating?"
                  placeholder="e.g. 4 Years (Est. 2021) or Just Launching"
                  value={brandForm.operatingDuration}
                  onChange={e => setBrandForm({ ...brandForm, operatingDuration: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Headquarters / Location"
                  placeholder="e.g. Mumbai, India"
                  value={brandForm.location}
                  onChange={e => setBrandForm({ ...brandForm, location: e.target.value })}
                />
                <Input
                  label="Official Website URL"
                  placeholder="https://yourbrand.com"
                  value={brandForm.website}
                  onChange={e => setBrandForm({ ...brandForm, website: e.target.value })}
                />
              </div>

              <Textarea
                label="Brand Bio & Vision"
                placeholder="Describe your brand ethos and what makes your product unique..."
                value={brandForm.description}
                onChange={e => setBrandForm({ ...brandForm, description: e.target.value })}
                rows={2}
              />

              {/* Question 4: What kind of products do you sell? */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-brand-400" />
                      4. What kind of products do you sell? (Product Catalog)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Add products that content creators can feature in their UGC and video reels.
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddProduct}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Product
                  </Button>
                </div>

                <div className="space-y-3">
                  {brandForm.products.map((prod, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-400">Product #{idx + 1}</span>
                        {brandForm.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(idx)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          placeholder="Product Name (e.g. Nectar Glow Drops)"
                          value={prod.name}
                          onChange={e => {
                            const updated = [...brandForm.products];
                            updated[idx].name = e.target.value;
                            setBrandForm({ ...brandForm, products: updated });
                          }}
                          required
                        />
                        <Input
                          placeholder="Category (e.g. Skincare, Streetwear)"
                          value={prod.category}
                          onChange={e => {
                            const updated = [...brandForm.products];
                            updated[idx].category = e.target.value;
                            setBrandForm({ ...brandForm, products: updated });
                          }}
                        />
                      </div>

                      <Input
                        placeholder="Product Description (e.g. Hydrating serum with Niacinamide)"
                        value={prod.description}
                        onChange={e => {
                          const updated = [...brandForm.products];
                          updated[idx].description = e.target.value;
                          setBrandForm({ ...brandForm, products: updated });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Button type="button" variant="ghost" size="md" onClick={() => setActiveTab('signin')}>
                  Back to Sign In
                </Button>

                <Button type="submit" variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Complete Brand Setup & Launch Dashboard
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 3: Content Creator Registration & Portfolio Builder */}
        {activeTab === 'creator' && (
          <Card className="p-6 sm:p-8 bg-slate-900/95 border-slate-800 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-pink-400" />
                  Content Creator Registration & Portfolio Builder
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Build your creator portfolio (LinkedIn-style) with your social channels, highest followers, and video posts.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitCreator} className="space-y-6">
              {/* Section 1: Account, Email & Profile Photo */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  1. Creator Profile &amp; Contact Credentials
                </h4>

                {/* Profile Photo Upload / Selector */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Creator Profile Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group">
                      <Avatar
                        src={creatorForm.avatar}
                        name={creatorForm.name || 'Creator'}
                        size="xl"
                        className="border-2 border-pink-500/50 shadow-lg"
                      />
                      <span className="absolute -bottom-1 -right-1 p-1 bg-pink-600 rounded-full text-white text-[10px]">
                        📸
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-pink-400" />
                          <span>Upload Photo File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-slate-500">or paste image URL:</span>
                      </div>

                      <Input
                        placeholder="https://images.unsplash.com/..."
                        value={creatorForm.avatar}
                        onChange={e => setCreatorForm({ ...creatorForm, avatar: e.target.value })}
                      />

                      {/* Quick Avatar Presets */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-500">Quick presets:</span>
                        {[
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
                        ].map((presetUrl, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setCreatorForm(prev => ({ ...prev, avatar: presetUrl }))}
                            className="w-6 h-6 rounded-full overflow-hidden border border-slate-700 hover:border-pink-500 transition-colors"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={presetUrl} alt="preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Creator Full Name"
                    placeholder="e.g. Rohan Kapoor, Ananya Rao"
                    value={creatorForm.name}
                    onChange={e => setCreatorForm({ ...creatorForm, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email ID Address"
                    type="email"
                    placeholder="e.g. rohan@creator.io, ananya@gmail.com"
                    value={creatorForm.email}
                    onChange={e => setCreatorForm({ ...creatorForm, email: e.target.value })}
                    leftIcon={<Mail className="w-4 h-4 text-pink-400" />}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Primary Social Handle"
                    placeholder="e.g. @rohankapoor"
                    value={creatorForm.handle}
                    onChange={e => setCreatorForm({ ...creatorForm, handle: e.target.value })}
                    required
                  />
                  <Input
                    label="Location (City / Region)"
                    placeholder="e.g. Bangalore, India"
                    value={creatorForm.location}
                    onChange={e => setCreatorForm({ ...creatorForm, location: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Bio & Creative Niche Positioning"
                  placeholder="Tell brands what content you create and why audiences trust your reviews..."
                  value={creatorForm.bio}
                  onChange={e => setCreatorForm({ ...creatorForm, bio: e.target.value })}
                  rows={2}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Primary Content Niches"
                    placeholder="e.g. Fashion, Streetwear, Lifestyle, Tech"
                    value={creatorForm.niche}
                    onChange={e => setCreatorForm({ ...creatorForm, niche: e.target.value })}
                  />
                  <Input
                    label="Content Languages (Comma-separated)"
                    placeholder="e.g. English, Hindi, Telugu"
                    value={creatorForm.languages}
                    onChange={e => setCreatorForm({ ...creatorForm, languages: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 2: Social Channels & Highest Followers */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  2. Social Media Details &amp; Follower Reach
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Instagram Profile URL"
                    placeholder="https://instagram.com/yourhandle"
                    value={creatorForm.instagramUrl}
                    onChange={e => setCreatorForm({ ...creatorForm, instagramUrl: e.target.value })}
                    leftIcon={<Instagram className="w-4 h-4 text-pink-400" />}
                  />
                  <Input
                    label="YouTube Channel URL"
                    placeholder="https://youtube.com/@yourchannel"
                    value={creatorForm.youtubeUrl}
                    onChange={e => setCreatorForm({ ...creatorForm, youtubeUrl: e.target.value })}
                    leftIcon={<Youtube className="w-4 h-4 text-red-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Highest Follower Count On Any Single Platform"
                    type="number"
                    placeholder="e.g. 140000"
                    value={creatorForm.highestFollowers}
                    onChange={e => setCreatorForm({ ...creatorForm, highestFollowers: e.target.value })}
                    required
                  />
                  <Input
                    label="Average Engagement Rate (%)"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 7.5"
                    value={creatorForm.engagementRate}
                    onChange={e => setCreatorForm({ ...creatorForm, engagementRate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Section 3: Brand Collaboration History (Explicit Interactive Choice) */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    3. Brand Collaboration Experience
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Have you previously collaborated with commercial brands, sponsors, or startups?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCreatorForm(prev => ({ ...prev, hasWorkedWithBrands: false, pastBrands: '' }))}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      !creatorForm.hasWorkedWithBrands
                        ? 'bg-pink-950/20 border-pink-500 shadow-md shadow-pink-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl text-xs font-bold ${!creatorForm.hasWorkedWithBrands ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      🌱
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        No, Independent / Fresh Talent
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        I am just getting started with brand deals or create pure organic content.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreatorForm(prev => ({ ...prev, hasWorkedWithBrands: true }))}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      creatorForm.hasWorkedWithBrands
                        ? 'bg-pink-950/20 border-pink-500 shadow-md shadow-pink-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl text-xs font-bold ${creatorForm.hasWorkedWithBrands ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      🤝
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Yes, I Have Worked With Brands
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        I have delivered sponsored posts, UGC, or paid brand integrations.
                      </span>
                    </div>
                  </button>
                </div>

                {creatorForm.hasWorkedWithBrands && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-pink-500/30 animate-fade-in space-y-2">
                    <Input
                      label="Which brands have you worked with? (Comma-separated)"
                      placeholder="e.g. Puma, StyleWear, Nike, Mamaearth, BoAt"
                      value={creatorForm.pastBrands}
                      onChange={e => setCreatorForm({ ...creatorForm, pastBrands: e.target.value })}
                      required={creatorForm.hasWorkedWithBrands}
                    />
                    <p className="text-[10px] text-slate-500">
                      These verified brands will appear on your creator media kit and boost your AI Reputation score.
                    </p>
                  </div>
                )}
              </div>

              {/* Section 4: Previously Done Portfolio & Video Posts */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-pink-400" />
                      4. Previously Done Portfolio &amp; Video Posts
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Upload or link your best reels and videos. Brands watch these during campaign evaluations.
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddPortfolioPost}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Video Post
                  </Button>
                </div>

                {creatorForm.portfolioPosts.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      No video posts added yet. Click <strong className="text-white">+ Add Video Post</strong> to showcase your work.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleAddPortfolioPost}
                      leftIcon={<Plus className="w-3.5 h-3.5 text-pink-400" />}
                    >
                      Add First Video Post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {creatorForm.portfolioPosts.map((post, idx) => (
                      <div
                        key={post.id || idx}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-400">Video Post #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePortfolioPost(idx)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            placeholder="Post Title (e.g. 3 Ways to Style Oversized Tee)"
                            value={post.title}
                            onChange={e => {
                              const updated = [...creatorForm.portfolioPosts];
                              updated[idx].title = e.target.value;
                              setCreatorForm({ ...creatorForm, portfolioPosts: updated });
                            }}
                            required
                          />
                          <Input
                            placeholder="Reel / Video URL (e.g. https://instagram.com/reel/...)"
                            value={post.url}
                            onChange={e => {
                              const updated = [...creatorForm.portfolioPosts];
                              updated[idx].url = e.target.value;
                              setCreatorForm({ ...creatorForm, portfolioPosts: updated });
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            type="number"
                            placeholder="Views Count (e.g. 150000)"
                            value={post.views}
                            onChange={e => {
                              const updated = [...creatorForm.portfolioPosts];
                              updated[idx].views = Number(e.target.value);
                              setCreatorForm({ ...creatorForm, portfolioPosts: updated });
                            }}
                          />
                          <Input
                            placeholder="Brand Name (if sponsored collaboration)"
                            value={post.brandName || ''}
                            onChange={e => {
                              const updated = [...creatorForm.portfolioPosts];
                              updated[idx].brandName = e.target.value;
                              setCreatorForm({ ...creatorForm, portfolioPosts: updated });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Button type="button" variant="ghost" size="md" onClick={() => setActiveTab('signin')}>
                  Back to Sign In
                </Button>

                <Button type="submit" variant="accent" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Publish Creator Portfolio & Open Dashboard
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
          Loading authentication gateway...
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
