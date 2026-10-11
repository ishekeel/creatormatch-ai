'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import {
  Building2,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  UserCheck,
  Lock,
  Globe,
  ShoppingBag,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export default function BrandAuthPage() {
  const router = useRouter();
  const { registerNewBrand, validateAndLogin, brands } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [brandForm, setBrandForm] = useState({
    name: '',
    industry: 'Beauty & Skincare',
    operatingDuration: '',
    location: '',
    website: '',
    email: '',
    password: '',
    description: '',
    targetAudience: '',
    products: [] as Array<{ name: string; category: string; description: string; image: string }>,
  });

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await validateAndLogin(loginEmail, loginPassword, 'brand');
      if (res.success) {
        router.push('/brand/dashboard');
      } else {
        setErrorMsg(res.message || 'Invalid brand credentials. Please verify your email and password.');
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
    if (!brandForm.name.trim()) {
      setErrorMsg('Please enter your brand or company name.');
      return;
    }
    if (!brandForm.email.trim()) {
      setErrorMsg('Please enter your company email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await registerNewBrand({
        name: brandForm.name,
        industry: brandForm.industry,
        operatingDuration: brandForm.operatingDuration || '1 Year',
        location: brandForm.location || 'India',
        website: brandForm.website,
        email: brandForm.email,
        password: brandForm.password || 'password123',
        description: brandForm.description || `${brandForm.name} specializes in ${brandForm.industry}.`,
        targetAudience: brandForm.targetAudience || `Consumers interested in ${brandForm.industry}`,
        products: brandForm.products.filter(p => p.name.trim()),
      });

      router.push('/brand/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Brand registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-53px)] bg-slate-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto space-y-6 relative z-10 py-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/60 text-xs text-brand-300 font-semibold shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-brand-400" />
            <span>Brand Marketer &amp; Sponsor Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Brand Sign In &amp; Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Launch campaigns, discover high-synergy content creators, and manage influencer collaborations.
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
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Sign In as Brand
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Register Brand
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
                <Sparkles className="w-4 h-4 text-brand-400" />
                Sign In to Your Brand Account
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your company email and password to open the brand dashboard.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                label="Company Email or Brand ID"
                type="text"
                placeholder="brand@company.com"
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
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In & Open Brand Dashboard'}
              </Button>
            </form>
          </Card>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <Card className="p-6 sm:p-8 bg-slate-900/95 border-slate-800 space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Register Company &amp; Brand Profile
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your company profile and products to initiate AI creator matchmaking.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company / Brand Name *"
                  type="text"
                  placeholder="e.g. Aura Botanicals"
                  value={brandForm.name}
                  onChange={e => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Industry / Vertical *</label>
                  <select
                    value={brandForm.industry}
                    onChange={e => setBrandForm(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Beauty & Skincare">Beauty &amp; Skincare</option>
                    <option value="Fashion & Apparel">Fashion &amp; Apparel</option>
                    <option value="Food & Beverage">Food &amp; Beverage</option>
                    <option value="Gaming & Esports">Gaming &amp; Esports</option>
                    <option value="Fitness & Health">Fitness &amp; Health</option>
                    <option value="Tech & Electronics">Tech &amp; Electronics</option>
                    <option value="Home & Lifestyle">Home &amp; Lifestyle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Official Company Email *"
                  type="email"
                  placeholder="contact@aurabotanicals.com"
                  value={brandForm.email}
                  onChange={e => setBrandForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Input
                  label="Account Password *"
                  type="password"
                  placeholder="Create a password"
                  value={brandForm.password}
                  onChange={e => setBrandForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Headquarters Location"
                  type="text"
                  placeholder="Mumbai, India"
                  value={brandForm.location}
                  onChange={e => setBrandForm(prev => ({ ...prev, location: e.target.value }))}
                />
                <Input
                  label="Website URL"
                  type="url"
                  placeholder="https://aurabotanicals.com"
                  value={brandForm.website}
                  onChange={e => setBrandForm(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <Textarea
                label="Company Bio & Brand Philosophy"
                placeholder="Describe your brand identity, product philosophy, and marketing goals..."
                rows={2}
                value={brandForm.description}
                onChange={e => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
              />

              <Input
                label="Target Consumer Demographic"
                type="text"
                placeholder="Women and Gen-Z consumers aged 18-32"
                value={brandForm.targetAudience}
                onChange={e => setBrandForm(prev => ({ ...prev, targetAudience: e.target.value }))}
              />

              {/* Product Catalog Entries */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-brand-400" />
                      Flagship Products Catalog
                    </h3>
                    <p className="text-[10px] text-slate-400">Products creators will feature in video campaigns</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddProduct}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Product
                  </Button>
                </div>

                <div className="space-y-3">
                  {brandForm.products.map((prod, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Product #{idx + 1}</span>
                        {brandForm.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={prod.name}
                          onChange={e => {
                            const val = e.target.value;
                            setBrandForm(prev => {
                              const arr = [...prev.products];
                              arr[idx].name = val;
                              return { ...prev, products: arr };
                            });
                          }}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Category (e.g. Skincare, Footwear)"
                          value={prod.category}
                          onChange={e => {
                            const val = e.target.value;
                            setBrandForm(prev => {
                              const arr = [...prev.products];
                              arr[idx].category = val;
                              return { ...prev, products: arr };
                            });
                          }}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Complete Brand Registration &amp; Open Dashboard
              </Button>
            </form>
          </Card>
        )}

        {/* Footer Link to Creator Portal */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Looking for the content creator login?{' '}
            <Link
              href="/login/creator"
              className="text-pink-400 hover:text-pink-300 font-bold underline inline-flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 inline" /> Go to Creator Portal &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
