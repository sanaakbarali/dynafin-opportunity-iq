'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR } from '@/lib/formatting/currency';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileCheck,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export default function NewOpportunityPage() {
  const router = useRouter();
  const { createOpportunity, business, financials } = useWorkspace();

  const [mode, setMode] = useState<'upload' | 'manual'>('upload');

  // Document upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [hasExtracted, setHasExtracted] = useState(false);

  // Editable Extracted Form State
  const [poForm, setPoForm] = useState({
    buyerName: 'Tata Motors Ancillary Supply Division',
    poNumber: 'PO-TM-2026/9941',
    orderDate: '2026-11-25',
    deliveryDeadline: '2026-12-28',
    deliveryLocation: 'Tata Motors Works, Pimpri, Pune',
    totalOrderValue: '1850000',
    advancePercentage: '10',
    paymentTermsDays: '45',
    penaltyClauseText: '0.5% per week of delay capped at 5% of order value',
    taxRatePct: '18',
    itemDescription: 'High-Tensile Precision Machined Fasteners (Grade 8.8)',
    quantity: '10000',
    unitPrice: '185',

    // Cost Assumptions
    rawMaterialCost: '850000',
    labourCost: '250000',
    productionExpenses: '90000',
    packagingCost: '35000',
    transportationLogistics: '45000',
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUploadedFile(files[0].name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0].name);
    }
  };

  const processUploadedFile = (fileName: string) => {
    setUploadedFileName(fileName);
    setIsProcessing(true);

    // Simulated OCR extraction pipeline per architecture
    setTimeout(() => {
      setIsProcessing(false);
      setHasExtracted(true);
      // Pre-fill realistic extracted PO fields
      setPoForm({
        buyerName: 'Chennai Garment Exporters Pvt Ltd',
        poNumber: 'PO-CG-2026/8821',
        orderDate: '2026-11-25',
        deliveryDeadline: '2026-12-24',
        deliveryLocation: 'Warehouse 4, MEPZ SEZ, Tambaram, Chennai',
        totalOrderValue: '1500000',
        advancePercentage: '15',
        paymentTermsDays: '45',
        penaltyClauseText: '0.5% per week of delay up to a maximum cap of 5% total PO value',
        taxRatePct: '5',
        itemDescription: '60s Combed Cotton Compact Woven Twill Fabric',
        quantity: '5000',
        unitPrice: '180',
        rawMaterialCost: '600000',
        labourCost: '200000',
        productionExpenses: '50000',
        packagingCost: '20000',
        transportationLogistics: '30000',
      });
    }, 1200);
  };

  const handleFormChange = (field: string, val: string) => {
    setPoForm((prev) => ({ ...prev, [field]: val }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const totalVal = Number(poForm.totalOrderValue) || 1000000;
      const advPct = Number(poForm.advancePercentage) || 0;
      const advAmt = (totalVal * advPct) / 100;

      await createOpportunity({
        title: `PO #${poForm.poNumber}: ${poForm.buyerName}`,
        buyerName: poForm.buyerName,
        purchaseOrder: {
          id: `po-${Date.now()}`,
          poNumber: poForm.poNumber,
          orderDate: poForm.orderDate,
          deliveryDeadline: poForm.deliveryDeadline,
          deliveryLocation: poForm.deliveryLocation,
          buyerName: poForm.buyerName,
          totalOrderValue: totalVal,
          advanceAmount: advAmt,
          advancePercentage: advPct,
          balanceAmount: totalVal - advAmt,
          paymentTermsDays: Number(poForm.paymentTermsDays) || 30,
          penaltyClauseText: poForm.penaltyClauseText,
          taxRatePct: Number(poForm.taxRatePct) || 18,
          sourceType: mode === 'upload' ? 'pdf_upload' : 'manual_entry',
          items: [
            {
              id: 'item-1',
              description: poForm.itemDescription,
              quantity: Number(poForm.quantity) || 1,
              unit: 'Units',
              unitPrice: Number(poForm.unitPrice) || totalVal,
              totalAmount: totalVal,
            },
          ],
        },
        costs: {
          rawMaterialCost: Number(poForm.rawMaterialCost) || 0,
          labourCost: Number(poForm.labourCost) || 0,
          productionExpenses: Number(poForm.productionExpenses) || 0,
          packagingCost: Number(poForm.packagingCost) || 0,
          transportationLogistics: Number(poForm.transportationLogistics) || 0,
        } as any,
      });

      router.push('/opportunities');
    } catch (err: any) {
      console.error('Error creating opportunity:', err);
      setSubmitError(err.message || 'Failed to create opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-charcoal-400">
          <Link href="/opportunities" className="hover:text-charcoal">
            ← Return to Opportunity Studio
          </Link>
          <span>/</span>
          <span className="text-charcoal font-semibold">New Pre-Order Evaluation</span>
        </div>

        {/* Section Header */}
        <div className="border-b border-border-light pb-4 space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-rust font-semibold">
            Intake Protocol
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Evaluate a New Business Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
            Ingest purchase orders via PDF/image OCR extraction or manual parameter entry.
            Every extraction can be verified and modified prior to decision modelling.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-border-light font-mono text-xs">
          <button
            onClick={() => setMode('upload')}
            className={`px-6 py-3 border-b-2 uppercase tracking-wider flex items-center gap-2 transition-colors ${
              mode === 'upload'
                ? 'border-charcoal text-charcoal font-bold'
                : 'border-transparent text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-rust" />
            <span>Option A: Document Upload (OCR)</span>
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-6 py-3 border-b-2 uppercase tracking-wider flex items-center gap-2 transition-colors ${
              mode === 'manual'
                ? 'border-charcoal text-charcoal font-bold'
                : 'border-transparent text-charcoal-400 hover:text-charcoal'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sage" />
            <span>Option B: Manual Parameter Entry</span>
          </button>
        </div>

        {/* =========================================================================
            OPTION A: DOCUMENT UPLOAD
            ========================================================================= */}
        {mode === 'upload' && !hasExtracted && (
          <div className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-10 border-2 border-dashed text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-charcoal bg-ivory-200'
                  : 'border-border-light bg-ivory hover:border-charcoal-300'
              }`}
            >
              <input
                type="file"
                id="po-file-input"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileInput}
              />
              <label htmlFor="po-file-input" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 bg-charcoal text-amber mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="font-serif text-xl text-charcoal">
                  Drop Purchase Order PDF, scanned copy, or image
                </div>
                <p className="text-xs text-charcoal-400 font-sans max-w-md mx-auto">
                  Accepts PDF, PNG, JPG, or TIFF documents up to 15MB. Our extraction engine
                  identifies line items, payment milestones, penalties, and tax specifications.
                </p>
                <div className="pt-2">
                  <span className="px-4 py-2 bg-ivory-200 border border-border-light text-xs font-mono uppercase tracking-wider text-charcoal hover:bg-ivory-300">
                    Browse Local File
                  </span>
                </div>
              </label>
            </div>

            {isProcessing && (
              <div className="p-6 bg-charcoal text-ivory border border-charcoal-300 font-mono text-xs space-y-3">
                <div className="flex items-center gap-2 text-amber">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="uppercase font-semibold">Running Document Extraction Pipeline</span>
                </div>
                <p className="text-[11px] text-ivory-300">
                  Parsing {uploadedFileName} • Segmenting headers • Extracting delivery dates • Calculating tax schedules...
                </p>
              </div>
            )}

            {/* Quick Demo Pre-load Trigger */}
            <div className="p-4 bg-ivory-100 border border-border-light flex items-center justify-between text-xs font-mono">
              <span className="text-charcoal-400">Want to test with a preloaded sample PO?</span>
              <button
                type="button"
                onClick={() => processUploadedFile('PO_Chennai_Garments_8821.pdf')}
                className="text-rust hover:underline font-semibold"
              >
                Load Sample PO #CG-8821 (₹15 Lakh) →
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            EXTRACTION REVIEW & EDITABLE FORM (FOR BOTH UPLOAD & MANUAL)
            ========================================================================= */}
        {(mode === 'manual' || hasExtracted) && (
          <form onSubmit={handleSubmitOpportunity} className="space-y-8 bg-ivory border border-border-light shadow-md p-6 sm:p-8">
            {hasExtracted && (
              <div className="p-3 bg-sage/20 border border-sage-dark text-xs font-mono text-charcoal flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-dark" />
                  <span>OCR Extraction Complete. Please review and verify all values below.</span>
                </div>
                <span className="text-[11px] text-sage-dark font-bold uppercase">Confidence: 94%</span>
              </div>
            )}

            {/* Section 1: Buyer & Contract Header */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-charcoal border-b border-border-light pb-2">
                1. Purchase Order Header & Buyer Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs font-mono">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="uppercase text-charcoal-300">Buyer / Client Name *</label>
                    {hasExtracted && <span className="text-[9px] bg-sage/30 text-sage-dark px-1">Extracted</span>}
                  </div>
                  <input
                    type="text"
                    value={poForm.buyerName}
                    onChange={(e) => handleFormChange('buyerName', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="uppercase text-charcoal-300">PO Number *</label>
                    {hasExtracted && <span className="text-[9px] bg-sage/30 text-sage-dark px-1">Extracted</span>}
                  </div>
                  <input
                    type="text"
                    value={poForm.poNumber}
                    onChange={(e) => handleFormChange('poNumber', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="uppercase text-charcoal-300">Total PO Value (₹ INR) *</label>
                    {hasExtracted && <span className="text-[9px] bg-sage/30 text-sage-dark px-1">Extracted</span>}
                  </div>
                  <input
                    type="number"
                    value={poForm.totalOrderValue}
                    onChange={(e) => handleFormChange('totalOrderValue', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none font-bold"
                    required
                  />
                  <span className="text-[10px] text-sage-dark mt-0.5 block">
                    {formatINR(Number(poForm.totalOrderValue))}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="uppercase text-charcoal-300">Order Date</label>
                  </div>
                  <input
                    type="date"
                    value={poForm.orderDate}
                    onChange={(e) => handleFormChange('orderDate', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="uppercase text-charcoal-300">Delivery Deadline *</label>
                    {hasExtracted && <span className="text-[9px] bg-sage/30 text-sage-dark px-1">Extracted</span>}
                  </div>
                  <input
                    type="date"
                    value={poForm.deliveryDeadline}
                    onChange={(e) => handleFormChange('deliveryDeadline', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none font-semibold text-rust"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="uppercase text-charcoal-300">Advance Payment (%)</label>
                    {hasExtracted && <span className="text-[9px] bg-amber/30 text-amber-dark px-1">Verify</span>}
                  </div>
                  <input
                    type="number"
                    value={poForm.advancePercentage}
                    onChange={(e) => handleFormChange('advancePercentage', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="uppercase text-charcoal-300">Payment Terms (Days Post-Delivery)</label>
                  </div>
                  <input
                    type="number"
                    value={poForm.paymentTermsDays}
                    onChange={(e) => handleFormChange('paymentTermsDays', e.target.value)}
                    placeholder="e.g. 30, 45, 60"
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="uppercase text-charcoal-300">Delivery Location / Warehouse</label>
                  </div>
                  <input
                    type="text"
                    value={poForm.deliveryLocation}
                    onChange={(e) => handleFormChange('deliveryLocation', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Direct Fulfillment Cost Assumptions */}
            <div className="space-y-4 pt-4 border-t border-border-light">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-charcoal">
                    2. Fulfillment Direct Costs
                  </h3>
                  <p className="text-xs text-charcoal-400 font-sans">
                    Enter the estimated direct expenditures required to manufacture and dispatch this order.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs font-mono">
                <div>
                  <label className="block uppercase text-charcoal-300 mb-1">
                    Raw Material Procurement Cost (₹) *
                  </label>
                  <input
                    type="number"
                    value={poForm.rawMaterialCost}
                    onChange={(e) => handleFormChange('rawMaterialCost', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block uppercase text-charcoal-300 mb-1">
                    Direct Labour & Operator Wages (₹) *
                  </label>
                  <input
                    type="number"
                    value={poForm.labourCost}
                    onChange={(e) => handleFormChange('labourCost', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block uppercase text-charcoal-300 mb-1">
                    Consumables & Production Expenses (₹)
                  </label>
                  <input
                    type="number"
                    value={poForm.productionExpenses}
                    onChange={(e) => handleFormChange('productionExpenses', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase text-charcoal-300 mb-1">
                    Packaging & Protective Wrap (₹)
                  </label>
                  <input
                    type="number"
                    value={poForm.packagingCost}
                    onChange={(e) => handleFormChange('packagingCost', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase text-charcoal-300 mb-1">
                    Freight & Transport Logistics (₹)
                  </label>
                  <input
                    type="number"
                    value={poForm.transportationLogistics}
                    onChange={(e) => handleFormChange('transportationLogistics', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase text-charcoal-300 mb-1">
                    Contract Penalty Clause (if any)
                  </label>
                  <input
                    type="text"
                    value={poForm.penaltyClauseText}
                    onChange={(e) => handleFormChange('penaltyClauseText', e.target.value)}
                    placeholder="e.g. 0.5% per week delay"
                    className="w-full p-2.5 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit & Ingestion Action */}
            <div className="pt-6 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-charcoal-400">
                Economics, working capital gap, and risk assessment will be computed deterministically upon creation.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-charcoal hover:bg-charcoal-600 disabled:opacity-60 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 text-amber animate-spin" />
                    <span>Calculating & Saving Opportunity...</span>
                  </>
                ) : (
                  <>
                    <span>Commit & Evaluate Opportunity</span>
                    <ArrowRight className="w-4 h-4 text-amber" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
