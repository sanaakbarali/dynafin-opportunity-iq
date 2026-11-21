'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR, formatIndianDate } from '@/lib/formatting/currency';
import { calculateBuyerStatistics, computeInvoiceDaysOverdue } from '@/lib/calculations/financial';
import { CustomerInvoice } from '@/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function BuyersPage() {
  const { customers, invoices, activeOpportunity, business, user, isDemoMode } = useWorkspace();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ''
  );

  // New Invoice Form Modal/Drawer State
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [localInvoices, setLocalInvoices] = useState<CustomerInvoice[]>(invoices);

  useEffect(() => {
    setLocalInvoices(invoices);
  }, [invoices]);

  const [newInv, setNewInv] = useState({
    invoiceNumber: `INV/2026/112`,
    invoiceDate: '2026-10-15',
    dueDate: '2026-11-29',
    actualPaymentDate: '',
    invoiceAmount: '550000',
    amountReceived: '550000',
    status: 'Paid',
    daysOverdue: '18',
  });

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const customerInvoices = localInvoices.filter(
    (inv) => inv.customerId === selectedCustomer?.id
  );

  const stats = calculateBuyerStatistics(customerInvoices);

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const amt = Number(newInv.invoiceAmount) || 0;
    const rcv = Number(newInv.amountReceived) || 0;
    const overdue =
      Number(newInv.daysOverdue) ||
      computeInvoiceDaysOverdue(newInv.dueDate, newInv.actualPaymentDate || undefined);

    const created: CustomerInvoice = {
      id: `inv-custom-${Date.now()}`,
      invoiceNumber: newInv.invoiceNumber,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      invoiceDate: newInv.invoiceDate,
      dueDate: newInv.dueDate,
      actualPaymentDate: newInv.actualPaymentDate || undefined,
      invoiceAmount: amt,
      amountReceived: rcv,
      status: newInv.status as 'Paid' | 'Partially Paid' | 'Overdue' | 'Pending',
      daysOverdue: overdue,
    };

    if (user && !isDemoMode && business.id && !business.id.startsWith('biz-') && !selectedCustomer.id.startsWith('cust-')) {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: row } = await supabase
          .from('customer_invoices')
          .insert({
            business_id: business.id,
            customer_id: selectedCustomer.id,
            invoice_number: newInv.invoiceNumber,
            invoice_date: newInv.invoiceDate,
            due_date: newInv.dueDate,
            actual_payment_date: newInv.actualPaymentDate || null,
            invoice_amount: amt,
            amount_received: rcv,
            status: newInv.status as any,
          })
          .select()
          .single();

        if (row) {
          created.id = row.id;
        }
      } catch (err) {
        console.error('Error saving invoice to Supabase:', err);
      }
    }

    setLocalInvoices([created, ...localInvoices]);
    setShowAddInvoice(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-dark font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-dark" />
              <span>Counterparty Credit Intelligence</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Buyer Payment Discipline
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Empirical analysis of customer payment behavior derived strictly from verified historical invoices.
              No fabricated credit scores or algorithmic speculation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddInvoice(!showAddInvoice)}
              className="px-5 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-amber" />
              <span>Log Past Invoice</span>
            </button>
          </div>
        </div>

        {/* Customer Selector Strip */}
        <div className="bg-ivory-100 p-3 border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-400 uppercase text-[11px]">Select Counterparty:</span>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-ivory font-semibold text-charcoal p-1.5 border border-border-light focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-charcoal-400">
            <span>Confidence: <strong className="text-charcoal">{stats.confidenceScore}</strong></span>
            <span>•</span>
            <span>{stats.confidenceNote}</span>
          </div>
        </div>

        {/* Modal/Drawer: Add Invoice */}
        {showAddInvoice && (
          <div className="p-6 bg-ivory border-2 border-charcoal shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border-light pb-2">
              <span className="font-serif text-xl text-charcoal font-normal">
                Log Past Invoice for {selectedCustomer?.name}
              </span>
              <button
                onClick={() => setShowAddInvoice(false)}
                className="text-charcoal-400 hover:text-charcoal"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddInvoice} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block uppercase text-charcoal-400 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={newInv.invoiceNumber}
                  onChange={(e) => setNewInv({ ...newInv, invoiceNumber: e.target.value })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-400 mb-1">Invoice Amount (₹)</label>
                <input
                  type="number"
                  value={newInv.invoiceAmount}
                  onChange={(e) => setNewInv({ ...newInv, invoiceAmount: e.target.value })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-400 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={newInv.invoiceDate}
                  onChange={(e) => setNewInv({ ...newInv, invoiceDate: e.target.value })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newInv.dueDate}
                  onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block uppercase text-charcoal-400 mb-1">Payment Status</label>
                <select
                  value={newInv.status}
                  onChange={(e) => setNewInv({ ...newInv, status: e.target.value })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block uppercase text-charcoal-400 mb-1">Days Overdue</label>
                <input
                  type="number"
                  value={newInv.daysOverdue}
                  onChange={(e) => setNewInv({ ...newInv, daysOverdue: e.target.value })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-charcoal text-ivory uppercase font-bold hover:bg-charcoal-600 transition-colors"
                >
                  Save Record & Recalculate Behavior
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4 Computed Behavioral Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-5 bg-charcoal text-ivory border border-charcoal-300 shadow-md space-y-1">
            <span className="text-sage-light uppercase text-[11px] block">Average Payment Drift</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber">
              +{stats.averageDelayDays} Days
            </div>
            <span className="text-[10px] text-ivory-400 block">
              Beyond standard {selectedCustomer?.standardCreditDays}-day credit terms
            </span>
          </div>

          <div className="p-5 bg-ivory border border-border-light shadow-sm space-y-1">
            <span className="text-charcoal-400 uppercase text-[11px] block">On-Time Settlement Rate</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-charcoal">
              {stats.onTimePaymentRate}%
            </div>
            <span className="text-[10px] text-charcoal-400 block">
              Invoices cleared within agreed window
            </span>
          </div>

          <div className="p-5 bg-ivory border border-border-light shadow-sm space-y-1">
            <span className="text-charcoal-400 uppercase text-[11px] block">Current Overdue Invoices</span>
            <div className={`text-2xl sm:text-3xl font-bold font-mono ${stats.overdueCount > 0 ? 'text-rust' : 'text-sage-dark'}`}>
              {stats.overdueCount} Invoices
            </div>
            <span className="text-[10px] text-charcoal-400 block">
              Unsettled past due date
            </span>
          </div>

          <div className="p-5 bg-ivory border border-border-light shadow-sm space-y-1">
            <span className="text-charcoal-400 uppercase text-[11px] block">Total Outstanding Amount</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-charcoal">
              {formatINR(stats.outstandingAmount)}
            </div>
            <span className="text-[10px] text-charcoal-400 block">
              Cumulative unpaid ledger balance
            </span>
          </div>
        </div>

        {/* Responsible Financial Disclosure */}
        <div className="p-4 bg-ivory-100 border border-border-light flex items-start gap-3 text-xs font-mono text-charcoal-400">
          <Info className="w-4 h-4 text-charcoal flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-charcoal">Responsible Credit Modeling:</strong> DYNAFIN never fabricates credit scores
            or assumes a buyer will pay on time solely based on brand reputation. All payment delay estimates are anchored strictly
            in the {customerInvoices.length} historical invoices registered above.
          </p>
        </div>

        {/* Historical Invoice Ledger Table */}
        <div className="bg-ivory border border-border-light shadow-sm space-y-4 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border-light pb-3">
            <h2 className="font-serif text-2xl text-charcoal">
              Verified Invoice History ({customerInvoices.length} Records)
            </h2>
            <span className="text-xs font-mono text-charcoal-400">
              Total Invoiced: <strong className="text-charcoal">{formatINR(stats.totalInvoiced)}</strong>
            </span>
          </div>

          {customerInvoices.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-charcoal-400 space-y-2">
              <p>No past invoice records found for {selectedCustomer?.name}.</p>
              <button
                onClick={() => setShowAddInvoice(true)}
                className="text-rust underline font-semibold"
              >
                Log an invoice now to establish payment discipline metrics →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-charcoal text-ivory uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Invoice Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Settlement Date</th>
                    <th className="p-3 text-right">Invoice Amount</th>
                    <th className="p-3 text-right">Received</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Delay (Days)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {customerInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-ivory-100">
                      <td className="p-3 font-semibold text-charcoal">{inv.invoiceNumber}</td>
                      <td className="p-3">{formatIndianDate(inv.invoiceDate, 'short')}</td>
                      <td className="p-3">{formatIndianDate(inv.dueDate, 'short')}</td>
                      <td className="p-3">
                        {inv.actualPaymentDate ? formatIndianDate(inv.actualPaymentDate, 'short') : '—'}
                      </td>
                      <td className="p-3 text-right font-bold">{formatINR(inv.invoiceAmount)}</td>
                      <td className="p-3 text-right">{formatINR(inv.amountReceived)}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-sage/20 text-sage-dark'
                              : inv.status === 'Overdue'
                              ? 'bg-rust/20 text-rust'
                              : 'bg-amber/20 text-amber-dark'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className={`p-3 text-right font-bold ${inv.daysOverdue > 0 ? 'text-rust' : 'text-sage-dark'}`}>
                        {inv.daysOverdue > 0 ? `+${inv.daysOverdue}d` : '0d (On Time)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
