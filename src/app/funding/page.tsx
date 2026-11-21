'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { INDIAN_MSME_FUNDING_SCHEMES } from '@/data/funding/schemes';
import { formatINR } from '@/lib/formatting/currency';
import {
  Compass,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Filter,
  Info,
  ChevronRight,
  Coins,
  ArrowRight,
} from 'lucide-react';

export default function FundingNavigatorPage() {
  const { activeOpportunity, business } = useWorkspace();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);

  const categories = [
    'All',
    'Government Scheme',
    'Working Capital / CC',
    'PO Financing',
    'Invoice Discounting / TReDS',
    'Term Loan',
  ];

  const filteredSchemes =
    selectedCategory === 'All'
      ? INDIAN_MSME_FUNDING_SCHEMES
      : INDIAN_MSME_FUNDING_SCHEMES.filter((s) => s.category === selectedCategory);

  const activeSchemeDetails =
    INDIAN_MSME_FUNDING_SCHEMES.find((s) => s.id === selectedScheme) ||
    filteredSchemes[0];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sage-dark font-semibold">
              <span className="w-2 h-2 rounded-full bg-sage-dark" />
              <span>Capital Remediation Discovery</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Funding Navigator
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Curated verified financing schemes and credit guarantee programmes for Indian MSMEs
              to bridge purchase order working capital deficits without collateral dilution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/loan-comparison"
              className="px-5 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md"
            >
              <span>Compare Loan EMIs</span>
              <ArrowRight className="w-4 h-4 text-amber" />
            </Link>
          </div>
        </div>

        {/* Opportunity Context Banner */}
        {activeOpportunity && (
          <div className="p-4 bg-ivory-100 border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-charcoal-400 text-[11px] uppercase block">Current Working Capital Requirement:</span>
              <span className="font-serif text-lg text-charcoal">
                {activeOpportunity.title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-charcoal-400 text-[11px] block">Unfunded Gap</span>
                <span className="font-bold text-base text-rust">
                  {formatINR(activeOpportunity.costs.workingCapitalGap)}
                </span>
              </div>
              <div className="border-l border-border-light pl-4">
                <span className="text-charcoal-400 text-[11px] block">Recommended Structure</span>
                <span className="font-semibold text-charcoal">PO Financing or CGTMSE WC</span>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 border transition-all ${
                selectedCategory === cat
                  ? 'bg-charcoal text-ivory border-charcoal font-bold'
                  : 'bg-ivory hover:bg-ivory-200 text-charcoal-400 border-border-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scheme Grid & Detailed Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Schemes List */}
          <div className="lg:col-span-7 space-y-4">
            {filteredSchemes.map((scheme) => {
              const isSelected = activeSchemeDetails?.id === scheme.id;
              return (
                <div
                  key={scheme.id}
                  onClick={() => setSelectedScheme(scheme.id)}
                  className={`p-6 border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-charcoal bg-charcoal text-ivory shadow-lg'
                      : 'border-border-light bg-ivory text-charcoal hover:border-charcoal-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-widest block mb-1 ${
                          isSelected ? 'text-amber' : 'text-rust font-semibold'
                        }`}
                      >
                        {scheme.category} • {scheme.provider}
                      </span>
                      <h3 className="font-serif text-2xl">{scheme.name}</h3>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 border whitespace-nowrap ${
                        isSelected
                          ? 'border-sage/40 text-sage-light'
                          : 'border-border-light bg-ivory-100 text-charcoal-400'
                      }`}
                    >
                      {scheme.isVerified ? 'Official Scheme' : 'Illustrative'}
                    </span>
                  </div>

                  <p
                    className={`text-xs font-sans leading-relaxed ${
                      isSelected ? 'text-ivory-300' : 'text-charcoal-400'
                    }`}
                  >
                    {scheme.purpose}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs pt-2 border-t border-current/20">
                    <div>
                      <span className="opacity-70 text-[10px] block">Credit Limit</span>
                      <span className="font-bold">{scheme.limitDisplay}</span>
                    </div>
                    <div>
                      <span className="opacity-70 text-[10px] block">Indicative Rate</span>
                      <span className="font-bold">{scheme.interestRateDisplay}</span>
                    </div>
                    <div>
                      <span className="opacity-70 text-[10px] block">Collateral</span>
                      <span className="font-bold truncate block">{scheme.collateralRequirement}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Selected Scheme Deep-Dive Panel */}
          {activeSchemeDetails && (
            <div className="lg:col-span-5 bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6 sticky top-24">
              <div className="border-b border-border-light pb-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-rust font-semibold">
                  Detailed Scheme Profile
                </span>
                <h3 className="font-serif text-2xl text-charcoal">
                  {activeSchemeDetails.name}
                </h3>
                <span className="text-xs font-mono text-charcoal-400 block">
                  Administering Body: {activeSchemeDetails.provider}
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <span className="text-charcoal-400 uppercase text-[11px] block">Eligibility Requirements</span>
                  <p className="text-xs font-sans text-charcoal mt-1 leading-relaxed">
                    {activeSchemeDetails.eligibility}
                  </p>
                </div>

                <div>
                  <span className="text-charcoal-400 uppercase text-[11px] block">Collateral & Security</span>
                  <p className="text-xs font-sans text-charcoal mt-1 leading-relaxed">
                    {activeSchemeDetails.collateralRequirement}
                  </p>
                </div>

                <div>
                  <span className="text-charcoal-400 uppercase text-[11px] block">Repayment Tenure</span>
                  <span className="font-bold text-charcoal block mt-0.5">{activeSchemeDetails.repaymentPeriod}</span>
                </div>

                <div>
                  <span className="text-charcoal-400 uppercase text-[11px] block mb-1">Mandatory Application Documents</span>
                  <ul className="space-y-1 font-sans text-xs text-charcoal-400">
                    {activeSchemeDetails.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark flex-shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-charcoal-400 uppercase text-[11px] block">Application Procedure</span>
                  <p className="text-xs font-sans text-charcoal mt-1 leading-relaxed">
                    {activeSchemeDetails.applicationProcedure}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border-light flex flex-col gap-2 font-mono text-xs">
                <a
                  href={activeSchemeDetails.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-charcoal hover:bg-charcoal-600 text-ivory text-center font-semibold uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber" />
                </a>
                <Link
                  href="/loan-readiness"
                  className="w-full py-2.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal border border-border-light text-center font-semibold uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Check Loan Document Readiness →</span>
                </Link>
              </div>

              <div className="p-3 bg-ivory-100 border border-border-light text-[11px] font-mono text-charcoal-400 leading-relaxed">
                <strong className="text-charcoal">Disclaimer:</strong> DYNAFIN is not a lender or credit broker.
                Information provided reflects official gazette guidelines. Interest rates fluctuate based on lender EBLR/MCLR benchmarks.
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
