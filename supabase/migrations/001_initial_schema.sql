-- ==============================================================================
-- DYNAFIN – OPPORTUNITY IQ: SUPABASE REPAIR SCRIPT 002
-- FIXES: customer_invoices, days_overdue view, tables 7-18, storage RLS & seed data
-- Use this script if your previous execution created tables 1-5 and halted at table 6.
-- ==============================================================================

-- 1. Ensure extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop days_overdue column if customer_invoices was partially created with it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'customer_invoices' AND column_name = 'days_overdue'
    ) THEN
        ALTER TABLE customer_invoices DROP COLUMN days_overdue;
    END IF;
END $$;

-- 3. Create customer_invoices cleanly without the invalid generated column
CREATE TABLE IF NOT EXISTS customer_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    actual_payment_date DATE,
    invoice_amount NUMERIC(15, 2) NOT NULL,
    amount_received NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('Paid', 'Partially Paid', 'Overdue', 'Pending')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Dynamic View: Real-time calculation of days_overdue
CREATE OR REPLACE VIEW customer_invoices_with_overdue AS
SELECT
    id,
    business_id,
    customer_id,
    invoice_number,
    invoice_date,
    due_date,
    actual_payment_date,
    invoice_amount,
    amount_received,
    status,
    CASE
        WHEN actual_payment_date IS NOT NULL THEN GREATEST(0, (actual_payment_date - due_date))
        WHEN CURRENT_DATE > due_date THEN GREATEST(0, (CURRENT_DATE - due_date))
        ELSE 0
    END::INT AS days_overdue,
    created_at
FROM customer_invoices;

