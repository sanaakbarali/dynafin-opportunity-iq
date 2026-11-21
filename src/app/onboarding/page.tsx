'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Coins,
  Factory,
  Users2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Edit3,
  HelpCircle,
  FileCheck,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { formatINR } from '@/lib/formatting/currency';
import { useWorkspace } from '@/lib/context/WorkspaceContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { saveBusinessProfile, isAuthenticated } = useWorkspace();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Business Information
    businessName: 'Sri Textiles',
    ownerName: 'Senthil Nathan',
    businessType: 'Proprietorship',
    industry: 'Textile Manufacturing',
    locationCity: 'Madurai',
    locationState: 'Tamil Nadu',
    establishedYear: '2018',
    employeeCount: '12',
    udyamRegNumber: 'UDYAM-TN-12-0048291',

    // Step 2: Financial Information
    averageMonthlyRevenue: '1850000',
    averageMonthlyExpenses: '1520000',
    availableCash: '280000',
    existingLoanOutstanding: '1450000',
    monthlyEmiObligations: '38000',
    accountsReceivable: '920000',
    accountsPayable: '610000',

    // Step 3: Operations
    monthlyCapacityUnits: '3500',
    currentCapacityUtilisationPct: '72',
    standardLeadTimeDays: '24',
    workforceShiftCount: '1',
    machineryCount: '8',

    // Step 4: Customer and Supplier Information
    primaryCustomerName: 'Chennai Garment Exporters Pvt Ltd',
    customerCreditDays: '45',
    primarySupplierName: 'Meenakshi Spinning Mills',
    supplierCreditDays: '15',
    supplierAdvanceRequiredPct: '40',
  });

  // Restore draft from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = localStorage.getItem('dynafin_onboarding_draft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === 'object') {
            setFormData((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch (err) {
        console.warn('Could not read onboarding draft from localStorage:', err);
      }
    }
  }, []);

  // Auto-save draft changes to localStorage
  const updateField = (field: string, val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: val };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('dynafin_onboarding_draft', JSON.stringify(updated));
        } catch (e) {
          // Ignore storage quota errors
        }
      }
      return updated;
    });
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed Step 5 -> Persist to database and route to workspace
      setIsSaving(true);
      setSaveError(null);
      try {
        await saveBusinessProfile(
          {
            businessName: formData.businessName,
            businessType: formData.businessType as any,
            industry: formData.industry,
            locationCity: formData.locationCity,
            locationState: formData.locationState,
            establishedYear: Number(formData.establishedYear) || 2020,
            employeeCount: Number(formData.employeeCount) || 5,
            udyamRegNumber: formData.udyamRegNumber,
          },
          {
            averageMonthlyRevenue: Number(formData.averageMonthlyRevenue) || 0,
            averageMonthlyExpenses: Number(formData.averageMonthlyExpenses) || 0,
            availableCash: Number(formData.availableCash) || 0,
            existingLoanOutstanding: Number(formData.existingLoanOutstanding) || 0,
            monthlyEmiObligations: Number(formData.monthlyEmiObligations) || 0,
            accountsReceivable: Number(formData.accountsReceivable) || 0,
            accountsPayable: Number(formData.accountsPayable) || 0,
          },
          {
            monthlyCapacityUnits: Number(formData.monthlyCapacityUnits) || 1000,
            currentCapacityUtilisationPct: Number(formData.currentCapacityUtilisationPct) || 65,
            standardLeadTimeDays: Number(formData.standardLeadTimeDays) || 21,
            workforceShiftCount: Number(formData.workforceShiftCount) || 1,
            machineryCount: Number(formData.machineryCount) || 4,
          },
          {
            customerName: formData.primaryCustomerName,
            customerCreditDays: Number(formData.customerCreditDays) || 30,
            supplierName: formData.primarySupplierName,
            supplierCreditDays: Number(formData.supplierCreditDays) || 15,
            supplierAdvanceRequiredPct: Number(formData.supplierAdvanceRequiredPct) || 0,
          }
        );

        if (typeof window !== 'undefined') {
          localStorage.removeItem('dynafin_onboarding_draft');
        }

        router.push('/workspace');
      } catch (err: any) {
        console.error('Onboarding submission error:', err);
        setSaveError(err.message || 'Failed to persist business baseline. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const steps = [
    { num: 1, title: 'Business Profile', icon: Building2 },
    { num: 2, title: 'Financial Snapshot', icon: Coins },
    { num: 3, title: 'Shop Floor & Capacity', icon: Factory },
    { num: 4, title: 'Trading Partners', icon: Users2 },
    { num: 5, title: 'Final Review', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col justify-between p-4 sm:p-8">
      {/* Brand Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-border-light">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-3xl text-charcoal font-normal">DYNAFIN</span>
          <span className="font-mono text-[10px] text-rust uppercase tracking-widest border border-rust/30 px-1.5 py-0.5">
            Opportunity IQ
          </span>
        </Link>
        <span className="text-xs font-mono text-charcoal-400">
          Step {currentStep} of 5 • Onboarding Wizard
        </span>
      </div>

      <div className="max-w-4xl w-full mx-auto my-8 space-y-8">
        {/* Progress Stepper */}
        <div className="grid grid-cols-5 gap-2 border-b border-border-light pb-6">
          {steps.map((st) => {
            const isDone = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <button
                key={st.num}
                onClick={() => isDone && setCurrentStep(st.num)}
                disabled={!isDone && !isCurrent}
                className={`text-left p-2 border-b-2 transition-colors ${
                  isCurrent
                    ? 'border-charcoal text-charcoal font-semibold'
                    : isDone
                    ? 'border-sage-dark text-sage-dark cursor-pointer'
                    : 'border-transparent text-charcoal-300'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider">
                  0{st.num}
                </div>
                <div className="text-xs font-serif truncate mt-0.5">{st.title}</div>
              </button>
            );
          })}
        </div>

        {/* STEP 1: BUSINESS INFORMATION */}
        {currentStep === 1 && (
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
                Section 1 • Enterprise Identity
              </span>
              <h2 className="font-serif text-3xl text-charcoal mt-1">
                Tell us about your business
              </h2>
              <p className="text-xs text-charcoal-400 font-sans mt-1">
                This forms your enterprise baseline. DYNAFIN will compare every incoming purchase order against these parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Registered Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Proprietor / Managing Partner Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Business Registration Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => updateField('businessType', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                >
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="One Person Company">One Person Company</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Primary Manufacturing Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  placeholder="e.g. Textile Manufacturing, CNC Machining"
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  City & State
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.locationCity}
                    onChange={(e) => updateField('locationCity', e.target.value)}
                    placeholder="City"
                    className="p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.locationState}
                    onChange={(e) => updateField('locationState', e.target.value)}
                    placeholder="State"
                    className="p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Udyam MSME Registration Number
                </label>
                <input
                  type="text"
                  value={formData.udyamRegNumber}
                  onChange={(e) => updateField('udyamRegNumber', e.target.value)}
                  placeholder="UDYAM-XX-00-0000000"
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Year Established
                </label>
                <input
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => updateField('establishedYear', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Permanent Employees
                </label>
                <input
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => updateField('employeeCount', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL INFORMATION */}
        {currentStep === 2 && (
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
                Section 2 • Baseline Liquidity & Debt
              </span>
              <h2 className="font-serif text-3xl text-charcoal mt-1">
                Financial position and obligations
              </h2>
              <p className="text-xs text-charcoal-400 font-sans mt-1">
                Enter your average monthly revenues, liquid bank cash buffer, and recurring loan EMIs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Average Monthly Turnover (₹ INR) *
                </label>
                <input
                  type="number"
                  value={formData.averageMonthlyRevenue}
                  onChange={(e) => updateField('averageMonthlyRevenue', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                  required
                />
                <span className="text-[10px] font-mono text-sage-dark mt-0.5 block">
                  {formatINR(Number(formData.averageMonthlyRevenue))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Currently Available Liquid Bank Balance (₹ INR) *
                </label>
                <input
                  type="number"
                  value={formData.availableCash}
                  onChange={(e) => updateField('availableCash', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                  required
                />
                <span className="text-[10px] font-mono text-sage-dark mt-0.5 block">
                  {formatINR(Number(formData.availableCash))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Existing Total Loan Outstanding (₹ INR)
                </label>
                <input
                  type="number"
                  value={formData.existingLoanOutstanding}
                  onChange={(e) => updateField('existingLoanOutstanding', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Total Monthly EMI Commitments (₹ INR) *
                </label>
                <input
                  type="number"
                  value={formData.monthlyEmiObligations}
                  onChange={(e) => updateField('monthlyEmiObligations', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                  required
                />
                <span className="text-[10px] font-mono text-rust mt-0.5 block">
                  Recurring bank debit: {formatINR(Number(formData.monthlyEmiObligations))}/mo
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Accounts Receivable / Outstanding from Buyers (₹ INR)
                </label>
                <input
                  type="number"
                  value={formData.accountsReceivable}
                  onChange={(e) => updateField('accountsReceivable', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Accounts Payable / Dues to Vendors (₹ INR)
                </label>
                <input
                  type="number"
                  value={formData.accountsPayable}
                  onChange={(e) => updateField('accountsPayable', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: OPERATIONS & CAPACITY */}
        {currentStep === 3 && (
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
                Section 3 • Shop Floor Constraints
              </span>
              <h2 className="font-serif text-3xl text-charcoal mt-1">
                Manufacturing capacity & lead times
              </h2>
              <p className="text-xs text-charcoal-400 font-sans mt-1">
                Ensures you do not accept orders exceeding physical machinery or workforce headroom.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Monthly Production Capacity (Units / Meters / Tins)
                </label>
                <input
                  type="number"
                  value={formData.monthlyCapacityUnits}
                  onChange={(e) => updateField('monthlyCapacityUnits', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Current Shop Floor Utilisation (%) *
                </label>
                <input
                  type="number"
                  value={formData.currentCapacityUtilisationPct}
                  onChange={(e) => updateField('currentCapacityUtilisationPct', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
                <span className="text-[10px] font-mono text-sage-dark mt-0.5 block">
                  Available headroom: {100 - Number(formData.currentCapacityUtilisationPct)}%
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Standard Order Lead Time (Days)
                </label>
                <input
                  type="number"
                  value={formData.standardLeadTimeDays}
                  onChange={(e) => updateField('standardLeadTimeDays', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Operating Machinery / CNC / Loom Count
                </label>
                <input
                  type="number"
                  value={formData.machineryCount}
                  onChange={(e) => updateField('machineryCount', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOMER & SUPPLIER TERMS */}
        {currentStep === 4 && (
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
                Section 4 • Trading Partner Conditions
              </span>
              <h2 className="font-serif text-3xl text-charcoal mt-1">
                Typical customer and supplier payment terms
              </h2>
              <p className="text-xs text-charcoal-400 font-sans mt-1">
                DYNAFIN models the cash gap between when suppliers require payments vs when buyers settle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Primary Customer / Corporate Client
                </label>
                <input
                  type="text"
                  value={formData.primaryCustomerName}
                  onChange={(e) => updateField('primaryCustomerName', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Contractual Customer Credit Period (Days)
                </label>
                <input
                  type="number"
                  value={formData.customerCreditDays}
                  onChange={(e) => updateField('customerCreditDays', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Primary Raw Material Supplier
                </label>
                <input
                  type="text"
                  value={formData.primarySupplierName}
                  onChange={(e) => updateField('primarySupplierName', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1">
                  Supplier Advance Required (%)
                </label>
                <input
                  type="number"
                  value={formData.supplierAdvanceRequiredPct}
                  onChange={(e) => updateField('supplierAdvanceRequiredPct', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FINAL REVIEW */}
        {currentStep === 5 && (
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-sage-dark font-semibold">
                Section 5 • Final Review & Confirmation
              </span>
              <h2 className="font-serif text-3xl text-charcoal mt-1">
                Review your MSME profile
              </h2>
              <p className="text-xs text-charcoal-400 font-sans mt-1">
                Confirm your baseline operational and financial figures. You can adjust these anytime in Settings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-4 bg-ivory-100 border border-border-light space-y-2">
                <div className="flex justify-between items-center text-charcoal font-semibold border-b border-border-light pb-1">
                  <span>Business Profile</span>
                  <button onClick={() => setCurrentStep(1)} className="text-rust hover:underline">
                    Edit
                  </button>
                </div>
                <div><span className="text-charcoal-400">Firm:</span> {formData.businessName}</div>
                <div><span className="text-charcoal-400">Owner:</span> {formData.ownerName} ({formData.businessType})</div>
                <div><span className="text-charcoal-400">Industry:</span> {formData.industry}</div>
                <div><span className="text-charcoal-400">Location:</span> {formData.locationCity}, {formData.locationState}</div>
                <div><span className="text-charcoal-400">Udyam:</span> {formData.udyamRegNumber}</div>
              </div>

              <div className="p-4 bg-ivory-100 border border-border-light space-y-2">
                <div className="flex justify-between items-center text-charcoal font-semibold border-b border-border-light pb-1">
                  <span>Financial Baseline</span>
                  <button onClick={() => setCurrentStep(2)} className="text-rust hover:underline">
                    Edit
                  </button>
                </div>
                <div><span className="text-charcoal-400">Monthly Turnover:</span> {formatINR(Number(formData.averageMonthlyRevenue))}</div>
                <div><span className="text-charcoal-400">Available Liquid Cash:</span> {formatINR(Number(formData.availableCash))}</div>
                <div><span className="text-charcoal-400">Monthly EMI Obligations:</span> {formatINR(Number(formData.monthlyEmiObligations))}</div>
                <div><span className="text-charcoal-400">Receivables / Payables:</span> {formatINR(Number(formData.accountsReceivable))} / {formatINR(Number(formData.accountsPayable))}</div>
              </div>

              <div className="p-4 bg-ivory-100 border border-border-light space-y-2">
                <div className="flex justify-between items-center text-charcoal font-semibold border-b border-border-light pb-1">
                  <span>Shop Floor Operations</span>
                  <button onClick={() => setCurrentStep(3)} className="text-rust hover:underline">
                    Edit
                  </button>
                </div>
                <div><span className="text-charcoal-400">Monthly Capacity:</span> {formData.monthlyCapacityUnits} units</div>
                <div><span className="text-charcoal-400">Current Load:</span> {formData.currentCapacityUtilisationPct}%</div>
                <div><span className="text-charcoal-400">Lead Time:</span> {formData.standardLeadTimeDays} days</div>
                <div><span className="text-charcoal-400">Machinery:</span> {formData.machineryCount} units</div>
              </div>

              <div className="p-4 bg-ivory-100 border border-border-light space-y-2">
                <div className="flex justify-between items-center text-charcoal font-semibold border-b border-border-light pb-1">
                  <span>Trading Terms</span>
                  <button onClick={() => setCurrentStep(4)} className="text-rust hover:underline">
                    Edit
                  </button>
                </div>
                <div><span className="text-charcoal-400">Lead Customer:</span> {formData.primaryCustomerName}</div>
                <div><span className="text-charcoal-400">Customer Credit:</span> {formData.customerCreditDays} days</div>
                <div><span className="text-charcoal-400">Lead Supplier:</span> {formData.primarySupplierName}</div>
                <div><span className="text-charcoal-400">Supplier Advance:</span> {formData.supplierAdvanceRequiredPct}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {saveError && (
          <div className="p-4 bg-rust/10 border border-rust/30 text-rust flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <span className="font-semibold block mb-0.5">Configuration Persistence Error</span>
              {saveError}
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              disabled={isSaving}
              className="px-6 py-3 bg-ivory-200 hover:bg-ivory-300 disabled:opacity-50 text-charcoal text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 border border-border-light"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={isSaving}
            className="px-8 py-3.5 bg-charcoal hover:bg-charcoal-600 disabled:opacity-60 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 text-amber animate-spin" />
                <span>Persisting Baseline to Database...</span>
              </>
            ) : (
              <>
                <span>{currentStep === 5 ? 'Save Baseline & Enter Workspace' : 'Continue to Next Step'}</span>
                <ArrowRight className="w-4 h-4 text-amber" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
