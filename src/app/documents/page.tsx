'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatIndianDate } from '@/lib/formatting/currency';
import { UploadedDocument } from '@/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  FolderOpen,
  Upload,
  FileText,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function DocumentRoomPage() {
  const { business, activeOpportunity, user, isDemoMode } = useWorkspace();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [docs, setDocs] = useState<UploadedDocument[]>([
    {
      id: 'doc-po-8821',
      businessId: 'biz-sri-textiles',
      opportunityId: 'opp-sri-po-8821',
      fileName: 'PO_ChennaiGarments_8821.pdf',
      fileType: 'purchase_order',
      fileSizeBytes: 2840000,
      uploadDate: '2026-11-20',
      status: 'verified',
      storagePath: 'documents/pos/PO_ChennaiGarments_8821.pdf',
      extractedSnippet: 'PO #CG-2026/8821 • ₹15,00,000 • 45d Credit • 5000m Twill',
    },
    {
      id: 'doc-quote-yarn',
      businessId: 'biz-sri-textiles',
      fileName: 'Quotation_Meenakshi_Spinning_Q4.pdf',
      fileType: 'supplier_quote',
      fileSizeBytes: 1420000,
      uploadDate: '2026-11-18',
      status: 'verified',
      storagePath: 'documents/quotes/Meenakshi_Spinning_Q4.pdf',
      extractedSnippet: '40s & 60s Combed Cotton Yarn • ₹6,00,000 • 40% Advance',
    },
    {
      id: 'doc-bank-stmt-q3',
      businessId: 'biz-sri-textiles',
      fileName: 'SBI_Current_Account_Stmt_Q3.pdf',
      fileType: 'bank_statement',
      fileSizeBytes: 5200000,
      uploadDate: '2026-10-12',
      status: 'verified',
      storagePath: 'documents/banking/SBI_Stmt_Q3.pdf',
      extractedSnippet: 'Average monthly balance: ₹2,80,000 • EMI debits verified',
    },
    {
      id: 'doc-gst-annual',
      businessId: 'biz-sri-textiles',
      fileName: 'GSTR-3B_Consolidated_FY26.pdf',
      fileType: 'financial_statement',
      fileSizeBytes: 3950000,
      uploadDate: '2026-11-05',
      status: 'verified',
      storagePath: 'documents/tax/GSTR_Consolidated_FY26.pdf',
      extractedSnippet: 'Annual turnover: ₹1.85 Cr • 100% on-time filing track',
    },
    {
      id: 'doc-udyam-cert',
      businessId: 'biz-sri-textiles',
      fileName: 'Udyam_Registration_Certificate.pdf',
      fileType: 'udyam_cert',
      fileSizeBytes: 420000,
      uploadDate: '2026-08-14',
      status: 'verified',
      storagePath: 'documents/compliance/Udyam_Certificate.pdf',
      extractedSnippet: 'UDYAM-TN-12-0048291 • Micro Manufacturing Entity',
    },
  ]);

  // Hydrate documents from Supabase if authenticated
  useEffect(() => {
    if (user && !isDemoMode && business.id && !business.id.startsWith('biz-')) {
      const fetchDocs = async () => {
        try {
          const supabase = getSupabaseBrowserClient();
          const { data, error } = await supabase
            .from('uploaded_documents')
            .select('*')
            .eq('business_id', business.id)
            .order('created_at', { ascending: false });

          if (data && data.length > 0) {
            const mapped: UploadedDocument[] = data.map((d: any) => ({
              id: d.id,
              businessId: d.business_id,
              opportunityId: d.opportunity_id || undefined,
              fileName: d.file_name,
              fileType: d.file_type as any,
              fileSizeBytes: Number(d.file_size_bytes || 0),
              uploadDate: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              status: d.status as any,
              storagePath: d.storage_path,
              extractedSnippet: d.extracted_data ? JSON.stringify(d.extracted_data).slice(0, 80) : undefined,
            }));
            setDocs(mapped);
          }
        } catch (err) {
          console.error('Error fetching documents from Supabase:', err);
        }
      };
      fetchDocs();
    }
  }, [user, isDemoMode, business.id]);

  const [filterType, setFilterType] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fileTypes = [
    { id: 'all', label: 'All Documents' },
    { id: 'purchase_order', label: 'Purchase Orders' },
    { id: 'supplier_quote', label: 'Supplier Quotes' },
    { id: 'bank_statement', label: 'Bank Statements' },
    { id: 'financial_statement', label: 'Financial Statements' },
    { id: 'udyam_cert', label: 'Registration & KYC' },
  ];

  const filteredDocs =
    filterType === 'all' ? docs : docs.filter((d) => d.fileType === filterType);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${Math.round(bytes / 1000)} KB`;
  };

  const handleDelete = async (id: string) => {
    const docToDelete = docs.find((d) => d.id === id);
    if (user && !isDemoMode && docToDelete && !id.startsWith('doc-')) {
      try {
        const supabase = getSupabaseBrowserClient();
        if (docToDelete.storagePath) {
          await supabase.storage.from('documents').remove([docToDelete.storagePath]);
        }
        await supabase.from('uploaded_documents').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting document from Supabase:', err);
      }
    }
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirmId(null);
  };

  const handleDownload = async (doc: UploadedDocument) => {
    if (user && !isDemoMode && doc.storagePath && !doc.id.startsWith('doc-')) {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.storage.from('documents').createSignedUrl(doc.storagePath, 120);
        if (data?.signedUrl) {
          window.open(data.signedUrl, '_blank');
          return;
        }
      } catch (err) {
        console.error('Error generating signed download url:', err);
      }
    }
    // Fallback notification for mock demo docs
    alert(`Downloading ${doc.fileName} from secure storage.`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setUploadError(null);

      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${business.id}/${Date.now()}_${cleanFileName}`;

      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}`,
        businessId: business.id,
        opportunityId: activeOpportunity?.id,
        fileName: file.name,
        fileType: 'purchase_order',
        fileSizeBytes: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'uploaded',
        storagePath: storagePath,
        extractedSnippet: 'Document securely uploaded to tenant storage vault.',
      };

      if (user && !isDemoMode && business.id && !business.id.startsWith('biz-')) {
        try {
          const supabase = getSupabaseBrowserClient();
          // Upload to Supabase Storage
          const { error: uploadErr } = await supabase.storage
            .from('documents')
            .upload(storagePath, file, { cacheControl: '3600', upsert: false });

          if (uploadErr) throw uploadErr;

          // Insert into uploaded_documents table
          const { data: insertedRow, error: dbErr } = await supabase
            .from('uploaded_documents')
            .insert({
              business_id: business.id,
              opportunity_id: activeOpportunity && !activeOpportunity.id.startsWith('opp-') ? activeOpportunity.id : null,
              file_name: file.name,
              file_type: 'purchase_order',
              file_size_bytes: file.size,
              storage_path: storagePath,
              status: 'uploaded',
            })
            .select()
            .single();

          if (dbErr) throw dbErr;
          if (insertedRow) {
            newDoc.id = insertedRow.id;
          }
        } catch (err: any) {
          console.error('Upload error:', err);
          setUploadError(err.message || 'Storage upload failed. Please try again.');
        }
      }

      setDocs((prev) => [newDoc, ...prev]);
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Evidence & Compliance Repository</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Document Room
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Centralized repository for purchase orders, supplier proformas, bank ledgers, and compliance certificates.
              Ready for Supabase Storage bucket integration with Row-Level Security encryption.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className={`px-5 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 text-amber animate-spin" />
                  <span>Uploading to Vault...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-amber" />
                  <span>Upload Document</span>
                </>
              )}
              <input type="file" className="hidden" disabled={isUploading} onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {fileTypes.map((ft) => (
            <button
              key={ft.id}
              onClick={() => setFilterType(ft.id)}
              className={`px-3.5 py-1.5 border transition-all ${
                filterType === ft.id
                  ? 'bg-charcoal text-ivory border-charcoal font-bold'
                  : 'bg-ivory hover:bg-ivory-200 text-charcoal-400 border-border-light'
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>

        {/* Documents Table */}
        <div className="bg-ivory border border-border-light shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-charcoal text-ivory uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Document Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Uploaded</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">Extraction Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-ivory-100">
                  <td className="p-3.5 font-semibold text-charcoal">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rust flex-shrink-0" />
                      <div>
                        <span>{doc.fileName}</span>
                        {doc.extractedSnippet && (
                          <span className="block text-[10px] text-charcoal-400 font-normal font-sans truncate max-w-md">
                            {doc.extractedSnippet}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 uppercase text-charcoal-400 text-[11px]">{doc.fileType.replace('_', ' ')}</td>
                  <td className="p-3.5">{formatIndianDate(doc.uploadDate, 'short')}</td>
                  <td className="p-3.5">{formatFileSize(doc.fileSizeBytes)}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-sage/20 text-sage-dark uppercase font-bold text-[10px] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-sage-dark" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1 hover:text-charcoal text-charcoal-400"
                      title="Inspect Metadata & Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1 hover:text-charcoal text-charcoal-400 inline-block"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(doc.id)}
                      className="p-1 hover:text-rust text-charcoal-400"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-4 z-50">
            <div className="bg-ivory border-2 border-charcoal p-6 max-w-sm w-full space-y-4 font-mono text-xs shadow-2xl">
              <div className="flex items-center gap-2 text-rust font-bold">
                <AlertCircle className="w-5 h-5" />
                <span>Confirm Document Deletion</span>
              </div>
              <p className="font-sans text-charcoal text-xs leading-relaxed">
                Are you sure you want to delete this document from your business vault? Extracted financial figures already integrated into models will remain preserved.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1.5 bg-ivory-200 border border-border-light text-charcoal"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-3 py-1.5 bg-rust text-ivory font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-4 z-50">
            <div className="bg-ivory border-2 border-charcoal p-6 sm:p-8 max-w-lg w-full space-y-5 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-border-light pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rust" />
                  <span className="font-serif text-xl text-charcoal font-normal">
                    Document Metadata
                  </span>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-charcoal-400 hover:text-charcoal text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-charcoal-400 text-[10px] block uppercase">File Name</span>
                  <span className="font-bold text-charcoal">{previewDoc.fileName}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 text-[10px] block uppercase">Storage Path</span>
                  <span className="text-charcoal font-mono">{previewDoc.storagePath}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 text-[10px] block uppercase">Extracted Metadata</span>
                  <p className="text-charcoal font-sans text-xs bg-ivory-100 p-3 border border-border-light leading-relaxed">
                    {previewDoc.extractedSnippet}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 bg-charcoal text-ivory uppercase font-semibold"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Integration Readiness Info */}
        <div className="p-4 bg-ivory-100 border border-border-light text-xs font-mono text-charcoal-400 leading-relaxed">
          <strong className="text-charcoal">Supabase Storage Preparedness:</strong> Document records map to the
          `uploaded_documents` table schema with storage keys referencing private Supabase Storage buckets.
        </div>
      </div>
    </AppLayout>
  );
}
