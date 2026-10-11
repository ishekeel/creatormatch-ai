'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/services/db';
import {
  Settings,
  Database,
  Key,
  Shield,
  Download,
  CheckCircle,
  Copy,
  RefreshCw,
} from 'lucide-react';

export default function BrandSettingsPage() {
  const { resetDemoData, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(db.getSupabaseSchemaSQL());
    setCopied(true);
    addToast({
      title: 'SQL Schema Copied 📋',
      message: 'Supabase PostgreSQL migration script copied to clipboard.',
      type: 'info',
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Platform Settings & Supabase Hub</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage database configuration, view Supabase migration schemas, and control database state.
        </p>
      </div>

      {/* Supabase Status */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Database Integration Status</h3>
              <p className="text-xs text-slate-400">LocalStorage reactive store + Supabase PostgreSQL schema</p>
            </div>
          </div>
          <Badge variant="emerald" size="md">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Ready for Supabase
          </Badge>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">NEXT_PUBLIC_SUPABASE_URL</span>
            <span className="font-mono text-slate-300">https://xyzcompany.supabase.co (Mock/Configured)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            <span className="font-mono text-slate-300">eyJhbGciOiJIUzI1NiIsInR5c... (Secured)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Water Emissions & Diaper Tables</span>
            <span className="text-emerald-400 font-semibold">Active in relational schema</span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopySchema}
            leftIcon={<Copy className="w-4 h-4" />}
          >
            {copied ? 'Schema Copied ✓' : 'Copy Supabase SQL Schema'}
          </Button>
        </div>
      </Card>

      {/* Reset State */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Reset Platform Database</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Re-initialize all campaigns, submissions, creator credits, and water emission records back to defaults.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={resetDemoData}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Reset All Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