DO $$
BEGIN
    ALTER VIEW customer_invoices_with_overdue SET (security_invoker = true);
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- 5. Remaining Tables (7-18)
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    material_category TEXT NOT NULL,
    credit_period_days INT DEFAULT 15,
    advance_payment_required_pct NUMERIC(5, 2) DEFAULT 0.00,
    lead_time_days INT DEFAULT 7,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('Evaluating', 'Accepted', 'Passed', 'Negotiating', 'Archived')) DEFAULT 'Evaluating',
    confidence_level TEXT DEFAULT 'Medium' CHECK (confidence_level IN ('High', 'Medium', 'Low', 'Needs Review')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    po_number TEXT NOT NULL,
    order_date DATE NOT NULL,
    delivery_deadline DATE NOT NULL,
    delivery_location TEXT,
    total_order_value NUMERIC(15, 2) NOT NULL,
    advance_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    advance_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(15, 2) NOT NULL,
    payment_terms_days INT NOT NULL DEFAULT 30,
    penalty_clause_text TEXT,
    penalty_per_day_pct NUMERIC(5, 2) DEFAULT 0.00,
    tax_rate_pct NUMERIC(5, 2) DEFAULT 18.00,
    items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    source_type TEXT NOT NULL CHECK (source_type IN ('pdf_upload', 'image_upload', 'manual_entry')) DEFAULT 'manual_entry',
    extraction_verified BOOLEAN DEFAULT FALSE,
    raw_document_id UUID,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS opportunity_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    raw_material_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    labour_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    production_expenses NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    packaging_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    transportation_logistics NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    electricity_utilities NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    other_direct_costs NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    allocated_overheads NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    estimated_financing_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_direct_cost NUMERIC(15, 2) NOT NULL,
    gross_contribution NUMERIC(15, 2) NOT NULL,
    contribution_margin_pct NUMERIC(6, 2) NOT NULL,
    upfront_cash_required NUMERIC(15, 2) NOT NULL,
    working_capital_gap NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('inflow', 'outflow')),
    amount NUMERIC(15, 2) NOT NULL,
    scheduled_date DATE NOT NULL,
    recipient_or_sender TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Customer Advance', 'Customer Final', 'Raw Materials', 'Labour / Payroll', 'Logistics', 'Overhead', 'Financing EMI', 'Other')),
    is_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS business_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    lender_name TEXT NOT NULL,
    facility_type TEXT NOT NULL CHECK (facility_type IN ('Term Loan', 'Cash Credit', 'Overdraft', 'Equipment Financing', 'Working Capital Loan', 'MUDRA Tarun', 'Other')),
    principal_amount NUMERIC(15, 2) NOT NULL,
    outstanding_balance NUMERIC(15, 2) NOT NULL,
    monthly_emi NUMERIC(15, 2) NOT NULL,
    interest_rate_pct NUMERIC(5, 2) NOT NULL,
    due_day_of_month INT NOT NULL DEFAULT 5,
    tenure_months_remaining INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    buyer_payment_delay_days INT NOT NULL DEFAULT 0,
    material_cost_inflation_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    production_cost_increase_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    advance_received_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    delivery_delay_days INT NOT NULL DEFAULT 0,
    simulated_peak_deficit NUMERIC(15, 2) NOT NULL,
    simulated_closing_cash NUMERIC(15, 2) NOT NULL,
    simulated_working_capital_gap NUMERIC(15, 2) NOT NULL,
    simulated_gross_contribution NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    overall_rating TEXT NOT NULL CHECK (overall_rating IN ('Low', 'Moderate', 'High', 'Critical')),
    customer_dependency_rating TEXT NOT NULL CHECK (customer_dependency_rating IN ('Low', 'Moderate', 'High', 'Critical')),
    customer_dependency_details JSONB NOT NULL,
    supplier_dependency_rating TEXT NOT NULL CHECK (supplier_dependency_rating IN ('Low', 'Moderate', 'High', 'Critical')),
    supplier_dependency_details JSONB NOT NULL,
    cash_flow_dependency_rating TEXT NOT NULL CHECK (cash_flow_dependency_rating IN ('Low', 'Moderate', 'High', 'Critical')),
    cash_flow_dependency_details JSONB NOT NULL,
    operational_dependency_rating TEXT NOT NULL CHECK (operational_dependency_rating IN ('Low', 'Moderate', 'High', 'Critical')),
    operational_dependency_details JSONB NOT NULL,
    financial_dependency_rating TEXT NOT NULL CHECK (financial_dependency_rating IN ('Low', 'Moderate', 'High', 'Critical')),
    financial_dependency_details JSONB NOT NULL,
    key_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS funding_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL UNIQUE,
    provider_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Government Scheme', 'Working Capital / CC', 'PO Financing', 'Invoice Discounting / TReDS', 'Term Loan', 'Equipment Finance')),
    max_amount_inr NUMERIC(15, 2),
    indicative_interest_rate_pct TEXT NOT NULL,
    collateral_requirement TEXT NOT NULL,
    turnaround_time_days TEXT,
    eligibility_criteria TEXT NOT NULL,
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    official_portal_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS uploaded_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('purchase_order', 'invoice', 'supplier_quote', 'bank_statement', 'financial_statement', 'loan_doc', 'udyam_cert', 'other')),
    file_size_bytes BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('uploaded', 'processing', 'extracted', 'failed', 'verified')) DEFAULT 'uploaded',
    extracted_data JSONB,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS financial_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    report_title TEXT NOT NULL,
    report_type TEXT NOT NULL DEFAULT 'pre_order_evaluation',
    report_summary JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    metric_trigger TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_business_financials_business_id ON business_financials(business_id);
CREATE INDEX IF NOT EXISTS idx_business_operations_business_id ON business_operations(business_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_business_id ON opportunities(business_id);
CREATE INDEX IF NOT EXISTS idx_customer_invoices_customer_id ON customer_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_invoices_business_id ON customer_invoices(business_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_business_id ON suppliers(business_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_opportunity_id ON purchase_orders(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_costs_opportunity_id ON opportunity_costs(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_opportunity_id ON payment_schedules(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_business_loans_business_id ON business_loans(business_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_opportunity_id ON scenarios(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_opportunity_id ON risk_assessments(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_documents_business_id ON uploaded_documents(business_id);
CREATE INDEX IF NOT EXISTS idx_financial_reports_business_id ON financial_reports(business_id);
CREATE INDEX IF NOT EXISTS idx_notifications_business_id ON notifications(business_id);

-- 7. Automated Profile Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, is_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'user'), '@', 1)),
        COALESCE(NEW.email, NEW.id::text || '@dynafin.internal'),
        'owner',
        FALSE
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_owner_policy ON profiles;
CREATE POLICY profiles_owner_policy ON profiles
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS businesses_owner_policy ON businesses;
CREATE POLICY businesses_owner_policy ON businesses
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS financials_owner_policy ON business_financials;
CREATE POLICY financials_owner_policy ON business_financials
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS operations_owner_policy ON business_operations;
CREATE POLICY operations_owner_policy ON business_operations
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS customers_owner_policy ON customers;
CREATE POLICY customers_owner_policy ON customers
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS customer_invoices_owner_policy ON customer_invoices;
CREATE POLICY customer_invoices_owner_policy ON customer_invoices
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS suppliers_owner_policy ON suppliers;
CREATE POLICY suppliers_owner_policy ON suppliers
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS opportunities_owner_policy ON opportunities;
CREATE POLICY opportunities_owner_policy ON opportunities
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS purchase_orders_owner_policy ON purchase_orders;
CREATE POLICY purchase_orders_owner_policy ON purchase_orders
    FOR ALL USING (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ))
    WITH CHECK (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ));

DROP POLICY IF EXISTS opportunity_costs_owner_policy ON opportunity_costs;
CREATE POLICY opportunity_costs_owner_policy ON opportunity_costs
    FOR ALL USING (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ))
    WITH CHECK (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ));

DROP POLICY IF EXISTS payment_schedules_owner_policy ON payment_schedules;
CREATE POLICY payment_schedules_owner_policy ON payment_schedules
    FOR ALL USING (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ))
    WITH CHECK (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ));

