'use client';

import React from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/navigation/TopNav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans selection:bg-amber selection:text-charcoal">
      <TopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Editorial Footnote & System Information */}
      <footer className="mt-auto border-t border-border-light bg-ivory-200/60 py-8 px-4 sm:px-6 lg:px-8 text-xs font-mono text-charcoal-200 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-base text-charcoal font-medium">DYNAFIN</span>
              <span className="text-[10px] text-rust uppercase tracking-widest font-mono">Opportunity IQ</span>
              <span className="text-border-dark">|</span>
              <span className="text-charcoal-400">Arthaton 2026</span>
            </div>
            <p className="text-[11px] text-charcoal-400 max-w-xl font-sans">
              A pre-order financial decision intelligence platform for Indian MSMEs. Designed to prevent opportunity blindness before capital, material, and capacity commitments.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <Link href="/workspace" className="hover:text-charcoal underline underline-offset-4">
              Workspace
            </Link>
            <Link href="/opportunities" className="hover:text-charcoal underline underline-offset-4">
              Opportunity Studio
            </Link>
            <Link href="/scenarios" className="hover:text-charcoal underline underline-offset-4">
              Scenario Lab
            </Link>
            <Link href="/reports" className="hover:text-charcoal underline underline-offset-4">
              Report Centre
            </Link>
            <span className="text-charcoal-400">
              Decision Support Platform • Not a Bank or Credit Rating Agency
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
