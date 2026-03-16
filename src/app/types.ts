export type ProjectStatus = 'in-progress' | 'ready' | 'invoiced' | 'cleared' | 'archived';
export type InvoiceStyle = 'classic' | 'branded' | 'minimal';
export type PaymentTerms = 'net7' | 'net14' | 'net30' | 'custom';

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface Project {
  id: string;
  clientName: string;
  clientEmail?: string;         // needed to pre-fill send-quote / send-invoice share sheet
  contactPerson?: string;       // if client is a company, who do you talk to
  type: string;
  categories?: string[];        // pill tags e.g. ['Branding', 'Web']
  amount: number;
  depositAmount?: number;       // optional deposit e.g. 50% upfront
  currency: string;
  startDate: string;
  dueDate?: string;
  notes?: string;
  status: ProjectStatus;
  invoiceNumber: string;
  invoiceItems: InvoiceItem[];
  invoiceNotes?: string;
  createdAt: string;

  // Quote tracking (Quoting stage)
  sentAt?: string;
  viewedAt?: string;
  expiryDate?: string;

  // Invoice tracking (Invoiced stage)
  invoiceSentAt?: string;
  invoiceViewedAt?: string;
  remindedAt?: string;
  paidAt?: string;

  hasSeenInvoiceHint?: boolean;
}

export interface BrandingSettings {
  brandColor: string;
  invoiceStyle: InvoiceStyle;
  logoUrl?: string;
  businessName?: string;
  freelancerName?: string;
}

export interface RateCardItem {
  id: string;
  service: string;
  price: number;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface InvoiceDefaultsType {
  // ── Your business / legal details ──
  fullName?: string;            // "Your name" — shown on invoices
  businessName?: string;        // legal business / trading name
  addressLine1?: string;        // address fields (individual lines)
  addressLine2?: string;
  city?: string;
  postcode?: string;
  address?: string;             // kept for legacy (textarea fallback)
  businessEmail?: string;       // email shown on invoice
  phone?: string;               // optional
  regNumber?: string;           // VAT reg / company reg number

  // ── Numbering ──
  invoicePrefix?: string;       // default "INV" → INV-001
  quotePrefix?: string;         // default "QUO" → QUO-001
  startingNumber?: number;      // default 1

  // ── Quote defaults ──
  defaultQuoteExpiry?: number;  // 7 | 14 | 30 days
  defaultQuoteNotes?: string;   // pre-fill quote notes

  // ── Rate card & fields ──
  customFields: CustomField[];
  rateCard: RateCardItem[];

  // ── Payment defaults ──
  defaultTerms: PaymentTerms;
  defaultCurrency: string;
  paymentNotes: string;
}