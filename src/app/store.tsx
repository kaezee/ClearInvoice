import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project, ProjectStatus, BrandingSettings, InvoiceDefaultsType } from './types';

const STATUS_ORDER: ProjectStatus[] = ['ready', 'in-progress', 'invoiced', 'cleared'];

const DATA_VERSION = 7; // bump to reset seed data

const SAMPLE_PROJECTS: Project[] = [

  // ── QUOTING ───────────────────────────────────────────────────
  {
    id: '1',
    clientName: 'Stripe',
    type: 'Brand identity',
    amount: 4800,
    currency: 'GBP',
    startDate: '2026-03-15',
    dueDate: '2026-04-15',
    status: 'ready',
    invoiceNumber: 'INV-202603-001',
    invoiceItems: [
      { id: '1', description: 'Logo suite — primary + symbol variants', amount: 3200 },
      { id: '2', description: 'Brand guidelines document', amount: 1600 },
    ],
    notes: 'Full identity system. Deliverables: logo files + PDF guidelines.',
    invoiceNotes: 'Reply to confirm and work begins within 3 business days.',
    expiryDate: '2026-04-30',
    // No sentAt → Draft · not sent
    createdAt: '2026-03-15T10:00:00Z',
    hasSeenInvoiceHint: false,
  },
  {
    id: '2',
    clientName: 'Notion',
    type: 'Motion rebrand',
    amount: 5500,
    currency: 'USD',
    startDate: '2026-03-14',
    dueDate: '2026-05-01',
    status: 'ready',
    invoiceNumber: 'INV-202603-002',
    invoiceItems: [
      { id: '1', description: 'Brand motion system — principles + spec', amount: 3800 },
      { id: '2', description: 'Intro & loading animations (3 variants)', amount: 1700 },
    ],
    notes: 'Motion system to complement the new brand direction.',
    expiryDate: '2026-04-28',
    sentAt: '2026-03-14T10:00:00Z',
    // sentAt set, no viewedAt → Sent · not viewed
    createdAt: '2026-03-14T09:30:00Z',
    hasSeenInvoiceHint: false,
  },
  {
    id: '3',
    clientName: 'Anthropic',
    type: 'Strategy deck',
    amount: 6200,
    currency: 'USD',
    startDate: '2026-03-12',
    dueDate: '2026-04-20',
    status: 'ready',
    invoiceNumber: 'INV-202603-003',
    invoiceItems: [
      { id: '1', description: '2-day strategy workshop facilitation', amount: 4500 },
      { id: '2', description: 'Strategy deck (50 slides) + roadmap', amount: 1700 },
    ],
    notes: '2-day offsite workshop + deliverable deck.',
    expiryDate: '2026-04-20',
    sentAt: '2026-03-12T09:00:00Z',
    viewedAt: '2026-03-16T07:30:00Z',
    // viewedAt set → Viewed ~2h ago
    createdAt: '2026-03-12T11:00:00Z',
    hasSeenInvoiceHint: false,
  },

  // ── IN PROGRESS ───────────────────────────────────────────────
  {
    id: '4',
    clientName: 'Arc Browser',
    type: 'App design',
    amount: 7800,
    currency: 'USD',
    startDate: '2026-02-10',
    dueDate: '2026-03-30',
    status: 'in-progress',
    invoiceNumber: 'INV-202603-004',
    invoiceItems: [
      { id: '1', description: 'iOS mobile UI — 24 screens', amount: 5800 },
      { id: '2', description: 'Interaction prototype + dev handoff', amount: 2000 },
    ],
    notes: 'iOS-first. Figma file + Zeplin handoff.',
    createdAt: '2026-02-10T09:00:00Z',
    hasSeenInvoiceHint: false,
  },
  {
    id: '5',
    clientName: 'Framer',
    type: 'Web design',
    amount: 3200,
    currency: 'USD',
    startDate: '2026-03-01',
    dueDate: '2026-04-08',
    status: 'in-progress',
    invoiceNumber: 'INV-202603-005',
    invoiceItems: [
      { id: '1', description: 'Landing page redesign — 5 sections', amount: 2400 },
      { id: '2', description: 'Interactive component library', amount: 800 },
    ],
    notes: 'Responsive, Framer-native build.',
    createdAt: '2026-03-01T09:00:00Z',
    hasSeenInvoiceHint: false,
  },
  {
    id: '6',
    clientName: 'Vercel',
    type: 'Illustration series',
    amount: 2600,
    currency: 'EUR',
    startDate: '2026-03-05',
    dueDate: '2026-04-14',
    status: 'in-progress',
    invoiceNumber: 'INV-202603-006',
    invoiceItems: [
      { id: '1', description: '8 full-page editorial illustrations', amount: 1800 },
      { id: '2', description: '20 spot illustrations for blog', amount: 800 },
    ],
    notes: 'Loose, editorial style. Reference: Pentagram NYC.',
    createdAt: '2026-03-05T10:00:00Z',
    hasSeenInvoiceHint: false,
  },

  // ── INVOICED ──────────────────────────────────────────────────
  {
    id: '7',
    clientName: 'Liveblocks',
    type: 'UX audit',
    amount: 4200,
    currency: 'GBP',
    startDate: '2026-01-20',
    dueDate: '2026-02-28',           // overdue
    status: 'invoiced',
    invoiceNumber: 'INV-202602-001',
    invoiceItems: [
      { id: '1', description: 'Heuristic review + usability audit', amount: 2800 },
      { id: '2', description: 'Written report + prioritised recommendations', amount: 1400 },
    ],
    invoiceNotes: 'Payment via BACS. Sort code 01-23-45, Account 12345678.',
    createdAt: '2026-01-20T09:00:00Z',
    invoiceSentAt: '2026-02-14T10:00:00Z',
    // No invoiceViewedAt → Not viewed · 16d overdue
    hasSeenInvoiceHint: true,
  },
  {
    id: '8',
    clientName: 'Resend',
    type: 'Email design',
    amount: 2800,
    currency: 'USD',
    startDate: '2026-02-10',
    dueDate: '2026-04-15',
    status: 'invoiced',
    invoiceNumber: 'INV-202603-007',
    invoiceItems: [
      { id: '1', description: '6 transactional email templates', amount: 2200 },
      { id: '2', description: 'Figma email component library', amount: 600 },
    ],
    invoiceNotes: 'Due net-30 from invoice date.',
    createdAt: '2026-02-10T10:00:00Z',
    invoiceSentAt: '2026-03-06T10:00:00Z',
    invoiceViewedAt: '2026-03-16T06:00:00Z',
    // Viewed ~4h ago
    hasSeenInvoiceHint: true,
  },

  // ── CLEARED ───────────────────────────────────────────────────
  {
    id: '9',
    clientName: 'Linear',
    type: 'Motion design',
    amount: 3600,
    currency: 'USD',
    startDate: '2026-01-15',
    dueDate: '2026-02-28',
    status: 'cleared',
    invoiceNumber: 'INV-202602-002',
    invoiceItems: [
      { id: '1', description: 'UI micro-animations — 5 interactions', amount: 2200 },
      { id: '2', description: 'Page transition system', amount: 800 },
      { id: '3', description: 'Export package (Lottie + MP4)', amount: 600 },
    ],
    invoiceNotes: 'Paid. Thanks!',
    createdAt: '2026-01-15T09:00:00Z',
    invoiceSentAt: '2026-02-20T12:00:00Z',
    paidAt: '2026-03-01T09:00:00Z',
    hasSeenInvoiceHint: true,
  },
  {
    id: '10',
    clientName: 'Raycast',
    type: 'Icon set',
    amount: 1800,
    currency: 'EUR',
    startDate: '2026-01-10',
    dueDate: '2026-02-20',
    status: 'cleared',
    invoiceNumber: 'INV-202601-001',
    invoiceItems: [
      { id: '1', description: '60 custom UI icons — 24×24 and 16×16', amount: 1800 },
    ],
    invoiceNotes: 'Paid in full. A pleasure working together!',
    createdAt: '2026-01-10T09:00:00Z',
    invoiceSentAt: '2026-02-01T10:00:00Z',
    paidAt: '2026-02-18T14:00:00Z',
    hasSeenInvoiceHint: true,
  },

  // ── ARCHIVED ──────────────────────────────────────────────────
  {
    id: '11',
    clientName: 'Loom',
    type: 'Video thumbnail kit',
    amount: 950,
    currency: 'USD',
    startDate: '2026-01-10',
    dueDate: '2026-01-31',
    status: 'archived',
    invoiceNumber: 'INV-202601-002',
    invoiceItems: [{ id: '1', description: 'Video thumbnail template kit — 20 designs', amount: 950 }],
    notes: 'Project stalled — client paused budget.',
    createdAt: '2026-01-10T09:00:00Z',
    hasSeenInvoiceHint: false,
  },
  {
    id: '12',
    clientName: 'Hashnode',
    type: 'Social media pack',
    amount: 750,
    currency: 'GBP',
    startDate: '2025-12-10',
    status: 'archived',
    invoiceNumber: 'INV-202512-001',
    invoiceItems: [{ id: '1', description: 'Social media content pack — 30 templates', amount: 750 }],
    notes: 'Scope changed significantly after kickoff call.',
    createdAt: '2025-12-10T09:00:00Z',
    hasSeenInvoiceHint: false,
  },
];

