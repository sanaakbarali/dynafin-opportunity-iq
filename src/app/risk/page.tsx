'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR } from '@/lib/formatting/currency';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Building2,
  Users2,
  Coins,
  Factory,
  Scale,
  ArrowRight,
  Sliders,
  Compass,
} from 'lucide-react';
import { RiskLevel, RiskPillar } from '@/types';

export default function RiskAssessmentPage() {
  const { activeOpportunity, business, financials } = useWorkspace();

  if (!activeOpportunity) {
    return (
      <AppLayout>
        <div className="text-center py-20 font-mono text-xs">
          Please select an active opportunity to evaluate its 5-Pillar Risk Assessment.
        </div>
      </AppLayout>
    );
  }

  const { riskAssessment, purchaseOrder, costs } = activeOpportunity;

  const getPillarBadge = (rating: RiskLevel) => {
    switch (rating) {
      case 'Critical':
        return 'bg-rust text-ivory border-rust';
      case 'High':
        return 'bg-rust-light/30 text-rust-dark border-rust/40';
      case 'Moderate':
        return 'bg-amber/20 text-amber-dark border-amber/40';
      default:
        return 'bg-sage/20 text-sage-dark border-sage/40';
    }
  };

  const pillars: { key: string; icon: any; data: RiskPillar }[] = [
    { key: 'customer', icon: Users2, data: riskAssessment.customerDependency },
    { key: 'supplier', icon: Building2, data: riskAssessment.supplierDependency },
    { key: 'cashFlow', icon: Coins, data: riskAssessment.cashFlowDependency },
    { key: 'operational', icon: Factory, data: riskAssessment.operationalDependency },
    { key: 'financial', icon: Scale, data: riskAssessment.financialDependency },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Multi-Dimensional Risk Governance</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Financial & Operational Risk Assessment
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Evaluating vulnerabilities across customer concentration, vendor reliance, liquidity deficits,
              shop floor bottlenecks, and existing debt obligations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/scenarios"
              className="px-5 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md"
            >
              <Sliders className="w-4 h-4 text-amber" />
              <span>Stress-Test in Lab</span>
            </Link>
          </div>
        </div>

        {/* Overall Risk Executive Banner */}
        <div className="bg-charcoal text-ivory p-6 sm:p-8 border border-charcoal-300 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-400 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-sage-light uppercase tracking-wider block">
                Target Opportunity
              </span>
              <span className="font-serif text-2xl text-ivory">
                {purchaseOrder.buyerName} — {purchaseOrder.poNumber}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-ivory-300 uppercase">Overall Exposure:</span>
              <span
                className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border ${getPillarBadge(
                  riskAssessment.overallRating
                )}`}
              >
                {riskAssessment.overallRating} Exposure
              </span>
            </div>
          </div>

          <p className="text-sm font-sans text-ivory-200 leading-relaxed max-w-3xl">
            {riskAssessment.overallSummary}
          </p>

          <div className="p-3 bg-charcoal-400 border border-charcoal-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <span className="text-amber-light font-semibold">
              Primary Recommendation: <span className="text-ivory font-normal">{riskAssessment.decisionRecommendation}</span>
            </span>
            <span className="text-ivory-400 text-[11px]">
              Decision support indicator • Not an automated order rejection
            </span>
          </div>
        </div>

        {/* 5 Distinctive Detailed Risk Pillars */}
        <div className="space-y-6">
          <div className="text-xs font-mono uppercase tracking-widest text-charcoal-400 pb-1">
            Five-Pillar Vulnerability Breakdown
          </div>

          <div className="grid grid-cols-1 gap-6">
            {pillars.map(({ key, icon: Icon, data }) => (
              <div
                key={key}
                className="bg-ivory border border-border-light shadow-sm p-6 sm:p-8 space-y-6 hover:border-charcoal-300 transition-colors"
              >
                {/* Pillar Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-ivory-100 border border-border-light text-charcoal">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-charcoal">{data.title}</h3>
                      <span className="text-[11px] font-mono text-charcoal-400">
                        Data Source: {data.dataSource}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border ${getPillarBadge(
                        data.rating
                      )}`}
                    >
                      {data.rating} Risk
                    </span>
                    <span className="text-[11px] font-mono text-charcoal-400 px-2 py-0.5 bg-ivory-100 border border-border-light">
                      Confidence: {data.confidence}
                    </span>
                  </div>
                </div>

                {/* Narrative Explanation */}
                <p className="text-xs sm:text-sm font-sans text-charcoal-400 leading-relaxed">
                  {data.explanation}
                </p>

                {/* Supporting Figures Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                  {data.supportingFigures.map((fig, idx) => (
                    <div key={idx} className="p-3 bg-ivory-100 border border-border-light space-y-0.5">
                      <span className="text-[11px] text-charcoal-400 block uppercase">{fig.label}</span>
                      <span className="text-base font-bold text-charcoal block">{fig.value}</span>
                      {fig.benchmark && (
                        <span className="text-[10px] text-sage-dark block">Benchmark: {fig.benchmark}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Impact & Action Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                  <div className="p-3 bg-rust/10 border border-rust/30 space-y-1">
                    <span className="text-rust-dark font-bold uppercase text-[11px] block">
                      Potential Operational Impact:
                    </span>
                    <p className="text-[11px] font-sans text-charcoal leading-relaxed">
                      {data.potentialImpact}
                    </p>
                  </div>

                  <div className="p-3 bg-sage/15 border border-sage/40 space-y-1">
                    <span className="text-sage-dark font-bold uppercase text-[11px] block">
                      Recommended Strategic Action:
                    </span>
                    <p className="text-[11px] font-sans text-charcoal leading-relaxed">
                      {data.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation to Remediation */}
        <div className="p-6 bg-ivory-100 border border-border-light flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <span className="text-charcoal-400">
            Address identified risks by checking pre-qualified government & banking facilities.
          </span>
          <Link
            href="/funding"
            className="px-6 py-3 bg-charcoal text-ivory hover:bg-charcoal-600 font-semibold uppercase flex items-center gap-2"
          >
            <span>Explore Mitigation Financing</span>
            <ArrowRight className="w-4 h-4 text-amber" />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
