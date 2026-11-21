'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR } from '@/lib/formatting/currency';
import {
  Building2,
  User,
  ShieldCheck,
  Bell,
  Database,
  Save,
  CheckCircle2,
  Key,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { business, userProfile, financials, operations, saveBusinessProfile, user, isDemoMode } = useWorkspace();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [bizForm, setBizForm] = useState({
    businessName: business.businessName,
    tradeName: business.tradeName || '',
    udyamRegNumber: business.udyamRegNumber || '',
    panNumber: business.panNumber || '',
    gstin: business.gstin || '',
    locationCity: business.locationCity,
    locationState: business.locationState,
    employeeCount: business.employeeCount.toString(),
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveBusinessProfile({
        businessName: bizForm.businessName,
        tradeName: bizForm.tradeName,
        udyamRegNumber: bizForm.udyamRegNumber,
        panNumber: bizForm.panNumber,
        gstin: bizForm.gstin,
        locationCity: bizForm.locationCity,
        locationState: bizForm.locationState,
        employeeCount: Number(bizForm.employeeCount) || business.employeeCount,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setSaveError(err.message || 'Failed to update enterprise profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Enterprise Governance</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Business & System Settings
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Configure enterprise identifiers, authorized signatories, baseline liquidity thresholds,
              and Stage 2 database credentials.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-sage/20 border border-sage-dark text-xs font-mono text-charcoal flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-dark" />
            <span>Enterprise parameters saved successfully.</span>
          </div>
        )}

        {saveError && (
          <div className="p-3 bg-rust/10 border border-rust/30 text-xs font-mono text-rust flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Business Profile */}
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
                Section 1 • Legal Enterprise Data
              </span>
              <h2 className="font-serif text-2xl text-charcoal mt-1">
                MSME Profile & Registrations
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono text-xs">
              <div>
                <label className="block uppercase text-charcoal-300 mb-1">Registered Business Name</label>
                <input
                  type="text"
                  value={bizForm.businessName}
                  onChange={(e) => setBizForm({ ...bizForm, businessName: e.target.value })}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-300 mb-1">Trade / Factory Name</label>
                <input
                  type="text"
                  value={bizForm.tradeName}
                  onChange={(e) => setBizForm({ ...bizForm, tradeName: e.target.value })}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-300 mb-1">Udyam Registration Number</label>
                <input
                  type="text"
                  value={bizForm.udyamRegNumber}
                  onChange={(e) => setBizForm({ ...bizForm, udyamRegNumber: e.target.value })}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-300 mb-1">GSTIN</label>
                <input
                  type="text"
                  value={bizForm.gstin}
                  onChange={(e) => setBizForm({ ...bizForm, gstin: e.target.value })}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-300 mb-1">City & State</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={bizForm.locationCity}
                    onChange={(e) => setBizForm({ ...bizForm, locationCity: e.target.value })}
                    className="p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  />
                  <input
                    type="text"
                    value={bizForm.locationState}
                    onChange={(e) => setBizForm({ ...bizForm, locationState: e.target.value })}
                    className="p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-charcoal-300 mb-1">Employee Count</label>
                <input
                  type="number"
                  value={bizForm.employeeCount}
                  onChange={(e) => setBizForm({ ...bizForm, employeeCount: e.target.value })}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Authorized Signatory */}
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
                Section 2 • Account Ownership
              </span>
              <h2 className="font-serif text-2xl text-charcoal mt-1">
                Authorized Officer
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono text-xs">
              <div>
                <label className="block uppercase text-charcoal-300 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={userProfile.fullName}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-300 mb-1">Official Email</label>
                <input
                  type="email"
                  defaultValue={userProfile.email}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Supabase Stage 2 Connectivity Info */}
          <div className="bg-charcoal text-ivory p-6 sm:p-8 border border-charcoal-300 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-charcoal-400 pb-3">
              <Database className="w-5 h-5 text-amber" />
              <h3 className="font-serif text-xl text-ivory">
                Supabase Production Architecture
              </h3>
            </div>

            <p className="text-xs text-ivory-300 font-sans leading-relaxed">
              The application data layer is structured to connect live Supabase PostgreSQL and Storage buckets.
              Table schemas and Row Level Security (RLS) migrations are saved in `supabase/migrations/001_initial_schema.sql`.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 bg-charcoal-400 border border-charcoal-300">
                <span className="text-sage-light block text-[10px]">NEXT_PUBLIC_SUPABASE_URL</span>
                <span className="text-ivory font-mono text-[11px] truncate block">Configured via .env.local</span>
              </div>
              <div className="p-3 bg-charcoal-400 border border-charcoal-300">
                <span className="text-sage-light block text-[10px]">STORAGE BUCKETS</span>
                <span className="text-ivory font-mono text-[11px] truncate block">documents, reports (Private RLS)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3.5 bg-charcoal hover:bg-charcoal-600 disabled:opacity-60 text-ivory font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 text-amber animate-spin" />
                  <span>Persisting Configuration...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber" />
                  <span>Save Enterprise Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