const DEFAULT_BRANDING: BrandingSettings = {
  brandColor: '#7C3AED',
  invoiceStyle: 'classic',
  businessName: 'KD Studio',
  freelancerName: 'Kiran Das',
};

const DEFAULT_INVOICE_DEFAULTS: InvoiceDefaultsType = {
  // Your business
  fullName:      'Kiran Das',
  businessName:  'KD Studio',
  addressLine1:  '14 Clerkenwell Road',
  addressLine2:  '',
  city:          'London',
  postcode:      'EC1M 5RF',
  address:       '14 Clerkenwell Road\nLondon EC1M 5RF',
  businessEmail: 'kiran@kdstudio.co',
  phone:         '',
  regNumber:     '',

  // Numbering
  invoicePrefix:  'INV',
  quotePrefix:    'QUO',
  startingNumber: 1,

  // Quote defaults
  defaultQuoteExpiry: 14,
  defaultQuoteNotes:  'To proceed, reply to confirm and work begins immediately.',

  // Rate card & fields
  customFields: [
    { id: '1', label: 'VAT Number', value: 'GB123456789' },
    { id: '2', label: 'Company Reg', value: '12345678' },
  ],
  rateCard: [
    { id: '1', service: 'Brand identity', price: 4800 },
    { id: '2', service: 'Web design', price: 3200 },
    { id: '3', service: 'UX audit', price: 2600 },
    { id: '4', service: 'Motion design', price: 1800 },
    { id: '5', service: 'Product design', price: 5500 },
  ],

  // Payment defaults
  defaultTerms:    'net30',
  defaultCurrency: 'GBP',
  paymentNotes:    'Please pay via BACS bank transfer. Account details: Sort code 01-23-45, Account 12345678.',
};

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v) return JSON.parse(v);
  } catch {}
  return fallback;
}

