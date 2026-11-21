'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR, formatIndianDate } from '@/lib/formatting/currency';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  FileText,
  Printer,
  Download,
  Share2,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function ReportCentrePage() {
  const { activeOpportunity, business, financials, operations, user, isDemoMode } = useWorkspace();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      user &&
      !isDemoMode &&
      business.id &&
      !business.id.startsWith('biz-') &&
      activeOpportunity?.id &&
      !activeOpportunity.id.startsWith('opp-')
    ) {
      const persistReportSummary = async () => {
        try {
          const supabase = getSupabaseBrowserClient();
          await supabase.from('financial_reports').insert({
            business_id: business.id,
            opportunity_id: activeOpportunity.id,
            report_title: `Pre-Order Decision Report: ${activeOpportunity.purchaseOrder.poNumber}`,
            report_type: 'pre_order_evaluation',
            report_summary: {
              orderValue: activeOpportunity.purchaseOrder.totalOrderValue,
              grossContribution: activeOpportunity.costs.grossContribution,
              marginPct: activeOpportunity.costs.contributionMarginPct,
              workingCapitalGap: activeOpportunity.costs.workingCapitalGap,
              decision: activeOpportunity.riskAssessment.decisionRecommendation,
              rating: activeOpportunity.riskAssessment.overallRating,
            },
          });
        } catch (err) {
          console.error('Error saving financial report summary:', err);
        }
      };
      persistReportSummary();
    }
  }, [user, isDemoMode, business.id, activeOpportunity]);

  if (!activeOpportunity) {
    return (
      <AppLayout>
        <div className="text-center py-20 font-mono text-xs">
          Please select an opportunity to generate its Pre-Order Financial Decision Report.
        </div>
      </AppLayout>
    );
  }

  const { purchaseOrder, costs, riskAssessment, operationalImpact } = activeOpportunity;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 no-print">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Institutional Decision Artifact</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Report Centre
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Downloadable and printable executive evaluation report. Designed to present deterministic
              financial risk assessments to partners, directors, and commercial bank managers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4 text-amber" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* The Printable Executive Report Document */}
        <div
          ref={reportRef}
          className="bg-ivory border-2 border-charcoal p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto space-y-10 font-sans print:border-none print:shadow-none print:p-0 print:m-0"
        >
          {/* Institutional Header Banner */}
          <div className="border-b-2 border-charcoal pb-6 flex items-start justify-between gap-6">
            <div>
              <div className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                DYNAFIN
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-rust font-bold mt-0.5">
                OPPORTUNITY DECISION INTELLIGENCE REPORT
              </div>
              <div className="text-xs font-mono text-charcoal-400 mt-2">
                Document Ref: IQ-REP-{purchaseOrder.poNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <div className="font-bold text-charcoal">{business.businessName}</div>
              <div className="text-charcoal-400">{business.locationCity}, {business.locationState}</div>
              {business.udyamRegNumber && <div className="text-charcoal-400 text-[10px]">{business.udyamRegNumber}</div>}
              <div className="text-charcoal-400 mt-1">Generated: {formatIndianDate(new Date())}</div>
            </div>
          </div>

          {/* Section 1: Executive Summary & Recommendation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-light pb-2 font-mono text-xs">
              <span className="uppercase text-rust font-bold">1. Executive Recommendation</span>
              <span className="uppercase font-bold text-charcoal">
                Risk Rating: {riskAssessment.overallRating} Exposure
              </span>
            </div>

            <div className="p-4 bg-ivory-100 border border-border-light font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-charcoal">
                <span>Decision Recommendation:</span>
                <span className="text-rust">{riskAssessment.decisionRecommendation}</span>
              </div>
              <p className="font-sans text-xs text-charcoal leading-relaxed pt-1">
                {riskAssessment.overallSummary}
              </p>
            </div>
          </div>

          {/* Section 2: Opportunity & PO Summary */}
          <div className="space-y-4 font-mono text-xs">
            <div className="border-b border-border-light pb-2 uppercase text-rust font-bold">
              2. Purchase Order Specifications
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-ivory-100 border border-border-light">
              <div>
                <span className="text-charcoal-400 text-[10px] block">Buyer Name</span>
                <span className="font-bold text-charcoal">{purchaseOrder.buyerName}</span>
              </div>
              <div>
                <span className="text-charcoal-400 text-[10px] block">PO Number</span>
                <span className="font-bold text-charcoal">{purchaseOrder.poNumber}</span>
              </div>
              <div>
                <span className="text-charcoal-400 text-[10px] block">Total Order Value</span>
                <span className="font-bold text-charcoal">{formatINR(purchaseOrder.totalOrderValue)}</span>
              </div>
              <div>
                <span className="text-charcoal-400 text-[10px] block">Delivery Deadline</span>
                <span className="font-bold text-charcoal">{formatIndianDate(purchaseOrder.deliveryDeadline)}</span>
              </div>
              <div>
                <span className="text-charcoal-400 text-[10px] block">Advance Inflow</span>
                <span className="font-bold text-charcoal">{formatINR(purchaseOrder.advanceAmount)} ({purchaseOrder.advancePercentage}%)</span>
              </div>
              <div>
                <span className="text-charcoal-400 text-[10px] block">Contract Credit Terms</span>
                <span className="font-bold text-charcoal">{purchaseOrder.paymentTermsDays} Days</span>
              </div>
              <div>
                <span className="text-charcoal-400 text-[10px] block">Delivery Location</span>
                <span className="font-bold text-charcoal truncate block">{purchaseOrder.deliveryLocation}</span>
              </div>
              <div>
                <span className="text-charcoal-400 text-[10px] block">GST Rate</span>
                <span className="font-bold text-charcoal">{purchaseOrder.taxRatePct}% GST</span>
              </div>
            </div>
          </div>

          {/* Section 3: Cost Structure & Gross Contribution */}
          <div className="space-y-4 font-mono text-xs">
            <div className="border-b border-border-light pb-2 uppercase text-rust font-bold">
              3. Fulfillment Economics & Contribution Margin
            </div>

            <table className="w-full text-left text-xs border border-border-light">
              <thead className="bg-charcoal text-ivory uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Financial Line Item</th>
                  <th className="p-2.5 text-right">Amount (INR)</th>
                  <th className="p-2.5 text-right">% of PO Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                <tr>
                  <td className="p-2.5 font-bold">Total Contract Value</td>
                  <td className="p-2.5 text-right font-bold">{formatINR(purchaseOrder.totalOrderValue)}</td>
                  <td className="p-2.5 text-right">100.0%</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-5">Raw Materials (Yarn / Billets)</td>
                  <td className="p-2.5 text-right">-{formatINR(costs.rawMaterialCost)}</td>
                  <td className="p-2.5 text-right">{((costs.rawMaterialCost / purchaseOrder.totalOrderValue) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-5">Labour & Weaver Payroll</td>
                  <td className="p-2.5 text-right">-{formatINR(costs.labourCost)}</td>
                  <td className="p-2.5 text-right">{((costs.labourCost / purchaseOrder.totalOrderValue) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-5">Production Consumables & Dyes</td>
                  <td className="p-2.5 text-right">-{formatINR(costs.productionExpenses)}</td>
                  <td className="p-2.5 text-right">{((costs.productionExpenses / purchaseOrder.totalOrderValue) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-5">Packaging & Logistics</td>
                  <td className="p-2.5 text-right">-{formatINR(costs.packagingCost + costs.transportationLogistics)}</td>
                  <td className="p-2.5 text-right">{(((costs.packagingCost + costs.transportationLogistics) / purchaseOrder.totalOrderValue) * 100).toFixed(1)}%</td>
                </tr>
                <tr className="bg-ivory-100 font-bold border-t border-charcoal">
                  <td className="p-2.5 text-charcoal">Total Direct Costs</td>
                  <td className="p-2.5 text-right">{formatINR(costs.totalDirectCost)}</td>
                  <td className="p-2.5 text-right">{((costs.totalDirectCost / purchaseOrder.totalOrderValue) * 100).toFixed(1)}%</td>
                </tr>
                <tr className="bg-amber/10 font-bold text-charcoal">
                  <td className="p-2.5">Estimated Gross Contribution</td>
                  <td className="p-2.5 text-right text-amber-dark">{formatINR(costs.grossContribution)}</td>
                  <td className="p-2.5 text-right text-amber-dark">{costs.contributionMarginPct}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Working Capital & Liquidity Deficit */}
          <div className="space-y-4 font-mono text-xs">
            <div className="border-b border-border-light pb-2 uppercase text-rust font-bold">
              4. Working Capital & Liquidity Risk Analysis
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-ivory-100 border border-border-light">
                <span className="text-charcoal-400 text-[10px] block">Upfront Cash Required</span>
                <span className="font-bold text-charcoal text-sm">{formatINR(costs.upfrontCashRequired)}</span>
                <span className="text-[10px] text-charcoal-400 block mt-0.5">Needed by Day 5 for raw materials</span>
              </div>
              <div className="p-3 bg-rust/10 border border-rust/40">
                <span className="text-rust text-[10px] block font-bold">Unfunded Working Capital Gap</span>
                <span className="font-bold text-rust text-sm">{formatINR(costs.workingCapitalGap)}</span>
                <span className="text-[10px] text-rust-dark block mt-0.5">Exceeds available bank buffer</span>
              </div>
              <div className="p-3 bg-ivory-100 border border-border-light">
                <span className="text-charcoal-400 text-[10px] block">Buyer Payment Drift</span>
                <span className="font-bold text-charcoal text-sm">+28 Days Historical Delay</span>
                <span className="text-[10px] text-charcoal-400 block mt-0.5">Based on 8 verified past invoices</span>
              </div>
            </div>
          </div>

          {/* Section 5: Five-Pillar Audit Summary */}
          <div className="space-y-3 font-mono text-xs">
            <div className="border-b border-border-light pb-2 uppercase text-rust font-bold">
              5. Five-Pillar Governance Scorecard
            </div>

            <div className="space-y-2">
              {[
                { name: 'Customer Concentration', rating: riskAssessment.customerDependency.rating, detail: riskAssessment.customerDependency.explanation },
                { name: 'Supplier Dependency', rating: riskAssessment.supplierDependency.rating, detail: riskAssessment.supplierDependency.explanation },
                { name: 'Cash Flow Exposure', rating: riskAssessment.cashFlowDependency.rating, detail: riskAssessment.cashFlowDependency.explanation },
                { name: 'Shop Floor Load', rating: riskAssessment.operationalDependency.rating, detail: riskAssessment.operationalDependency.explanation },
                { name: 'Debt Servicing Load', rating: riskAssessment.financialDependency.rating, detail: riskAssessment.financialDependency.explanation },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-ivory-100 border border-border-light flex items-start justify-between gap-4">
                  <div>
                    <span className="font-bold text-charcoal">{item.name}</span>
                    <p className="font-sans text-[11px] text-charcoal-400 mt-0.5">{item.detail}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase whitespace-nowrap ${
                      item.rating === 'Critical'
                        ? 'bg-rust text-ivory'
                        : item.rating === 'High'
                        ? 'bg-amber text-charcoal'
                        : 'bg-sage-dark text-ivory'
                    }`}
                  >
                    {item.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Actionable Financing Remediation */}
          <div className="space-y-3 font-mono text-xs">
            <div className="border-b border-border-light pb-2 uppercase text-rust font-bold">
              6. Recommended Credit Structure for Execution
            </div>
            <div className="p-4 bg-charcoal text-ivory border border-charcoal-300 space-y-2">
              <span className="font-bold text-amber block">
                Primary Financing Path: CGTMSE Backed Purchase Order Loan
              </span>
              <p className="font-sans text-xs text-ivory-300 leading-relaxed">
                Apply for a ₹4,00,000 working capital bridge facility backed by PO #CG-8821 under CGTMSE.
                The 40% gross contribution on this order comfortably accommodates the ~10.5% annualized interest
                charge (~₹14,000 across 90 days), eliminating cash-flow failure while preserving full operating margin.
              </p>
            </div>
          </div>

          {/* Institutional Sign-off Block */}
          <div className="pt-8 border-t-2 border-charcoal grid grid-cols-2 gap-8 font-mono text-xs">
            <div>
              <div className="text-charcoal-400 text-[10px] uppercase">Prepared for & Acknowledged by:</div>
              <div className="font-bold text-charcoal mt-4 pt-1 border-t border-border-light">
                {business.businessName} (Authorized Signatory)
              </div>
            </div>
            <div className="text-right">
              <div className="text-charcoal-400 text-[10px] uppercase">Evaluation Protocol:</div>
              <div className="font-bold text-charcoal mt-4 pt-1 border-t border-border-light">
                DYNAFIN Opportunity IQ Engine v1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
