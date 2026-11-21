export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'owner' | 'finance_manager' | 'auditor' | 'viewer';
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'owner' | 'finance_manager' | 'auditor' | 'viewer';
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'owner' | 'finance_manager' | 'auditor' | 'viewer';
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          trade_name: string | null;
          udyam_reg_number: string | null;
          pan_number: string | null;
          gstin: string | null;
          business_type: 'Proprietorship' | 'Partnership' | 'Private Limited' | 'LLP' | 'One Person Company';
          industry: string;
          sub_category: string | null;
          location_city: string;
          location_state: string;
          address: string | null;
          established_year: number;
          employee_count: number;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          trade_name?: string | null;
          udyam_reg_number?: string | null;
          pan_number?: string | null;
          gstin?: string | null;
          business_type: 'Proprietorship' | 'Partnership' | 'Private Limited' | 'LLP' | 'One Person Company';
          industry: string;
          sub_category?: string | null;
          location_city: string;
          location_state: string;
          address?: string | null;
          established_year: number;
          employee_count?: number;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          trade_name?: string | null;
          udyam_reg_number?: string | null;
          pan_number?: string | null;
          gstin?: string | null;
          business_type?: 'Proprietorship' | 'Partnership' | 'Private Limited' | 'LLP' | 'One Person Company';
          industry?: string;
          sub_category?: string | null;
          location_city?: string;
          location_state?: string;
          address?: string | null;
          established_year?: number;
          employee_count?: number;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      business_financials: {
        Row: {
          id: string;
          business_id: string;
          average_monthly_revenue: number;
          average_monthly_expenses: number;
          available_cash: number;
          existing_loan_outstanding: number;
          monthly_emi_obligations: number;
          accounts_receivable: number;
          accounts_payable: number;
          monthly_fixed_overheads: number;
          monthly_payroll: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          average_monthly_revenue?: number;
          average_monthly_expenses?: number;
          available_cash?: number;
          existing_loan_outstanding?: number;
          monthly_emi_obligations?: number;
          accounts_receivable?: number;
          accounts_payable?: number;
          monthly_fixed_overheads?: number;
          monthly_payroll?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          average_monthly_revenue?: number;
          average_monthly_expenses?: number;
          available_cash?: number;
          existing_loan_outstanding?: number;
          monthly_emi_obligations?: number;
          accounts_receivable?: number;
          accounts_payable?: number;
          monthly_fixed_overheads?: number;
          monthly_payroll?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      business_operations: {
        Row: {
          id: string;
          business_id: string;
          monthly_capacity_units: number;
          current_capacity_utilisation_pct: number;
          standard_lead_time_days: number;
          workforce_shift_count: number;
          machinery_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          monthly_capacity_units?: number;
          current_capacity_utilisation_pct?: number;
          standard_lead_time_days?: number;
          workforce_shift_count?: number;
          machinery_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          monthly_capacity_units?: number;
          current_capacity_utilisation_pct?: number;
          standard_lead_time_days?: number;
          workforce_shift_count?: number;
          machinery_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          category: 'Corporate / Tier-1' | 'Mid-Market Enterprise' | 'Government / PSU' | 'Retailer / Distributor' | 'Local MSME' | null;
          standard_credit_days: number | null;
          contact_person: string | null;
          email: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          category?: 'Corporate / Tier-1' | 'Mid-Market Enterprise' | 'Government / PSU' | 'Retailer / Distributor' | 'Local MSME' | null;
          standard_credit_days?: number | null;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          category?: 'Corporate / Tier-1' | 'Mid-Market Enterprise' | 'Government / PSU' | 'Retailer / Distributor' | 'Local MSME' | null;
          standard_credit_days?: number | null;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
        };
      };
      customer_invoices: {
        Row: {
          id: string;
          business_id: string;
          customer_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date: string;
          actual_payment_date: string | null;
          invoice_amount: number;
          amount_received: number;
          status: 'Paid' | 'Partially Paid' | 'Overdue' | 'Pending';
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          customer_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date: string;
          actual_payment_date?: string | null;
          invoice_amount: number;
          amount_received?: number;
          status: 'Paid' | 'Partially Paid' | 'Overdue' | 'Pending';
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          customer_id?: string;
          invoice_number?: string;
          invoice_date?: string;
          due_date?: string;
          actual_payment_date?: string | null;
          invoice_amount?: number;
          amount_received?: number;
          status?: 'Paid' | 'Partially Paid' | 'Overdue' | 'Pending';
          created_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          material_category: string;
          credit_period_days: number | null;
          advance_payment_required_pct: number | null;
          lead_time_days: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          material_category: string;
          credit_period_days?: number | null;
          advance_payment_required_pct?: number | null;
          lead_time_days?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          material_category?: string;
          credit_period_days?: number | null;
          advance_payment_required_pct?: number | null;
          lead_time_days?: number | null;
          created_at?: string;
        };
      };
      opportunities: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          buyer_name: string;
          customer_id: string | null;
          status: 'Evaluating' | 'Accepted' | 'Passed' | 'Negotiating' | 'Archived';
          confidence_level: 'High' | 'Medium' | 'Low' | 'Needs Review' | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          title: string;
          buyer_name: string;
          customer_id?: string | null;
          status?: 'Evaluating' | 'Accepted' | 'Passed' | 'Negotiating' | 'Archived';
          confidence_level?: 'High' | 'Medium' | 'Low' | 'Needs Review' | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          title?: string;
          buyer_name?: string;
          customer_id?: string | null;
          status?: 'Evaluating' | 'Accepted' | 'Passed' | 'Negotiating' | 'Archived';
          confidence_level?: 'High' | 'Medium' | 'Low' | 'Needs Review' | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchase_orders: {
        Row: {
          id: string;
          opportunity_id: string;
          po_number: string;
          order_date: string;
          delivery_deadline: string;
          delivery_location: string | null;
          total_order_value: number;
          advance_amount: number;
          advance_percentage: number;
          balance_amount: number;
          payment_terms_days: number;
          penalty_clause_text: string | null;
          penalty_per_day_pct: number | null;
          tax_rate_pct: number | null;
          items_json: Json;
          source_type: 'pdf_upload' | 'image_upload' | 'manual_entry';
          extraction_verified: boolean | null;
          raw_document_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          po_number: string;
          order_date: string;
          delivery_deadline: string;
          delivery_location?: string | null;
          total_order_value: number;
          advance_amount?: number;
          advance_percentage?: number;
          balance_amount: number;
          payment_terms_days?: number;
          penalty_clause_text?: string | null;
          penalty_per_day_pct?: number | null;
          tax_rate_pct?: number | null;
          items_json?: Json;
          source_type?: 'pdf_upload' | 'image_upload' | 'manual_entry';
          extraction_verified?: boolean | null;
          raw_document_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          po_number?: string;
          order_date?: string;
          delivery_deadline?: string;
          delivery_location?: string | null;
          total_order_value?: number;
          advance_amount?: number;
          advance_percentage?: number;
          balance_amount?: number;
          payment_terms_days?: number;
          penalty_clause_text?: string | null;
          penalty_per_day_pct?: number | null;
          tax_rate_pct?: number | null;
          items_json?: Json;
          source_type?: 'pdf_upload' | 'image_upload' | 'manual_entry';
          extraction_verified?: boolean | null;
          raw_document_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      opportunity_costs: {
        Row: {
          id: string;
          opportunity_id: string;
          raw_material_cost: number;
          labour_cost: number;
          production_expenses: number;
          packaging_cost: number;
          transportation_logistics: number;
          electricity_utilities: number;
          other_direct_costs: number;
          allocated_overheads: number;
          estimated_financing_cost: number;
          total_direct_cost: number;
          gross_contribution: number;
          contribution_margin_pct: number;
          upfront_cash_required: number;
          working_capital_gap: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          raw_material_cost?: number;
          labour_cost?: number;
          production_expenses?: number;
          packaging_cost?: number;
          transportation_logistics?: number;
          electricity_utilities?: number;
          other_direct_costs?: number;
          allocated_overheads?: number;
          estimated_financing_cost?: number;
          total_direct_cost: number;
          gross_contribution: number;
          contribution_margin_pct: number;
          upfront_cash_required: number;
          working_capital_gap: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          raw_material_cost?: number;
          labour_cost?: number;
          production_expenses?: number;
          packaging_cost?: number;
          transportation_logistics?: number;
          electricity_utilities?: number;
          other_direct_costs?: number;
          allocated_overheads?: number;
          estimated_financing_cost?: number;
          total_direct_cost?: number;
          gross_contribution?: number;
          contribution_margin_pct?: number;
          upfront_cash_required?: number;
          working_capital_gap?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_schedules: {
        Row: {
          id: string;
          opportunity_id: string;
          event_name: string;
          event_type: 'inflow' | 'outflow';
          amount: number;
          scheduled_date: string;
          recipient_or_sender: string;
          category: 'Customer Advance' | 'Customer Final' | 'Raw Materials' | 'Labour / Payroll' | 'Logistics' | 'Overhead' | 'Financing EMI' | 'Other';
          is_confirmed: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          event_name: string;
          event_type: 'inflow' | 'outflow';
          amount: number;
          scheduled_date: string;
          recipient_or_sender: string;
          category: 'Customer Advance' | 'Customer Final' | 'Raw Materials' | 'Labour / Payroll' | 'Logistics' | 'Overhead' | 'Financing EMI' | 'Other';
          is_confirmed?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          event_name?: string;
          event_type?: 'inflow' | 'outflow';
          amount?: number;
          scheduled_date?: string;
          recipient_or_sender?: string;
          category?: 'Customer Advance' | 'Customer Final' | 'Raw Materials' | 'Labour / Payroll' | 'Logistics' | 'Overhead' | 'Financing EMI' | 'Other';
          is_confirmed?: boolean | null;
          created_at?: string;
        };
      };
      business_loans: {
        Row: {
          id: string;
          business_id: string;
          lender_name: string;
          facility_type: 'Term Loan' | 'Cash Credit' | 'Overdraft' | 'Equipment Financing' | 'Working Capital Loan' | 'MUDRA Tarun' | 'Other';
          principal_amount: number;
          outstanding_balance: number;
          monthly_emi: number;
          interest_rate_pct: number;
          due_day_of_month: number;
          tenure_months_remaining: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          lender_name: string;
          facility_type: 'Term Loan' | 'Cash Credit' | 'Overdraft' | 'Equipment Financing' | 'Working Capital Loan' | 'MUDRA Tarun' | 'Other';
          principal_amount: number;
          outstanding_balance: number;
          monthly_emi: number;
          interest_rate_pct: number;
          due_day_of_month?: number;
          tenure_months_remaining: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          lender_name?: string;
          facility_type?: 'Term Loan' | 'Cash Credit' | 'Overdraft' | 'Equipment Financing' | 'Working Capital Loan' | 'MUDRA Tarun' | 'Other';
          principal_amount?: number;
          outstanding_balance?: number;
          monthly_emi?: number;
          interest_rate_pct?: number;
          due_day_of_month?: number;
          tenure_months_remaining?: number;
          created_at?: string;
        };
      };
      scenarios: {
        Row: {
          id: string;
          opportunity_id: string;
          scenario_name: string;
          buyer_payment_delay_days: number;
          material_cost_inflation_pct: number;
          production_cost_increase_pct: number;
          advance_received_pct: number;
          delivery_delay_days: number;
          simulated_peak_deficit: number;
          simulated_closing_cash: number;
          simulated_working_capital_gap: number;
          simulated_gross_contribution: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          scenario_name: string;
          buyer_payment_delay_days?: number;
          material_cost_inflation_pct?: number;
          production_cost_increase_pct?: number;
          advance_received_pct?: number;
          delivery_delay_days?: number;
          simulated_peak_deficit: number;
          simulated_closing_cash: number;
          simulated_working_capital_gap: number;
          simulated_gross_contribution: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          scenario_name?: string;
          buyer_payment_delay_days?: number;
          material_cost_inflation_pct?: number;
          production_cost_increase_pct?: number;
          advance_received_pct?: number;
          delivery_delay_days?: number;
          simulated_peak_deficit?: number;
          simulated_closing_cash?: number;
          simulated_working_capital_gap?: number;
          simulated_gross_contribution?: number;
          created_at?: string;
        };
      };
      risk_assessments: {
        Row: {
          id: string;
          opportunity_id: string;
          overall_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          customer_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          customer_dependency_details: Json;
          supplier_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          supplier_dependency_details: Json;
          cash_flow_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          cash_flow_dependency_details: Json;
          operational_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          operational_dependency_details: Json;
          financial_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          financial_dependency_details: Json;
          key_recommendations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          overall_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          customer_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          customer_dependency_details: Json;
          supplier_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          supplier_dependency_details: Json;
          cash_flow_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          cash_flow_dependency_details: Json;
          operational_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          operational_dependency_details: Json;
          financial_dependency_rating: 'Low' | 'Moderate' | 'High' | 'Critical';
          financial_dependency_details: Json;
          key_recommendations?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          overall_rating?: 'Low' | 'Moderate' | 'High' | 'Critical';
          customer_dependency_rating?: 'Low' | 'Moderate' | 'High' | 'Critical';
          customer_dependency_details?: Json;
          supplier_dependency_rating?: 'Low' | 'Moderate' | 'High' | 'Critical';
          supplier_dependency_details?: Json;
          cash_flow_dependency_rating?: 'Low' | 'Moderate' | 'High' | 'Critical';
          cash_flow_dependency_details?: Json;
          operational_dependency_rating?: 'Low' | 'Moderate' | 'High' | 'Critical';
          operational_dependency_details?: Json;
          financial_dependency_rating?: 'Low' | 'Moderate' | 'High' | 'Critical';
          financial_dependency_details?: Json;
          key_recommendations?: Json;
          created_at?: string;
        };
      };
      funding_products: {
        Row: {
          id: string;
          product_name: string;
          provider_name: string;
          category: 'Government Scheme' | 'Working Capital / CC' | 'PO Financing' | 'Invoice Discounting / TReDS' | 'Term Loan' | 'Equipment Finance';
          max_amount_inr: number | null;
          indicative_interest_rate_pct: string;
          collateral_requirement: string;
          turnaround_time_days: string | null;
          eligibility_criteria: string;
          required_documents: Json;
          official_portal_url: string | null;
          is_verified: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_name: string;
          provider_name: string;
          category: 'Government Scheme' | 'Working Capital / CC' | 'PO Financing' | 'Invoice Discounting / TReDS' | 'Term Loan' | 'Equipment Finance';
          max_amount_inr?: number | null;
          indicative_interest_rate_pct: string;
          collateral_requirement: string;
          turnaround_time_days?: string | null;
          eligibility_criteria: string;
          required_documents?: Json;
          official_portal_url?: string | null;
          is_verified?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_name?: string;
          provider_name?: string;
          category?: 'Government Scheme' | 'Working Capital / CC' | 'PO Financing' | 'Invoice Discounting / TReDS' | 'Term Loan' | 'Equipment Finance';
          max_amount_inr?: number | null;
          indicative_interest_rate_pct?: string;
          collateral_requirement?: string;
          turnaround_time_days?: string | null;
          eligibility_criteria?: string;
          required_documents?: Json;
          official_portal_url?: string | null;
          is_verified?: boolean | null;
          created_at?: string;
        };
      };
      uploaded_documents: {
        Row: {
          id: string;
          business_id: string;
          opportunity_id: string | null;
          file_name: string;
          file_type: 'purchase_order' | 'invoice' | 'supplier_quote' | 'bank_statement' | 'financial_statement' | 'loan_doc' | 'udyam_cert' | 'other';
          file_size_bytes: number;
          storage_path: string;
          status: 'uploaded' | 'processing' | 'extracted' | 'failed' | 'verified';
          extracted_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          opportunity_id?: string | null;
          file_name: string;
          file_type: 'purchase_order' | 'invoice' | 'supplier_quote' | 'bank_statement' | 'financial_statement' | 'loan_doc' | 'udyam_cert' | 'other';
          file_size_bytes: number;
          storage_path: string;
          status?: 'uploaded' | 'processing' | 'extracted' | 'failed' | 'verified';
          extracted_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          opportunity_id?: string | null;
          file_name?: string;
          file_type?: 'purchase_order' | 'invoice' | 'supplier_quote' | 'bank_statement' | 'financial_statement' | 'loan_doc' | 'udyam_cert' | 'other';
          file_size_bytes?: number;
          storage_path?: string;
          status?: 'uploaded' | 'processing' | 'extracted' | 'failed' | 'verified';
          extracted_data?: Json | null;
          created_at?: string;
        };
      };
      financial_reports: {
        Row: {
          id: string;
          business_id: string;
          opportunity_id: string;
          report_title: string;
          report_type: string;
          report_summary: Json;
          generated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          opportunity_id: string;
          report_title: string;
          report_type?: string;
          report_summary: Json;
          generated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          opportunity_id?: string;
          report_title?: string;
          report_type?: string;
          report_summary?: Json;
          generated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          business_id: string;
          opportunity_id: string | null;
          severity: 'critical' | 'warning' | 'info';
          title: string;
          message: string;
          metric_trigger: string | null;
          is_read: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          opportunity_id?: string | null;
          severity: 'critical' | 'warning' | 'info';
          title: string;
          message: string;
          metric_trigger?: string | null;
          is_read?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          opportunity_id?: string | null;
          severity?: 'critical' | 'warning' | 'info';
          title?: string;
          message?: string;
          metric_trigger?: string | null;
          is_read?: boolean | null;
          created_at?: string;
        };
      };
    };
    Views: {
      customer_invoices_with_overdue: {
        Row: {
          id: string;
          business_id: string;
          customer_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date: string;
          actual_payment_date: string | null;
          invoice_amount: number;
          amount_received: number;
          status: 'Paid' | 'Partially Paid' | 'Overdue' | 'Pending';
          days_overdue: number;
          created_at: string;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