DROP POLICY IF EXISTS business_loans_owner_policy ON business_loans;
CREATE POLICY business_loans_owner_policy ON business_loans
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS scenarios_owner_policy ON scenarios;
CREATE POLICY scenarios_owner_policy ON scenarios
    FOR ALL USING (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ))
    WITH CHECK (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ));

DROP POLICY IF EXISTS risk_assessments_owner_policy ON risk_assessments;
CREATE POLICY risk_assessments_owner_policy ON risk_assessments
    FOR ALL USING (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ))
    WITH CHECK (opportunity_id IN (
        SELECT id FROM opportunities WHERE business_id IN (
            SELECT id FROM businesses WHERE user_id = auth.uid()
        )
    ));

DROP POLICY IF EXISTS funding_products_read_policy ON funding_products;
CREATE POLICY funding_products_read_policy ON funding_products
    FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS uploaded_documents_owner_policy ON uploaded_documents;
CREATE POLICY uploaded_documents_owner_policy ON uploaded_documents
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS financial_reports_owner_policy ON financial_reports;
CREATE POLICY financial_reports_owner_policy ON financial_reports
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS notifications_owner_policy ON notifications;
CREATE POLICY notifications_owner_policy ON notifications
    FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
    WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- 9. Storage Buckets
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES 
        ('documents', 'documents', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[]),
        ('reports', 'reports', false, 10485760, ARRAY['application/pdf']::text[])
    ON CONFLICT (id) DO UPDATE SET
        public = false,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Storage buckets creation skipped or handled via dashboard: %', SQLERRM;
END $$;

-- 10. Strict Storage Ownership Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Storage owner access for documents" ON storage.objects;
    DROP POLICY IF EXISTS "Storage owner access for reports" ON storage.objects;
    DROP POLICY IF EXISTS "Storage documents insert policy" ON storage.objects;
    DROP POLICY IF EXISTS "Storage documents select policy" ON storage.objects;
    DROP POLICY IF EXISTS "Storage documents update policy" ON storage.objects;
    DROP POLICY IF EXISTS "Storage documents delete policy" ON storage.objects;
    DROP POLICY IF EXISTS "Storage reports insert policy" ON storage.objects;
    DROP POLICY IF EXISTS "Storage reports select policy" ON storage.objects;
    DROP POLICY IF EXISTS "Storage reports update policy" ON storage.objects;
    DROP POLICY IF EXISTS "Storage reports delete policy" ON storage.objects;

    CREATE POLICY "Storage documents insert policy"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'documents' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Storage documents select policy"
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'documents' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Storage documents update policy"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
        bucket_id = 'documents' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        bucket_id = 'documents' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Storage documents delete policy"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'documents' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Storage reports insert policy"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'reports' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Storage reports select policy"
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'reports' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Storage reports update policy"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
        bucket_id = 'reports' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        bucket_id = 'reports' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    );

    CREATE POLICY "Storage reports delete policy"
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'reports' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            (storage.foldername(name))[1] IN (
                SELECT b.id::text FROM public.businesses b WHERE b.user_id = auth.uid()
            )
        )
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Storage policies creation skipped or handled via dashboard: %', SQLERRM;
END $$;

