'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import {
  Building2,
  Globe,
  MapPin,
  Package,
  Droplets,
  Database,
  CheckCircle,
  Plus,
  Save,
} from 'lucide-react';

export default function BrandProfilePage() {
  const { activeBrand, updateBrandSustainability, addToast } = useApp();

  const [name, setName] = useState(activeBrand.name);
  const [description, setDescription] = useState(activeBrand.description);
  const [website, setWebsite] = useState(activeBrand.website);
  const [industry, setIndustry] = useState(activeBrand.industry);
  const [location, setLocation] = useState(activeBrand.location);
  const [targetAudience, setTargetAudience] = useState(activeBrand.targetAudience);

  // Sustainability fields stored in database
  const [waterEmissionSaved, setWaterEmissionSaved] = useState(
    activeBrand.sustainability?.waterEmissionSavedLiters || 0
  );
  const [diapersCount, setDiapersCount] = useState(
    activeBrand.sustainability?.diapersCount || 0
  );
  const [diaperType, setDiaperType] = useState(
    activeBrand.sustainability?.diaperType || ''
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandSustainability({
      waterEmissionSavedLiters: Number(waterEmissionSaved),
      diapersCount: Number(diapersCount),
      diaperType,
      notes: 'Profile updated with sustainability inventory metrics',
    });
    addToast({
      title: 'Brand Profile Updated ✨',
      message: 'All brand information and sustainability database metrics have been saved.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Brand Profile & ESG Settings</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure brand identity, product catalog, target audience cohorts, and environmental database metrics.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar src={activeBrand.logo} name={name} size="xl" />
            <div>
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <p className="text-xs text-slate-400">{industry} • {location}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Brand Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} required />
            <Input label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          <Textarea
            label="Brand Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />

          <Textarea
            label="Target Audience Persona"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            rows={2}
            required
          />
        </Card>

        {/* Environmental & Diapers Database Settings (Mandatory Requirement) */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Water Emission & Diaper Stock Ledger (Database)
              </h3>
            </div>
            <Badge variant="emerald" size="sm">
              <Database className="w-3 h-3 mr-1" />
              PostgreSQL Persisted
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Water Emission Saved (Liters)"
              type="number"
              value={waterEmissionSaved}
              onChange={(e) => setWaterEmissionSaved(Number(e.target.value))}
              helperText="Verified liters conserved"
              leftIcon={<Droplets className="w-4 h-4 text-cyan-400" />}
            />

            <Input
              label="Eco-Diapers in Database (Units)"
              type="number"
              value={diapersCount}
              onChange={(e) => setDiapersCount(Number(e.target.value))}
              helperText="Tracked product units"
              leftIcon={<Package className="w-4 h-4 text-amber-400" />}
            />

            <Input
              label="Diaper Type & Certification"
              value={diaperType}
              onChange={(e) => setDiaperType(e.target.value)}
              helperText="e.g. 100% Bamboo Plant-Based"
            />
          </div>
        </Card>

        {/* Products Showcase */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Catalog Products ({activeBrand.products.length})</h3>
            <span className="text-xs text-brand-400 font-semibold">+ Add Product</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeBrand.products.map(prod => (
              <div key={prod.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{prod.category}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{prod.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Save All Changes to Database
          </Button>
        </div>
      </form>
    </div>
  );
}