function save<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Wipe stale seeds from previous versions
function checkVersion() {
  try {
    const stored = localStorage.getItem('clear_data_version');
    if (stored !== String(DATA_VERSION)) {
      localStorage.removeItem('clear_projects');
      localStorage.setItem('clear_data_version', String(DATA_VERSION));
    }
  } catch {}
}
checkVersion();

interface AppContextType {
  projects: Project[];
  branding: BrandingSettings;
  invoiceDefaults: InvoiceDefaultsType;
  hasLaunched: boolean;
  setHasLaunched: (v: boolean) => void;
  addProject: (data: Omit<Project, 'id' | 'invoiceNumber' | 'invoiceItems' | 'createdAt'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  advanceStatus: (id: string) => void;
  updateBranding: (s: BrandingSettings) => void;
  updateInvoiceDefaults: (d: InvoiceDefaultsType) => void;
  isOverdue: (p: Project) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => load('clear_projects', SAMPLE_PROJECTS));
  const [branding, setBranding] = useState<BrandingSettings>(() => load('clear_branding', DEFAULT_BRANDING));
  const [invoiceDefaults, setInvoiceDefaults] = useState<InvoiceDefaultsType>(() => load('clear_inv_defaults', DEFAULT_INVOICE_DEFAULTS));
  const [hasLaunched, setHasLaunchedState] = useState<boolean>(() => load('clear_launched', false));

  const setHasLaunched = useCallback((v: boolean) => {
    setHasLaunchedState(v);
    save('clear_launched', v);
  }, []);

  const addProject = useCallback((data: Omit<Project, 'id' | 'invoiceNumber' | 'invoiceItems' | 'createdAt'>) => {
    const id = Date.now().toString();
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const seq = String(Math.floor(Math.random() * 900) + 100);
    const invoiceNumber = `INV-${year}${month}-${seq}`;
    const newProject: Project = {
      ...data,
      id,
      invoiceNumber,
      invoiceItems: [{ id: '1', description: data.type, amount: data.amount }],
      createdAt: now.toISOString(),
    };
    setProjects(prev => {
      const updated = [newProject, ...prev];
      save('clear_projects', updated);
      return updated;
    });
    return id;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      save('clear_projects', updated);
      return updated;
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      save('clear_projects', updated);
      return updated;
    });
  }, []);

  const advanceStatus = useCallback((id: string) => {
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== id) return p;
        const idx = STATUS_ORDER.indexOf(p.status);
        if (idx >= STATUS_ORDER.length - 1) return p;
        return { ...p, status: STATUS_ORDER[idx + 1] };
      });
      save('clear_projects', updated);
      return updated;
    });
  }, []);

  const updateBranding = useCallback((s: BrandingSettings) => {
    setBranding(s);
    save('clear_branding', s);
  }, []);

  const updateInvoiceDefaults = useCallback((d: InvoiceDefaultsType) => {
    setInvoiceDefaults(d);
    save('clear_inv_defaults', d);
  }, []);

  const TODAY = new Date().toISOString().split('T')[0];
  const isOverdue = useCallback((p: Project) => {
    if (!p.dueDate || p.status !== 'invoiced') return false;
    return p.dueDate < TODAY;
  }, [TODAY]);

  return (
    <AppContext.Provider value={{
      projects, branding, invoiceDefaults, hasLaunched, setHasLaunched,
      addProject, updateProject, deleteProject, advanceStatus,
      updateBranding, updateInvoiceDefaults, isOverdue,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be within AppProvider');
  return ctx;
}