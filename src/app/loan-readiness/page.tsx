'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatIndianDate } from '@/lib/formatting/currency';
import { LoanReadinessItem } from '@/types';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  ShieldCheck,
  Building2,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function LoanReadinessPage() {
  const { business, activeOpportunity } = useWorkspace();

  const [checklist, setChecklist] = useState<LoanReadinessItem[]>([
    {
      id: 'doc-udyam',
      documentName: 'Udyam Registration Certificate',
      category: 'Identity & Registration',
      status: 'Available',
      importance: 'Mandatory',
      notes: 'UDYAM-TN-12-0048291 verified active on MSME databank',
      uploadedAt: '2026-08-14',
      fileSize: '412 KB',
    },
    {
      id: 'doc-pan',
      documentName: 'Firm PAN & Proprietor PAN Card',
      category: 'Identity & Registration',
      status: 'Available',
      importance: 'Mandatory',
      notes: 'PAN AAFFS4921K validated with NSDL',
      uploadedAt: '2026-08-14',
      fileSize: '1.2 MB',
    },
    {
      id: 'doc-gst-returns',
      documentName: 'GSTR-3B & GSTR-1 Filings (Last 12 Months)',
      category: 'Financial & Tax',
      status: 'Available',
      importance: 'Mandatory',
      notes: 'Monthly filing consistency 100% with no pending defaults',
      uploadedAt: '2026-11-02',
      fileSize: '3.4 MB',
    },
    {
      id: 'doc-bank-statements',
      documentName: 'Primary Current Account Statements (Last 12 Months)',
      category: 'Financial & Tax',
      status: 'Needs Review',
      importance: 'Mandatory',
      notes: 'October statement missing; 2 days of overdraft drift noted',
      uploadedAt: '2026-10-10',
      fileSize: '8.1 MB',
    },
    {
      id: 'doc-audited-financials',
      documentName: 'Audited Financial Statements & Tax Audit Reports (FY24 & FY25)',
      category: 'Financial & Tax',
      status: 'Available',
      importance: 'Mandatory',
      notes: 'Audited by Chartered Accountant with full schedules',
      uploadedAt: '2026-09-20',
      fileSize: '5.6 MB',
    },
    {
      id: 'doc-po',
      documentName: 'Confirmed Purchase Order & Work Contract',
      category: 'Operational & Commercial',
      status: 'Available',
      importance: 'Mandatory',
      notes: 'PO #CG-2026/8821 for ₹15 Lakhs from Chennai Garments',
      uploadedAt: '2026-11-20',
      fileSize: '2.8 MB',
    },
    {
      id: 'doc-debtors-aging',
      documentName: 'Debtors Aging Schedule & Invoice History',
      category: 'Operational & Commercial',
      status: 'Needs Review',
      importance: 'Recommended',
      notes: 'Overdue invoices from 2 mid-market clients need reconciliation',
      uploadedAt: '2026-11-15',
      fileSize: '650 KB',
    },
    {
      id: 'doc-loan-sanction',
      documentName: 'Existing Loan Sanction Letters & Amortization Track',
      category: 'Collateral & Banking',
      status: 'Incomplete',
      importance: 'Mandatory',
      notes: 'SBI term loan track uploaded; machinery NBFC loan statement missing',
    },
    {
      id: 'doc-factory-lease',
      documentName: 'Factory Works Lease Deed & Electricity Bill Proof',
      category: 'Collateral & Banking',
      status: 'Missing',
      importance: 'Conditional',
      notes: 'Required if seeking facilities with collateral charge',
    },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocToUpload, setSelectedDocToUpload] = useState<string | null>(null);

  const availableCount = checklist.filter((i) => i.status === 'Available').length;
  const needsReviewCount = checklist.filter((i) => i.status === 'Needs Review').length;
  const missingCount = checklist.filter((i) => i.status === 'Missing' || i.status === 'Incomplete').length;

  const readinessScorePct = Math.round(
    ((availableCount + needsReviewCount * 0.5) / checklist.length) * 100
  );

  const filteredItems =
    filterCategory === 'All'
      ? checklist
      : checklist.filter((i) => i.category === filterCategory);

  const handleSimulateUpload = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Available',
              uploadedAt: new Date().toISOString().split('T')[0],
              fileSize: '1.8 MB',
              notes: 'Uploaded document verified and validated for bank submission.',
            }
          : item
      )
    );
    setUploadModalOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Credit Application Pre-Check</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Bank Loan Readiness
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Comprehensive dossier compliance audit. Evaluates statutory documentation, GST consistency,
              and banking track records before approaching lenders or CGTMSE authorities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/loan-comparison"
              className="px-5 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md"
            >
              <span>Compare Loan Costs</span>
              <ArrowRight className="w-4 h-4 text-amber" />
            </Link>
          </div>
        </div>

        {/* Readiness Score & Category Breakdown Banner */}
        <div className="bg-charcoal text-ivory p-6 sm:p-8 border border-charcoal-300 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-charcoal-400 pb-4">
            <div>
              <span className="text-[11px] font-mono text-sage-light uppercase tracking-wider block">
                Target MSME Dossier
              </span>
              <span className="font-serif text-2xl text-ivory">
                {business.businessName} ({business.locationCity})
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-sage-light block">Readiness Score</span>
                <span className="font-mono text-3xl font-bold text-amber">{readinessScorePct}%</span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-amber flex items-center justify-center font-mono text-xs font-bold">
                {readinessScorePct >= 75 ? 'Strong' : 'Moderate'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 bg-charcoal-400 border border-charcoal-300 flex items-center justify-between">
              <div>
                <span className="text-sage-light uppercase block text-[11px]">Ready Documents</span>
                <span className="text-base font-bold text-ivory">{availableCount} Files</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-sage" />
            </div>

            <div className="p-3 bg-charcoal-400 border border-charcoal-300 flex items-center justify-between">
              <div>
                <span className="text-amber-light uppercase block text-[11px]">Needs Review / Recency</span>
                <span className="text-base font-bold text-ivory">{needsReviewCount} Files</span>
              </div>
              <Clock className="w-5 h-5 text-amber" />
            </div>

            <div className="p-3 bg-charcoal-400 border border-charcoal-300 flex items-center justify-between">
              <div>
                <span className="text-rust-light uppercase block text-[11px]">Missing / Incomplete</span>
                <span className="text-base font-bold text-rust-light">{missingCount} Files</span>
              </div>
              <AlertCircle className="w-5 h-5 text-rust" />
            </div>
          </div>

          <p className="text-xs text-ivory-300 font-sans leading-relaxed">
            <strong className="text-ivory">Bank Appraisal Note:</strong> Having Udyam, 12 months of GSTR-3B filings,
            and confirmed PO #CG-8821 in order satisfies pre-qualification for SIDBI and PSU bank credit committees under CGTMSE.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap gap-2">
            {['All', 'Identity & Registration', 'Financial & Tax', 'Operational & Commercial', 'Collateral & Banking'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 border transition-all ${
                    filterCategory === cat
                      ? 'bg-charcoal text-ivory border-charcoal font-bold'
                      : 'bg-ivory hover:bg-ivory-200 text-charcoal-400 border-border-light'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Document Checklist Table */}
        <div className="bg-ivory border border-border-light shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-charcoal text-ivory uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Document Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Importance</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Audit Findings & Notes</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-ivory-100">
                  <td className="p-3.5 font-semibold text-charcoal">
                    {item.documentName}
                    {item.uploadedAt && (
                      <span className="block text-[10px] text-charcoal-400 font-normal">
                        Uploaded: {formatIndianDate(item.uploadedAt, 'short')} • {item.fileSize}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-charcoal-400">{item.category}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 border ${
                        item.importance === 'Mandatory'
                          ? 'border-rust/40 text-rust bg-rust/10'
                          : 'border-border-light text-charcoal-400'
                      }`}
                    >
                      {item.importance}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                        item.status === 'Available'
                          ? 'bg-sage/20 text-sage-dark'
                          : item.status === 'Needs Review'
                          ? 'bg-amber/20 text-amber-dark'
                          : 'bg-rust/20 text-rust'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans text-xs text-charcoal-400 max-w-xs leading-relaxed">
                    {item.notes || '—'}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    {item.status === 'Available' ? (
                      <button
                        onClick={() => handleSimulateUpload(item.id)}
                        className="text-xs text-charcoal-400 hover:text-charcoal underline"
                      >
                        Re-upload
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSimulateUpload(item.id)}
                        className="px-3 py-1 bg-charcoal text-ivory hover:bg-charcoal-600 uppercase font-semibold text-[10px] flex items-center gap-1 ml-auto"
                      >
                        <Upload className="w-3 h-3 text-amber" />
                        <span>Upload File</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 bg-ivory-100 border border-border-light text-xs font-mono text-charcoal-400 leading-relaxed">
          <strong className="text-charcoal">Legal Disclaimer:</strong> A high readiness score reflects document completeness
          based on public commercial banking checklists. DYNAFIN does not approve loans, guarantee credit sanctions,
          or act as an intermediary for financial institutions.
        </div>
      </div>
    </AppLayout>
  );
}