-- 11. Seed Data: Verified Indian MSME Funding Schemes
INSERT INTO funding_products (
    product_name,
    provider_name,
    category,
    max_amount_inr,
    indicative_interest_rate_pct,
    collateral_requirement,
    turnaround_time_days,
    eligibility_criteria,
    required_documents,
    official_portal_url,
    is_verified
) VALUES
(
    'CGTMSE – Credit Guarantee Scheme for Micro & Small Enterprises',
    'Ministry of MSME & SIDBI',
    'Government Scheme',
    50000000.00,
    '9.25% - 11.50% p.a. (Linked to Bank EBLR)',
    'Nil (100% Collateral-free; backed by CGTMSE guarantee up to 85%)',
    '14 - 21 Days',
    'New and existing Micro & Small Enterprises with active Udyam Registration. Both manufacturing and services covered.',
    '["Udyam Registration Certificate", "PAN & GST Returns (Last 12 Months)", "Audited Financial Statements (Last 2 Years)", "Detailed Project / Purchase Order Report", "KYC of Proprietor/Partners/Directors"]'::jsonb,
    'https://www.cgtmse.in',
    TRUE
),
(
    'Pradhan Mantri MUDRA Yojana (PMMY) – Tarun Category',
    'Government of India (PSU Banks, RRBs, SFBs)',
    'Government Scheme',
    2000000.00,
    '8.50% - 10.75% p.a.',
    'Nil (Covered under Credit Guarantee Fund for Micro Units - CGFMU)',
    '7 - 14 Days',
    'Non-Corporate Small Business Segment (NCSBS) including proprietorships and partnerships in manufacturing/trading.',
    '["Proof of Identity & Address (Aadhaar / Voter ID)", "Udyam Registration", "Bank statement (Last 6 months)", "Quotation for machinery or Raw material purchase invoice"]'::jsonb,
    'https://www.mudra.org.in',
    TRUE
),
(
    'TReDS – Trade Receivables Discounting System',
    'RBI Regulated Platforms (RXIL, M1xchange, Invoicemart)',
    'Invoice Discounting / TReDS',
    NULL,
    '7.50% - 9.00% annualized',
    'Nil (Backed by underlying corporate/PSU buyer obligation)',
    '2 - 3 Days',
    'Any MSME with accepted invoices raised against corporate buyers with turnover > ₹500 Cr or PSUs.',
    '["Digitally signed tax invoice", "Proof of delivery / Goods Receipt Note (GRN)", "Buyer acceptance certificate", "MSME registration certificate"]'::jsonb,
    'https://www.rbi.org.in',
    TRUE
),
(
    'Purchase Order / Pre-Shipment Working Capital Facility',
    'Scheduled Commercial Banks & Private NBFCs',
    'PO Financing',
    25000000.00,
    '10.50% - 13.50% p.a.',
    'Hypothecation of raw materials & assignment of PO receivables',
    '5 - 10 Days',
    'Confirmed purchase order from verified corporate buyer or PSU with min 1-year trading track record.',
    '["Confirmed Purchase Order / Contract copy", "Supplier proforma invoices for raw materials", "Bank statements (Last 12 months)", "GST returns (GSTR-3B & GSTR-1)"]'::jsonb,
    NULL,
    TRUE
),
(
    'SIDBI Working Capital Assistance for Micro & Small Enterprises',
    'Small Industries Development Bank of India (SIDBI)',
    'Working Capital / CC',
    30000000.00,
    '8.75% - 10.25% p.a.',
    'Second charge on current assets or CGTMSE cover',
    '10 - 15 Days',
    'Manufacturing MSMEs with minimum 2 years of profitable operations and clean CIBIL Commercial rank.',
    '["Audited Balance Sheet & P&L (Last 2 Years)", "Income Tax Returns", "Udyam Certificate", "Sanction letter of existing bankers"]'::jsonb,
    'https://www.sidbi.in',
    TRUE
),
(
    'Stand-Up India Scheme for Women and SC/ST Entrepreneurs',
    'Department of Financial Services, Ministry of Finance',
    'Government Scheme',
    10000000.00,
    'Bank Base Rate / MCLR + 3% (typically 9.50% - 11.00%)',
    'Primary security of assets financed; collateral optional via CGSSI',
    '14 - 30 Days',
    'Greenfield enterprise in manufacturing, services or trading sector promoted by SC/ST or Women entrepreneur (>= 51% stake).',
    '["Proof of identity & caste category / Gender affidavit", "Project Report detailing capital expenditure & working capital", "Lease deed / Land proof for unit", "Udyam registration"]'::jsonb,
    'https://www.standupmitra.in',
    TRUE
)
ON CONFLICT (product_name) DO NOTHING;
