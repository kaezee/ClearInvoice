export type ProjectStatus = 'in-progress' | 'ready' | 'invoiced' | 'cleared' | 'archived';
export type InvoiceStyle = 'classic' | 'branded' | 'minimal';
export type PaymentTerms = 'net7' | 'net14' | 'net30' | 'custom';

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  rateCardId?: string;
}

/* ── Multiple contacts ───────────────────────────────── */
export interface Contact {
  id: string;
  name: string;
  email?: string;
}

/* ── Quote revision history ──────────────────────────── */
export interface QuoteRevision {
  quoteNumber: string;    // e.g. "QUO-001"
  sentAt: string;         // ISO — when this version was sent
  items: InvoiceItem[];
  supersededAt: string;   // ISO — when it was replaced
}

export interface Project {
  id: string;
  clientName: string;
  clientEmail?: string;
  contactPerson?: string;
  additionalContacts?: Contact[];   // up to 2 extra contacts
  type: string;
  services?: ServiceItem[];
  amount: number;
  depositAmount?: number;
  currency: string;
  startDate: string;
  dueDate?: string;
  notes?: string;
  status: ProjectStatus;
  invoiceNumber: string;
  invoiceItems: InvoiceItem[];
  quoteNotes?: string;    // notes shown on the client-facing quote page
  invoiceNotes?: string;  // notes shown on the client-facing invoice page
  createdAt: string;

  // Quote tracking (Quoting stage)
  sentAt?: string;
  viewedAt?: string;
  expiryDate?: string;
  quoteVersion?: number;          // 1-based; increments on each revision
  quoteRevisions?: QuoteRevision[]; // previous sent versions

  // Invoice tracking (Invoiced stage)
  invoiceSentAt?: string;
  invoiceViewedAt?: string;
  remindedAt?: string;
  paidAt?: string;

  // Tax (per-invoice override of defaults)
  taxEnabled?: boolean;
  taxLabel?: string;    // e.g. "VAT"
  taxRate?: number;     // e.g. 20

  hasSeenInvoiceHint?: boolean;

  // Archived state
  preArchiveStatus?: ProjectStatus; // status saved before archiving, used for one-tap restore
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
  fullName?: string;
  businessName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  businessEmail?: string;
  phone?: string;
  regNumber?: string;

  // ── Numbering ──
  invoicePrefix?: string;
  quotePrefix?: string;
  startingNumber?: number;

  // ── Quote defaults ──
  defaultQuoteExpiry?: number;
  defaultQuoteNotes?: string;

  // ── Rate card & fields ──
  customFields: CustomField[];
  rateCard: RateCardItem[];

  // ── Payment defaults ──
  defaultTerms: PaymentTerms;
  defaultCurrency: string;
  paymentNotes: string;

  // ── Tax defaults ──
  taxEnabled?: boolean;
  taxLabel?: string;    // e.g. "VAT"
  taxRate?: number;     // e.g. 20
}